/**
* The main controller of the media view.
* @param {type} option description
*/
function PlaylistZoneMediaEdit(option) {
    
	var _self = this;
	var _option = option;
	var _zoneMediaView = null;
	var _showMediaDialog = null;
	var isReplace = false;
	var _zoneData = null;
	var _curZoneId = 0;
    
    /**
    * The current zone id of list table.
    * This parameter to keep the id for the case - switching media view then switching back to list view.
    * It could be changed on switching scene, zone.
    */
    var _curListTblZoneId = 0;
    
	var _playlistId = -1;
	var onItemClick, onItemDbClick, onAfterDrop, onBeforeDrag, onSelectChange, onBeforeEditStop, onAfterEditStop;
    //fuli 20150928 for move media item
    var onMouseDragOut, onMouseDragIn, onMouseOutItem, onMouseMove, onMouseMoving;
	//
	var _editTransDialog;
	var _scriptObject;
	var _curSelectMediaId = null;
	var _isExistUploading = [];
	var checkUploadT=null;
	_self.transitionDialog = null;
	var transNames = {};
	var _unReadAbleMediaRescode = null;
	var sceneIndex = null;
    
    /**
    * The media list table map - key is zone id, value is the media list table
    */
    var _mediaListTableMap = new Object();
    
    /**
    * The selected media map - key is zone id, value is the selected media id array
    */
    var _selectedMediaMap = new Object();
    
    /**
    * The selected media map - key is zone id, value is the selected media id array
    */
    var _zoneAreaMap = new Object();
    
    var _zoneContentViewParam = 1;
    var _thumbnailView = 1;
    var _listView = 2;
    
    /* Default no status. */
    var _actionStatus = 0;
    
    this.actionStatusDel = -1;
    this.actionStatusAdd = 1;
    this.actionStatusEdit = 2;
    this.actionStatusReplace = 3;
    this.actionStatusClick = 4;
    this.actionStatusCtrlClick = 5;
    this.actionStatusDrag = 6;
    this.actionStatusSwitchThumbnail = 7;
    this.actionStatusSwitchListTable = 8;
    this.actionStatusResizeSouth = 9;
    this.actionStatusImport = 10;
    this.actionStatusClickZoneArea = 11;
    this.actionStatusClickZoneTab = 12;
    this.actionStatusClickSceneArea = 13;
    this.actionStatusResizeWest = 14;
    
    /** The transition data! */
    this.transitionComboData;
    
	var _init = function() {
		//alert("_playlistId="+option.containerId);
        
		_iniZoneMediaView();
		_attachZoneMediaToolButtons();
		_zoneData = new ZoneData();
		transNames = new TransitionNames();
		_editTransDialog = new CreateEditMediaItemDialog();
		_scriptObject = document.getElementById("dt_cm_modules_playlistWrapper_js");
        
        //Performance tuning - load the transition combo data once
        if(!_self.transitionComboData){
            _self.transitionComboData = _loadTransitionData();    
        }
        
        //_self.attachResizerEvent();
	};
    
    /**
    * Detect the west resizer click, maintain the status code to do something.
    * Using the mouseup, mousedown & click may break the original event.
    * id=peHalfDown div .ui-layout-resizer-west
    */
    this.attachResizerEvent = function(){
        jQuery( document ).ready(function() {
            //West DIV
            jQuery("#peHalfDown").find(".ui-layout-resizer-west").on( "mouseup", function() {
                _actionStatus = _self.actionStatusResizeWest;
                //zoneMediaCtrl.setActionStatus(self.actionStatusResizeWest);
                
                var timer = setTimeout(function() {
                    _actionStatus = 0;
                    
                }, 500);
            });

            //South DIV layoutZoneEdit ui-layout-toggler-south
            jQuery("#layoutZoneEdit").find(".ui-layout-toggler-south").on( "mouseup", function() {
                _actionStatus = _self.actionStatusResizeSouth;
                //zoneMediaCtrl.setActionStatus(self.actionStatusResizeSouth);
                
                var timer = setTimeout(function() {
                    _actionStatus = 0;
                    
                }, 500);
            });
            
            
            //West scene click
            jQuery(".item_thumbnail").find("[name='zonediv']").on( "mouseup", function() {
                //console.log("scene click!!!");
            });
            
            //Add the events on the images span of the center main zone area
            //Set the status when click the image in 0.5 second.
            //This is for the selecting the selected media on the south media area.
            jQuery("#templatDivId").find("span[id^='newZoneSpan']").on("mousedown",function(){
                _actionStatus = _self.actionStatusClickZoneArea;
                var timer = setTimeout(function() {
                    _actionStatus = 0;
                }, 500);
            });
        });//end jQuery( document ).ready        
    };
    
    this.setActionStatus = function(action){
        _actionStatus = action;
    };
    
    /** Get combo data. */
    var _loadTransitionData = function(){
        var urlDat = "/modules/playlist/transition.action;jsessionid="+window.jsessionid;
        jQuery.post( urlDat, null,
              function(data) {
                  _self.transitionComboData = data;    
                  return data;
              }
        );
    };//end loadTransitionData
    
	_self.empty = function() {
		_zoneData.empty();
	};

    /**
    * Attach the events to maintain the selected media array.
    * ctrl+click & click to update the media data.
    * '.dhx_dataview_item' is the single media view.  
    */
    var _attachZoneMediaViewClickEvent = function(){
        jQuery( document ).ready(function() {
            
            jQuery("#zone_content").on('mousedown', '.dhx_dataview_item', function (event) { 
                if(event.ctrlKey) {//Ctrl+Click - multiple select the rows
                    ;//Skip the ctrl+click
                }else{
                    //var zoneMedias = _zoneData.getZoneMedias(_curZoneId);
                    var selectedMediaIdArr = _self.getSelsctedMediaIdArr();               

                    var zone = _zoneData.getZoneByZoneId(_curZoneId * 1);
                    
                    var curSelectMediaId = getSelectHis(sceneIndex, zone.zorder * 1);                    
                   
                    var evt = jQuery.Event("click");
                    evt.ctrlKey = true;
                    evt.which = 17;
                    jQuery(this).trigger(evt);                    
                }                                   
            });
            
            jQuery("#zone_content").on('mouseup', '.dhx_dataview_item', function (event) {                        
                var timer = setTimeout(function() {                   
                    var selectedMediaIdArr = _self.getSelsctedMediaIdArr();                    
                    _selectedMediaMap[_curZoneId] = selectedMediaIdArr;
                    
                }, 500);
            });
            
            //Maintain the switch scene status
            jQuery("#segmentList").on('mouseup', '.dhx_dataview_item', function (event) {                
                _actionStatus = _self.actionStatusClickSceneArea;
                var timer = setTimeout(function() {
                   _actionStatus = 0;
                }, 500);
            });
        });
    };
    
	var _attachZoneMediaToolButtons = function(){                        
		jQuery("#attrTabRight #addMedia").unbind("click").bind("click", _addZoneMedia);
		
		jQuery("#attrTabRight #switchMediaListView").unbind("click").bind("click", _switchMediaListView);
		jQuery("#attrTabRight #switchMediaThumbnailView").unbind("click").bind("click", _switchMediaThumbnailView);
		
        jQuery("#attrTabRight #importMedia").unbind("click").bind("click", _importZoneMedia);
		jQuery("#attrTabRight #deleteMedia").unbind("click").bind("click", _delZoneMedia);
		jQuery("#attrTabRight #replaceMedia").unbind("click").bind("click", _addZoneMedia);
		jQuery("#attrTabRight #mediaList").unbind("click").bind("click", _setTransDialog);
		jQuery("#attr_tab #previousZone").unbind("click").bind("click", scrollZone);
		jQuery("#attr_tab #nextZone").unbind("click").bind("click", scrollZone);

	};

	var detachZoneMdiaToolButtons = function()
    {
		jQuery("#attrTabRight #addMedia").unbind("click");
		
		jQuery("#attrTabRight #switchMediaListView").unbind("click");
		jQuery("#attrTabRight #switchMediaThumbnailView").unbind("click");
		
        jQuery("#attrTabRight #importMedia").unbind("click");
		jQuery("#attrTabRight #deleteMedia").unbind("click");
		jQuery("#attrTabRight #replaceMedia").unbind("click");
		jQuery("#attrTabRight #mediaList").unbind("click");
		jQuery("#attr_tab #previousZone").unbind("click");
		jQuery("#attr_tab #nextZone").unbind("click");
	};

	/**
	 * (1)One tab's width is fixed.
	 * (2)We can count how much tab would be moved when click left/right arrow.
	 * (3)If we find half tabDdiv overlapped, we should adjust the tabs position.
	 * */
	var scrollZone =function() {
	    if(_zoneData.getZones()&&_zoneData.getZones().length==0){
            return;
        }
		//每个tab宽度为145px, 参见main.css ".TabSelected, .TabUnSelected"
		var tabWidth = 145;
		var tabsDiv = jQuery("#attr_tab  #attrTabLeft");
		var tabsDivWidth = tabsDiv.width();
		var tabParentDivWidth = tabsDiv.parent().width();
		var defaultMoveNum = Math.floor(tabParentDivWidth / tabWidth);
		var tabsDivLeft = tabsDiv.position().left;
		var objId = jQuery(this).attr("id");
		if (objId == "previousZone") {// click left arrow
			if (tabsDivLeft >= 0) {
				return;
			} else {
				var hideWidth = 0 - tabsDivLeft;
				var hideTabNum = hideWidth / tabWidth;
				if (hideTabNum <= defaultMoveNum) {
					jQuery("#attr_tab  #attrTabLeft").css("left", 0);
					return;
				} else {
					var tarLeft = tabsDivLeft + defaultMoveNum * tabWidth;
					var temp = 0 - tarLeft;
					tarLeft = (0 - Math.ceil(temp / tabWidth)) * tabWidth;
					jQuery("#attr_tab  #attrTabLeft").css("left", tarLeft);
					return;
				}
			}

		} else {// click right arrow
			if ((tabsDivWidth + tabsDivLeft) > tabParentDivWidth) {
				var hideWidth = tabsDivWidth + tabsDivLeft - tabParentDivWidth;
				var hideTabNum = hideWidth / tabWidth;
				if (hideTabNum <= defaultMoveNum) {
					var tarLeft = tabsDivLeft - hideTabNum * tabWidth;
					jQuery("#attr_tab  #attrTabLeft").css("left", tarLeft);
					return;
				} else {
					var tarLeft = tabsDivLeft - defaultMoveNum * tabWidth;
					jQuery("#attr_tab  #attrTabLeft").css("left", tarLeft);
					return;
				}
			} else {
				return;
			}
		}
	}
    
    /**
    * Edit button - open the edit window.
    */
	var _setTransDialog = function() {
		if(_zoneData.getZones()&&_zoneData.getZones().length==0){
            return;
        }

		var mediaIds = _zoneMediaView.getSelected(true);
		if(mediaIds.length==0){
			MessageBox({content:window.msg["esignage.jsp.playlist.mediazone.selectmedia"]});
			return false;
		}
		_zoneMediaView.stopEdit();
		var mediasIds = _zoneMediaView.getSelected(true);
		if (mediasIds.length > 0) {
			jQuery("#layoutZoneEdit").data("transCome", "dialog");
			_editTransDialog.createDialog(_transDialogCallback);

			var medias = []
			for (var i = 0; i < mediasIds.length; i++) {
				var mediaobj = _zoneMediaView.get(mediasIds[i]);
				medias.push(mediaobj);
			}
			_editTransDialog.setSelMedias(medias);
		}                       
	}

    /**
    * The edit action callback.
    */
	var _transDialogCallback = function(mediaItems,
										transNode,
										mediaDuration,
										newTransDuration)
	{
		var trans = transNode;// transNode.extendString;
		var objTrans = trans;// jQuery.parseJSON(trans);
		for (var i = 0; i < mediaItems.length; i++) {
			var mediaItem = mediaItems[i];
			var frame = mediaItem.media.frame;
			var d = 0;
			//Fix bug 43899 Cavan 2013-11-28 begin#1
			{
				if (frame && frame * 1 > 0) //frame - means video/flash/etc.
				{
					d = mediaDuration;
				}
				else
				{
					d = Math.round(mediaDuration);
				}
			}

			/*
			if (frame && frame * 1 > 0) {
				var p = mediaDuration.lastIndexOf(".");
				if (p > -1) {
					var strf = mediaDuration.substr(p + 1);
					if (frame && frame * 1 > 0 && strf * 1 > 0) {
						d = (strf * 1) / (frame * 1);
					}
				} else if (p == -1) {
					p = mediaDuration.length;
				}

				var sec = mediaDuration.substr(0, p);
				if (sec && sec * 1 > 0) {
					d += sec * 1;
				}
			} else {
				d = mediaDuration
			}
			*/

			d = Math.round(d * 1000);
			if (isNaN(d)) { //when error is seen, then set it as default 15s
				d = 15;
			}
			//Fix bug 43899 Cavan 2013-11-28 end#1

			var transDuration = newTransDuration * 1;
			// 用户在编辑对话框中选择了切换效果 原zone的media是有切换效果并transition duration == 0的时候,
			// 将切换时间设置成3秒
			if (objTrans && objTrans.transitionid) {
				if (objTrans.transitionid * 1 != 0) {
					if (transDuration == 0
							&& mediaItem.transitionduration * 1 == 0) {// 用户选择0
																		// 并且原媒体切换时间是0
						transDuration = 3;
					} else if (transDuration == -1
							&& mediaItem.transitionduration * 1 == 0) { // 用户选择--
																		// 并且原媒体切换时间是0
						transDuration = 3;
					}
				}
			} else { // 用户在编辑对话框中没有选择切换效果但是选择了切换时间
						// 但是其中一个原zone的media是没有切换效果并transition duration == 0的时候,
						// 将切换时间设置成0秒
				if (mediaItem.transition * 1 == 0) {
					transDuration = 0;
				}
			}
			_zoneData.setTrancetion(_curZoneId, mediaItem.sequence, objTrans,
					transDuration, d);
			_setZoneTitle(_getZoneTitle(_curZoneId));

		};
		_self.setViewData(_zoneData.getZoneMedias(_curZoneId));
		_scriptObject.sceneList.refreshCurentNode(true);
        
            //Update the list view transition data
            updateListViewTransitionBySelected(mediaItems);
	};

	var _toMediaGui = function(id) {
		var item = _zoneMediaView.get(id);
		var obj = {};
		//fix bug 0046753
		if(item.media.arend || item.media.arstart){
			
		}else{
			setViewCookie('expiration','hide','30');
		}
		obj.rootId = item.media.parentid;
		obj.lastClickMedia = [item.media.mediaid];
		obj.from = "playlistMediaZone";
		obj.backPlaylistid = _playlistId;
		obj.id = id;
		obj.zoneid = _curZoneId;
		obj.complaylist = jQuery("#playlist_toolbar_approve_publish_button")
				.data("comboPlaylistId");
		obj.sceneId = _scriptObject.sceneList.selectedId;
		//window.DTCookieUtil.setSiteCookie("contentView_DTUI_MEDIA", JSON.stringify(obj));
		window.DTCookieUtil.setSiteCookie("mediaView_DTUI_MEDIA", JSON.stringify(obj));
		window.module_framework.doChangeTab("mediaTab");

	};

	var _editZoneMedia = function(id) {

		var msg = _scriptObject.sceneList.beforeUnload();
		if (msg) {
			ConfirmDialog({
						content : msg,
						okHandler : function() {
							_scriptObject.sceneList.reSetData();
							_toMediaGui(id);
						}
					});

		} else {
			_toMediaGui(id);
		}
	};

	var _addZoneMedia = function() {
		if(_zoneData.getZones()&&_zoneData.getZones().length==0){
		    return;
		}
		var clickObj = jQuery(this).attr("id");
		if (clickObj == "addMedia") {
            _actionStatus = _self.actionStatusAdd;
            
			isReplace = false;
		} else {
            _actionStatus = _self.actionStatusReplace;
			isReplace = true;
            
		}

		var mediaIds = _zoneMediaView.getSelected(true);

		if (isReplace && mediaIds.length == 0) {
			MessageBox({
				content : window.msg["esignage.jsp.playlist.mediazone.selectmedia"]
			});
			return false;
		}

		if (isReplace && mediaIds.length > 1) {
			MessageBox({
				content : window.msg["esignage.jsp.playlist.zone.replace.onlyone"]
			});
			return false;
		}

		var rootId = jQuery("#" + _option.containerId).data("dialogRootId");
		if (!rootId) {
			rootId = 1;
		}

        
        
		_showMediaDialog = new MediaViewDialog({
					containerId : "playlist_zone_media_dialog",
					modal : true,
					toolbars : getToolBars(),
					enableMultiselect : isReplace ? false : true,
					defaultId : rootId,
					width : 950,
					height : 550,
					buttonEvents : {
						ok : _addZoneMediaOk,
						cancel : _addZoneMediaCancel,
						close : _addZoneMediaClose
					}
				});

		_self._showMediaDialog = _showMediaDialog;
	};

    var _showZoneContentView = function(){
        
        if(_zoneContentViewParam === _thumbnailView){
            //Switch button
		    jQuery("#attrTabRight #switchMediaListView").css("display", "inline");
		    jQuery("#attrTabRight #switchMediaThumbnailView").css("display", "none");
		
		    //Switch view
            jQuery("#zone_content").show();
            jQuery("#zone_content_list").hide();
            
        }else if(_zoneContentViewParam === _listView){
            //Switch button
		    jQuery("#attrTabRight #switchMediaListView").css("display", "none");
		    jQuery("#attrTabRight #switchMediaThumbnailView").css("display", "inline");
		
		    //Switch view
            jQuery("#zone_content").hide();
            jQuery("#zone_content_list").show();
        }else{
            console.log("ERR:Unknow zone content view!");
        }  
    };
    
    /**
    * Re-size the media list table view.
    * 1. Get the current zone id.
    * 2. Get the media list view from map object by zone id.
    * 3. Set the width and height.
    */
    var _resizeZoneContentListView = function(){
        
        var mediaListTable = _mediaListTableMap[_curZoneId];
        //var zoneContentView = jQuery("#zone_content");
        //var zoneContentView = jQuery("#zone_content_area");  zoneList
        var zoneContentView = jQuery("#zoneList");  
        
        if(mediaListTable && zoneContentView && zoneContentView[0] && zoneContentView[0].getHeight()){
            
            //Change the status
            //mediaListTable.actionStatus = mediaListTable.actionStatusResizeSouth;
            
            mediaListTable.setViewHeight(zoneContentView[0].getHeight());
            //mediaListTable.setViewHeight(100);
            
            mediaListTable.setViewWidth(zoneContentView[0].getWidth());
            
            mediaListTable.reStyleTr();
            //mediaListTable.initResizeEvent();
                        
        }else{
            console.log("ERR:_resizeZoneContentListView object lost!!!");
        }
    }
    
    /**
    * Simple switch, no data refresh.
    */
    var _justSwitchMediaListView = function() {
        //Switch button
		jQuery("#attrTabRight #switchMediaListView").css("display", "none");
		jQuery("#attrTabRight #switchMediaThumbnailView").css("display", "inline");
		
		//Switch view
        //_zoneMediaView.css("dispaly":"none");
        jQuery("#zone_content").hide();
        jQuery("#zone_content_list").show();
        
        _zoneContentViewParam = _listView;
    }
    
    /**
    * Simple switch, no data refresh.
    * To handle the west resize then switch tab, add the re-width function. 
    */
    var _justSwitchMediaListViewTab = function() {
        
        var zonContentListIdObj;
        var mediaListTable;
        setMediaListTableMapIndex();
        
        if(_mediaListTableMap && _mediaListTableMap.hasOwnProperty(_curZoneId)){            
            
            mediaListTable = _mediaListTableMap[_curZoneId] ;
            mediaListTable.setZIndex("1");
            //Update the other zone index to -1, set the current zone to z-index 1
            zonContentListIdObj = jQuery('#zone_content_list_'+_curZoneId);
            
            zonContentListIdObj.css("z-index","1");
            zonContentListIdObj.css("display","inline");
            
            //The table is generated first time, it may not selected any data row. Check and select the 1st one.
            //var selectedMediaArr = mediaListTable.getSelectedMedia(2);
            var selectedMediaArr = mediaListTable.getSelectedMediaByArr();
            if(selectedMediaArr){
                var zoneMedias = _zoneData.getZoneMedias(_curZoneId);
                //No selected record
                if(zoneMedias && zoneMedias.length>0 ){
                    if(selectedMediaArr.length === 0){
                        //Select the 1st row
                        mediaListTable.selectMediaByIdx(0);
                    }else{
                        if(mediaListTable.getSelectedMediaCountFromTable()===0){
                            var cnt = 0;
                            //If no selected row on the list table, select by the row data
                            for(var mediaIdx=0 ; mediaIdx<zoneMedias.length ; mediaIdx++){
                                if(zoneMedias[mediaIdx] && zoneMedias[mediaIdx].$selected){
                                    mediaListTable.selectMediaByIdx(mediaIdx);
                                }
                            }// end for    
                        }  
                    }
                    
                    //Just one record, select the check master
                    if(zoneMedias.length===1){
                        mediaListTable.selectCheckMaster();
                    }
                }
            }
            
            //Chrome, attach resize events.
            //if(mediaListTable.isBrowserChrome()){
                
                
            //	mediaListTable.initResizeEvent();
            //}
                        
            mediaListTable.resizeCol();            
        }else{//No the zone id area, append new.
            
            jQuery("#zone_content_list").append('<div id="zone_content_list_'+ _curZoneId +'">'+'<div>');
            
            zonContentListIdObj = jQuery('#zone_content_list_'+_curZoneId);
            
            //jQuery('#zone_content_list_'+_curZoneId).css("z-index","1");
            zonContentListIdObj.css("z-index","1");
            //jQuery('#zone_content_list_'+_curZoneId).css("display","inline");
            zonContentListIdObj.css("display","inline");
            
            mediaListTable = createMediaListTable();
            
            //The table is generated first time, it may not selected any data row. Check and select the 1st one.
            var selectedMediaArr = mediaListTable.getSelectedMedia(2);
            if(selectedMediaArr){
               if(selectedMediaArr.length === 0){
                   //Select the 1st row
                   mediaListTable.selectMediaByIdx(0);
               }
            }    
            
            _mediaListTableMap[_curZoneId] = mediaListTable;                
            
            //mediaListTable.reWidth();
			mediaListTable.nonResizeCol();
        }
        
        _curListTblZoneId = _curZoneId;
        
        mediaListTable.reHeight();
        
        _justSwitchMediaListView();
    };
    
    /**  
    * Switch tab to create and display the media list table.
    * This may let the other table in z-index -1, and the current list table z-index to 1.
    */
//    var _resetAndDisplayListTable = function(){                
//        
//        if(_mediaListTableMap && _mediaListTableMap.hasOwnProperty(_curZoneId)){                        
//            
//            setMediaListTableMapIndex();
//            
//            mediaListTable = _mediaListTableMap[_curZoneId] ;
//            mediaListTable.setZIndex("1");
//            //Update the other zone index to -1, set the current zone to z-index 1
//            jQuery('#zone_content_list_'+_curZoneId).css("z-index","1");
//            jQuery('#zone_content_list_'+_curZoneId).css("display","inline");
//                        
//            mediaListTable.cleanMediaListHtml();            
//            mediaListTable.refresh();
//        }else{//No the zone id area, append new.                        
//            jQuery("#zone_content_list").append('<div id="zone_content_list_'+ _curZoneId +'">'+'<div>');            
//            mediaListTable = createMediaListTable();
//            _mediaListTableMap[_curZoneId] = mediaListTable;                
//        }
//    }
    
	/**
    * Display the list view, set the official view display:none. Icon switch display
    */
	var _switchMediaListView = function() {
            //Switch button
            jQuery("#attrTabRight #switchMediaListView").css("display", "none");
            jQuery("#attrTabRight #switchMediaThumbnailView").css("display", "inline");
		
            //Switch view
            //_zoneMediaView.css("dispaly":"none");
            jQuery("#zone_content").hide();
            jQuery("#zone_content_list").show();
        
            _zoneContentViewParam = _listView;
        
            checkAndRewidthListView();
                
            if(_curListTblZoneId===0){
                var zone = _zoneData.getZoneByZoneId(_curZoneId * 1);
                _self.handleShowListTable(zone);
            }else{            
                _self.updateMediaListTable();    
            }
	};
    
	/**
	 * This function is for the test case (fix the list view doesn't resize after refactoring the performance tuning.)-
	 *  1. Display thumbnail view.
	 *  2. Switch to list view.
	 *  3. Switch to thumbnail view.
	 *  4. Do the west resize.
	 *  5. Switch to list view.
	 */
	var checkAndRewidthListView = function(){
            
		var mediaListTable = _mediaListTableMap[_curZoneId]; 
		if(mediaListTable){
			
			//mediaListTable.reWidth();
			
			mediaListTable.nonResizeCol();
		}
	};
	
    var createMediaListTable = function(){        
        
        
        var mediaListTable;
        var zoneMedias = _zoneData.getZoneMedias(_curZoneId);
        
        var attrs = {'divId':'zone_content_list_'+_curZoneId,
                     'zoneMedias':zoneMedias,
                     'zoneMediaView':_zoneMediaView,
                     'zoneMediaCtrl':_self,
                     'zoneData':_zoneData,
                     'currentZoneId':_curZoneId,
                     'transitionComboData':_self.transitionComboData
                    };
        mediaListTable = new MediaListTable(attrs);
        
        return mediaListTable;
    };
    
	
    
    /** Set all the media list table on the zone to z-index -1. */
    var setMediaListTableMapIndex = function(){
        
        if(_mediaListTableMap){
            //Move the list view to z-index -1
            Object.keys(_mediaListTableMap).forEach(function(key,index) {
                // key: the name of the object key                
                jQuery('#zone_content_list_'+key).css("z-index","-1");
                jQuery('#zone_content_list_'+key).css("display","none");
                // index: the ordinal position of the key within the object                
            });
        }
    };
    
   


    
    var _justSwitchMediaThumbnailView = function() {
        
        //Switch button
		jQuery("#attrTabRight #switchMediaThumbnailView").css("display", "none");
		jQuery("#attrTabRight #switchMediaListView").css("display", "inline");
		
		//Switch view
        //_zoneMediaView.css("dispaly":"inline");
        jQuery("#zone_content").show();
        jQuery("#zone_content_list").hide();
        
        if(_mediaListTableMap && !_mediaListTableMap.hasOwnProperty(_curZoneId)){
            var mediaListTable = _mediaListTableMap[_curZoneId];
            var selectedMediaArr = mediaListTable.getSelectedMedia(0);
            
            if(_zoneMediaView){
                _zoneMediaView.unselectAll();
                _zoneMediaView.select(selectedMediaArr, true, false);    
            }
            
        }
    };	
    
    /**  
    * Switch to thumbnail view.
    */
	var _switchMediaThumbnailView = function() {        
            
		//Switch button
		jQuery("#attrTabRight #switchMediaThumbnailView").css("display", "none");
		jQuery("#attrTabRight #switchMediaListView").css("display", "inline");
		
		//Switch view
        jQuery("#zone_content").show();
        jQuery("#zone_content_list").hide();
        
        _zoneContentViewParam = _thumbnailView;
        
        var mediaListTable;
        //Initialize the list table for mapping the data view,
        //The 1st view is the thumbnail view, do some actions and switch to list table will show the correct data.
        if(_mediaListTableMap && !_mediaListTableMap.hasOwnProperty(_curZoneId)){
            var zoneMedias = _zoneData.getZoneMedias(_curZoneId);    
            jQuery("#zone_content_list").append('<div id="zone_content_list_'+ _curZoneId +'">'+'<div>');
            
            var mediaListTable = createMediaListTable();
            //Save the new table to map
            _mediaListTableMap[_curZoneId] = mediaListTable;        
        }else{
            mediaListTable = _mediaListTableMap[_curZoneId];
        }
                 
        //Refresh the thumbnail view
        //Switch to thumbnail view, keep the selected index array
        //There is a bug on thumbnail view after adding multiplae data. It may select the last one.
        if(_zoneMediaView && mediaListTable){    
            var selectedMediaArr = mediaListTable.getSelectedMediaIndexFromTable();
            
            if(selectedMediaArr && selectedMediaArr.length>0){
                _zoneMediaView.refresh();
                _zoneMediaView.unselectAll();
                
                try{
                    _zoneMediaView.select(selectedMediaArr,true, false);
                }catch(err){
                    console.log(err);
                }
            }//end if
        }
	};	
	
    /**
    * Get the id from the media object array.
    */
    var toMediaIdArray = function(selectedMediaArr){
        var mediaIdArr = [];
        if(selectedMediaArr && selectedMediaArr.length>0){
           for(var idx=0; idx<selectedMediaArr.length; idx++){
               var mediaObj = selectedMediaArr[idx];
               if(mediaObj && mediaObj.$selected){
                   mediaIdArr.push(mediaObj.mediaid);
               }
           } 
        }
        
        return mediaIdArr;
    };
    
    /**
    * Import the media.
    */
    var _importZoneMedia = function(){
        
       _actionStatus = _self.actionStatusImport;                
        
        if (_zoneData.getZones() && _zoneData.getZones().length == 0){
            return;
        }

        isReplace = false;
        _showMediaDialog = new dlgWindow();
        _showMediaDialog.show();
    };

    /**
    * Remove the selected medias from the view(thumbnail and list table). Not real deleting.
    * These medias will be deleted after clicking saving button.
    */
    var _delZoneMedia = function() {
        
       _actionStatus = _self.actionStatusDel;
        
	    if(_zoneData.getZones()&&_zoneData.getZones().length===0){
            return;
        }
		var mediaIds = null;
        
        var mediaListTable = null;
        
        //Get the selected medias from list table view 
        if(_zoneContentViewParam===_listView){
            mediaListTable = _mediaListTableMap[_curZoneId];
            //Media ID or index
            mediaIds = mediaListTable.getSelectedMedia(0);
        }else{//Get the selected medias from thumbnail view 
            mediaIds = _zoneMediaView.getSelected(true);
        }
        
		var mediaArr = [];
		for (var i = 0; i < mediaIds.length; i++) {
			mediaArr.push(_zoneMediaView.get(mediaIds[i]));
		}
        
		if (mediaArr.length === 0) {
			return false;
		}
		ConfirmDialog({
			content : window.msg["playlist.jsp.playlistdetail_frame.deletemedia.wan"],
			modal : "true",
			okHandler : function() {
                
                var mediaListTable = _mediaListTableMap[_curZoneId];
                if(mediaListTable){
                    //Set the action status to delete
                    mediaListTable.actionStatus = mediaListTable.actionStatusDel;    
                }
                
                //List view mode needs to update the select index first, then do the delete.
                if(_zoneContentViewParam===_listView){
                    if(mediaListTable){
                        //var selectedMediaArr = mediaListTable.getSelectedMedia();                    
                        mediaListTable.updateThumbnailSelectedIndexByArr();    
                    }                    
                }
                
                //Original delete function
                var oindx = _zoneMediaView.indexById(mediaIds[0]);
                
                _zoneData.plus(_curZoneId, mediaArr);
                _self.setViewData(_zoneData.getZoneMedias(_curZoneId));
                _setZoneTitle(_getZoneTitle(_curZoneId));

                if (_zoneMediaView.dataCount() > 0) {
                    var nid = _zoneMediaView.idByIndex(oindx);
                    
                    if (!nid) {
                        nid = _zoneMediaView.idByIndex(oindx - 1);
                    }
                                        
                    
                    _zoneMediaView.select(nid);
                    if (oindx < 1) {
                        _scriptObject.sceneList.refreshCurentNode(true);
                    }
                } else {
                    var obj = {};
                    obj["" + _curZoneId] = "none";
                    _scriptObject.editPlaylist.renderTemplateZoneImage(obj);
                    _scriptObject.sceneList.refreshCurentNode(true,true);
                }
                
                //Update the list table
                
                if(mediaListTable){
                    //mediaIds
                    _self.removeMediaArr(mediaIds);
                    _self.updateMediaListTable();                
                }				
			},
			cancelHandler : function() {
                console.log("Cancel the delete!");
			}
		});
	};

	var _saveMediadialogRootId = function(mid) {
		if (mid) {
			jQuery("#" + option.containerId).data("dialogRootId", mid)
		} else {
			jQuery("#" + option.containerId).data("dialogRootId",
					_showMediaDialog.getRootId())
		}
	};

	var _checkUploading = function(mediaItems) {
		if (_isExistUploading.length > 0) {
				if(checkUploadT){
                    clearInterval(checkUploadT);
			        checkUploadT=null;
	            }
			  checkUploadT = setInterval(function() {
				if (_isExistUploading.length > 0) {
					for (var i = 0; i < _isExistUploading.length; i++) {
						var isExist = window.uploadArea
								.findItemById(_isExistUploading[i]);
						if (!isExist&&checkUploadT) {
							if (mediaItems && mediaItems.length > 0) {
								for (var j = 0; j < mediaItems.length; j++) {
									if (mediaItems[j].media.mediaid * 1 == _isExistUploading[i]* 1) {
										_zoneMediaView.parse(mediaItems[j],"json");
										_isExistUploading.splice(i, 1);
										mediaItems.splice(j, 1);
										i--;
										break;
									}
								}
							}

						}
					}
				} else {
					_scriptObject.sceneList.refreshCurentNode(true);
					clearInterval(checkUploadT);
					checkUploadT=null;
				}
			}, 5000);
		}

	};

    ///WCM63
    var _addZoneMediaOk = function()
    {
       //_actionStatus = _self.actionStatusAdd;                
        
        var scriptObject = document.getElementById("dt_cm_modules_playlistWrapper_js");
        var objPlaylistZoneMediaEdit = scriptObject.zoneEdit;

        _saveMediadialogRootId();

        var mediasNew = _showMediaDialog.getSelectedMediaObj();
        if(mediasNew.length == 0)
        {
            MessageBox({content: window.msg["esignage.contentserver.jsp.builtin.library.media.mediacategory.delete.notempty"]});
            return false;
        }

        objPlaylistZoneMediaEdit._addZoneMediaArray(mediasNew);

        _showMediaDialog.destory();
        _showMediaDialog = null;
        
                
        //Append the new media array for the list table first
        if(_actionStatus === _self.actionStatusAdd){            
            _self.appendNewMediaArr(mediasNew);        
            _self.updateMediaListTable();    
        }else if(_actionStatus === _self.actionStatusReplace){            
            _self.replaceMedia(mediasNew); 
            //_self.updateMediaListTable();    
        }else{
            console.log("ERR:No action status!");
        }
        _actionStatus = 0;        
    }

    ///WCM63
    _self._addZoneMediaArrayViaExcel = function(mediasNew)
    {

        this._addZoneMediaArray(mediasNew);
    }

    ///WCM63
    _self._addZoneMediaArray = function(mediasNew)
    {
        for(var i = 0; i < mediasNew.length; i++)
        {
            if(mediasNew[i].isfolder * 1 == 1)
            {
                MessageBox({content: window.msg["esignage.contentserver.jsp.playlist.cannot.select.folder"]});
                return false;
            }
        }

        if(window.uploadArea)
        {
            for(var i = 0; i < mediasNew.length; i++)
            {
                var item = window.uploadArea.findItemById(mediasNew[i].id);
                if(item)
                {
                    _isExistUploading.push(mediasNew[i].id);
                }
            }
        }
        var stIndex = -1;
        var mediaIds = _zoneMediaView.getSelected(true);

        var selMedias = [];

        for(var i = 0; i < mediaIds.length; i++)
        {
            var mobj = _zoneMediaView.get(mediaIds[i]);
            if(mobj.media.isfolder * 1 == 0)
            {
                selMedias.push(mobj);
            }
        }
        if(selMedias && selMedias.length > 0)
        {
            stIndex = selMedias[0].sequence;
        }

        var mediaItems = [];

        if(isReplace)
        {
            if(selMedias && selMedias.length > 0)
            {
                selMedias[0].media = mediasNew[0];
                mediaItems.push(selMedias[0]);
                _zoneData.updateMedia(_curZoneId, stIndex, mediaItems[0])
            }
        }
        else
        {
            for(var i = 0; i < mediasNew.length; i++)
            {
                mediaItems.push(_zoneItemNew(mediasNew[i]));
            }
            _zoneData.add(_curZoneId, mediaItems, stIndex);
        }
        _zoneMediaView.unselectAll();
        _zoneMediaView.stopEdit();
        _zoneMediaView.clearAll();
        _self.setViewData(_zoneData.getZoneMedias(_curZoneId));

        var mid = -1;
        if(isReplace)
        {
            mid = _zoneMediaView.idByIndex(stIndex - 1);
            _zoneMediaView.select(mid, true);
            if(mid != -1)
            {
                _zoneMediaView.show(mid);
            }
        }
        else
        {
            for(var i = 0; i < mediaItems.length; i++)
            {
                mid = mediaItems[i].id;
                _zoneMediaView.select(mid, true);
            }
        }

        _setZoneTitle(_getZoneTitle(_curZoneId));
        _checkUploading(mediaItems);

        _scriptObject.sceneList.generateSceneZoneSelectedMediaObj();
        var zoneScrollTop = jQuery("#zone_content").scrollTop();
        window.setTimeout(function()
                          {
                              _scriptObject.sceneList.refreshCurentNode(true);
                              //fixed the bug 0044027
                              if(isReplace)
                                  jQuery("#zone_content").scrollTop(zoneScrollTop);
                          }, 3000);
        //remove tooltip blank box
        for(t = 0; t < jQuery(".dhx_tooltip").length; t++)
        {
            jQuery(".dhx_tooltip")[t].remove();
        }
    };

	var _addZoneMediaCancel = function() {
		_saveMediadialogRootId();
		_showMediaDialog.destory();
		_showMediaDialog = null;
	};
	var _addZoneMediaClose = function() {
		_saveMediadialogRootId();
		_showMediaDialog.destory();
		_showMediaDialog = null;
	};
    
    /** 
    * Click zone tab.
    */
	var zoneTabbarClick = function() {
        
		_curSelectMediaId = null;
		var zoneId = jQuery(this).attr("zoneid");
		var zoneType = jQuery(this).attr("zonetype");
		var edtPlst = _scriptObject.editPlaylist;
		var tei = edtPlst.getTemplateEventInterractor();
		var zone = {};
        
		if (zoneType * 1 == 3) {
			zone = jQuery(this).data("tickerZone");
		} else {
			zone = _zoneData.getZoneByZoneId(zoneId * 1);
			_curSelectMediaId = getSelectHis(sceneIndex, zone.zorder * 1);
		}
        
        //var selectedMediaArr = _self.getSelsctedMediaIdArr();        
                
		_showZone(zoneId, zoneType, false);
		tei.selectZoneByIndex(zone);

		// check if has selected media, if no, clear zone image.
		CommonInfo("_zoneMediaView.dataCount():" + _zoneMediaView.dataCount());
		if (_zoneMediaView.dataCount() == 0) {
			var obj = {};
			obj["" + _curZoneId] = "none";
			_scriptObject.editPlaylist.renderTemplateZoneImage(obj);
		}
        
        //List table mode - show it.
        if( _zoneContentViewParam === _listView ){
            
            if(_actionStatus == _self.actionStatusResizeSouth || _actionStatus == _self.actionStatusResizeWest){
                ; 
            }else{
                _self.handleSwitchListTableTab(zone);
            }
        }else{
            _curListTblZoneId = 0;
            if( checkReSelectRule(_actionStatus) ){
                
                if(_selectedMediaMap){
                    var selectedMediaIdArr = _selectedMediaMap[_curZoneId];
                    
                    if(selectedMediaIdArr && selectedMediaIdArr.length>0){
                        _zoneMediaView.unselectAll();
                        _zoneMediaView.select(selectedMediaIdArr, true, false);     
                    }
                }
                
            }
        }
        
		return false;
	};

    /**
    * Check the status for the re-select the media.
    */
    var checkReSelectRule = function(actStatus){
        var blnCheck = false;
        
        if(actStatus == _self.actionStatusClickZoneTab ||
           actStatus == _self.actionStatusClickZoneArea){
            blnCheck = true;
        }
        
        return blnCheck;
    }
    
    /**
    * Maintain the zone tab click life cycle.
    */
    var zoneTabbarMouseup = function() {
        _actionStatus = _self.actionStatusClickZoneTab;
        var selectedMediaArr = _self.getSelsctedMediaIdArr();
        var timer = setTimeout(function() {
            _actionStatus = 0;
        }, 400);
    }
    
    /**
    * Click the zone picture may call this function.
    */
	var _showZoneByObj = function(zoneObj) {
            
		var tabWidth = 145;
		// var beforeZoneId = jQuery("#attr_tab #attrTabLeft
		// .TabSelected").attr("zoneid");
		// var beforeZone =
		// _scriptObject.editPlaylist.getZoneById(beforeZoneId);
		// var befSeq = beforeZone.sequence;        
        
		_showZone(zoneObj.zoneid, zoneObj.type, true);
		if (zoneObj.zoneid * 1 == _curZoneId * 1) {
			var curSeq = zoneObj.sequence;
			var tabIntervals = _getTabInterval();
			var position = _scriptObject.editPlaylist.getZonePosition(curSeq);
			// CommonInfo("curSeq:"+curSeq+", position:"+position);
			// CommonInfo("tabIntervals:"+tabIntervals[0]+","+tabIntervals[1]);
			if (position > tabIntervals[1] || position < tabIntervals[0]) {
				var tarLeft = 0 - (position - 1) * tabWidth;
				jQuery("#attr_tab  #attrTabLeft").css("left", tarLeft);
			}
        }
        
        var selectedMediaArr = _self.getSelsctedMediaIdArr();
               
		var medid = -1;
        var mediaIds;

        medid = getSelectHis(sceneIndex, zoneObj.zorder);

        if (medid && medid * 1 > 0)
            _zoneMediaView.select(medid);

        mediaIds = _zoneMediaView.getSelected(true);

        if ((typeof mediaIds) == "undefined" || !mediaIds
                || mediaIds.length == 0) {
            var zoneMedias = _zoneData.getZoneMedias(zoneObj.zoneid);
            if ((typeof zoneMedias) != "undefined" && zoneMedias != null
                    && zoneMedias.length > 0) {
                _zoneMediaView.select(zoneMedias[0].id * 1, true);                
            }
        }
        
        //Keep the selected media data
        if(_actionStatus == _self.actionStatusClickSceneArea ||
           _actionStatus == _self.actionStatusClickZoneArea){
            if(_selectedMediaMap){
                var selectedMediaIdArr = _selectedMediaMap[_curZoneId];
                if(selectedMediaIdArr && selectedMediaIdArr.length>0){
                    _zoneMediaView.unselectAll();
                    _zoneMediaView.select(selectedMediaIdArr, true, false);     
                }
            }
        }
        
	}

	var _getTabInterval = function() {
		var intervals = [];
		// 每个tab宽度为145px, 参见main.css ".TabSelected, .TabUnSelected"
		var tabWidth = 145;
		var tabsDiv = jQuery("#attr_tab  #attrTabLeft");
		var tabsDivWidth = tabsDiv.width();
		var tabParentDivWidth = tabsDiv.parent().width();
		var defaultMoveNum = Math.floor(tabParentDivWidth / tabWidth);
		var tabsDivLeft = tabsDiv.position().left;

		var hiddenTabFloat = tabsDivLeft / tabWidth;
		if (hiddenTabFloat < 0) {
			hiddenTabFloat = 0 - hiddenTabFloat;
		}
		var hiddenNumber = Math.floor(hiddenTabFloat);
		if (hiddenNumber >= hiddenTabFloat) {
			hiddenNumber += 1;
		}
		intervals[0] = hiddenNumber;
		intervals[1] = hiddenNumber + defaultMoveNum;
		return intervals;
	}

	var _showZone = function(zoneId, zoneType, isReload) {
            
		if (!isReload && zoneId * 1 == _curZoneId * 1) {
			return;
		}

		_setZoneSelected(zoneId);
		if (_curZoneId * 1 != zoneId * 1) {
			_setZoneUnSelected(_curZoneId);
		}

		_curZoneId = zoneId;
		_zoneMediaView.stopEdit();
		_zoneMediaView.clearAll();
        //Control the list table display
		if (zoneType == 3) {
			
            jQuery("#attrTabRight").css("display", "none");
			jQuery("#attrTabRightTicker").css("display", "block");
			jQuery("#" + _option.tickZoneContainerId).css("display", "block");
			jQuery("#" + _option.containerId).css("display", "none");
			
            //Set list table display to none
            jQuery("#zone_content_list").hide();
            jQuery("#attrTabRight #switchMediaListView").css("display", "inline");
            jQuery("#attrTabRight #switchMediaThumbnailView").css("display", "none");
            
            _scriptObject.tickerEdit.showTicker(zoneId);
		} else {
			jQuery("#attrTabRight").css("display", "block");
			jQuery("#attrTabRightTicker").css("display", "none");
			jQuery("#" + _option.tickZoneContainerId).css("display", "none");
            
			jQuery("#" + _option.containerId).css("display", "block");
            
			var medias = _zoneData.getZoneMedias(_curZoneId);
			if (medias && medias.length > 0) {
				_self.setViewData(medias);
				/*if (_curSelectMediaId != null) {
					_zoneMediaView.select(_curSelectMediaId);
				}*/                
			}            
		}
        
        //Media switch, clean the current list view zone id.
        if(_zoneContentViewParam === _thumbnailView){
            _curListTblZoneId = 0;   
        }

	};
	var detachMediaViewEvent = function() {
		jQuery("#zone_content").undelegate(".transduration", "change");
		if (_zoneMediaView) {
			_zoneMediaView.detachEvent(onItemClick);
			_zoneMediaView.detachEvent(onItemDbClick);
			_zoneMediaView.detachEvent(onBeforeDrag);
			_zoneMediaView.detachEvent(onAfterDrop);
			_zoneMediaView.detachEvent(onSelectChange);
			_zoneMediaView.detachEvent(onAfterEditStop);
			_zoneMediaView.detachEvent(onBeforeEditStop);
            _zoneMediaView.detachEvent(onAfterEditStop);
            //fuli 20150928 for move media item
            _zoneMediaView.detachEvent(onMouseOutItem);
            _zoneMediaView.detachEvent(onMouseMoving);
            _zoneMediaView.detachEvent(onMouseMove);
            _zoneMediaView.detachEvent(onMouseDragOut);
            _zoneMediaView.detachEvent(onMouseDragIn);
		}
	};

	var _setZoneMediaTooltip = function(obj, event) {
		var titleName = window.msg["esignage.contentserver.jsp.builtin.library.media.mediadetail.name"];
		var strTooltips = "<div class='w h tooltip mediaDialogTipFlag'><ul>";
		strTooltips += "<li>" + titleName + " : " + obj.media.name + "</li>";
		strTooltips += "</ul></div>";
		return strTooltips;
	}

	var _iniZoneMediaView = function(xcount) {
		detachMediaViewEvent();
        
        //Set the content list hide
        jQuery("#zone_content_list").hide();
        
		
		_zoneMediaView = new dhtmlXDataView({
			container : _option.containerId,
			edit : false,
			drag : true,
			// tooltip: {
			// width:300,
			// height:500,
			// template: _setZoneMediaTooltip
			// },
			auto_scroll : false,
			// y_count : 1,
			height : 160,
			// x_count: xcount?xcount:6,
			type : {
				height : 130,
				width : 190,
				margin : 0,
				padding : 2,
				css : "thumView",
				template : "<div id='#id#' class='zoneItem'>"
						+ "<div class='zoneItem_startTime'><img src='/modules/playlist/img/totaltime.png' style='width:16px;height:16px;margin-right:4px'>{common.setStartTime()}</div>"
						+ "<div class='zoneItem_content'>"
						+ "<div class='zoneItem_content_top'>"
						+ "<div class='zoneItem_content_top_num'>{common.setMediaSequence()}</div>"
						+ "<div class='zoneItem_content_top_duration' title='"
						+ window.msg["esignage.playlist.jsp.zone.duration.format"]
						+ "'>{common.setDuration()}</div>"
						+ "</div>"
						+ "<div class='zoneItem_content_thum'>{common.setMediaPlayImg()}<img width='100%' height='100%' mediaid='#mediaid#' class='media' src='{common.setMediaImageSrc()}' ondragstart='return false'></div>"
						+ "<div class='zoneItem_content_name' title='{common.setTitle()}'>{common.setName()}</div>"
						+ "</div>"
						+ "</div>"
						+ "<div class='zoneItemTf' id='zoneItemTf#id#'>"
                        + "<div class='AvailableRangeIcon'><div class='{common.setARImg()}' height='24' width='24' title='{common.setARTitle()}'></div></div>"
                        + "<div class='TfImage'><img class='tranimg' src='{common.setTransitionImg()}' height='39' width='39' title='{common.setTranTitle()}' ondragstart='return false'/></div>"
						+ "<div class='TfDur'>"
						+ "<select id='transitionDuration#id#' class='transduration'>{common.setTransDuration()}</select>"
						+ "</div>" + "</div>",
				template_edit : "<div id='#id#' class='zoneItem'>"
						+ "<div class='zoneItem_startTime'>|{common.setStartTime()}</div>"
						+ "<div class='zoneItem_content'>"
						+ "<div class='zoneItem_content_top'>"
						+ "<div class='zoneItem_content_top_num'>{common.setMediaSequence()}</div>"
						+ "<div class='zoneItem_content_top_duration'>"
						+ "<div style='position:relative;width:100%;z-index:10000;'>"
						+ "<input type='text' class='dhx_item_editor' style='width:100px'  value='{common.setDuration()}' id='{common.setEditDurationInputId()}'></div>"
						+ "{common.setEditDuration()}</div>"
						+ "</div>"
						+ "<div class='zoneItem_content_thum'>{common.setMediaPlayImg()}<img width='100%' height='100%' class='media'  mediaid='#mediaid#'  src='{common.setMediaImageSrc()}' ondragstart='return false'></div>"
						+ "<div class='zoneItem_content_name'>{common.setName()}</div>"
						+ "</div>"
						+ "</div>"
						+ "<div class='zoneItemTf' id='zoneItemTf#id#'>"
                        + "<div class='AvailableRangeIcon'><div class='{common.setARImg()}' height='24' width='24' title='{common.setARTitle()}'></div></div>"
						+ "<div class='TfImage'><img class='tranimg' src='{common.setTransitionImg()}' height='39' width='39' title='{common.setTranTitle()}' ondragstart='return false'/></div>"
						+ "<div class='TfDur'>"
						+ "<select id='transitionDuration#id#' class='transduration'>{common.setTransDuration()}</select>"
						+ "</div>" + "</div>",

				setDuration : function(obj) {
					var medialengthstr = _playtimeFormat(obj.medialength,
							obj.media.frame);
					return medialengthstr;
				},
				setEditDurationInputId : function(obj) {
					return "input" + obj.id;
				},
				setStartTime : function(obj) {
					var len = _startPlaytime(obj.sequence);
					return _playtimeFormat(len);
				},
				setName : function(obj) {
					//var isUnReadableMedia = _isUnReadableMedia(obj);
                    var isUnReadableMedia = _self.isUnReadableMedia(obj);
					if (isUnReadableMedia == true) {
						return "<font color='red'>"
								+ window.msg["esignage.contentserver.svlt.privilege.unreadablemedia"]
								+ "</font>";
					}
					return obj.media.name;
				},
				setTitle : function(obj) {
					//var isUnReadableMedia = _isUnReadableMedia(obj);
                    var isUnReadableMedia = _self.isUnReadableMedia(obj);
					if (isUnReadableMedia == true) {
						return window.msg["esignage.contentserver.svlt.privilege.unreadablemedia"];
					}
					return obj.media.name;
				},
				setMediaSequence : function(obj) {
					return obj.sequence * 1;
				},

				setMediaPlayImg : function(obj) {
					var fileExtent = obj.media.extension;
					var extension = new Extension();
					if (extension.isVideoExtension(fileExtent) != true) {
						return "";
					} else {
						return "<div class='zoneItem_content_playBtn'></div>";
					}
				},

				setTransDuration : function(obj) {
					var str = "";
					var t = obj.transitionduration;
					if (obj.transition * 1 == 0) {
						str = "<option value=0 selected>0</option>";
					} else {
						for (var i = 1; i < 11; i++) {
							if (t && t * 1 == i) {
								str += "<option value=" + i + " selected>" + i
										+ "</option>";
							} else {
								str += "<option value=" + i + ">" + i
										+ "</option>";
							}
						}
					}
					return str;
				},
				setTransitionImg : function(obj) {
                    if (obj && obj.transition * 1 == -1) {
						return "/image/transition/tf_img001.png";
					} else if (obj && obj.transition * 1 == 0) {
						return "/image/transition/0.png";
					} else if (obj && obj.transition * 1 > 0) {
						return "/image/transition/" + obj.transition + ".gif";
					} else {
						return "/image/transition/0.png";
					}
				},
				setTranTitle : function(obj) {
					var tranid = obj.transition ? obj.transition * 1 : 0;
					return transNames.getTransitionName(tranid);

				},

                /*fuli 20151008 add available range icon in media area*/
                setARImg : function(obj) {
                    var ARType = _checkAvailableType(obj);
                    var imgURL = "";

                    switch(ARType) {
                        case 1:
                            imgURL = "item_top_left_icon05";
                            break;

                        case 0:
                            imgURL = "item_top_left_icon04";
                            break;

                        case 2:
                        default:
                            imgURL = "";
                            break;
                    }

                    return imgURL;
                },
                setARTitle : function(obj) {
                    var notAvailable = window.msg["esignage.contentserver.jsp.playlist.availableRange.notAvailable"];
                    var available = window.msg["esignage.contentserver.jsp.playlist.availableRange.available"];
                    var noAvailableSetting = window.msg["esignage.contentserver.jsp.playlist.availableRange.notset"];
                    var ARType = _checkAvailableType(obj);
                    var title = noAvailableSetting;
                    var arRange = _getAvailableRange(obj);

                    switch(ARType) {
                        case 1:
                            title = notAvailable + arRange;
                            break;

                        case 0:
                            title = available + arRange;
                            break;

                        case 2:
                        default:
                            title = noAvailableSetting;
                            break;
                    }
                    return title;
                },
                /**/

				setMediaImageSrc : function(obj) {
					//var isUnReadableMedia = _isUnReadableMedia(obj);
                    var isUnReadableMedia = _self.isUnReadableMedia(obj);
					if (isUnReadableMedia == true) {
						return "/image/noRead.png;jsessionid="
								+ window.jsessionid;
					}
					var url = _getMediaImgUrl(obj.media.mediaid);
					return url;
				}
			}
		});
        
		_zoneMediaView.attachEvent("onBeforeDrop",function(context){
            //fuli20150928 forbid the drop operation if the dragged item will be dropped to an empty area.
            var dropTargetIndex = context.target;
            if(!dropTargetIndex) {
                return false;
            }
            //

            if(context.from._dataobj.id == "segmentList"){
				return false;
			}
		});

//		var _isUnReadableMedia = function(obj) {
//			if (_unReadAbleMediaRescode && _unReadAbleMediaRescode.length > 0) {
//				for (var i = 0; i < _unReadAbleMediaRescode.length; i++) {
//					if (_unReadAbleMediaRescode[i] * 1 == obj.media.rescode * 1) {
//						return true;
//					}
//				}
//			}
//			return false;
//		};

		_zoneMediaView.attachEvent("onAfterSelect", function(id) {
			// any custom logic here
			if (_zoneMediaView.hack && _zoneMediaView.hack.showVideo) {
				var selector = "#zone_content #" + id
						+ " .zoneItem_content_thum";
				var cobj = jQuery(selector);
				var w = cobj[0].offsetWidth;
				var h = cobj[0].offsetHeight;

				var media = _zoneMediaView.get(id);
				var fileExtent = media.extension;
				var strFilePath = window.context_path
						+ _getMediaFilePath(media.media.mediaid);
				var strHtml = "<video src='"
						+ strFilePath
						+ "' class='video-js vjs-default-skin' autoplay='autoplay' loop='false' width='"
						+ w + "' height='" + h + "' type='" + fileExtent
						+ "'></video>";
				jQuery(selector).html(strHtml);
				_zoneMediaView.hack = {};
			}
			// just change this zone his, do not change others
			var obj = _zoneMediaView.get(id);
            
            
            
			_scriptObject.sceneList.generateSceneZoneSelectedMediaObj(obj);
            
            
            //Update the selected media index
            //updateThumbnailSelectedMap();
		});

		var durationInvalidProcess = function(elem){
		    jQuery(elem).focus();
            jQuery(elem).select();
            jQuery(elem).one("focusout", function() {
                jQuery(elem).focus();
                jQuery(elem).select();
                _zoneMediaView.stopEdit();
            });
		};

		onBeforeEditStop = _zoneMediaView.attachEvent("onBeforeEditStop",
				function(id) {
					CommonDebug("onBeforeEditStop .......................");
					var elem = jQuery("#input" + id)[0];
					var newValue = jQuery("#input" + id)[0].value;
					var data = _zoneMediaView.get(id);
					// var
					// medialengthstr=_playtimeFormat(data.medialength,data.media.frame);
					var ff = newValue.split(":");
					var z = 0, f = 0, frm;
					if (ff.length <= 3 && ff.length > 0) {
						var strSec = ff[ff.length - 1];
						var p = strSec.lastIndexOf(".");
						if (p > -1) {
							//Fix bug 43899 Cavan 2013-11-28 begin#5
							frm = "0." + strSec.substr(p + 1);
							z = strSec.substr(0, p) * 1;
						} else {
							z = strSec * 1;
						}

						if (ff.length > 1) {
							z += ff[ff.length - 2] * 60;
						}

						if (ff.length > 2) {
							z += ff[ff.length - 3] * 60 * 60;
						}
					}

					if (data && data.media.frame && frm) {
						//Fix bug 43899 Cavan 2013-11-28 begin#4
						f = Math.round(frm * 1000);
						//f = Math.round(frm * 1000 / data.media.frame);
					}

					z = z * 1000 + f;
					if (isNaN(z)) {
						z = 0;
					}
					if (z > 86400000 || z <= 0) {
						jQuery(elem).unbind("focusout");
						MessageBox({
							content : window.msg["esignage.playlist.jsp.zone.duration.error1"],
							okHandler : function(){
							     durationInvalidProcess(elem);
							},
                            closeHandler : function(){
                                durationInvalidProcess(elem);
                            }
						});
						return false;
					}

					jQuery("#zone_content").data("newEditDurationValue", z);
				});

		onAfterEditStop = _zoneMediaView.attachEvent("onAfterEditStop",
				function(id) {
					var newValue = jQuery("#zone_content").data("newEditDurationValue");
					// var tmpnewValue = jQuery("#input"+id)[0].value;
					var tmpdata = _zoneMediaView.get(id);
					var oldStr = _playtimeFormat(tmpdata.medialength,tmpdata.media.frame);
					var newStr = _playtimeFormat(newValue, tmpdata.media.frame);
					if (oldStr == newStr) {
						return;
					}

					var newValue = jQuery("#zone_content").data("newEditDurationValue");
					var data = _zoneMediaView.get(id);
					data.medialength = newValue;
					_self.editFlag = true;
					_showZone(_curZoneId, 2, true);
					if (_zoneMediaView.indexById(id) < 1) {
						_scriptObject.sceneList.refreshCurentNode(false, true);
					}
					_self.editFlag = false;
					_setZoneTitle(_getZoneTitle(_curZoneId));
					_zoneMediaView.stopEdit();
            
                    
                    //updateThumbnailSelectedMap();
				});

		onSelectChange = _zoneMediaView.attachEvent("onSelectChange", function(
				sel_arr) {
			if (_self.editFlag)
				return;
			var id = sel_arr[0];
			var obj = {};
			var media = _zoneMediaView.get(id);
			//var isUnReadableMedia = _isUnReadableMedia(media);
            var isUnReadableMedia = _self.isUnReadableMedia(media);
			if (isUnReadableMedia == true) {
				obj["" + _curZoneId] = "/image/noRead.png;jsessionid="
						+ window.jsessionid;
			} else {
				obj["" + _curZoneId] = _getMediaOriginImgUrl(media.media.mediaid);
			}
			_scriptObject.editPlaylist.renderTemplateZoneImage(obj);            
            
            //Some list view action will update back, the action will cause this event and let the index lost.
            //Limit the update when doing the thumbnail management 
            if(_zoneContentViewParam===_thumbnailView){
                try{
                    updateListTableSelectedData();    
                }catch(err){
                    console.log("onSelectChange:"+err);
                }
            }            
		});

        
        /**
        * Delay call to prevent from repeat update.
        */
        var updateSelectedData = function(){
            var timer;
            
        
            var firstCall = function(){                
                updateThumbnailSelectedData();
                updateListTableSelectedData();  
            };

            //Do nothing, just set the parameter back.
            var secondCall = function(){ 
                firing = false;                
                //return false;
            };
        
            //Default - firstCall function
            var firingFunc = firstCall;

            // Detect the 2nd call event, so we can set it to secondCall
            if(firing){
              firingFunc = secondCall; 
            }

            firing = true;

            timer = setTimeout(function() {
               //Run the main function
               firingFunc(); 
               // Always revert back to firstCall firing function
               firingFunc = firstCall;
               firing = false;
            }, 100);
               
        };
        
		onItemClick = _zoneMediaView.attachEvent("onItemClick", function(id,
						ev, html) {
					var media = _zoneMediaView.get(id);
					var strClassName = ev.target.className;
					if ("dhx_item_editor" == strClassName) {
						return;
					}
                    if (ev.target.className == "dhx_item_editor") {
                        return;
                    }
                    if (ev.target.className == "tranimg") {
						_zoneMediaView.stopEdit();
						jQuery("#" + _option.containerId).data(
								"lastClickMediaId", id);
						CommonDebug("playlist item edit onItemClick");
						var transitionEffectDiv = jQuery("#TransitionEffectDiv");
						if (transitionEffectDiv.is(":hidden")) {
							_self.editSingleMediaEffer(ev.target);
						} else {
							_self.hiddenTransition();
						}
						return false;
					} else if (ev.target.className == "media"
							|| ev.target.className == "zoneItem_content_playBtn") {
						_zoneMediaView.stopEdit();
						var playVedio = _playMedia(ev.target, media);
						if (playVedio == true) {
							var bool = _zoneMediaView.isSelected(id);
							if (!bool) {
								_zoneMediaView.hack = {};
								_zoneMediaView.hack.showVideo = true;
								_zoneMediaView.select(id);
							}
							return false;
						}

					} else if (ev.target.className == "transduration") {
						_zoneMediaView.stopEdit();
						CommonDebug("playlist item edit transduration");
						return false;
					} else if (ev.target.className == "zoneItem_content_top_duration") {

					} else if (jQuery(".video-js", ev.target).length >= 1) {
						// do nothing
						// var imgPath = _getMediaImgUrl(media.media.mediaid);
						// _stopPlayMedia(ev.target, imgPath);
					} else if (ev.target.nodeName.toLowerCase() == "video") {// click
																				// playing
																				// video
						var imgPath = _getMediaImgUrl(media.media.mediaid);
						_clickPlayingVideo(ev.target, imgPath);
					}

				});

		onItemDbClick = _zoneMediaView.attachEvent("onItemDblClick", function(id, ev, html) {
                    
					CommonDebug("playlist item editonItemDblClick");
					var strClassName = ev.target.className;
					if ("dhx_item_editor" == strClassName) {
						return false;
					}
					if ("video-js vjs-default-skin" == strClassName
							|| "media" == strClassName) {
						return;
					}
					if ("tranimg" == strClassName
							|| "transduration" == strClassName
							|| "zoneItem_content_thum" == strClassName) {

						return;
					}
                    if ("zoneItem_content_top" == strClassName
							|| "zoneItem_content_top_num" == strClassName
							|| "zoneItem_content_top_duration" == strClassName) {
						_zoneMediaView.edit(id);
						var elem = jQuery("#input" + id)[0];
						var start = 0;
						end = elem.value.length;
						if (elem.setSelectionRange) {
							CommonDebug("Enter elem.setSelectionRange....");
							elem.focus();
							elem.setSelectionRange(0, end);
						} else if (elem.createTextRange) {
							CommonDebug("Enter elem.createTextRange....");
							var range = elem.createTextRange();
							range.collapse(true);
							range.moveStart('character', 0);
							range.moveEnd('character', end);
							range.select();
						}
						jQuery(elem).one("focusout", function() {
									jQuery(elem).focus();
									jQuery(elem).select();
									_zoneMediaView.stopEdit();
								});
						return true;
					} else {
						_zoneMediaView.stopEdit();
					}
					var media = _zoneMediaView.get(id);
					//var isUnReadableMedia = _isUnReadableMedia(media);
                    var isUnReadableMedia = _self.isUnReadableMedia(media);
					if (isUnReadableMedia == true) {
						return;
					} else {
						_editZoneMedia(id);
					}
				});

		onBeforeDrag = _zoneMediaView.attachEvent("onBeforeDrag", function(context, ev) {
            
            
            var selectedMediaIdArr = _zoneMediaView.getSelected(true);
            
            var event_target = ev.srcElement || ev.target;
            if (event_target.className == "dhx_item_editor") {
                return false;
            }

            _zoneMediaView.stopEdit();
            CommonDebug("playlist item edit onBeforeDrag");

            //fuli 20151013 there is a bug, sometime the context.source is not an array when only drag one item
            var source = [];
            if(jQuery.isArray(context.source)) {
                source = context.source;
            }else {
                source.push(context.source);
            }
            //

            var sourceIndexs = [];
            for (var i = 0; i < source.length; i++) {
                var ind = _zoneMediaView.indexById(source[i]);
                sourceIndexs.push(ind);
                _zoneData.setDragSourceIndexs(sourceIndexs);
            }
        });

		onAfterDrop = _zoneMediaView.attachEvent("onAfterDrop", function(context, e) {
            
            CommonDebug("playlist item edit onAfterDrop");
            //debug//
            //var medias = _zoneData.getZoneMedias(_curZoneId);
            var targetIndex = context.index;
            var sourcesIds = [];

            //fuli 20151013 the source item is not sorted when drag and drop, it causes the item order changed after drop.
            // sort the source item before use it.
            if(jQuery.isArray(context.source)) {
                sourcesIds = context.source;
            }else {
                sourcesIds.push(context.source);
            }

            //the item type in context.source sometime is string, sometime is integer!!!!
            var newSource = _zoneMediaView.sortSourceId(sourcesIds);
            //

            //fuli 20151013 support drop item to target's header or tail
            var $targetItem = null;
            var moveDirection = 0;
            var id = context.target;//_zoneMediaView.locate(e);
            if (id) $targetItem = jQuery("#zone_content div[dhx_f_id=" + id + "]").eq(0);

            if($targetItem){
                if($targetItem.css("border-left-width") && ($targetItem.css("border-left-width").slice(0, 3) === "3px")) {
                    moveDirection = 0;
                    _zoneData.updateForDrag(_curZoneId, targetIndex, moveDirection);
                } else {
                    moveDirection = 1;
                    _zoneData.updateForDrag(_curZoneId, targetIndex, moveDirection);
                }
            }else{
                moveDirection = 0;
                _zoneData.updateForDrag(_curZoneId, targetIndex, moveDirection);
            }
            //_zoneData.updateForDrag(_curZoneId, targetIndex);
            //

            _showZone(_curZoneId, 2, true);
            var srcIndex = _zoneMediaView.indexById(newSource[0]);
            //var dropTargetIndex = parseInt(context.target, 10);

            if (targetIndex < 1 || srcIndex < 1) {
                _scriptObject.sceneList.refreshCurentNode(true);
            }

            ////fuli 20160308 calc the distance of target item after drop.
            var selectedSourceIndexs = _zoneData.getDragSourceIndexs();
            var sourceItemsBeforeTarget = 0;
            var isTargetInSource = false;
            var startIndex = -1;

            //check source array contains target or not, if not contain do it as general case
            //otherwise need special treatment
            var targetIndexInSource = selectedSourceIndexs.indexOf(targetIndex);
            if(targetIndexInSource > -1) isTargetInSource = true;

            //special case(target in source list)
            if(isTargetInSource) {
                var spyNumber = 0;
                if(targetIndexInSource !== (targetIndex - selectedSourceIndexs[0])) {
                    spyNumber = targetIndex - selectedSourceIndexs[0] - targetIndexInSource;
                }

                //if it is continuous in source list from beginning to target
                //then just set target as the first item of source list, then select items after it after drop.
                //if there are unselected items before target, need consider the unselected item.
                startIndex = selectedSourceIndexs[0] + spyNumber + 1;
            } else {
            // general case, just check how many steps target item moved after drop,
            // then select the items before or after target according to drop before or after.
                //calc how many item in source array is before target item
                for (var i = 0; i < selectedSourceIndexs.length; i++) {
                    if(selectedSourceIndexs[i] < targetIndex) sourceItemsBeforeTarget++;
                }

                startIndex = targetIndex + 1 - sourceItemsBeforeTarget;
                if(moveDirection === 1) {
                    startIndex++;
                }
            }

            newSelectedStartIdx = startIndex;
            
            

            //Update the media list table after drop processes.
            //onSelectChange has changed the list table
            try{                                                
                refreshTableByMediaArr(context, selectedSourceIndexs, newSelectedStartIdx);
            }catch(err){
                console.log("ERR on drop media:"+err);
            }
                                                
            //Restore the selection
            //New selected start position after the dropping the items.
            var newSelectedStartIdx = -1;
            _zoneMediaView.unselectAll();
            
            for (var i = 0; i < selectedSourceIndexs.length; i++) {
                _zoneMediaView.select(startIndex + i, true);
                
                //This parameter is for the list view to identify the selected starting row.
                //And it may 
//                if(i==0){
//                    newSelectedStartIdx = startIndex + i;
//                }

            }
            
            return false;
        });

        /**
        *
        */
        var focusOnSelectMedia = function(mediaIdx){
            
            jQuery("#zone_content").find( '.dhx_dataview_item').each(function(idx){
                if(mediaIdx==idx){                    
                    jQuery(this).triggerHandler( "focus" );
                    return false;
                }else{
                    //console.log("aftr drop No matches!!!");
                }
            }); 
        }
        
        //fuli 20151103 the item type in context.source is not sorted and sometime is string, sometime is integer!!!!
        _zoneMediaView.sortSourceId = function(sourceIDs) {
            var newSource = [];
            for(var i = 0; i < sourceIDs.length; i++) {
                sourceIDs[i] = parseInt(sourceIDs[i]);
                if(newSource.indexOf(sourceIDs[i]) === -1) { newSource.push(sourceIDs[i]); }
            }

            if(newSource.length === 1){
                newSource[0] = parseInt(newSource[0]);
            }
            else { //sort item by order
                newSource.sort(function(a, b) {
                    if(a > b) return 1;
                    else if(a < b) return -1;
                    else return 0;
                });
            }

            return newSource;
        }
        //

//fuli 20150928 for move media item
        onMouseOutItem = _zoneMediaView.attachEvent("onMouseOut", function(ev) {            
//              response too slow
        });

        onMouseMove = _zoneMediaView.attachEvent("onMouseMove", function(id, ev, html) {
//              response too slow
//            jQuery(html).css("background-color", "#F39814");
        });

        /**
        * Control the css of target drop position, may display the vertical color bar.
        */        
        
        
        onMouseMoving = _zoneMediaView.attachEvent("onMouseMoving", function(ev) {
        //onMouseMoving = _zoneMediaView.attachEvent("onMouseMoving", function(context, ev) {    
            var zone = _zoneData.getZoneByZoneId(_curZoneId * 1);
            
            var curSelectMediaId = getSelectHis(sceneIndex, zone.zorder * 1);
                        
            var mediaIds = _zoneMediaView.getSelected(true);
            
            var id = _zoneMediaView.locate(ev);
            //var id = context.id;            
            
            if (id){
            	
                var $targetItem = jQuery("#zone_content div[dhx_f_id=" + id + "]").eq(0);

                if($targetItem.hasClass("DragIn_Fuli")) {
                    $targetItem = jQuery("#zone_content div[dhx_f_id=" + id + "]").eq(0);

//                    var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
//                    var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                    var containerClientRect = $targetItem[0].getBoundingClientRect();
                    var offsetX = ev.x - containerClientRect.left;
                    var itemHalfWidth = containerClientRect.width / 2;

                    if(offsetX <= itemHalfWidth) {
                        $targetItem.css("border-left", "3px solid #f3f250");//F39814");
                        if($targetItem.css("border-right-width"))
                            $targetItem.css("border-right", "");
                    } else {
                        if($targetItem.css("border-left-width"))
                            $targetItem.css("border-left", "");
                        $targetItem.css("border-right", "3px solid #f37945");//F39814");
                    }
                }
            }
            return true;
        });

        var callOnMouseMoving = function(){
        	 var zone = _zoneData.getZoneByZoneId(_curZoneId * 1);
             
             var curSelectMediaId = getSelectHis(sceneIndex, zone.zorder * 1);
             
             var id = _zoneMediaView.locate(ev);

             if (id){
                 var $targetItem = jQuery("#zone_content div[dhx_f_id=" + id + "]").eq(0);                                  
                 if($targetItem.hasClass("DragIn_Fuli")) {
                     
                     $targetItem = jQuery("#zone_content div[dhx_f_id=" + id + "]").eq(0);

//                     var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
//                     var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

                     var containerClientRect = $targetItem[0].getBoundingClientRect();
                     var offsetX = ev.x - containerClientRect.left;
                     var itemHalfWidth = containerClientRect.width / 2;

                     if(offsetX <= itemHalfWidth) {
                         $targetItem.css("border-left", "3px solid #f3f250");//F39814");
                         if($targetItem.css("border-right-width"))
                             $targetItem.css("border-right", "");
                     }
                     else {
                         if($targetItem.css("border-left-width"))
                             $targetItem.css("border-left", "");
                         $targetItem.css("border-right", "3px solid #f37945");//F39814");
                     }
                 }else{
                      ;
                 }
             }
             return true;
        }
        
        onMouseDragOut = _zoneMediaView.attachEvent("onDragOut", function (context, ev){
            
//            jQuery("#zone_content .dhx_dataview_item").css("background-color", "");
            jQuery("#zone_content .dhx_dataview_item").css("border-left", "");
            jQuery("#zone_content .dhx_dataview_item").css("border-right", "");
            
            var id = _zoneMediaView.locate(ev);
                        
            if(id) {
                var $targetItem = jQuery("#zone_content div[dhx_f_id=" + id + "]").eq(0);
//            $targetItem.css("background-color", "#F39814");
                if($targetItem) {
                    $targetItem.removeClass("DragIn_Fuli");
                }
            }
            else {
                jQuery("#zone_content .dhx_dataview_item").removeClass("DragIn_Fuli");
            }

            return true;
        });

        onMouseDragIn = _zoneMediaView.attachEvent("onBeforeDragIn", function (context, ev){
            
            var id = _zoneMediaView.locate(ev);
            
            if(id) {
                var $targetItem = jQuery("#zone_content div[dhx_f_id=" + id + "]").eq(0);
                if($targetItem) {
                    $targetItem.addClass("DragIn_Fuli");
                    
                }
            }
            return true;
        });
        //

        jQuery("#zone_content").delegate(".transduration", "change",
				function(event) {
					var ele = jQuery(event.srcElement || event.target);
					var id = ele.attr("id").replace("transitionDuration", "");
					var media = _zoneMediaView.get(id);
					var duration = ele.val();
					_zoneData.setTrancetionDuration(_curZoneId, media.sequence,duration);
				});
	};//end _iniZoneMediaView
    
    _self.isUnReadableMedia = function(obj){
        if (_unReadAbleMediaRescode && _unReadAbleMediaRescode.length > 0) {
            for (var i = 0; i < _unReadAbleMediaRescode.length; i++) {
                if (_unReadAbleMediaRescode[i] * 1 == obj.media.rescode * 1) {
                    return true;
                }
            }
        }
        return false;
    };

	_self.editSingleMediaEffer = function(Ele) {
		_self.transitionDialog = jQuery("<div id='playlist_transition_dialog'></div>")
				.dialog({
					modal : true,
					resizable : false,
					title : window.msg['esignage.contentserver.jsp.playlist.transitioneffect'],
					width : 320,
					height : 444,
					buttons : [{
						id : "ok",
						text : window.msg['esignage.contentserver.jsp.dialog.button.ok'],
						click : function(event) {
							_self.transitionDialog.remove();
						}
					}, {
						id : "cancel",
						text : window.msg['esignage.contentserver.jsp.dialog.button.cancel'],
						click : function(event) {
							_self.transitionDialog.remove();
						}
					}],
					close : function(event, ui) {
						_self.transitionDialog.remove();
					},
					open : function(evt) {
						jQueryAjaxExt({
							type : "post",
							url : window.context_path
									+ "/modules/playlist/jsp/playlistTransition.jsp;jsessionid="
									+ window.jsessionid,
							success : function(re) {
								jQuery("#playlist_transition_dialog")
										.append(re);
								var transitionAnimation = new TransitionAnimation(_self.setTransition);
								transitionAnimation.init();
							}
						});
					}
				});
	};

//    this.setMediaData = function(json){
//        console.log("this.setMediaData!!!");
//    }
    
    /**
     * Append the new media array on the media list table.
     */
    _self.removeMediaArr = function(mediaIds, selectedIdx){
        var mediaListTable;
                        
        if(_mediaListTableMap.hasOwnProperty(_curZoneId)){
            mediaListTable = _mediaListTableMap[_curZoneId];
            if(mediaListTable){
                //Get the selected media ID array.                    
                if(mediaIds && mediaIds.length>0){                        
                    //Remove from tail
                    for(var arrIdx=mediaIds.length; arrIdx>0; arrIdx--){                            
                        //Send the array index to the function
                        mediaListTable.removeMediaTr(mediaIds[arrIdx-1]-1);
                    }

                }

            }
        }                    
    };//end function removeMediaArr
    
    /**
    * Append the new media array on the media list table.
    * @param selectedMediaArr - The selected media array
    */
    _self.appendNewMediaArr = function(selectedMediaArr){
        var mediaListTable;
        //New media array
        var newMediaArr = _zoneData.getZoneMedias(_curZoneId);
        
        if(selectedMediaArr && selectedMediaArr.length>0){
            //The list table exists, append the new media array tr html 
            if(_mediaListTableMap.hasOwnProperty(_curZoneId)){
                mediaListTable = _mediaListTableMap[_curZoneId];
                if(mediaListTable){
                    //Get the selected media ID array.
                    var mediaIds = _zoneMediaView.getSelected(true);
                    
                    mediaListTable.appendNewMediaArr(mediaIds, selectedMediaArr, newMediaArr);
                }
                
            }    
        }
        
    }
    
    /**
    * Append the new media array on the media list table.
    * @param selectedMediaArr - The selected media array
    */
    _self.replaceMedia = function(selectedMedia){
        var mediaListTable;
        //New media - suppose it's just one record.
        var mediaArr = _zoneData.getZoneMedias(_curZoneId);
        
        if(selectedMedia){
            //The list table exists, append the new media array tr html 
            if(_mediaListTableMap.hasOwnProperty(_curZoneId)){
                mediaListTable = _mediaListTableMap[_curZoneId];
                if(mediaListTable){
                    //Get the selected media ID - suppose the replace just one record.
                    var mediaId = _zoneMediaView.getSelected(true);
                    
                    mediaListTable.replaceMedia(mediaId, selectedMedia, mediaArr);
                    
                }
                
            }    
        }
        
    }
    
	/**
    * Update the media list data, remove the original table then create it.
    * Check the check all status - for the 1st master check box.
    */
    _self.updateMediaListTable = function(){
        
        var newMediaArr = _zoneData.getZoneMedias(_curZoneId);
            
        var mediaListTable;
        if(_mediaListTableMap.hasOwnProperty(_curZoneId)){            
            mediaListTable = _mediaListTableMap[_curZoneId];
            //refresh media here
            mediaListTable.setZoneMedias(newMediaArr);
            
            //Using this function to replace the high cost refresh.
            mediaListTable.updateByMedia();
            
            mediaListTable.reStyleTr();
        }else{            
            jQuery("#zone_content_list").append('<div id="zone_content_list_'+ _curZoneId +'">'+'<div>');
                        
            //create new table here, no refresh
            mediaListTable = createMediaListTable();
            _mediaListTableMap[_curZoneId] = mediaListTable;    
            
            mediaListTable.setZoneMedias(newMediaArr);
        }
        
        if(mediaListTable){            
            mediaListTable.updateChkMaster();            
            mediaListTable.refreshOriginValue();
        }
        
        if(_zoneContentViewParam===_listView){
        	//Media switch, clean the current list view zone id.
            if(_curListTblZoneId==0){
                _justSwitchMediaListViewTab();
            }else{
                _justSwitchMediaListView();        
            }                        
        }
    }
            
    /**
    * Update the thumbnail view selected index map when changing the selected index.
    */
    var updateThumbnailSelectedMap = function(){        
        
        if(_zoneMediaView && _selectedMediaMap && _curZoneId){
            var selectedMediaIdArr = _self.getSelsctedMediaIdArr();            
            _selectedMediaMap[_curZoneId] = selectedMediaIdArr;
        }
    }
    
    /**
    * Update the thumbnail view selected index when changing the selected index.
    */
    var updateThumbnailSelectedData = function(){
        var selectedMediaIdArr;
        if(_zoneMediaView && _selectedMediaMap.hasOwnProperty(_curZoneId)){
            
            selectedMediaIdArr = _selectedMediaMap[_curZoneId];
            if(selectedMediaIdArr && selectedMediaIdArr.length>0){
                _zoneMediaView.unselectAll();
                _zoneMediaView.select(selectedMediaIdArr, true, false);     
            }
        }
    }
    
    /**
    * Update the list table selected index when changing the selected index.
    */
    var updateListTableSelectedData = function(){
        var newMediaArr = _zoneData.getZoneMedias(_curZoneId);
            
        var mediaListTable;
        if(_mediaListTableMap.hasOwnProperty(_curZoneId)){
            
            mediaListTable = _mediaListTableMap[_curZoneId];
            //Update media here before the function refreshTableByMediaArr
            mediaListTable.setZoneMedias(newMediaArr);
            
            //Using this function to replace the high cost refresh.
            mediaListTable.refreshTableIndexByMediaArr();
            
        }
    };
    
    /**
    * Update the transition data after the edit action.
    * 
    * @param mediaItems
    */
    var updateListViewTransitionBySelected = function(mediaItems){
                        
        var mediaArr = _zoneData.getZoneMedias(_curZoneId);
            
        var mediaListTable;
        if(_mediaListTableMap.hasOwnProperty(_curZoneId)){
            
            mediaListTable = _mediaListTableMap[_curZoneId];
            //Update media here before the function refreshTableByMediaArr
            mediaListTable.setZoneMedias(mediaArr);
            
            //var mediaIdArr = _zoneMediaView.getSelected(true);
            var mediaItemArr = mediaItems;
            
            if(mediaItemArr && mediaItemArr.length>0){
                var mediaId, transition, duration;
                for(var idx=0; idx<mediaItemArr.length; idx++){
                    //var targetMediaId = mediaIdArr[idx];
                    var mediaObj = mediaItemArr[idx];
                    if(mediaObj){
                        //mediaListTable.updateMediaTransition(mediaObj.id, mediaObj.transition, mediaObj.transitionduration);
                        mediaListTable.setTransitionComboValueByIdx(mediaObj.id);
                        mediaListTable.setTransitionDurationComboValueByIdx(mediaObj.id);
                                                
                        //Update local media & thumbnail
                        if(_zoneContentViewParam === _listView){
                            
                            mediaListTable.updateMediaTransition(mediaObj.id, mediaObj.transition, mediaObj.transitionduration);
                        }
                                    
                    }
                    
                }
            }
            
        }
    };
    
    /**
    * Update the list table data after dropping the media array.
    * Set the new media array before call the function refreshTableByMediaArr.
    * @param {type} context description
    * @param {type} selectedSourceIndexs description
    * @param {type} newSelectedStartIdx description
    */
    var refreshTableByMediaArr = function(context, selectedSourceIndexs, newSelectedStartIdx){
        
        var newMediaArr = _zoneData.getZoneMedias(_curZoneId);
            
        var mediaListTable;
        if(_mediaListTableMap.hasOwnProperty(_curZoneId)){
            
            mediaListTable = _mediaListTableMap[_curZoneId];
            //Update media here before the function refreshTableByMediaArr
            mediaListTable.setZoneMedias(newMediaArr);
            //mediaListTable.refresh();
            //Using this function to replace the high cost refresh.
            mediaListTable.refreshTableByMediaArr(context, selectedSourceIndexs, newSelectedStartIdx);
            
            mediaListTable.reStyleTr();
        }
    };
    
    _self.setViewData = function(json) {
        
		_zoneMediaView.stopEdit();
		_zoneMediaView.clearAll();
		jQuery("#" + option.containerId).empty();
		if (json && json.length > 0) {
            
			_zoneMediaView.parse(json, "json");
            
            if(_zoneContentViewParam === _listView){
                
                var mediaListTable;
                if(_mediaListTableMap.hasOwnProperty(_curZoneId)){
                    
                    mediaListTable = _mediaListTableMap[_curZoneId];
                }else{
                    jQuery("#zone_content_list").append('<div id="zone_content_list_'+ _curZoneId +'">'+'<div>');
                    //var attrs = {'divId':'zone_content_list','zoneMedias':zoneMedias};
                    var zoneMedias = _zoneData.getZoneMedias(_curZoneId);
                    //var attrs = {'divId':'zone_content_list_'+_curZoneId,'zoneMedias':zoneMedias,'zoneMediaView':_zoneMediaView,'zoneMediaCtrl':_self};
                    
                    //Create the new table by zone id
                    mediaListTable = createMediaListTable();
                    
                    //Save to the map
                    _mediaListTableMap[_curZoneId] = mediaListTable;                                           
                }
				
				if(_actionStatus == _self.actionStatusImport){
                    _switchMediaListView();
                    _actionStatus = 0;
                }else{
                    _justSwitchMediaListView();        
                }
            }
        }
        //var newMediaArr = _zoneData.getZoneMedias(_curZoneId);                            
	}; //end setViewData

	_self.onResize = function(event) {
        //Resize may trigger the click zone tab event generated by TemplateImp, 
        //update the status to skip some unused functions call to improve the performance. 
        if(_actionStatus===0){
            _actionStatus = _self.actionStatusResizeSouth;
        }
        
        //Keep the selected media array
        var selectedMedirIdArr = _self.getSelsctedMediaIdArr();                
        
        var delay=400; //0.5 second delay to select back to keep the selected data.
        
		if (_zoneMediaView != null) {
            
            //var newMediaArr = _zoneData.getZoneMedias(_curZoneId);
            
			var container = jQuery("#" + _option.containerId);
			container.css("width", "100%");
			container.css("height", "100%");
            
            if(_zoneContentViewParam===_listView){
                
            
                setTimeout(function() {       
					console.log("Before unselectAll!");
                    _zoneMediaView.unselectAll();
					console.log("Before select!"+selectedMedirIdArr);
                    _zoneMediaView.select(selectedMedirIdArr, true, false);    
                    //Display the correct zone content
                    var mediaListTable = _mediaListTableMap[_curZoneId];
                    if(mediaListTable){
						
						console.log("_actionStatus="+_actionStatus);
						console.log("_self.actionStatusResizeSouth="+_self.actionStatusResizeSouth);
						console.log("_self.actionStatusResizeWest="+_self.actionStatusResizeWest);
						
                        if( _actionStatus === _self.actionStatusResizeSouth || _actionStatus === _self.actionStatusResizeWest){
                            console.log("Do nothing!");
                        }else{
							console.log(selectedMedirIdArr);
                            mediaListTable.selectMediaByArr(selectedMedirIdArr);     
                        }
                        
                    }

                    _resizeZoneContentListView();   

                    //Set it to default no status after complete the reset.
                    _actionStatus = 0;
                    
                }, delay);
            }else{
                delay=500;
                
                setTimeout(function() {        
                    _zoneMediaView.unselectAll();
                    _zoneMediaView.select(selectedMedirIdArr, true, false);    
                    //Display the correct zone content                    
                    //_resizeZoneContentListView();                           
                    //Set it to default no status after complete the reset.
                    _actionStatus = 0;
                    
                }, delay);
                // _zoneMediaView.setSizes();
			    // _zoneMediaView.refresh();
            }//end if
            
		}//end if (_zoneMediaView != null)
	};

    /**
    * Fix dhtmlx could just get one by calling getSelected.
    */
    _self.getSelsctedMediaArr = function(){
        var selMedias = [];
        if(_zoneData && _curZoneId){
            var currMediaArr = _zoneData.getZoneMedias(_curZoneId);
            if(currMediaArr && currMediaArr.length>0){
                for(var mediaIdx=0 ; mediaIdx<currMediaArr.length ; mediaIdx++){
                    if(currMediaArr[mediaIdx] && currMediaArr[mediaIdx].$selected){
                        selMedias.push(currMediaArr[mediaIdx]);
                    }
                }
            }
        }
        
        return selMedias;
    };
    
    /**
    * Fix dhtmlx could just get one by calling getSelected.
    */
    _self.getSelsctedMediaIdArr = function(){
        var selMedias = [];
        if(_zoneData && _curZoneId){
            var currMediaArr = _zoneData.getZoneMedias(_curZoneId);
            if(currMediaArr && currMediaArr.length>0){
                for(var mediaIdx=0 ; mediaIdx<currMediaArr.length ; mediaIdx++){
                    if(currMediaArr[mediaIdx] && currMediaArr[mediaIdx].$selected){
                        selMedias.push(currMediaArr[mediaIdx].id);
                    }
                }
            }
        }
        
        return selMedias;
    }
    
	_self.onBeforeUnload = function(event) {
		return undefined;
	};

	_self.destory = function(event) {
		detachMediaViewEvent();
		if (_zoneMediaView != null) {
			_zoneMediaView.destructor();
			_zoneMediaView = null;
		}
		jQuery("#" + option.containerId).remove();
	};

	_self.addZoneTabbar = function(zone) {

		var strHtml = "";
		if (zone.type * 1 == 3) {
			strHtml = "<div class='TabUnSelected zonetabbar zonetabbarticker' zonetype="
					+ zone.type + " zoneid=" + zone.zoneid + ">";
		} else {
			strHtml = "<div class='TabUnSelected zonetabbar zonetabbarnomal' zonetype="
					+ zone.type + " zoneid=" + zone.zoneid + ">";
		}
		strHtml += "<div class='TS_left'></div>" + "<div class='TS_bg'>"
				+ "<div class='attrTab_text001'> " + zone.name + "</div>"
				+ "<div class='attrTab_text002'>"
				+ _getZoneTitle(zone.zoneid, zone.type) + "</div>" + "</div>"
				+ "<div class='TS_right'></div>" + "</div>";

		var curEle;
		if (zone.type * 1 == 3) {
			curEle = jQuery(strHtml).appendTo("#" + _option.toolbarId);
			curEle.data("tickerZone", zone);
		} else {
			var zonInsert = jQuery("#" + _option.toolbarId
					+ " .zonetabbarnomal").last();
			if (zonInsert.length > 0) {
				curEle = jQuery(zonInsert).after(strHtml);
			} else {
				curEle = jQuery("#" + _option.toolbarId).prepend(strHtml);
			}
			var eleTickers = jQuery(".zonetabbarticker");
			for (var i = 0; i < eleTickers.size(); i++) {
				var dataTicker = jQuery(eleTickers[i]).data("tickerZone");
				dataTicker.zorder = dataTicker.zorder + 1;
				jQuery(eleTickers[i]).data("tickerZone", dataTicker);
			}

		}
		jQuery("#" + _option.toolbarId + " .zonetabbar").unbind("click").bind("click", zoneTabbarClick);
        
        jQuery("#" + _option.toolbarId + " .zonetabbar").unbind("mouseup").bind("mouseup", zoneTabbarMouseup);
	};

    _self.getPlayListId = function(){
        return _playlistId;
    };
    
	_self.setIniZones = function(playlistId, zones, items,
			unReadAbleMediaRescode) {
		if (zones.length == 0) {
			_zoneData.empty();
		     jQuery("#" + _option.toolbarId).empty();
			return false;
		} else {
			for (var i = 0; i < zones.length; i++) {
				if (zones[i].zmedias) {
					for (var j = 0; j < zones[i].zmedias.length; j++) {
						if (zones[i].zmedias[j].$selected)
							zones[i].zmedias[j].$selected = null;
					}
				}
			}
		}
		_unReadAbleMediaRescode = unReadAbleMediaRescode;
		_playlistId = playlistId ? playlistId : _playlistId;                
        
		//var platListData = _initMediaListTable(_playlistId);
				
        _zoneData.empty();
		jQuery("#" + _option.toolbarId).empty();
		var zonesTickers = [];
		for (var i = 0; i < zones.length; i++) {
			if (zones[i].type * 1 != 3) {
				_zoneData.addZone(zones[i]);
			} else {
				zonesTickers.push(zones[i]);
			}
		}
		_zoneData.zoneOrderbyZorder();
		if (items && items.length > 0) {
			for (var i = 0; i < items.length; i++) {
				items[i].media.stype = items[i].media.type;
				_zoneData.add(items[i].zoneid, [items[i]]);
			}
		}
		var zonesNomal = _zoneData.getZones();
		if(zonesNomal.length>0){
			_curZoneId = zonesNomal[0].zoneid;
		}
		else if(zonesTickers.length>0){
			_curZoneId = zonesTickers[0].zoneid;
		}
		var zor = -1;
		if (_scriptObject.sceneList.sceneZoneMediaHis
				&& _scriptObject.sceneList.sceneZoneMediaHis.zorder) {
			zor = _scriptObject.sceneList.sceneZoneMediaHis.zorder;
		}

		for (var i = 0; i < zonesNomal.length; i++) {
			_self.addZoneTabbar(zonesNomal[i]);
			if (zonesNomal[i].zorder * 1 == zor * 1) {
				_curZoneId = zonesNomal[i].zoneid;
			}
		}
		for (var i = 0; i < zonesTickers.length; i++) {
			_self.addZoneTabbar(zonesTickers[i]);
			if (zonesTickers[i].zorder * 1 == zor * 1) {
				_curZoneId = zonesTickers[i].zoneid;
			}
		}
		setZoneContainerWidth(zones.length);
	};

	var setZoneContainerWidth = function(zoneCount) {
		var $cainter = jQuery("#attr_tab  #attrTabLeft");
		var itemW = jQuery("#attr_tab  #attrTabLeft div:first-child").outerWidth(true);
		var w = $cainter.width();
		$cainter.css("width", itemW * zoneCount)
	}

	_self.renderInit = function(sIndex) {
		if(checkUploadT){
            clearInterval(checkUploadT);
			checkUploadT=null;
	    }
		sceneIndex = sIndex;
		// _scriptObject.sceneList
		jQuery("#attr_tab #attrTabLeft").css("left", 0);
		var zoneMedias = _zoneData.getZoneMedias(_curZoneId);
        
		_self.setViewData(zoneMedias);
		var edtPlst = _scriptObject.editPlaylist;

		var tei = edtPlst.getTemplateEventInterractor();

		tei.attachEvent("changeZoneName", _self.updateZoneFromTpl);
		// tei.attachEvent("deleteZone", _self.deleteZoneFromTpl);
		        
        //Call twice fix it
        tei.attachEvent("selectZone", _self.clickZoneFromTpl);
        
		tei.attachEvent("newZone", _self.addZoneFromTpl);
		tei.attachEvent("changeZoneZindex", _self.changeZoneIdexFromTpl);

		_curSelectMediaId = null;

		var zonedata = _zoneData.getZones();
		if (zonedata.length == 0) {
			return false;
		}

		var objstr = window.DTCookieUtil.getSiteCookie("thumbnailView_DTUI_MEDIA");
		if (objstr != null) {
			var objSel = jQuery.parseJSON(objstr);
			if (objSel && objSel.from) {
				_curZoneId = objSel.zoneid
				_curSelectMediaId = objSel.id;
				window.DTCookieUtil.getSiteCookie("thumbnailView_DTUI_MEDIA","");
			}
		}

		// _scriptObject.sceneList.sceneZoneMediaHis.zorder;
		_setZoneSelected(_curZoneId);

		var zone = _zoneData.getZoneByZoneId(_curZoneId * 1);
		tei.selectZoneByIndex(zone);

		if (!_curSelectMediaId) {
			_curSelectMediaId = getSelectHis(sceneIndex, zone.zorder * 1);
		}

		if (!_curSelectMediaId) {
			if (zoneMedias[0] && zoneMedias[0].id)
				_curSelectMediaId = zoneMedias[0].id * 1;
		}

		if (zoneMedias.length > 0 && _curSelectMediaId) {
			if (!_zoneMediaView.isSelected(_curSelectMediaId)) {
				_zoneMediaView.select(_curSelectMediaId * 1);
			}
            
            //Maintain the selected data
            //_attachZoneMediaViewClickEvent();
		}
        
        _self.attachResizerEvent();

	};

	var getSelectHis = function(sceneIndex, zoneOrder) {
		var selId = null;
		var sceneObj = _scriptObject.sceneList;
		var selectHis = sceneObj.sceneZoneMediaHis;
		if (selectHis) {
			if (selectHis && selectHis[sceneIndex]
					&& selectHis[sceneIndex][zoneOrder * 1]
					&& selectHis[sceneIndex][zoneOrder * 1].id) {
				selId = selectHis[sceneIndex][zoneOrder * 1].id;
				// selectHis[sceneIndex][zoneOrder*1].id=null;
			}
		}
		return selId;
	};

	_self.getZoneDatas = function() {
		var zonedata = _zoneData.getZones();
		var newData = [];

		for (var i = 0; i < zonedata.length; i++) {
			newData.push(zonedata[i]);
		}
		return newData;
	};

	_self.setTransition = function(pNode) {
		var from = jQuery("#layoutZoneEdit").data("transCome");
		if (from == "dialog") {
			jQuery("#layoutZoneEdit").data("transCome", "dialogClear");
			jQuery("#layoutZoneEdit").data("transObject", pNode);
			_editTransDialog.setTrans(pNode);
		} else if (from == "dialogClear") {
			jQuery("#layoutZoneEdit").data("transCome", "dialog");
		} else {
			var trans = pNode; // pNode.extendString;
			var mid = jQuery("#" + _option.containerId)
					.data("lastClickMediaId");
			var objTrans = trans; // jQuery.parseJSON(trans);
			var media = _zoneMediaView.get(mid)
			var imgObj = jQuery("#zoneItemTf" + mid + " .tranimg");
			imgObj[0].title = transNames
					.getTransitionName(objTrans.transitionid * 1);
			if (objTrans.transitionid * 1 == -1) {
				jQuery(imgObj).attr("src", "/image/transition/tf_img001.png");
			} else if (objTrans.transitionid * 1 == 0) {
				jQuery(imgObj).attr("src", "/image/transition/0.png");
			} else {
				jQuery(imgObj).attr("src", objTrans.transitionpath);
			}
			var duration = jQuery("#transitionDuration" + mid).val();
			if (objTrans.transitionid * 1 != 0) {
				jQuery("#transitionDuration" + mid + " option[value='0']")
						.remove();
				if (jQuery("#transitionDuration" + mid + " option:first-child")
						.size() == 0) {
					var strOptions = "";
					for (var i = 1; i < 11; i++) {
						strOptions += "<option value=" + i + ">" + i
								+ "</option>";
					}
					jQuery("#transitionDuration" + mid).append(strOptions);
				}

				if (duration * 1 == 0) {
					duration = 3;
				}
			} else {
				duration = 0;
				jQuery("#transitionDuration" + mid).empty()
						.prepend("<option value='0'>0</option>");
			}

			jQuery("#transitionDuration" + mid).val(duration);
			_zoneData.setTrancetion(_curZoneId, media.sequence, objTrans,
					duration);
			_self.hiddenTransition();
		}

	};

	_self.hiddenTransition = function() {
		_self.transitionDialog.remove();
	};

	_self.addZoneFromTpl = function(zone) {

		if (_zoneData.getZones() && _zoneData.getZones().length == 0)
        {
			detachZoneMdiaToolButtons();
			jQuery("#addMedia").removeClass("icon_unaddMedia002").addClass("icon_addMedia002");
            
            //Media list table buttons
            jQuery("#switchMediaListView").removeClass("icon_unaddMedia002").addClass("icon_addMedia002");
            jQuery("#switchMediaThumbnailView").removeClass("icon_unaddMedia002").addClass("icon_addMedia002");
            
            jQuery("#importMedia").removeClass("icon_unaddMedia002").addClass("icon_ImportMediaWizard");
			jQuery("#replaceMedia").removeClass("icon_unreplaceMedia").addClass("icon_replaceMedia");
			jQuery("#mediaList").removeClass("icon_unlistMedia").addClass("icon_listMedia");
			jQuery("#deleteMedia").removeClass("icon_undeleteMedia002").addClass("icon_deleteMedia002");
			
			jQuery("#attr_tab #previousZone").removeClass("icon_unpreviousZone").addClass("icon_previousZone");
			jQuery("#attr_tab #nextZone").removeClass("icon_unnextZone").addClass("icon_nextZone");
            
            //alert("_attachZoneMediaToolButtons");
			_attachZoneMediaToolButtons();
		}

		_scriptObject.sceneList.generateSceneZoneSelectedMediaObj();

		var $cainter = jQuery("#attr_tab  #attrTabLeft");
		var itemW = jQuery("#attr_tab  #attrTabLeft div:first-child").outerWidth(true);
		var w = $cainter.width();

		var left = $cainter.position().left;
		left = Math.floor(left);

		jQuery("#attr_tab  #attrTabLeft").css("width", w + itemW);
		jQuery("#attr_tab  #nextZone").click();

		_self.addZoneTabbar(zone);
		if (zone.type == 3) {
			_scriptObject.tickerEdit.addTicker(zone);
		} else {
			_zoneData.addZone(zone);
		}
		_setZoneUnSelected(_curZoneId);
		_curZoneId = zone.zoneid;
		_setZoneSelected(_curZoneId);
		_zoneMediaView.stopEdit();
		_zoneMediaView.clearAll();
		_scriptObject.sceneList.refreshCurentNode(true);

	};

    /**
    * Click the scene & zone tab will call this function.
    * Click the west and south resize will trigger this function.
    * Check the zone area existing the data or not. 
    */
	_self.clickZoneFromTpl = function(zone) {
        
        //Skip south resize to avoid the selected data lost
        if(_actionStatus == _self.actionStatusResizeSouth || _actionStatus == _self.actionStatusResizeWest ){
            ;
        }else{
            _showZoneByObj(zone);
        }
        
        //Call the function on list view mode
        if(_zoneContentViewParam===_listView){
            
            if(_actionStatus == _self.actionStatusResizeSouth || _actionStatus == _self.actionStatusResizeWest){
                ;
            }else{                
                
                _self.handleSwitchListTableTab(zone);
            } 
        }
        
	};

    var firing = false;
    var firingZoneId = 0;
    
    /**
    * The performance function to handle the multiple call.
    */
    _self.handleSwitchListTableTab = function(zone){
        
        var timer;        
        
        var firstCall = function(){            
            firingZoneId = zone.zoneid; 
            //Run the list table function
            _justSwitchMediaListViewTab();
        };

        //Do nothing, just set the parameter back.
        var secondCall = function(){ 
            firing = false;
            firingZoneId = 0;            
            //return false;
        };
        
        //Default - firstCall function
        var firingFunc = firstCall;

        // Detect the 2nd call event, so we can set it to secondCall
        if(firing && firingZoneId == zone.zoneid){
          firingFunc = secondCall; 
        }

        firing = true;
        firingZoneId = zone.zoneid; 

        timer = setTimeout(function() {
           //Run the main function
           firingFunc(); 
           // Always revert back to firstCall firing function
           firingFunc = firstCall;
           firingZoneId = 0;
           firing = false;           
        }, 100);
    };
    
    /**
    * This function is for controlling the several showZone call in a short time.
    * The first call will execute, the 2nd call will skip.
    * The controll flag firing will set true on 1st call, so the 2nd call will get another function point.
    * And the firingZoneId is another parameter to verify the call using the same zone id.
    * @param zone
    */
    _self.handleShowListTable = function(zone){
        
        var timer;        
        
        var firstCall = function(){
            
            firingZoneId = zone.zoneid; 
            
            var mediaListTable;
            //Run the list table function
            if(_mediaListTableMap && _mediaListTableMap.hasOwnProperty(_curZoneId)){
                setMediaListTableMapIndex();
                mediaListTable = _mediaListTableMap[_curZoneId] ;
                mediaListTable.setZIndex("1");
                //Update the other zone index to -1, set the current zone to z-index 1
                var contentListZoneObj = jQuery('#zone_content_list_'+_curZoneId); 
                contentListZoneObj.css("z-index","1");
                contentListZoneObj.css("display","inline");
                
            }else{//No the zone id area, append new.
                jQuery("#zone_content_list").append('<div id="zone_content_list_'+ _curZoneId +'">'+'<div>');
                mediaListTable = createMediaListTable();
                _mediaListTableMap[_curZoneId] = mediaListTable;    
            }
            
            _self.updateMediaListTable();
        };

        //Do nothing, just set the parameter back.
        var secondCall = function(){ 
            firing = false;
            firingZoneId = 0;            
            //return false;
        };
        
        //Default - firstCall function
        var firingFunc = firstCall;

        // Detect the 2nd call event, so we can set it to secondCall
        if(firing && firingZoneId == zone.zoneid){
          firingFunc = secondCall; 
        }

        firing = true;
        firingZoneId = zone.zoneid; 

        timer = setTimeout(function() {
           //Run the main function
           firingFunc();                         
           // Always revert back to firstCall firing function
           firingFunc = firstCall;
           firingZoneId = 0;
           firing = false;           
        }, 100);
    };
    
	_self.updateZoneFromTpl = function(zone) {
		if (zone.type == 3) {
			_setZoneName(zone);
		} else {
			_zoneData.setZoneInfo(zone);
			_curZoneId = zone.zoneid;
			_setZoneName(zone);
		}

	};

	_self.deleteZoneFromTpl = function(zone) {

		if (zone.type == 3) {
			_scriptObject.tickerEdit.delTicker(zone);
		} else {
			_zoneData.delZone(zone.zoneid);
		}
		jQuery("#attr_tab  #attrTabLeft div[zoneid=" + zone.zoneid + "]").remove();

		var eleTickers = jQuery(".zonetabbarticker");
		var tickerZoneLength = eleTickers?eleTickers.size():0;
		for (var i = 0; i < eleTickers.size(); i++) {
			var dataTicker = jQuery(eleTickers[i]).data("tickerZone");
			if (dataTicker.zorder * 1 > zone.zorder * 1) {
				dataTicker.zorder = dataTicker.zorder - 1;
				jQuery(eleTickers[i]).data("tickerZone", dataTicker);
			}
		}

		if (jQuery("#attr_tab #attrTabLeft .zonetabbar").size() == 0) {
			jQuery("#zone_content").empty();
		}

		var tmpZones = _zoneData.getZones();
        if(tmpZones){
            var zlength = tmpZones.length;
            if(zlength == 0){
               //detachZoneMdiaToolButtons();
                // jQuery("#addMedia").removeClass("icon_addMedia002").addClass("icon_unaddMedia002");
                // jQuery("#replaceMedia").removeClass("icon_replaceMedia").addClass("icon_unreplaceMedia");
                // jQuery("#mediaList").removeClass("icon_listMedia").addClass("icon_unlistMedia");
                // jQuery("#deleteMedia").removeClass("icon_deleteMedia002").addClass("icon_undeleteMedia002");
                // jQuery("#attr_tab #previousZone").removeClass("icon_previousZone").addClass("icon_unpreviousZone");
                // jQuery("#attr_tab #nextZone").removeClass("icon_nextZone").addClass("icon_unnextZone");
                if(zone.type == 3) {
                    jQuery("#attrTabRightTicker").css("display","none");
                    jQuery("#attrTabRight").css("display","block");
                }
                if(tickerZoneLength!=0){
                	jQuery("#attr_tab  #attrTabLeft").width(itemW*tickerZoneLength);
                }
                else{
                	jQuery("#attr_tab  #attrTabLeft").width(itemW);
                }
            }else{
                //itemW is 145 px;
                var itemW = jQuery("#attr_tab  #attrTabLeft div:first-child").outerWidth(true);
                jQuery("#attr_tab  #attrTabLeft").width(itemW*(zlength+tickerZoneLength));
            }
        }

		if (tmpZones && tmpZones.length == 0) {
			//detachZoneMdiaToolButtons();
			// jQuery("#addMedia").removeClass("icon_addMedia002").addClass("icon_unaddMedia002");
			// jQuery("#replaceMedia").removeClass("icon_replaceMedia").addClass("icon_unreplaceMedia");
			// jQuery("#mediaList").removeClass("icon_listMedia").addClass("icon_unlistMedia");
			// jQuery("#deleteMedia").removeClass("icon_deleteMedia002").addClass("icon_undeleteMedia002");
			// jQuery("#attr_tab #previousZone").removeClass("icon_previousZone").addClass("icon_unpreviousZone");
			// jQuery("#attr_tab #nextZone").removeClass("icon_nextZone").addClass("icon_unnextZone");
			if(zone.type == 3) {
				jQuery("#attrTabRightTicker").css("display","none");
				jQuery("#attrTabRight").css("display","block");
			}
		}

		return false;
	};

	_self.changeZoneIdexFromTpl = function(zone) {
            
		var oldzorder = 1;
		var newZorder = zone.zorder * 1;
		var curZoneEle = jQuery("#" + _option.toolbarId + " .TabSelected");
		if (zone.type == 3) {
			oldzorder = jQuery(curZoneEle).data("tickerZone").zorder;
			_zoneData.setZoneZorder(_scriptObject.tickerEdit.getTickerZones());
		} else {
			var oldZone = _zoneData.getZoneByZoneId(_curZoneId);
			oldzorder = oldZone.zorder;
			if (oldzorder * 1 == newZorder * 1) {
				return;
			}
			_zoneData.changeZoneIndex(oldzorder, newZorder);
		}

		var diff = newZorder - oldzorder;
		if (Math.abs(diff) > 1) {
			if (diff > 0) {
				jQuery(curZoneEle).parent().find(".zonetabbar").last()
						.after(jQuery(curZoneEle));
			} else {
				jQuery(curZoneEle).parent().find(".zonetabbar").first()
						.before(jQuery(curZoneEle));
			}
		} else {
			if (newZorder * 1 > oldzorder * 1) {
				jQuery(curZoneEle).next().after(jQuery(curZoneEle));
			} else {
				jQuery(curZoneEle).prev().before(jQuery(curZoneEle));
			}
		}

		if (zone.type == 3) {
			jQuery(curZoneEle).data("tickerZone").zorder = newZorder;
			if (newZorder * 1 > oldzorder * 1) {
				jQuery(curZoneEle).prev().data("tickerZone").zorder = oldzorder;
			} else {
				jQuery(curZoneEle).next().data("tickerZone").zorder = oldzorder;
			}
		}

	};

	_self.hideDiv = function(oEvent) {
		if ("mouseover" == oEvent.type) {
			jQuery("#TransitionEffectDiv").attr("isInDiv", true);
		}
		if ("mouseout" == oEvent.type) {
			jQuery("#TransitionEffectDiv").attr("isInDiv", false);
		}
		if ("blur" == oEvent.type) {
			if (jQuery("#TransitionEffectDiv").attr("isInDiv") == "false") {
				jQuery("#TransitionEffectDiv").css("display", "none");
			}
		}
	};

    ///WCM63 20151026 add transition effect parameter if 'objMedia' has it; otherwise use 0 by default.
    var _zoneItemNew = function(objMedia)
    {
        var zoneItem = {};
        zoneItem.media = objMedia;
        zoneItem.mediaid = objMedia.mediaid;
        zoneItem.playlistid = _playlistId;
        zoneItem.medialength = objMedia.length;
        zoneItem.id = null;
        zoneItem.transitionduration = objMedia.TDValue | 0;
        zoneItem.transition = objMedia.TEValue | 0;
        return zoneItem;
    }

    //fuli 20151008 to show available range icon in media item area
    var _formatDateTimeField = function(value) {
        if(value < 10) return "0" + value;
        else return value + "";
    };

    var _getAvailableRange = function(obj) {
        var before = window.msg["esignage.contentserver.jsp.playlist.availableRange.before"];
        var after = window.msg["esignage.contentserver.jsp.playlist.availableRange.after"];

        if (obj && obj.media) {
            arStart = obj.media.arstart;
            arEnd = obj.media.arend;

            if(arStart && !arEnd) {
                return after + " " + arStart;
            }
            else if(!arStart && arEnd) {
                return before + " " + arEnd;
            }
            else {
                return "(" + arStart + " , " + arEnd + ")";
            }
        }

        return "";
    };

    var _checkAvailableType = function(obj) {
        var arStart = null;
        var arEnd = null;
        var curTime = null;
        var curTimeString = "";

        if (obj && obj.media) {
            arStart = obj.media.arstart;
            arEnd = obj.media.arend;
            curTime = new Date();

            curTimeString = curTime.getFullYear() + "-" + _formatDateTimeField(curTime.getMonth() + 1) + "-" +
                _formatDateTimeField(curTime.getDate()) + " " + _formatDateTimeField(curTime.getHours()) + ":" +
                _formatDateTimeField(curTime.getMinutes()) + ":" + _formatDateTimeField(curTime.getSeconds());

            if(arStart || arEnd) {
                if(arStart && (curTimeString < arStart)) { //not available
                    return 1;
                }

                if(arEnd && (curTimeString > arEnd)){ //expired
                    return 1;
                }

                //available and not expired
                return 0;
            }
        }

        //no availalbe range setting
        return 2;
    };
    //

    var _getMediaImgUrl = function(mediaid) {
        var imgUrl = "/servlet/library/media/GetMediaLibraryPathAction.do;jsessionid="
            + window.jsessionid
            + "?method=getImageThumbnailPath&mediaid="
            + mediaid + "&" + Math.random();
        return imgUrl;
    };

    var _getMediaOriginImgUrl = function(mediaid) {
		var imgUrl = "/servlet/library/media/GetMediaLibraryPathAction.do;jsessionid="
				+ window.jsessionid
				+ "?method=getImageThumbnailPath&mediaid="
				+ mediaid + "&originThumb=" + "true&" + Math.random();
		return imgUrl;
	};

	var _getMediaFilePath = function(mediaid) {
		var imgUrl = "/servlet/library/media/GetMediaLibraryPathAction.do;jsessionid="
				+ window.jsessionid
				+ "?method=getFilePath&mediaid="
				+ mediaid
				+ "&" + Math.random();
		return imgUrl;
	};

	var _stopPlayMedia = function(obj, imgPath) {
		var html = '<img width="100%" height="100%" class="media" src="'
				+ imgPath + '" ondragstart="return false">';
		// jQuery(cobj).html(html);
	}

	var _clickPlayingVideo = function(obj, imgPath) {
		var cobj = jQuery(obj).parent();
		var playIconHtml = '<div class="zoneItem_content_playBtn"></div>';
		var html = playIconHtml
				+ '<img width="100%" height="100%" class="media" src="'
				+ imgPath + '" ondragstart="return false">';
		jQuery(cobj).html(html);
	}

	var _playMedia = function(obj, item) {

		var fileExtent = item.media.extension;
		var extension = new Extension();
		if (extension.isVideoExtension(fileExtent) != true) {
			return false;
		}

		var cobj = jQuery(obj).parent();
		var w = cobj[0].offsetWidth;
		var h = cobj[0].offsetHeight;
		var strFilePath = window.context_path
				+ _getMediaFilePath(item.media.mediaid);
		var ext = item.media.extension;
		var strExtType = _getMediaType(ext);
		var strHtml = "<video src='"
				+ strFilePath
				+ "' class='video-js vjs-default-skin' autoplay='autoplay' loop='false' width='"
				+ w + "' height='" + h + "' type='" + fileExtent + "'></video>";
		jQuery(cobj).html(strHtml);
		return true;

	};

	var _mediaPlayControl = function() {
		var video = jQuery(this)[0];
		if (video.networkState == 1) {
			if (video.readyState == 4) {
				if (video.paused || video.ended) {
					video.play();
				} else {
					video.pause();
				}
			}
		}
	};

	var checkBrowserType = function() {
		if (jQuery.browser.msie) {
			return true;
		} else if (jQuery.browser.opera) {
			return false;
		} else if (jQuery.browser.mozilla) {
			return true;
		} else if (jQuery.browser.safari) {
			return true;;
		} else {
			return false;
		}
	};

	var _getMediaType = function(mtype) {
		var strType = null;
		var types = "aif,aiff,aac,au,bmp,gsm,mov,mid,midi,mpg,mpeg,mp4,m4a,psd,qt,qtif,qif,qti,snd,tif,tiff,wav,3g2,3gp,";
		var ind = types.indexOf(mtype + ",");
		if (ind > -1) {
			return "quicktime";
		}
		types = null;
		if (mtype == "flv" || mtype == "swf") {
			return "flash";
		}
		types = "ra,ram,rm,rpm,rv,smi,smil,";
		ind = types.indexOf(mtype + ",");
		if (ind > -1) {
			return "realplayer";
		}
		types = "asx,asf,avi,wma,wmv,";
		ind = types.indexOf(mtype + ",");
		if (ind > -1) {
			return "winmedia";
		}
		types = "gif,png,jpg,";
		ind = types.indexOf(mtype + ",");
		if (ind > -1) {
			return "img";
		}

		return null;;

	};
	var _setZoneSelected = function(zoneId) {
		jQuery("#" + _option.toolbarId + " div[zoneid=" + zoneId + "]")
				.addClass("TabSelected").removeClass("TabUnSelected");
	};
	var _setZoneUnSelected = function(zoneId) {
		jQuery("#" + _option.toolbarId + " div[zoneid=" + zoneId + "]")
				.addClass("TabUnSelected").removeClass("TabSelected");
	};
	var _getSelectedZoneId = function(zoneId) {
		var zid = jQuery("#" + _option.toolbarId + " .TabSelected")
				.attr("zoneid");
		return zid;
	};
	var _setZoneName = function(zone) {
		jQuery("#" + _option.toolbarId + " div[zoneid=" + zone.zoneid + "]")
				.find(".attrTab_text001").html(zone.name);
	};
	var _playtimeFormat = function(len, f) {
		var strTime = "";
		len = parseInt(len);
		if (isNaN(len)) {
			len = 0;
		}
		if (len == 0) {
			strTime = "00:00:00";
		} else {
			var frm = len % 1000;
			var tm = (len - frm) / 1000;
			tm = Math.round(tm);
			var second = tm % 60;
			tm = (tm - second) / 60;
			var minute = tm % 60;
			tm = tm - minute;
			var hour = tm / 60;
			if (hour < 10) {
				hour = "0" + hour;
			}
			if (minute < 10) {
				minute = "0" + minute;
			}
			if (second < 10) {
				second = "0" + second;
			}

			strTime = hour + ":" + minute + ":" + second;
			if(f)
			{
				if(frm < 10)
				{
					frm = "00" + frm;
				}
				else if(frm < 100)
				{
					frm = "0" + frm;
				}
				strTime += "." + frm;
			}
			//Fix bug 43899 Cavan 2013-11-28 begin#3
			/*
			if (frm && f) {
				strTime += "." + Math.round(frm * f / 1000);
			}
			else if(frm){
				strTime += "."+frm;
			}*/
			//Fix bug 43899 Cavan 2013-11-28 end#3
		}
		return strTime;
	};
	var _startPlaytime = function(p) {
		var medias = _zoneData.getZoneMedias(_curZoneId);
		var len = 0;
		for (var i = 0; i < p - 1; i++) {
			if (medias[i] && medias[i].medialength && medias[i].medialength != null) {
				len += medias[i].medialength * 1;
			}
		}
		return len;
	};

	_self.playtimeFormat = _playtimeFormat;

	var getToolBars = function() {
		return {
			"home" : true,
			"prev " : true,
			"next" : true,
			"refresh" : true,
			"copy_36" : false,
			"paste_36" : false,
			"import" : false,
			"export" : false,
			"delete_dt" : false,
			"cut_36" : false,
			"newfolder" : true,
			"newMedia" : true,
			"newSPMedia" : false,
			"newTickMedia" : false,
			"addMedia" : false
		};

	};
	var _getZoneTitle = function(zid, zonetype) {
		if (zonetype * 1 == 3) {
			return "";
		}
		var count = _zoneData.getZoneMediaCount(zid);
		var length = _zoneData.getZoneMediaPlayTime(zid);
		var str = "" + _playtimeFormat(length) + "(" + count + ")";
		return str;
	};
	var _setZoneTitle = function(title) {
		jQuery("#" + _option.toolbarId + " .TabSelected .attrTab_text002")
				.html(title);
	}
	_init();
    
    
    
    
};
//end function PlaylistZoneMediaEdit(option) 

PlaylistZoneMediaEdit.prototype = new Object();
PlaylistZoneMediaEdit.prototype.constructor = PlaylistZoneMediaEdit;

function ZoneData() {
	var zones = [];
	var dragSourceIndexs = [];
	this.add = function(zid, medias, p) {
		var index = getZoneIndex(zid);
		if (index > -1) {
			if (p == undefined) {
				zones[index].zmedias = zones[index].zmedias.concat(medias);
			} else {
				if (p == -1) {
					zones[index].zmedias = zones[index].zmedias.concat(medias);
				} else {
					for (var i = 0; i < medias.length; i++) {
						zones[index].zmedias.splice(p++, 0, medias[i]);
					}
				}
			}
		} else {
			var zone = {
				zoneid : zid,
				zmedias : medias ? medias : []
			};
			zones.push(zone);
			index = zones.length - 1;
		}
		this.setMediaSequence(index);
	};

	this.addZone = function(zone) {
		zone.zmedias = [];
		zones.push(zone);
	};

	this.plus = function(zid, medias) {
		var index = getZoneIndex(zid);
		if (index > -1) {
			for (var i = 0; i < medias.length; i++) {
				for (var j = 0; j < zones[index].zmedias.length; j++) {
					if (zones[index].zmedias[j].id == medias[i].id) {
						zones[index].zmedias.splice(j, 1);
						j--;
					}
				}
			}
			this.setMediaSequence(index);
		}

	};

	this.empty = function(zid) {
		if (zid) {
			var index = getZoneIndex(zid);
			if (index > -1) {
				zones[index].zmedias = new Array();
			}
		} else {
			zones = [];
		}

	};

	this.updateMedia = function(zid, ind, media) {
		var index = getZoneIndex(zid);
		var medias = [];
		if (index > -1) {
			zones[index].zmedias[ind - 1] = media;
		}
	};

	this.getZoneMedias = function(zid) {
		var index = getZoneIndex(zid);
		var medias = [];
		if (index > -1) {
			medias = zones[index].zmedias;
		}

		return medias;
	};
    
    /**
    * Open an interface to update the zone media data.
    */
    this.setZoneMedias = function(zid, newMediaArr) {
		var index = getZoneIndex(zid);
		
		if (newMediaArr && newMediaArr.length>0 && index > -1) {
			zones[index].zmedias = newMediaArr;
		}
	};
    
	var getZoneIndex = function(zid) {
		var index = -1;
		for (var i = 0; i < zones.length; i++) {
			if (zones[i].zoneid == zid) {
				index = i;
				break;
			}
		}
		return index;
	};

	this.getZoneMediaPlayTime = function(zid) {

		var zmedias = this.getZoneMedias(zid);
		var sum = 0;
		for (var i = 0; i < zmedias.length; i++) {
			sum += parseInt(zmedias[i].medialength);
		}
		return sum;
	};

	this.getZoneMediaCount = function(zid) {
		var zmedias = this.getZoneMedias(zid);
		return zmedias.length;
	};

	this.setMediaSequence = function(zind) {
		var zoneMedias = zones[zind].zmedias;
		for (var j = 0; j < zoneMedias.length; j++) {
			zoneMedias[j].sequence = j + 1;
			zoneMedias[j].id = j + 1;
		}
	};

	this.setZoneZorder = function(mzones) {
		_scriptObject = document
				.getElementById("dt_cm_modules_playlistWrapper_js");
		var zoneInfos = _scriptObject.editPlaylist.getTemplateZoneList();
		var vzones = zones;
		if (mzones)
			vzones = mzones;
		if (zoneInfos && vzones) {
			for (var i = 0; i < vzones.length; i++) {
				for (var j = 0; j < zoneInfos.length; j++) {
					if (vzones[i].zoneid == zoneInfos[j].id) {
						vzones[i].zorder = zoneInfos[j].zindex;
					}
				}
			}
			var tmp;
			for (var i = 0; i < vzones.length; i++) {
				for (var j = i + 1; j < vzones.length; j++) {
					if (vzones[i].zorder * 1 > vzones[j].zorder) {
						tmp = vzones[i];
						vzones[i] = vzones[j];
						vzones[j] = tmp;
					}
				}
			}
		}
	};

	this.setTrancetion = function(zid, seq, trans, tranDuration, mediaDuration) {
		var index = getZoneIndex(zid);
		if (trans && trans.transitionid) {
			zones[index].zmedias[seq - 1].transition = trans.transitionid;
		}
		if (tranDuration * 1 > -1) {
			zones[index].zmedias[seq - 1].transitionduration = tranDuration;
		}
		if (mediaDuration) {
			zones[index].zmedias[seq - 1].medialength = mediaDuration;
		}
	};

	this.setTrancetionDuration = function(zid, seq, duration) {
		var index = getZoneIndex(zid);
		zones[index].zmedias[seq - 1].transitionduration = duration;
	}

	this.getZones = function() {
		return zones;
	};

	this.setZoneInfo = function(zone) {
		var index = getZoneIndex(zone.zoneid);
		zones[index].name = zone.name;
		zones[index].zorder = zone.zorder;
		zones[index].sequence = zone.sequence;
		zones[index].type = 2;
	};

	this.delZone = function(zid) {
		if (zid != undefined && zid * 1 > -1) {
			var index = getZoneIndex(zid);
			zones.splice(index, 1);
			this.setZoneZorder();
		}
	};

	this.changeZoneIndex = function(oldZorder, newZorder) {
		var oldZone = zones[oldZorder - 1];
		var diff = newZorder * 1 - oldZorder * 1;
		this.setZoneZorder();
	};

	this.zoneOrderbyZorder = function() {
		zones.sort(function(a, b) {
					return a.zorder - b.zorder;
				})
	};

	this.getZoneByZoneId = function(zid) {
		this.setZoneZorder();
		var index = getZoneIndex(zid);
		var zone = {};
		var zoneObj = zones[index];
		if (zoneObj) {
			zone.name = zoneObj.name;
			zone.sequence = zoneObj.sequence;
			zone.zoneid = zoneObj.zoneid;
			zone.type = zoneObj.type;
			zone.zorder = zoneObj.zorder;
		}
		return zone;
	};

    this.setDragSourceIndexs = function(dragIndexs) {
        //fuli 20151103
        dragIndexs.sort(function(a, b) {
            if(a > b) return 1;
            else if(a < b) return -1;
            else return 0;
        });
        //

        dragSourceIndexs = dragIndexs;
    };

    //fuli 20160307
    this.getDragSourceIndexs = function() {
        return dragSourceIndexs;
    };
    //

//fuli 20151013 support drop item to target's header or tail
//where = 0 means header
//where = 1 means tail
    this.updateForDrag = function(zid, tindex, where) {
        var index = getZoneIndex(zid);
        var medias = zones[index].zmedias;
        var p = tindex;
        var sourceMedias = [];

        for (var i = 0; i < dragSourceIndexs.length; i++) {
            sourceMedias.push(medias[dragSourceIndexs[i]]);
            medias[dragSourceIndexs[i]] = null;
        };

        if (p > dragSourceIndexs[0]) {
//            p++;
        }

        if(where === 1) p++;

        for (var i = 0; i < sourceMedias.length; i++) {
            var media = sourceMedias[i];
            medias.splice(p++, 0, media);
        };

        for (var i = medias.length - 1; i > -1; i--) {
            if (medias[i] == null) {
                medias.splice(i, 1);
            }
        }
        this.setMediaSequence(index);
    }
/*
    this.updateForDrag = function(zid, tindex) {
        var index = getZoneIndex(zid);
        var medias = zones[index].zmedias;
        var p = tindex;
        var sourceMedias = [];
        for (var i = 0; i < dragSourceIndexs.length; i++) {
            sourceMedias.push(medias[dragSourceIndexs[i]]);
            medias[dragSourceIndexs[i]] = null;
        };

        if (p > dragSourceIndexs[0]) {
            p++;
        }

        for (var i = 0; i < sourceMedias.length; i++) {
            var media = sourceMedias[i];
            medias.splice(p++, 0, media);
        };

        for (var i = medias.length - 1; i > -1; i--) {
            if (medias[i] == null) {
                medias.splice(i, 1);
            }
        }
        this.setMediaSequence(index);
    }
*/
//
}
//end function ZoneData()

function CreateEditMediaItemDialog() {
	var _containerId = "editPlaylistItemDilog";
	var transNode = {};
	var selMedias = [];
	var _transitionEffectDiv = null;
	var _firstTimeRun = true;
	var transNames = new TransitionNames();
	var editPlaylistItemDilog = this;
	editPlaylistItemDilog.transitionDialog = null;

	this.createDialog = function(transDialogCallback) {
		var _dialog = jQuery("<div id=" + _containerId + " class='ui-dialog'></div>").dialog({
			autoOpen : true,
			modal : true,
			height : 300,
			width : 450,
			title : window.msg['playlist.jsp.editplaylist.editplaylistitem'],
			buttons : [{
				text : window.msg['esignage.contentserver.jsp.dialog.button.ok'],
				click : function() {
					var duration = jQuery("#" + _containerId + " #mediaDurationId").val();
					var tranDuration = jQuery("#" + _containerId + " #selectTransDuration").val();
					if (duration * 1 > 86400) {
						MessageBox({
							content : window.msg["esignage.contentserver.jsp.playlist.playlistdetail.editlength.wan01"]
						});
						return false;
					}
					transDialogCallback(selMedias, transNode, duration, tranDuration);
					destory();
				}
			}, {
				text : window.msg['esignage.contentserver.jsp.dialog.button.cancel'],
				click : function() {
					destory();
				}
			}],
			close : function(event, ui) {
				destory();
			},
			open : function(evt) {

				//2015-05-18 Cavan Fix 0045073
				transNode = {};
				jQueryExtLoadPage({
					url : window.context_path
							+ "/modules/playlist/jsp/dialog/editPlaylistItem.jsp;jsessionid="
							+ window.jsessionid,
					container : document
							.getElementById("editPlaylistItemDilog"),
					success : function(event) {
						jQuery("#" + _containerId)
								.find("#transeffectBtn")
								.unbind("click")
								.bind(
										"click",
										editPlaylistItemDilog.openTransitionDialog); // ("click",
																						// editSingleMediaEffer);
						showSelMedias();

						hiddenProcessStatus();
					},
					error : function(event) {
						hiddenProcessStatus();
					}
				});
			}
		});
	};

	this.openTransitionDialog = function() {
		editPlaylistItemDilog.transitionDialog = jQuery("<div id='playlist_transition_dialog'></div>")
				.dialog({
					modal : true,
					resizable : false,
					title : window.msg['esignage.contentserver.jsp.playlist.transitioneffect'],
					width : 320,
					height : 444,
					buttons : [{
						id : "ok",
						text : window.msg['esignage.contentserver.jsp.dialog.button.ok'],
						click : function(event) {
							editPlaylistItemDilog.transitionDialog.remove();
						}
					}, {
						id : "cancel",
						text : window.msg['esignage.contentserver.jsp.dialog.button.cancel'],
						click : function(event) {
							editPlaylistItemDilog.transitionDialog.remove();
						}
					}],
					close : function(event, ui) {
						editPlaylistItemDilog.transitionDialog.remove();
					},
					open : function(evt) {
						jQueryAjaxExt({
							type : "post",
							url : window.context_path
									+ "/modules/playlist/jsp/playlistTransition.jsp;jsessionid="
									+ window.jsessionid,
							success : function(re) {
								jQuery("#playlist_transition_dialog")
										.append(re);
								var transitionAnimation = new TransitionAnimation(editPlaylistItemDilog.setTrans);
								transitionAnimation.init();
							}
						});
					}
				});
	};

	this.setTrans = function(pNode) {
		transNode = pNode;
		var name = transNames.getTransitionName(pNode.transitionid * 1);
		var transitionDuration = jQuery("#" + _containerId
				+ " #selectTransDuration").val();

		// 用户选择了无效果切换
		if (transNode.transitionid * 1 == 0) {
			transitionDuration = 0;
		} else {
			if (transitionDuration * 1 == 0) {
				transitionDuration = 3;
			}
		}
		if (transitionDuration == 0) {
			jQuery("#" + _containerId + " #selectTransDuration").empty()
					.append("<option value=0>0</option>");
		} else {
			var html = "<option value=-1 selected>--</option>";
			for (var i = 1; i < 11; i++) {
				if (transitionDuration == i) {
					html += "<option value=" + i + " selected>" + i
							+ "</option>";
				} else {
					html += "<option value=" + i + ">" + i + "</option>";
				}
			}
			jQuery("#" + _containerId + " #selectTransDuration").empty()
					.append(html);
		}

		jQuery("#" + _containerId + " #selectTransDuration")
				.val(transitionDuration);
		jQuery("#" + _containerId + " #selecteffectText").val(name);
		editPlaylistItemDilog.transitionDialog.remove();
	};

	var showSelMedias = function() {
		jQuery("#" + _containerId + " #mediaNames").empty();
		for (var i = 0; i < selMedias.length; i++) {
			var name = selMedias[i].media.name;
			jQuery("#" + _containerId + " #mediaNames")
					.append("<div  style='overflow: hidden; width: 100%; text-overflow: ellipsis; white-space:nowrap;'>"
							+ name + "</div>");
		}
		if (selMedias.length == 1) {
			var media = selMedias[0];
			var md = selMedias[0].medialength;
			if (md) {
				var tmp = 0;
				//Fix bug 43899 Cavan 2013-11-28 begin#2
				tmp = md / 1000;
				//Fix bug 43899 Cavan 2013-11-28 end
				/*
				if (selMedias[0].media.frame
						&& selMedias[0].media.frame * 1 > 0) {
					tmp = Math.floor(md / 1000)
							+ "."
							+ Math.round((md % 1000) * selMedias[0].media.frame
									/ 1000);
				} else {
					tmp = Math.round(md / 1000);
				}*/
				//Fix bug 43899 Cavan 2013-11-28 end#2
				jQuery("#" + _containerId + " #mediaDurationId").val(tmp);
			} else {
				jQuery("#" + _containerId + " #mediaDurationId").val(0);
			}
			var transDuration = selMedias[0].transitionduration * 1;
			if (transDuration == 0) {
				jQuery("#" + _containerId + " #selectTransDuration").empty()
						.append("<option value=0>0</option>");
			}
			jQuery("#" + _containerId + " #selectTransDuration option[value="
					+ transDuration + "]").attr("selected", true);
			var transitionid = media.transition;
			if (transitionid != null) {
				transitionid = transitionid ? transitionid : 0;
				var name = transNames.getTransitionName(transitionid * 1);
				jQuery("#" + _containerId + " #selecteffectText").val(name);
			}
		}
	};

	this.setSelMedias = function(medias) {
		selMedias = medias;
	};
	var destory = function() {
		jQuery("#layoutZoneEdit").data("transCome", "");
		jQuery("#" + _containerId).dialog("destory");
		jQuery("#" + _containerId).remove();
	};

	var editSingleMediaEffer = function(event) {
		var clickNode = jQuery("#" + _containerId).find("#transeffectBtn");
		var isOpen = clickNode.attr("isOpen");
		if (isOpen) {
			clickNode.attr("isOpen", "");
			jQuery("#" + _containerId).find("#appendTransDiv").hide();
		} else {
			clickNode.attr("isOpen", "true");
			jQuery("#" + _containerId).find("#appendTransDiv").show();
		}
	};

}

/**
* Transition number key group. If update, remember to add here.
*/
function TransitionNames() {
	this.nums = [-1, 0, 0, 19, 1001, 20, 1002, 21, 1003, 22, 1004, 23, 24,
			1005, 25, 1006, 26, 13, 14, 1007, 15, 1008, 27, 28, 29, 30, 44, 43,
			45, 17, 18, 39, 40, 41, 42, 33, 34, 35, 36, 1009, 37, 38, 1010,
			1011, 1, 16, 46, 47, 48, 1012, 49, 1013, 50, 1014, 51, 11, 1015,
			12, 31, 32,2001];

	this.titles = new Array();
	this.titles[0] = window.msg['esignage.contentserver.jsp.playlist.transitioneffect.random'];
	this.titles[1] = window.msg["esignage.contentserver.jsp.playlist.transitioneffect.none"];
	this.titles[2] = window.msg[""];
	var ttttt = [];
	for (var tnum = 3; tnum < this.nums.length; tnum++) {
		var snum = "";
		if (tnum < 10) {
			snum = "00" + tnum;
		} else if (9 < tnum && tnum < 100) {
			snum = "0" + tnum;
		}
		var messageKey = "esignage.contentserver.jsp.playlist.transitioneffect.builtin."
				+ snum;
		this.titles[tnum] = window.msg[messageKey];
		ttttt.push(messageKey);
	}
	var aaaaaaaaa = this.titles;
	this.getTransitionName = function(k) {
		for (var i = 0; i < this.nums.length; i++) {
			var num = this.nums[i];
			if (num * 1 == k) {
				return this.titles[i];
			}
		}
	}
}


/** Set the table's sort attribute */
//function initMediaListSort(){
//	jQuery(function() {
//		jQuery( "#sortable" ).sortable();
//		jQuery( "#sortable" ).disableSelection();
//	  });
//}

