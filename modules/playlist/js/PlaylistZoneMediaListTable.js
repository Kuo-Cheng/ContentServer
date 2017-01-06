/**  
* The multiple drag and drop medias list table.
* The default view is thumbnail view, then switch to list view after click the switch list view button.
* Switching the tab will diaplay the list view if the last view mode is list view.
* 
* The div id will be zone_content_list_$zone_id$.
* And just the current zone id will be displayed on the z-index 1.
* This table supports resize header, click select, ctrl-click multi-select.
* And drag & drop, multiple drag & drop.
* Image arrows up/down to control the selected rows moving up or down.
* 
* About the most recent used, the thumbnail view using the open window to display the latest selected transition,
* the list view has displayed on the drop down box, will update at the next time.
* 
* The resize feature just supports on chrome.
* 
* Double-click the name may open the media edit view.     
* 
* NOTE: Any change needs to check the switch list table & thumbnail view,
* click & ctrl-click style, single & multiple drag & drop,
* add, delete, replace, import medias, zone, scene,
* Select the zone tab, zone area picture, scene,
* Media dblclick to media page, 
* Resize west and south, drag the line resize south, resiz window.
* 
* Click up & down arrow to move the selected rows then switch to thimbnail view to check it.
* And cross mixing test different cases.
*
* @param attrsObj Attributes object, includes the attributes listed below
*		 divId:div id
*        tableHeades: The table headers.
*        zoneMedias: The zone with some media data
* @see jQuery JavaScript Library v1.7.1
* @see jQuery UI CSS Framework 1.8.18
* @see colResizable-1.6.js
* @see multidraggable.js
* @see /modules/playlist/js/PlayListZoneMediaEdit.js
* 
*/
function MediaListTable(attrsObj) {
    
    var startTime, endTime;
    
    var self = this;
    
    this.divId = "";
    /** Include some attribute and the object. */
    this.attrsObject = attrsObj;
    
    this.mediaArr = null;
    
    /**
    * The real media array data.
    * Any action (add/delete/drag & drop/select/unselect) should maintain this object first then update the mapping object on PlaylistZoneMediaEdit
    */
    var _localZoneMedias = attrsObj.zoneMedias;
    
    /**
     * 
     * @type attrsObj.zoneMed
     */
    var zoneMediaCtrl = attrsObj.zoneMediaCtrl;
    
    var currentZoneId = attrsObj.currentZoneId;
    
    this.zoneId="";
    
    //this.transitionData;
    this.transitionComboData;
    
    var transitionComboData = attrsObj.transitionComboData;
    
    var _listTableColWidthArr = ["24", "300","300" ,"145","145","315"];
    
    /** The media list table min width. */
    var _listTableMinColWidth = ["24", "200","150" ,"100","145","320"];
    
    /** The media list table default width */
    var _listTableWidth = "1800px";
    /** The default height. */
    var _listTableHeight = "400px";
    
    var _listTableScrollWidth = 16;
    
    var _zoneData = attrsObj.zoneData;
    
    var _zoneList;
    
    //var _zoneContentView = jQuery('#zone_content');
    var _zoneContentView;
    
    /** Thmbnail view object - help to control the data update back. */
    var _zoneMediaView = attrsObj.zoneMediaView;
    
    //var zoneContentListView = jQuery('#zone_content_list');
	//var _zoneContentListView = jQuery('#'+attrsObj.divId).first();
    
    //var _zoneContentListView = jQuery('#'+attrsObj.divId) ;
    var _zoneContentListView ;
    
    /** The header table div */
    var _theadDiv;
    
    /** The body table div */
    var _tbodyDiv;
    
    //var _mainTableScrollObj = _zoneContentListView.find(".tblMainListCls");
    var _mainTableScrollObj ;
    
    /** The header table with empty body. */
    var _headerTable;
    
    /** The body table with empty header. */
    var _bodyTable;
    
    /** The tbody area in the body table. */
    var _tbodyObj;
    
    /** The thead area in the header table. */
    var _theadObj;
    
//    var _zoneContentListView ;
//    if(_zoneContentView){
//        _zoneContentListView = _zoneContentView.find("#"+attrsObj.divId);
//    }
    /** 
     * The list & thumbnail view status to control some asynchronous events call.
     *   
     */
    this.actionStatus = 0;
    /** Delete button */
    this.actionStatusDel = -1;
    /** Add button */
    this.actionStatusAdd = 1;
    /** Edit button */
    this.actionStatusEdit = 2;
    /** Replace button */
    this.actionStatusReplace = 3;
    /** Click the item */
    this.actionStatusClick = 4;
    /** Ctrl+Click the item */
    this.actionStatusCtrlClick = 5;
    /** Drag the item */
    this.actionStatusDrag = 6;
    /** Switch to the thumbnail view. */
    this.actionStatusSwitchThumbnail = 7;
    /** Switch to the list view. */
    this.actionStatusSwitchListTable = 8;
    /** Resize to view on south. */
    this.actionStatusResizeSouth = 9;
    /** Import button */
    this.actionStatusImport = 10;
    /** Click the item of zone area  */
    this.actionStatusClickZoneArea = 11;
    /** Click the zone tab. */
    this.actionStatusClickZoneTab = 12;
    /** Click the scene. */
    this.actionStatusClickSceneArea = 13;
    /** Resize the west. */
    this.actionStatusResizeWest = 14;
    
    this.resizeStatus = false; //resize function is not initialized.
    
     /**
      * Opera 8.0+
      */ 
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    /**
     * Firefox 1.0+
     */
    var isFirefox = typeof InstallTrigger !== 'undefined';
    
    
    /**
     * At least Safari 3+: "[object HTMLElementConstructor]"
     */ 
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    /**
     * Internet Explorer 6-11
     */ 
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    
    /**
     * Edge 20+
     */ 
    var isEdge = !isIE && !!window.StyleMedia;
    
    /**
     * Chrome 1+
     */ 
    var isChrome = !!window.chrome && !!window.chrome.webstore;
   
    /**
     * Blink engine detection
     */ 
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    if(attrsObj){
	this.divId = attrsObj.divId;
    }
    
    /**
     * Check the browser is firefox or not.
     */
    this.isBrowserFirefox = function(){
    	return isFirefox;
    }; 
    
    /**
     * Check the browser is firefox or not.
     */
    this.isBrowserChrome = function(){
    	return isChrome;
    }; 
    
    /**
    * Control area
    */
    
    //this.getMostRecentUsedHtml("");
    //this.getMostRecentUsedObjByTransitionId("");
    /**
    * Initialize all re-used parameters.
    * Cache some jQuery call objects.
    */
    this.initParams = function(){
         jQuery( document ).ready(function() {
            _zoneList = self.getZoneList(); 
             
            _zoneContentView = jQuery('#zone_content');

            //_zoneContentListView = jQuery('#'+attrsObj.divId) ;
             _zoneContentListView = self.getZoneContentListView() ;
        
            //var mainTableScrollObjArr = _zoneContentListView.find(".tblMainListCls");    
             //Get the 2nd
            _mainTableScrollObj = self.getMainTableScrollObj();        
            
            _theadDiv = self.getTheadDiv();
                  
            _tbodyDiv = self.getTbodyDiv();
             
            _headerTable = self.getHeaderTable();
    
            _bodyTable = self.getBodyTable();
                
            //Get the 1st 
            _tbodyObj = self.getTbodyObj();                         
             
            if(_zoneContentListView){
                _zoneContentListView.innerHTML = "";                
            }            
         });
    };

    /**
    * The tbody object in the body table.
    * Performance function - re-use the object.
    */
    this.getTheadObj = function(){
        if(_theadObj){
            return _theadObj;
        }else{
            var theadObjArr = jQuery(self.getHeaderTable()).find('thead');
            //Get the 1st one
            if(theadObjArr && theadObjArr[0]){
                _theadObj = jQuery(theadObjArr[0]);
                return _theadObj;
            }                
        }
    };
    
    /**
    * The tbody object in the body table.
    * Performance tuning function - re-use the object.
    */
    this.getTbodyObj = function(){
        if(_tbodyObj){
            return _tbodyObj;
        }else{
            var tbodyObjArr = jQuery(self.getBodyTable()).find('tbody');
            //Get the 1st one
            if(tbodyObjArr && tbodyObjArr[0]){
                _tbodyObj = jQuery(tbodyObjArr[0]);
                return _tbodyObj;
            }
                
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getBodyTable = function(){
        if(_bodyTable){
            return _bodyTable;
        }else{
            var bodyTableArr = jQuery("#"+attrsObj.divId).find("#BodyDiv").find("#tblMainList");
            if(bodyTableArr && bodyTableArr[0]){
                _bodyTable = bodyTableArr[0];
                return _bodyTable;    
            }
            
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getHeaderTable = function(){
        if(_headerTable){
            return _headerTable;
        }else{
            var headerTableArr = jQuery("#"+attrsObj.divId).find("#HeaderDiv").find("#tblMainList");
            if(headerTableArr && headerTableArr[0]){
                _headerTable = jQuery("#"+attrsObj.divId).find("#HeaderDiv").find("#tblMainList");
                return _headerTable;    
            }
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getTbodyDiv = function(){
        if(_tbodyDiv){
            return _tbodyDiv;
        }else{
            var tbodyDivArr = jQuery("#"+attrsObj.divId+" .bodyDivCls");
            if(tbodyDivArr && tbodyDivArr[0]){
                _tbodyDiv = jQuery(tbodyDivArr);    
                return _tbodyDiv;
            }
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getTheadDiv = function(){
        if(_theadDiv){
            return _theadDiv;
        }else{
            _theadDiv = jQuery("#"+attrsObj.divId).find("#HeaderDiv");
            return _theadDiv;
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getZoneList = function(){
        if(_zoneList){
            return _zoneList;
        }else{
            _zoneList = jQuery('#zoneList');
            return _zoneList;
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getZoneContentView = function(){
        if(_zoneContentView){
            return _zoneContentView;
        }else{
            _zoneContentView = jQuery("#zone_content");
            return _zoneContentView;
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getZoneContentListView = function(){
        if(_zoneContentListView){
            return _zoneContentListView;
        }else{
            _zoneContentListView = jQuery('#'+attrsObj.divId);
            return _zoneContentListView;
        }
    };
    
    /**
    * Performance tuning function - re-use the object.
    */
    this.getMainTableScrollObj = function(){
        if(_mainTableScrollObj){
            return _mainTableScrollObj;
        }else{
            _mainTableScrollObj = self.getZoneContentListView().find(".tblMainListCls");    
            if(_mainTableScrollObj && _mainTableScrollObj[0] && _mainTableScrollObj[1]){
                _mainTableScrollObj = _mainTableScrollObj[1];
                
                return _mainTableScrollObj;
            }
        }
    };
    
    this.setResizeStatus = function(newResizeStatus){
        self.resizeStatus = newResizeStatus;
    };
    
    /**
     * Using the zoneList as the target object, not the zoneContentView,
     * because of the asynchronous issue.
     * zoneList will show the correct height & width faster than zoneContentView.
     */
    this.setTableAreaWidthHeight = function(){
        var zoneContentView = self.getZoneContentListView();
        
        var zoneList = self.getZoneList();
        
        if(zoneList){                
            if(zoneList.width()){                
                self.setViewWidth(_listTableWidth);
            }

            if(zoneList.height()){
                _listTableHeight = zoneList.height();                
                self.setViewHeight(_listTableHeight);
            }            
        }
    };
    
    this.setZoneMedias = function(zoneMediasObj){        
        _localZoneMedias = zoneMediasObj;        
    };
    
    this.getZoneMedias = function(){
        return _localZoneMedias;
    };
    
    /**
    * Get the zIndex.
    */
    this.getZIndex = function(){        
        var mainTblDiv = jQuery(attrsObj.divId);
        return mainTblDiv.zIndex();
    };
    /**
     * Set the z-index.
     * @param {type} zidx z-index
     * 
     */
    this.setZIndex = function(zidx){        
        var mainTblDiv = jQuery( attrsObj.divId);
        mainTblDiv.css("z-index",zidx);        
    };
    
    /**
     * 
     * @param {type} viewWidth
     * 
     */
    this.setViewWidth = function(viewWidth){
        var zoneContentListView = self.getZoneContentListView();
        zoneContentListView.css("width",viewWidth);
        
        var tbodyDiv = jQuery(self.getTbodyDiv());
        var divWidth = 0;
        
        if(tbodyDiv && tbodyDiv.offsetWidth){
            divWidth = tbodyDiv.offsetWidth;
        }
        
        var diffWidth = viewWidth - divWidth;
        var headerDiv = self.getTheadDiv();
        var headerTable = self.getHeaderTable();
        var headObj = self.getTheadObj();
        
        var bodyDiv = self.getTbodyDiv();
        var bodyTbl = self.getBodyTable();
                
        //How much .bodyDivCls add, the head & body add the same.
        if(this.actionStatus === this.actionStatusResizeSouth){
			self.countWidthByZoneList();
            //self.resizeCol();
			self.nonResizeCol(viewWidth);
        }else if(this.actionStatus === this.actionStatusResizeWest){
            var westDiff = 0;            
            //narrow the list view
            if(_listTableWidth>viewWidth){                
                westDiff = 1;
                          
                headerDiv.css("width",viewWidth-westDiff);
                headerTable.css("width",viewWidth-westDiff);
                
                bodyDiv.css("width",viewWidth-westDiff);
                jQuery(bodyTbl).css("width",viewWidth-westDiff);
                
				console.log("Before countWidthByZoneList!");
                self.countWidthByZoneList();

				console.log("Before resizeWestNarrow!");
                //Resize columns before initialize the event
                self.resizeWestNarrow();
				
                // Remove the resize function by Alex 2017-01-05
                //Refresh the hidden control for the resize
                //if(isChrome){
                //    self.initResizeEvent();
                //}else{
                
				console.log("Before nonResizeCol!");
                self.nonResizeCol(viewWidth);
                //}                                
            }else{                               
                headerDiv.css("width",viewWidth);
                headerTable.css("width",viewWidth);
                
                //Check the scroll
                jQuery(bodyDiv).css("width",viewWidth);
                jQuery(bodyTbl).css("width",viewWidth);

				console.log("Before countWidthByZoneList!");
                self.countWidthByZoneList();
                                
				// Remove the resize function by Alex 2017-01-05
                //Refresh the hidden control for the resize
                //if(isChrome){
                    //Resize columns before initialize the event
                //    self.resizeCol();
                //    self.initResizeEvent();
                //    self.resizeCol();
                //}else{
                
				console.log("Before nonResizeCol!");
                self.nonResizeCol(viewWidth);
                //}                                
                
            }
        }else{            
            jQuery("#"+attrsObj.divId+" .bodyDivCls").css("width",viewWidth);            
        }
        _listTableWidth = viewWidth;
    };
    
    /**
    * Performance tuning function
    * To fix the resize west then switch tab, resize the height.
    */
    this.reHeight = function(){
        
        var zoneList = self.getZoneList();        
        if(zoneList && zoneList.height){
            var bodyDiv = self.getTbodyDiv();            
            if(bodyDiv){
                bodyDiv.css("height",zoneList.height()-80);
            }    
        }
    };
    
    /**
    * Count the columns width by zoneList area.
    */
    this.countWidthByZoneList = function(){
        var zoneList = self.getZoneList();
        
        var listViewWidth ;
        if(zoneList){
            listViewWidth = jQuery(zoneList).width();
            listViewWidth = listViewWidth-1.5;
            
            _listTableColWidthArr[0] = 24;
            
            _listTableColWidthArr[1] = Math.ceil(listViewWidth*0.25);
            var two = _listTableColWidthArr[1];
            _listTableColWidthArr[2] = _listTableColWidthArr[1];
            var three = _listTableColWidthArr[2];
            
            var fourTmp = Math.ceil( (listViewWidth - (two*3))/2 );
            if(fourTmp>145){
                fourTmp = 145;
            }            
            
            _listTableColWidthArr[3] = fourTmp;
            _listTableColWidthArr[4] = _listTableColWidthArr[3]; 
            
            _listTableColWidthArr[5] = listViewWidth - ( parseInt(_listTableColWidthArr[0]) + two + three + fourTmp + fourTmp );
            
            _listTableWidth = parseInt(_listTableColWidthArr[0]) + two*2 + fourTmp*2 + _listTableColWidthArr[5];
            
            _listTableHeight = jQuery(zoneList).height();
        }
        
    };
    
    /**
    * Performance tuning function
    * To handle the west resize then switch tab.
    * 24px, 23% , 23%, min, min ,29%
    */
	/**
    this.reWidth = function(){
        var zoneList = self.getZoneList();
        var zoneContentList = self.getZoneContentListView();
                
        var listViewWidth = jQuery(zoneList).width();
                 
        var headerDiv = self.getTheadDiv();
        var bodyDiv = self.getTbodyDiv();
        var headerTbl = self.getHeaderTable();
        var bodyTbl = self.getBodyTable();
        var headObj = self.getTheadObj();                
        
        listViewWidth = listViewWidth-1.5;
        
        if(listViewWidth>0){
			//The check box width, it's fixed.
            _listTableColWidthArr[0] = _listTableMinColWidth[0];
            
			var sumFront5 = parseInt(_listTableMinColWidth[0]) + parseInt(_listTableMinColWidth[1]) + parseInt(_listTableMinColWidth[2]) + 
							parseInt(_listTableMinColWidth[3]) + parseInt(_listTableMinColWidth[4]);
			
			var tmpLastWidth = ( listViewWidth - sumFront5 );
			//The 1st priority - keep the last 'Transition Effect/Duration' more than _listTableMinColWidth[5]
			if( tmpLastWidth > parseInt(_listTableMinColWidth[5]) ){
				//Duration
				_listTableColWidthArr[3] = _listTableMinColWidth[3];
				//Total Elapsed Time
				_listTableColWidthArr[4] = _listTableMinColWidth[4];
				
				//Name
				_listTableColWidthArr[1] = _listTableMinColWidth[1];
				//Description
				_listTableColWidthArr[2] = _listTableMinColWidth[2];
				
				//Transition Effect/Duration
				_listTableColWidthArr[5] = listViewWidth -( parseInt(_listTableColWidthArr[0]) + parseInt(_listTableColWidthArr[1]) +
															parseInt(_listTableColWidthArr[2]) + parseInt(_listTableColWidthArr[3]) +
															parseInt(_listTableColWidthArr[4]) );
			}else{
				_listTableColWidthArr[5] = _listTableMinColWidth[5];
				//2nd priority - 'Media name'
				_listTableColWidthArr[3] = _listTableMinColWidth[3];
				_listTableColWidthArr[4] = _listTableMinColWidth[4];
				_listTableColWidthArr[2] = _listTableMinColWidth[2];
				
				var otherWidth = parseInt(_listTableColWidthArr[0]) + parseInt(_listTableColWidthArr[2]) + parseInt(_listTableColWidthArr[3]) +
								parseInt(_listTableColWidthArr[4]) + parseInt(_listTableColWidthArr[5])
				_listTableColWidthArr[1] = listViewWidth - otherWidth ;
				
			}
			console.log('sumFront5='+sumFront5);
            console.log(_listTableColWidthArr);
            
            jQuery(headerDiv).css("width",listViewWidth);
            jQuery(headerTbl).css("width",listViewWidth);
            jQuery(bodyDiv).css("width",listViewWidth);
            jQuery(bodyTbl).css("width",listViewWidth);
        }
                
        if(headObj){
            var headThArr = jQuery(headObj).find("th");
            if(headThArr && headThArr.length===6){                                                                                
                jQuery(headThArr[0]).css("width",_listTableColWidthArr[0]);
                jQuery(headThArr[1]).css("width",_listTableColWidthArr[1]);
                jQuery(headThArr[2]).css("width",_listTableColWidthArr[2]);
                jQuery(headThArr[3]).css("width",_listTableColWidthArr[3]);
                jQuery(headThArr[4]).css("width",_listTableColWidthArr[4]);
                jQuery(headThArr[5]).css("width",_listTableColWidthArr[5]);
				
            }                        
        }
        
        self.resizeCol();
        //Just chrome run the resize event
        //if(isChrome){
            
        //    self.initResizeEvent();
        //}        
    };
    */
	
	
    /**
    * Set the display area height.
    * @param viewHeight 
    */
    this.setViewHeight = function(viewHeight){
        var zoneContentListView = self.getZoneContentListView();                
        zoneContentListView.css("height",viewHeight);
        
        //The div outside the table, display the scroll
        var zoneList = self.getZoneList();
        
        if(zoneList){
            var bodyDiv = self.getTbodyDiv();
            
            if(bodyDiv){
                bodyDiv.css("height",zoneList.height()-80);
            }                                        
        }
    };
    
    this.getAttributes = function(){
        return this.attrsObj;
    };
    
    this.getDivId = function(){
        return this.divId;
    };
    
    this.getZoneId = function(){
        return this.zoneId;
    };
    
    this.getMediaArr = function(){
        return this.mediaArr;
    };
    
    //create the combo box
//    this.loadTransitionEffect = function() {
//        
//    };
    
    //create the combo box
//    this.loadTransitionDuration = function() {
//        
//    };
    
    /**
    * Append the html on list table.
    * It has to empty the inner html before appending the new table.
    * The scene and zone area click may send the click event twice sometimes.
    * @param {String} htmlString The html string of the table
    */
    this.loadMediaListData = function(htmlString) {        
        if(this.divId){
            var listTableObj = jQuery('#'+this.divId);
            if(listTableObj){
                listTableObj.empty();
                //_zoneContentListView.empty();
                
                listTableObj.append(htmlString);      
                //_zoneContentListView.append(htmlString);
            }            
        }else{
            console.log("ERR:The target div is lost!");
        }
    };
        
    /**
    * Remove the media list table.
    * @param {String} htmlString The html string of the table
    */
    this.cleanMediaListHtml = function(htmlString) {
        
        if(this.divId){
            //var divObj = jQuery('#'+this.divId);
            var divObj = self.getZoneContentListView();
            if(divObj){
                divObj.empty();
                //_zoneContentListView.empty();
            }else{
                console.log("ERR: Media list table cleanMediaListHtml - No div object!");
            }            
        }else{
            console.log("ERR:The target div of media list table is lost!");
        }
    };      
    
    /**  
    * This function provides the call let the event lately executing.
    * @param trObj The target tr object.
    */
    this.lateRefresh = function(trObj){
        var e = jQuery.Event( "mouseup", { which: 1, lateRefresh: true} );
        trObj.trigger(e);
        //jQuery(".tblMainListCls tr").trigger(e);
    };
    
    /**
    * Get the selected media array from local media array.
    * return selectedMediaArr The selected media object array.
    */
    this.getSelectedMediaByArr = function(){
        var selectedMediaArr = [];
        if(_localZoneMedias && _localZoneMedias.length>0){
            for(var idx=0; idx<_localZoneMedias.length; idx++){
                var mediaObj = _localZoneMedias[idx];
                if(mediaObj && mediaObj.$selected){
                    selectedMediaArr.push(mediaObj);
                }
            }
        }
        return selectedMediaArr;
    };
    
    /**
    * Get selected media id or sequence array.
    * @param mediaParam 
    */
    this.getSelectedMedia = function(mediaParam){
        
        var mediaIdArr = [];
                
        var scrollTbl = self.getBodyTable();
        var tblBodyObj = self.getTbodyObj();           
        
        if(scrollTbl &&　tblBodyObj){
            //Load media list table with data
            jQuery(tblBodyObj).find("tr").each(function(trIdx){
                var chkObj = jQuery(this).find("input");;
                if(chkObj && chkObj[0]){
                    var mediaId = "";
                    var mediaVal = "";
                    var mediaRowIdx = 0;
                    var mediaObj ;
                    var originalSeq = "";
                                        
                    if(jQuery(chkObj).prop("checked")){
                        mediaId = jQuery(chkObj).prop("id");
                        mediaVal = jQuery(chkObj).prop("value");
                        
                        mediaRowIdx = jQuery(chkObj).attr("rowIdx");
                        
                        originalSeq = jQuery(chkObj).attr("originalValue");
                        
                        //get the object by mediaid and sequence                                                
                        
                        mediaObj = self.getMediaById(mediaId,mediaVal,mediaRowIdx);
                        
                        if(mediaObj){
                            if(mediaParam === 0 ){
                                mediaIdArr.push(mediaObj.id);        
                            }else if(mediaParam === 1){
                                mediaIdArr.push(mediaObj.sequence);        
                            }else{
                                mediaIdArr.push(mediaRowIdx);        
                            }
                        }else{
                            console.log("ERR: No media object!");
                        }
                    }
                    //return false;  //break and check next       
                }

            });    
        }//end if(scrollTbl && scrollTbl[1])
        
        return mediaIdArr;
    };
    
    /**
    * Get the selected media index array from list table.
    */
    this.getSelectedMediaIndexFromTable = function(){
        
        var mediaIdArr = [];
        var scrollTbl = self.getBodyTable();
        var tblBodyObj = self.getTbodyObj();
        if(scrollTbl && tblBodyObj){
            //Load media list table with data
            jQuery(tblBodyObj).find("tr").each(function(trIdx){
                var chkObj = jQuery(this).find("input");;
                if(chkObj && chkObj[0]){
                    if(jQuery(chkObj).prop("checked")){
                        mediaIdArr.push(trIdx+1);
                    }
                }
            });    
        }//end if(scrollTbl && scrollTbl[1])
        return mediaIdArr;
    };
    
    
    /**
    * Get the selected media count from list table.
    */
    this.getSelectedMediaCountFromTable = function(){
        var mediaCnt = 0;
        
        var mediaIdArr = [];
        var scrollTbl = self.getBodyTable();
        var tblBodyObj = self.getTbodyObj();
        if(scrollTbl && tblBodyObj){
            //Load media list table with data
            jQuery(tblBodyObj).find("tr").each(function(trIdx){
                var chkObj = jQuery(this).find("input");;
                if(chkObj && chkObj[0]){
                    if(jQuery(chkObj).prop("checked")){
                        mediaCnt++;
                    }
                }
            });    
        }//end if(scrollTbl && scrollTbl[1])
        return mediaCnt;
    };
    

    
    /**
    * Select the media by index.
    * Performance tuning.
    * @param {type} idx description
    */
    this.selectMediaByIdx = function(idx){
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
        
        if(scrollTbl && scrollTbl[1]){
            //Load media list table with data
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            if(tblBodyObj && tblBodyObj[0]){
                jQuery(tblBodyObj[0]).first().children("tr").each(function(trIdx){    
                    //jQuery(this).click();
                    var chkObj = jQuery(this).find("input");;
                    if(chkObj && chkObj[0]){
                        if(idx===trIdx){                            
                            jQuery(chkObj).prop("checked", true);
                            //jQuery(chkObj).addClass('ui-state-highlight')
                            self.highlightMediaByIdx(trIdx);
                            return false;  //break    
                        }   
                    }
                });          
            }//end if(tblBodyObj[0])
        }//end if(scrollTbl && scrollTbl[1])
    };
    
    /**
    * Highlight the media by index.
    * Performance tuning.
    * @param {int} idx The index value.
    */
    this.highlightMediaByIdx = function(idx){
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
        
        if(scrollTbl && scrollTbl[1]){
            //Load media list table with data
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            if(tblBodyObj && tblBodyObj[0]){
                jQuery(tblBodyObj[0]).first().children("tr").each(function(trIdx){                        
                    if(idx===trIdx){
                        var allTd = jQuery(this)[0].children;
                        if(allTd && allTd.length>0){
                            for(var tIdx=0; tIdx<allTd.length ; tIdx++){                        
                                if(allTd[tIdx] && allTd[tIdx].style){
                                    allTd[tIdx].style.backgroundColor = "#c5f0f6";    //light blue    
                                }        
                            }
                        }
                    }
                });          
            }//end if(tblBodyObj[0])
        }//end if(scrollTbl && scrollTbl[1])
    };
    
    /**
    * Performance tuning.
    * @param {array} idxArr The index array
    */
    this.selectMediaByArr = function(idxArr){
        //var checkedOne = false;
        var chkObj;
        
        if(idxArr && idxArr.length>0){
            
            var childTrArr = document.querySelectorAll('#'+attrsObj.divId + ' table tbody tr');
            
            if(childTrArr && childTrArr.length>0){
                self.checkAllMedia(false);
                //Loop tr row
                for(var trIdx=0; trIdx<childTrArr.length; trIdx++){
                    var childrenTrObj = childTrArr[trIdx];
                    var childTdNodesArr = childrenTrObj.childNodes;
                    if(childTdNodesArr && childTdNodesArr.length>0){
                        for(var tdIdx=0; tdIdx<childTdNodesArr.length; tdIdx++){
                            var tdObj = childTdNodesArr[tdIdx];
                            var chkObj = tdObj.children;
                            if(chkObj && chkObj[0]){
                                for(var idx=0;idx<idxArr.length;idx++){
                                    if( (trIdx+1) === parseInt(idxArr[idx]) ){
                                        chkObj[0].checked = true;
                                        break; //got it, doesn't check another. 
                                    }
                                }
                            }
                            break; //just get the 1st td with check box
                        }
                    }
                }
            }
        }//end if(idxArr && idxArr.length>0)
    };
    
    this.removeSelectedMedia = function(){
        var lastIdx = 0;
        var selectedCnt = 0;
        var trCnt = 0;
        var tbodyObj = jQuery("#"+attrsObj.divId+ " div.bodyDivCls").children("table#tblNeedsScrolling").children("tbody");
            
        if(tbodyObj && tbodyObj[0]){

            tbodyObj.first().children("tr").each(function(index){
                trCnt++;
                var trObj = jQuery(this);

                //Loop td
                jQuery(this).find('td').each(function(tIdx){

                    var chkObj = jQuery(this).children("input");
                    //var mediaId = "";
                    var mediaObj ;
                    
                    if(chkObj.attr("checked")){
                        selectedCnt++;
                        lastIdx = index;
                        //remove the selected tr
                        trObj.remove();
                    }

                });
            });
        }
        
        return lastIdx;
    };
    
    /**
    * 
    * @param {type} removeArr description
    */
    this.removeByArr = function(removeArr){
        if(removeArr){
            var lastIdx = 0;
            //var selectedCnt = 0;
            var trCnt = 0;
            
            var tbodyObj = jQuery("#"+attrsObj.divId+ " div.bodyDivCls").children("table#tblNeedsScrolling").children("tbody");
            
            if(tbodyObj && tbodyObj[0]){
                
                tbodyObj.first().children("tr").each(function(index){
                    trCnt++;
                    var trObj = jQuery(this);

                    //Loop td
                    jQuery(this).find('td').each(function(tIdx){

                        var chkObj = jQuery(this).children("input");
                        var mediaId = chkObj.attr("id");
                        var mediaSeq = chkObj.attr("value");
                        var mediaObj ;

                        if(removeArr.hasOwnProperty(mediaSeq)){
                            if(removeArr[mediaSeq] && removeArr[mediaSeq] == mediaId){
                                trObj.remove();    
                                
                            }
                        }

                        lastIdx = index;
                    });
                });
            }
            
          
        }//end if(removeArr)
        return lastIdx;
    };
    
    this.getDataCount = function(){
        var trCnt = 0;
        
        var tbodyObj = jQuery("#"+attrsObj.divId+ " div.bodyDivCls").children("table#tblNeedsScrolling").children("tbody");
            
        if(tbodyObj && tbodyObj[0]){
            tbodyObj.first().children("tr").each(function(index){
                trCnt++;
            });
        }
       
        return trCnt;
    };
    
    /**
     * 
     * @param {type} mediaId media id
     * @param {type} seq media sequence
     * @returns _localZoneMedias[idx] local media object by index.
     */
    this.getMediaById = function(mediaId, seq){
        //var mediaArr = attrsObj.zoneMedias;
        
        if( _localZoneMedias && _localZoneMedias.length>0 && mediaId){
            for(var idx=0; idx<_localZoneMedias.length; idx++){
                if(_localZoneMedias[idx] && ( String(mediaId) === String(_localZoneMedias[idx].mediaid) ) &&
                   ( String(seq) === String(_localZoneMedias[idx].sequence) )){
                    return _localZoneMedias[idx];
                }
            }
        }
    };
    
    
    
    /**
    * Re-count the total elapsed time.
    */
    this.refreshTotalElapsedtime = function(){
        if(_localZoneMedias){
            var newElipsedTime = 0;
            
            var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
            //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
                    
            if(scrollTbl && scrollTbl[1]){
            
                //Load media list table with data
                var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");

                if(tblBodyObj[0]){
                    jQuery(tblBodyObj[0]).first().children("tr").each(function(index){
                        var duration = self.recoverSeconds( jQuery(this).find("td").eq(3).html() );
                        //var totalElapsed = jQuery(this).find("td").eq(4).html();    

                        var formatTotalElapsedTime = self.formatMediaTime( newElipsedTime*1000 );
                        jQuery(this).find("td").eq(4).html( formatTotalElapsedTime ) ;
                        newElipsedTime += duration;
                    });                    
                }//end if(tblBodyObj[0])
            }
        }else{
            console.log("ERR:No media!");
        }//end if(_localZoneMedias){
        
    };//end refreshTotalElapsedtime
    
    /**
    * Send the html display string like '00:00:00', convert it to seconds.
    * @param {type} timeStr description
    */
    this.recoverSeconds = function(timeStr){
        var totalSec = 0;
        if(timeStr && timeStr.length>0){
            var arrTime = timeStr.split(":");
            totalSec = (( Number(arrTime[0]) *60 )+ Number(arrTime[1]) *60 + Number(arrTime[2]) );
        }
        return totalSec;
    };
    
    /**
    * Initizlize the tr click event. 
    */        
    this.setupTrClick = function(){
        
        var cnt=0;
        var scrollTbl = self.getBodyTable();

        if(scrollTbl){
            //Load media list table with data
            //var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var tblBodyObj = self.getTbodyObj();
            
            if(tblBodyObj){
                //Using the jQuery suggestion 'on'
                jQuery(tblBodyObj).on('click', 'tr', function (event) {                        
                    if(event.ctrlKey) {//Ctrl+Click - multiple select the rows                        
                        //jQuery(this).toggleClass('selectedListTableRow');
                        jQuery(this).toggleClass('ui-state-highlight');

                        //control check box
                        if(jQuery(this).hasClass("ui-state-highlight")){
                            if(jQuery(this)[0] && jQuery(this)[0].firstElementChild ){
                                var allTd = jQuery(this)[0].children;
                                if(allTd && allTd.length>0){
                                    for(var tIdx=0; tIdx<allTd.length ; tIdx++){                        
                                        if(allTd[tIdx] && allTd[tIdx].style){
                                            allTd[tIdx].style.backgroundColor = "#c5f0f6";    //light blue    
                                        }        
                                    }
                                }
                                //Control the 1st row and checked box status
                                var firstTd = jQuery(this)[0].firstElementChild ;
                                if(firstTd && firstTd.firstElementChild){
                                    firstTd.firstElementChild.checked = true;
                                }

                            }
                        }else{
                            if(jQuery(this)[0] && jQuery(this)[0].firstElementChild ){
                                var firstTd = jQuery(this)[0].firstElementChild ;
                                if(firstTd && firstTd.firstElementChild){
                                    firstTd.firstElementChild.checked = false;
                                    //Refresh the styles.
                                    self.reStyleTr();
                                }
                            }
                        }
                        
                        self.updateThumbnailSelectedIndex();                        
                    }else{//Just mouse click - Just select the target, unselect the other
                        jQuery(this).toggleClass('ui-state-highlight');                        
                        var highlightClass = false;
                        
                        if(jQuery(this).hasClass('ui-state-highlight')){
                           
                            highlightClass = true;
                        }else{
                            highlightClass = false;
                            
                        }
                        
                        self.checkAllMedia(false);
                        self.unclassAllMedia();
						self.unSelectAllThumbMedia();

                        if(jQuery(this)[0] && jQuery(this)[0].firstElementChild ){
                            var allTd = jQuery(this)[0].children;
                            if(allTd && allTd.length>0){
                                for(var tIdx=0; tIdx<allTd.length ; tIdx++){                        
                                    if(allTd[tIdx] && allTd[tIdx].style){
                                        if(highlightClass){
                                            allTd[tIdx].style.backgroundColor = "#c5f0f6";    //light blue        
                                        }
                                    }        
                                }
                            }
                            //Control the 1st row and checked box status
                            var firstTd = jQuery(this)[0].firstElementChild ;
                            if(firstTd && firstTd.firstElementChild){
                                firstTd.firstElementChild.checked = highlightClass;
                            }else{
                                console.log("ERR:1st element lost dom!!!");
                            }

                        }
                        //Refresh the row data status
                        self.updateThumbnailSelectedIndex();
                        self.reStyleTr();
                    }
                    self.updateChkMaster();
                }); //end jQuery("#tblNeedsScrolling tbody").on('click', 'tr', function (event)
            }//end if(tblBodyObj[0])
            
        }//end if(scrollTbl && scrollTbl[1])
        
    };
    
	/**
	* Initialize the multiple drag & drop events.
	*/
    this.initMultipleDragAndDrop = function(){
        //Multiple drag & drop    
        jQuery.ui.sortable.prototype._rearrange = function (event, i, a, hardRefresh) {

            a ? a[0].appendChild(this.placeholder[0]) : (i.item[0].parentNode) ? i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling)) : i.item[0];

            this.counter = this.counter ? ++this.counter : 1;
            var counter = this.counter;
            

            setTimeout(function(){
                if (counter === this.counter) {
                    this.refreshPositions(!hardRefresh); 
                }
            }, 100);


            
        };
        
        var tbodyObj = self.getTbodyObj();
        
        //jQuery('#tblMainList tbody').sortable({
        jQuery(tbodyObj).sortable({
            connectWith: "tbody",
            //delay: 150, 
            delay: 100, 
            revert: 1,
            helper: function (e, item) {

                var helper = jQuery('<tr/>');
                
                if (!item.hasClass('ui-state-highlight')) {
                    
                    item.addClass('ui-state-highlight').siblings().removeClass('ui-state-highlight');
                }
                
                var elements = item.parent().children('.ui-state-highlight').clone();

                item.data('multidrag', elements).siblings('.ui-state-highlight').remove();

                var rtnHelper = helper.append(elements);

                
                return rtnHelper;
            },
            stop: function (e, info) {
                info.item.after(info.item.data('multidrag')).remove();
                
                
                self.reStyleTr();
                //Re-count the total elapsed time.
                self.refreshTotalElapsedtime();
                //self.refreshThumbnailData();
                self.dropRefreshThumbnailData();
                //self.updateThumbnailSelectedIndex();
                //Alex test the new re-width function
				//self.reWidth();
				self.nonResizeCol();
                
                self.lockComboxNone();
                
                self.attachTransitionEvents();                
            },
            sort: function (e, ui) {
               //jQuery("tr").removeClass('selectedListTableRow');
                jQuery("tr").removeClass('ui-state-highlight');    
                
            }
        });//end jQuery('#tblNeedsScrolling tbody').sortable
 
        // Return a helper with preserved width of cells
        var fixHelper = function(e, item) {
            var helper = jQuery('<tr/>');
            
            if (!item.hasClass('ui-state-highlight')) {
                
                item.addClass('ui-state-highlight').siblings().removeClass('ui-state-highlight');
            }
            
            var elements = item.parent().children('.ui-state-highlight').clone();
            
            item.data('multidrag', elements).siblings('.ui-state-highlight').remove();

            var rtnHelper = helper.append(elements);
//            item.children().each(function() {
//                jQuery(this).width(jQuery(this).width());
//            });
            rtnHelper.children().each(function() {
                jQuery(this).width(jQuery(this).width());
            });

            return rtnHelper;
        };
    };
    
    /**
    * Initialize the resize event by using colResizable library.
    * Initialize this event needs to disable first the turn on later. 
    */
    this.initResizeEvent = function(){        
        //colResizable will attach the event twice, need to disable then register again.
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
        
        if(scrollTbl){
            //jQuery("#" + attrsObj.divId+ " .tblMainListCls").colResizable({    
            if(scrollTbl[0]){
                jQuery(scrollTbl[0]).colResizable({        
                    liveDrag:true, 
                    gripInnerHtml:"", 
                    minWidth:140, 
                    draggingClass:"dragging", 
                    //resizeMode:'fit', //fit flex overflow
                    partialRefresh:true,
                    /* disabledColumns: [0]*/
                    onResize: self.afterTableResize,
                    onDrag: self.resizeTableDrag,
                    disable: true
                });    
                
                jQuery(scrollTbl[0]).colResizable({        

                    liveDrag:true, 
                    gripInnerHtml:"", 
                    minWidth:140, 
                    draggingClass:"dragging", 
                    resizeMode:'fit',
                    partialRefresh:true,
                    /* disabledColumns: [0,2,3,4,5],*/
                    disabledColumns: [0], 
                    onResize: self.afterTableResize,
                    onDrag: self.resizeTableDrag 
                });    
            }
        }//end if(scrollTbl){
    };
    
    /**
    * Clone another table without empty head, truncate this table body, set the scroll condition.
    * @param {type} tblAsJQueryObject description
    * @param {type} height description
    * @param {type} width description
    */
    this.scrolify = function(tblAsJQueryObject, height, width){
        var oTbl;
        var newTbl;
        
        oTbl = tblAsJQueryObject;

        // for very large tables you can remove the four lines below
        // and wrap the table with <div> in the mark-up and assign
        // height and overflow property  
        var oTblDiv = jQuery("<div id='BodyDiv' class='bodyDivCls' />");
        
        oTblDiv.css('height', height);
        //oTblDiv.css('width', width);
        //oTblDiv.css('overflow', 'auto');
        oTblDiv.css('overflow-y', 'scroll');
        oTblDiv.css('overflow-x', 'hidden');
        
        oTbl.wrap(oTblDiv);

        // save original width
        oTbl.attr("data-item-original-width", oTbl.width());
        oTbl.find('thead tr td').each(function () {
            jQuery(this).attr("data-item-original-width", jQuery(this).width());
        });
        
        oTbl.find('tbody tr:eq(0) td').each(function () {
            jQuery(this).attr("data-item-original-width", jQuery(this).width());
        });

        // clone the original table
        newTbl = oTbl.clone();

        // remove table header from original table
        oTbl.find('thead tr').remove();
        // remove table body from new table
        newTbl.find('tbody tr').remove();

        oTbl.parent().parent().prepend(newTbl);
        newTbl.wrap("<div id='HeaderDiv' class='headerDivCls'/>");
        
        // replace ORIGINAL COLUMN width                
        newTbl.width(newTbl.attr('data-item-original-width'));
        newTbl.find('thead tr td').each(function () {
            jQuery(this).width(jQuery(this).attr("data-item-original-width"));
        });
        oTbl.width(oTbl.attr('data-item-original-width'));
        oTbl.find('tbody tr:eq(0) td').each(function () {
            jQuery(this).width(jQuery(this).attr("data-item-original-width"));
        });                
    };
    
    /**
     * Control the style and events related functions.
     */
    this.adjustMainStyle = function(){
        jQuery( document ).ready(function() {            
            startTime = new Date();
                                    
            self.setupTrClick(); 
                        
            self.attachMediaNameFieldsDblEvent();            
            
            //Group the transition related events.
            self.attachTransitionEvents();
                        
            self.attachChkMasterClickEvent();            
            
            self.attachChkMediaClickEvent();            
            
            self.attachTotalElapsedtimeEvent();            
            
            //self.reWidth();   
			self.nonResizeCol();
            
            //Refresh the style
            self.reStyleTr();           
            
            self.setMainTableStyle();            
            
            //Maintain the status
            self.attachResizerEvent();
            
            self.attachUpDownEvents();
            
        });//end jQuery( document ).ready    
    };
    
    /**
    * Up and down key events.
    * The image buttons to control the selected media on the right up position
    */
    this.attachUpDownEvents = function(){
        //var mainTbl = self.getZoneContentListView();
        var headTbl = self.getTheadObj();
        
        if(headTbl){
            jQuery(headTbl).find("button[name='btnUp']").on('click',  function (event) {               
                self.runClickUp();
            });
            
            jQuery(headTbl).find("button[name='btnDown']").on('click',  function (event) {
                self.runClickDown();
            });
        }

    };
    
    /**
    * Control the selected media to up.
    */
    this.runClickUp = function(){        
        
        //Get the selected media id array
        var selectedArr = self.getSelectedMediaIndexFromTable();
        var bodyTblObj = self.getTbodyObj();
        var bodyTbl = self.getBodyTable();
        
        if(bodyTblObj && selectedArr && selectedArr.length>0){
            
            //Move up, need to make sure the 1st index more than one
            if(selectedArr[0]>1){
                //Begin from 1
                var firstId = selectedArr[0]; 
                
                var elements = jQuery(bodyTblObj).children('.ui-state-highlight').clone();

                //item.data('multidrag', elements).siblings('.selectedListTableRow').remove();
                jQuery(bodyTblObj).children('.ui-state-highlight').remove();

                //Re-arrange the index
                var trObjArr = jQuery(bodyTblObj).find("tr");
                
                //Get the previous one and insert
                //index to target array index
                elements.insertBefore(trObjArr[firstId-2]);  
                
                self.reStyleTr();
				
				self.attachTransitionEvents();
                //Re-count the total elapsed time.
                self.refreshTotalElapsedtime();
                //self.refreshThumbnailData();
                self.dropRefreshThumbnailData();
                //self.updateThumbnailSelectedIndex();
                //self.reWidth();
				self.nonResizeCol();
                
                self.lockComboxNone();
                
            }
                
        }        
    };
    
    /**
    * Control the selected media to down.
    */
    this.runClickDown = function(){
        
        //Get the selected media id array
        var selectedArr = self.getSelectedMediaIndexFromTable();
        var bodyTblObj = self.getTbodyObj();
        var bodyTbl = self.getBodyTable();
        
        if(bodyTblObj && selectedArr && selectedArr.length>0){
            var trObjArr = jQuery(bodyTblObj).find("tr");
            //Move down, need to make sure the 1st index less than all items length
            //Need to add the array's length
            if(trObjArr && selectedArr[0] < (trObjArr.length-selectedArr.length + 1)){
                //Begin from 1
                var firstId = selectedArr[0]; 
                
                var targetTr;
                //Get the next 1st index is not highlight 
                for(var trIdx=firstId-1; trIdx<trObjArr.length; trIdx++){
                    
                    if(!jQuery(trObjArr[trIdx]).hasClass("ui-state-highlight")){
                        targetTr = trObjArr[trIdx];
                        break;
                    }
                }
                
                //Clone the selected items
                var elements = jQuery(bodyTblObj).children('.ui-state-highlight').clone();

                //Remove the selected items
                jQuery(bodyTblObj).children('.ui-state-highlight').remove();

                //Get the nex one not highlight and insert after it
                elements.insertAfter(targetTr);
                
                //Post actions after changing the index of the selected items.
                self.reStyleTr();
				
				self.attachTransitionEvents();
                //Re-count the total elapsed time.
                self.refreshTotalElapsedtime();
                //self.refreshThumbnailData();
                self.dropRefreshThumbnailData();
                //self.updateThumbnailSelectedIndex();
                //self.reWidth();
				self.nonResizeCol();
                
                self.lockComboxNone();
                
            }
                
        }
    };
    
    /**
    * Detect the west resizer click, maintain the status code to do something.
    * Using the mouseup, mousedown & click may break the original event.
    * id=peHalfDown div .ui-layout-resizer-west
    */
    this.attachResizerEvent = function(){
        //West DIV - trigger the west resize
        jQuery("#peHalfDown").find(".ui-layout-resizer-west").on( "mouseup", function() {
            self.actionStatus = self.actionStatusResizeWest;
            zoneMediaCtrl.setActionStatus(self.actionStatusResizeWest);
            //resize the table width
            //_listTableColWidthArr = self.resizeByRules(_listTableColWidthArr, jQuery(self.getZoneList()).width());            
        });
        
        //South DIV layoutZoneEdit ui-layout-toggler-south
        jQuery("#layoutZoneEdit").find(".ui-layout-toggler-south").on( "mouseup", function() {
            self.actionStatus = self.actionStatusResizeSouth;
            zoneMediaCtrl.setActionStatus(self.actionStatusResizeSouth);            
        });
        
        //Attach the window resize event
        jQuery( window ).resize(function() {            
            self.handleResizeWindow();
        });
    };
    
    /**
     * Late firing function for the window resize.
     * 
     */
    this.fireHandleResizeWindow = function(){
        
        
        var layoutEditWidth = jQuery("#layoutEdit").width();                
        var zoneList = self.getZoneList();                
        var zoneContentListView = self.getZoneContentListView();                        
        var bodyDiv = self.getTbodyDiv();        
        var tbodyObj = self.getTbodyObj();
        var jqTrObj ;        
        var trArrObj ;
        var bodyTdArr ;        
        var headerTable = self.getHeaderTable();                
        var headThArr = jQuery(headerTable).find('thead tr th');        
        var headObj = self.getTheadObj();
        
        var listViewWidth = jQuery(zoneContentListView).width();
        
         //var mainTblDivObj = self.getZoneContentListView();
        var headerDiv = self.getTheadDiv();
        var bodyDiv = self.getTbodyDiv();
        var headerTbl = self.getHeaderTable();
        var bodyTbl = self.getBodyTable();
        var headObj = self.getTheadObj();                
        
        listViewWidth = listViewWidth-1.5;
        
        if(layoutEditWidth>0){
            _listTableColWidthArr[0] = 24;
            var three = 0;
            //Less then this size, the parent window couldn't narrow, the width is frozen.
            if(layoutEditWidth>1400){                
                _listTableColWidthArr[1] = Math.ceil(layoutEditWidth*0.25);
                _listTableColWidthArr[2] = _listTableColWidthArr[1];
        
                three= Math.ceil((layoutEditWidth-(_listTableColWidthArr[1]*3))/2 );
            
                _listTableColWidthArr[3] = three;
                _listTableColWidthArr[4] = three; 
                _listTableColWidthArr[5] = layoutEditWidth -(_listTableColWidthArr[0]+_listTableColWidthArr[1]+_listTableColWidthArr[2]+_listTableColWidthArr[3]+_listTableColWidthArr[4]);
            }else{
                
                _listTableColWidthArr[5] = _listTableMinColWidth[5];
                var tmpAvg = (listViewWidth - (parseInt(_listTableMinColWidth[5]) +parseInt(_listTableMinColWidth[0])) )/4;
                _listTableColWidthArr[1] = tmpAvg;
                _listTableColWidthArr[2] = tmpAvg;
                _listTableColWidthArr[3] = tmpAvg;
                _listTableColWidthArr[4] = tmpAvg;
            }
            
            jQuery(headerDiv).css("width",layoutEditWidth);
            jQuery(headerTbl).css("width",layoutEditWidth);
            jQuery(bodyDiv).css("width",layoutEditWidth);
            jQuery(bodyTbl).css("width",layoutEditWidth);
        }
        
        if(headObj){
            var headThArr = jQuery(headObj).find("th");
            if(headThArr && headThArr.length===6){                                                                
                //These number is try/error to fix the width issue on m=
                jQuery(headThArr[0]).css("width", _listTableColWidthArr[0]+30);
                jQuery(headThArr[1]).css("width", _listTableColWidthArr[1]-60);
                jQuery(headThArr[2]).css("width", _listTableColWidthArr[2]-50);
                jQuery(headThArr[3]).css("width", _listTableColWidthArr[3]-10);
                jQuery(headThArr[4]).css("width", _listTableColWidthArr[4]-10 );
                jQuery(headThArr[5]).css("width", _listTableColWidthArr[5]-50 );
            }                        
        }
        
        if(tbodyObj){
            jqTrObj = jQuery(tbodyObj);            
            if(jqTrObj && jqTrObj[0] && jqTrObj[0].children){                
                //Couldn't update the width directly, record the TH width, then set the TD width.
                //The firefox, IE11, chrome have different width-diff, may need to re-count the width for them.
                var thWidthArr = [];
                for (var thIdx = 0; thIdx < headThArr.length; thIdx++) {
                    //Check and resize the 1st column
                    if(thIdx===0){                                    
                        jQuery(headThArr[thIdx]).css("width","24");
                        jQuery(headThArr[thIdx]).width("24");                        
                        thWidthArr.push(24);                       
                    }else{                        
                        thWidthArr.push(jQuery(headThArr[thIdx]).width());                                                        
                    }
                }                
                         
                thWidthArr = _listTableColWidthArr;                                          
                trArrObj = jqTrObj[0].children;
                
                //May have no data in some case
                if(trArrObj && trArrObj[0] && trArrObj[0].children){
                    bodyTdArr = trArrObj[0].children;                    
                    //Set body td width
                    for (var tdIdx = 0; tdIdx < bodyTdArr.length; tdIdx++) {
                        if(tdIdx===0){
                            jQuery(bodyTdArr[tdIdx]).width(24);        
                        }else{
                            jQuery(bodyTdArr[tdIdx]).width(thWidthArr[tdIdx]);        
                        }                        
                    }    

                    var tdWidthArr = [];
                    for (var tdIdx = 0; tdIdx < bodyTdArr.length; tdIdx++) {
                        if(tdIdx===0){
                            tdWidthArr.push(24);
                        }else{
                            tdWidthArr.push(jQuery(bodyTdArr[tdIdx]).width());    
                        }                        
                    }
                }
            }            
        }
    }; 
    
    /**
     * This is the function for the window resize.
     * The width seems not to get the correct by the reWidth.
     * 
     * @returns
     */
    this.handleResizeWindow = function(){
        
        self.reHeight();
        //self.reWidth();                
        var timer = setTimeout(function() {
           //Run the main function
           self.fireHandleResizeWindow();            
        }, 300);                
    };
    
    /**
    * Let the scroll could see the last one.
    */
    this.setMainDivStyle = function(){        
        var scrollDiv = jQuery("#" + attrsObj.divId+ " .bodyDivCls");        
        
        if(scrollDiv){            
            var divHeight = scrollDiv.height();
            scrollDiv.height(divHeight-27);
        }else{
            console.log("ERR:scrollDiv lost!!!");
        }
        
    };
    
    /**
    * Set main table related tr td border style.
    */
    this.setMainTableStyle = function(){
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
                
        //The master check box is on the 1st table header, so get the 1st table.
        if(scrollTbl && scrollTbl[0] && scrollTbl[1]){
            //border:5px #cccccc solid;
            if(isFirefox){
                jQuery(scrollTbl[0]).css("border","1px darkgrey solid");
                jQuery(scrollTbl[1]).css("border","1px darkgrey solid");
            }else{
                jQuery(scrollTbl[0]).css("border","1px #cccccc solid");
                jQuery(scrollTbl[1]).css("border","1px #cccccc solid");
            }
            
            var tblHeadObj = jQuery(scrollTbl[0]).find("thead");
            var childHead = jQuery(tblHeadObj[0]);
            
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var childBody = jQuery(tblBodyObj[0]);
            
            childHead.find("th").each(function(idx){
                
                if(isFirefox){           
                    jQuery(this).css("border-right-style","ridge");                 
                    jQuery(this).css("background","rgba(255,255,255,0.7)");
                    jQuery(this).css("background","linear-gradient(#FFFFFF, #D4D0C8)");
                }else{
                    jQuery(this).css("border-right","2px solid whitesmoke");
                    jQuery(this).css("border-right-style","ridge");

                    jQuery(this).css("border-left","2px solid whitesmoke");
                    jQuery(this).css("border-top","2px solid whitesmoke");

                    jQuery(this).css("background","rgba(255,255,255,0.7)");
                    jQuery(this).css("background","linear-gradient(#FFFFFF, #D4D0C8)");
                }//end isFirefox
                
            });
            
            childBody.find("tr").each(function(idx){
                
                jQuery(this).find("td").each(function(idxTd){
                    //FF mar draw the white border
                    if(isFirefox){
                        
                    }else{
                        jQuery(this).css("border-right","2px solid whitesmoke");
                    
                        jQuery(this).css("border-right-style","ridge");
                    
                        jQuery(this).css("border-left","2px solid whitesmoke");
                        jQuery(this).css("border-top","2px solid whitesmoke");    
                    }
                    
                   
                });
            });
        }//if(scrollTbl && scrollTbl[0] && scrollTbl[1])
    };
    
    this.attachTotalElapsedtimeEvent = function(){
        
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
                
        if(scrollTbl && scrollTbl[1]){            
            //Load media list table with data
            //var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var childBody = jQuery(tblBodyObj[0]);
            
            if(childBody && childBody[0]){
                jQuery(childBody[0]).find("tr").each(function( index ) {
                
                    jQuery(this).mouseover(function() {
                        jQuery(this).addClass("ui-state-hover"); 
                    }).mouseout(function() {
                        jQuery(this).removeClass("ui-state-hover");
                    });

                    /**
                    * The draggable function couldn't detect the events, use the down & up to replace it.
                    * The drop needs several miliseconds to complete the redraw, set time delay to call the lateRefresh then trigger the event.
                    * Do the refreshing the total elapsed time
                    * @param e mousedown event
                    */
                    jQuery(this).mousedown(function(e) {
                        //nothing
                    }).mouseup(function(e) {
                        var lateRefSec = 0;                        
                        //Check the flag
                        if(e && e.lateRefresh === true){
                            self.refreshTotalElapsedtime();
                        }else{
                            //To improve the performance - remove the setTimeout
                            //the function call through the lateRefresh could update the totalElapsedTime
                            //It may have enough time to re-position then the counting will be correct.
                            self.lateRefresh(jQuery(this));
                            //self.lateRefresh();
                            
//                            setTimeout(function(){
//                                self.lateRefresh();
//                            }, lateRefSec);
                        }

                    });

                });
        
            }
        }
            
    };//end attachTotalElapsedtimeEvent
                   
    /**
    * Callback after resize the table width.
    * @param scrollTbl
    */
    this.afterTableResize = function(scrollTbl){
        
//        var timer;
//        timer = setTimeout(function() {
            self.resizeCol(scrollTbl);           
        //}, 500);
    };
    
    /**
    * Callback on resizing the table width.
    * @param scrollTbl
    */
    this.resizeTableDrag = function(scrollTbl){        
        self.resizeCol(scrollTbl);
    };
    
    /**
     * Resize the width of list table. 
     * @param scrollTbl
     * @param isNarrowWest resize the west - narrow mode
     */
    this.resizeCol = function(scrollTbl, isNarrowWest){                               
        var mainTblDivObj = self.getZoneContentListView();
        var headerDiv = self.getTheadDiv();
        var headerWidth = jQuery(headerDiv).width();
        var bodyDiv = self.getTbodyDiv();
        var bodyWidth = jQuery(bodyDiv).width();
        
        //Scroll bar flag
        var hasScroll = false;
        var outerWidth = 0;
        var scrollWidth = 0;
        
        hasScroll = true;
        
        //Unknown reason hang here, change the way to get the array
        var tbodyObj = self.getTbodyObj();
        var jqTrObj ;
        //var trObj = jqTrObj.find('tr:eq(0)');
        var trArrObj ;
        var bodyTdArr ;
        //var bodyTdArr = jQuery(bodyDiv).find('tbody tr:eq(0) td');
        var headerTable = self.getHeaderTable();
        
        //var th = jQuery("#"+attrsObj.divId).find("div HeaderDiv").find('thead tr th');
        var headThArr = jQuery(headerTable).find('thead tr th');
        
        if(tbodyObj){
            jqTrObj = jQuery(tbodyObj);
            
            if(jqTrObj && jqTrObj[0] && jqTrObj[0].children){                
                //Couldn't update the width directly, record the TH width, then set the TD width.
                //The firefox, IE11, chrome have different width-diff, may need to re-count the width for them.
                var thWidthArr = [];
                for (var thIdx = 0; thIdx < headThArr.length; thIdx++) {
                    //Check and resize the 1st column
                    if(thIdx===0){                                    
                        jQuery(headThArr[thIdx]).css("width",_listTableColWidthArr[0]);
                        jQuery(headThArr[thIdx]).width(_listTableColWidthArr[0]);                        
                        thWidthArr.push(24);                       
                    }else{                        
                        thWidthArr.push(jQuery(headThArr[thIdx]).width());
                    }
                }
                
                thWidthArr = self.resizeByBrowser(thWidthArr,hasScroll,bodyWidth);                                
                trArrObj = jqTrObj[0].children;
                
                //May have no data in some case
                if(trArrObj && trArrObj[0] && trArrObj[0].children){
                    bodyTdArr = trArrObj[0].children;
                    
                    //Set body td width
                    for (var tdIdx = 0; tdIdx < bodyTdArr.length; tdIdx++) {
                        if(tdIdx===0){
                            jQuery(bodyTdArr[tdIdx]).width(_listTableColWidthArr[0]);        
                        }else{      
                            if(isChrome){
                                jQuery(bodyTdArr[tdIdx]).width(thWidthArr[tdIdx]);
                            }else{
                                if(tdIdx===5){
                                    jQuery(bodyTdArr[tdIdx]).width(self.sumSixWidth(tdWidthArr)-self.sumFiveWidth(thWidthArr));
                                }else{
                                    jQuery(bodyTdArr[tdIdx]).width(thWidthArr[tdIdx]);
                                }
                            }                            
                        }                        
                    }    

                    var tdWidthArr = [];
                    for (var tdIdx = 0; tdIdx < bodyTdArr.length; tdIdx++) {
                        if(tdIdx===0){
                            tdWidthArr.push(_listTableColWidthArr[0]);
                        }else{
                            if(isChrome){
                                tdWidthArr.push(jQuery(bodyTdArr[tdIdx]).width());
                            }else{
                                if(tdIdx===5){
                                    tdWidthArr.push(self.sumSixWidth(tdWidthArr)-self.sumFiveWidth(tdWidthArr));
                                }else{
                                    tdWidthArr.push(jQuery(bodyTdArr[tdIdx]).width());
                                }
                            }                            
                        }                        
                    }//end for
                    
                }
            }            
        }
    };
    
    /**
     * Using the fixed width
     * 1st 24
     * 2nd
     * 3rd
     * 4th 145
     * 5th 145
     * 6th >320
     * @param {type} newViewWidth description
     * @returns 
     */
    this.nonResizeCol = function(newViewWidth){
        
		if(newViewWidth>0){
			console.log("newViewWidth>0");
		}else{
			var zoneList = self.getZoneList();
			var zoneContentList = self.getZoneContentListView();               
			newViewWidth = jQuery(zoneList).width();
		}
		
        
		var leftViewWidth = newViewWidth - (parseInt(_listTableColWidthArr[0])+parseInt(_listTableColWidthArr[3])+parseInt(_listTableColWidthArr[4]));
		
        var twoWidth = 0;
        var threeWidth = 0;
        var sixWidth = 0;
                
		twoWidth = parseInt(_listTableColWidthArr[1]) ;
		console.log("twoWidth="+twoWidth);
		
        //threeWidth = (leftViewWidth-320)/2;
		//threeWidth = (leftViewWidth - parseInt(_listTableColWidthArr[5]))/2;
		threeWidth = parseInt(_listTableColWidthArr[2]) ;
        console.log("threeWidth="+threeWidth);
		
        sixWidth = newViewWidth - (twoWidth+threeWidth+ parseInt(_listTableColWidthArr[0]) + parseInt(_listTableColWidthArr[3])+parseInt(_listTableColWidthArr[4]));
        
        var mainTblDivObj = self.getZoneContentListView();
        var headerDiv = self.getTheadDiv();
        var headerWidth = jQuery(headerDiv).width();
        var bodyDiv = self.getTbodyDiv();
        var bodyWidth = jQuery(bodyDiv).width();
                        
        hasScroll = true;
        
        //Unknown reason hang here, change the way to get the array
        var tbodyObj = self.getTbodyObj();
        var jqTrObj ;
        //var trObj = jqTrObj.find('tr:eq(0)');
        var trArrObj ;
        var bodyTdArr ;
        //var bodyTdArr = jQuery(bodyDiv).find('tbody tr:eq(0) td');
        var headerTable = self.getHeaderTable();
        
        //var th = jQuery("#"+attrsObj.divId).find("div HeaderDiv").find('thead tr th');
        var headThArr = jQuery(headerTable).find('thead tr th');
        
        if(tbodyObj){
            jqTrObj = jQuery(tbodyObj);
            
            if(jqTrObj && jqTrObj[0] && jqTrObj[0].children){                
                                                                  
                jQuery(headThArr[0]).css("width",_listTableColWidthArr[0]);
                jQuery(headThArr[0]).width(_listTableColWidthArr[0]);
                jQuery(headThArr[3]).css("width",_listTableColWidthArr[3]);
                jQuery(headThArr[3]).width(_listTableColWidthArr[3]);
                jQuery(headThArr[4]).css("width",_listTableColWidthArr[4]);
                jQuery(headThArr[4]).width(_listTableColWidthArr[4]);
                
				_listTableColWidthArr[1] = twoWidth;
                jQuery(headThArr[1]).css("width",_listTableColWidthArr[1]);
                jQuery(headThArr[1]).width(_listTableColWidthArr[1]);
				
				_listTableColWidthArr[2] = threeWidth;
                jQuery(headThArr[2]).css("width",_listTableColWidthArr[2]);
                jQuery(headThArr[2]).width(_listTableColWidthArr[2]);
				
				sixWidth = headerWidth - ( parseInt(_listTableColWidthArr[0]) + parseInt(_listTableColWidthArr[1]) + parseInt(_listTableColWidthArr[2]) +
											parseInt(_listTableColWidthArr[3])+ parseInt(_listTableColWidthArr[4]) );
				_listTableColWidthArr[5] = sixWidth;
				
                jQuery(headThArr[5]).css("width",sixWidth);
                jQuery(headThArr[5]).width(sixWidth);
                                
                trArrObj = jqTrObj[0].children;
                
                //May have no data in some case
                if(trArrObj && trArrObj[0] && trArrObj[0].children){
                    bodyTdArr = trArrObj[0].children;
                    
                    jQuery(bodyTdArr[0]).css("width",_listTableColWidthArr[0]);
                    jQuery(bodyTdArr[0]).width(_listTableColWidthArr[0]);
                    jQuery(bodyTdArr[3]).css("width",_listTableColWidthArr[3]);
                    jQuery(bodyTdArr[3]).width(_listTableColWidthArr[3]);
                    jQuery(bodyTdArr[4]).css("width",_listTableColWidthArr[4]);
                    jQuery(bodyTdArr[4]).width(_listTableColWidthArr[4]);

                    jQuery(bodyTdArr[1]).css("width",_listTableColWidthArr[1]);
                    jQuery(bodyTdArr[1]).width(_listTableColWidthArr[1]);
                    jQuery(bodyTdArr[2]).css("width",_listTableColWidthArr[2]);
                    jQuery(bodyTdArr[2]).width(_listTableColWidthArr[2]);
					
					sixWidth = bodyWidth - ( parseInt(_listTableColWidthArr[0]) + parseInt(_listTableColWidthArr[1]) + parseInt(_listTableColWidthArr[2]) +
											parseInt(_listTableColWidthArr[3])+ parseInt(_listTableColWidthArr[4]) );
					_listTableColWidthArr[5] = sixWidth;
					
                    jQuery(bodyTdArr[5]).css("width",sixWidth);
                    jQuery(bodyTdArr[5]).width(sixWidth);                                                                   
                }
            }            
        }
    };
    
    this.sumFiveWidth = function (thWidthArr){
                
        var tmpFive = 0;
        if(thWidthArr && thWidthArr.length>0){
            for(var idx=0; idx<thWidthArr.length; idx++){
                if(idx!==5){
                    tmpFive += parseInt(thWidthArr[idx]);
                }    
            }
        }
        return tmpFive;
    };
    
    this.sumSixWidth = function (thWidthArr){        
        var tmp = 0;
        if(thWidthArr && thWidthArr.length>0){
            for(var idx=0; idx<thWidthArr.length; idx++){                
                tmp += parseInt(thWidthArr[idx]);                    
            }
        }
        return tmp;
    };
    
    /**
     * For the west resize from wide to narrow.
     *
     * @returns {undefined}
     */
    this.resizeWestNarrow = function(){                       
        var headerDiv = self.getTheadDiv();
        var bodyDiv = self.getTbodyDiv();
        var bodyWidth = jQuery(bodyDiv).width();                
        
        var tbodyObj = self.getTbodyObj();
        var jqTrObj ;
        
        var trArrObj ;
        var bodyTdArr ;
        
        var headerTable = self.getHeaderTable();                
        var headThArr = jQuery(headerTable).find('thead tr th');        
        var headObj = self.getTheadObj();
        
        if(headObj){
            var headThArr = jQuery(headObj).find("th");
            if(headThArr && headThArr.length===6){                
                //_listTableColWidthArr = self.resizeByRules(_listTableColWidthArr, jQuery(self.getZoneList()).width());                                
                //These number is try/error to fix the width issue on m=
                jQuery(headThArr[0]).css("width", _listTableColWidthArr[0]+30);
                jQuery(headThArr[1]).css("width", _listTableColWidthArr[1]-60);
                jQuery(headThArr[2]).css("width", _listTableColWidthArr[2]-50);
                jQuery(headThArr[3]).css("width", _listTableColWidthArr[3]-10);
                jQuery(headThArr[4]).css("width", _listTableColWidthArr[4]-10 );
                jQuery(headThArr[5]).css("width", _listTableColWidthArr[5]-50 );
            }            
            
        }
        
        if(tbodyObj){
            jqTrObj = jQuery(tbodyObj);            
            if(jqTrObj && jqTrObj[0] && jqTrObj[0].children){                
                //Couldn't update the width directly, record the TH width, then set the TD width.
                //The firefox, IE11, chrome have different width-diff, may need to re-count the width for them.
                var thWidthArr = [];
                for (var thIdx = 0; thIdx < headThArr.length; thIdx++) {
                    //Check and resize the 1st column
                    if(thIdx===0){                                    
                        jQuery(headThArr[thIdx]).css("width","24");
                        jQuery(headThArr[thIdx]).width("24");                        
                        thWidthArr.push(24);                       
                    }else{
                        thWidthArr.push(jQuery(headThArr[thIdx]).width());
                    }
                }                
                               
                thWidthArr = _listTableColWidthArr;                                                
                
                trArrObj = jqTrObj[0].children;
                
                //May have no data in some case
                if(trArrObj && trArrObj[0] && trArrObj[0].children){
                    bodyTdArr = trArrObj[0].children;
                    
                    //Set body td width
                    for (var tdIdx = 0; tdIdx < bodyTdArr.length; tdIdx++) {
                        if(tdIdx===0){
                            jQuery(bodyTdArr[tdIdx]).width(24);        
                        }else{
                            jQuery(bodyTdArr[tdIdx]).width(thWidthArr[tdIdx]);        
                        }                        
                    }    

                    var tdWidthArr = [];
                    for (var tdIdx = 0; tdIdx < bodyTdArr.length; tdIdx++) {
                        if(tdIdx===0){
                            tdWidthArr.push(24);
                        }else{
                            tdWidthArr.push(jQuery(bodyTdArr[tdIdx]).width());    
                        }
                        
                    }

                }
            }
            
        }
    };
    
    /**
     * 1st Media check box    : Fix 24
     * 2nd Media name         : Min 140
     * 3rd Description        : Min 140
     * 4th Duration           : Min 140
     * 5th Total Elapsed Tiome: Min 140
     * 6th Transition Effect  : Min 315
     * Sum: 900
     * More than 900 and less than 900 adapt the differernt rules.
     * 
     * @param {type} thWidthArr
     * @param {type} listViewWidth The current list view width.
     * @returns {array} thWidthArr
     */
    this.resizeByRules = function(thWidthArr, listViewWidth){
        
        if(thWidthArr && thWidthArr.length>0 && thWidthArr.length===6){
            var sumWidth = 0;
            for(var idx=0; idx<thWidthArr.length; idx++){
                sumWidth += thWidthArr[idx];
            }
            var tmpDiff = 0;
            
            for(var idx=0; idx<thWidthArr.length; idx++){
                switch(idx){
                    case 0:
                        if(thWidthArr[idx]!==24){
                            thWidthArr[idx] = 24;
                        }
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        if(thWidthArr[idx]<140){                         
                            tmpDiff = 140 - thWidthArr[idx];
                            thWidthArr[idx] = 140;
                            
                            if(tmpDiff>(thWidthArr[5]-315)){
                                thWidthArr[5] = thWidthArr[5] -tmpDiff;
                            }else{
                                thWidthArr[2] = thWidthArr[2]-tmpDiff;
                            }
                            
                        }
                        break;
                    case 4:
                        if(thWidthArr[idx]<140){
                            tmpDiff = 140 - thWidthArr[idx];
                            thWidthArr[idx] = 140;
                            
                            if(tmpDiff>(thWidthArr[5]-315)){
                                thWidthArr[5] = thWidthArr[5] -tmpDiff;
                            }else{
                                thWidthArr[2] = thWidthArr[2]-tmpDiff;
                            }
                        }
                        break;
                    case 5:
                        if(thWidthArr[idx]<315){
                            tmpDiff = 315 - thWidthArr[idx];
                            thWidthArr[idx] = 315;
                            thWidthArr[2] = thWidthArr[2]-tmpDiff;
                        }
                        break;
                    default:
                        break;
                }//end switch
            }//end for
        }
        return thWidthArr;
    };
    /**
     * The width logic by browser.
     * @param {type} thWidthArr
     * @param {type} hasScroll
     * @param {type} bodyWidth
     * @returns thWidthArr new width of table array.
     */
    this.resizeByBrowser = function(thWidthArr, hasScroll, bodyWidth){
        
        //chrome
        if(isChrome){
            thWidthArr = self.reviseWidthForChrome(thWidthArr,hasScroll,bodyWidth);
        }
        
        
        //IE11 
        if(isIE){
            thWidthArr = self.reviseWidthForIE(thWidthArr,hasScroll,bodyWidth);
        }
        
        //firefox - mozilla = true , version=45;
        if(isFirefox){
            thWidthArr = self.reviseWidthForFF(thWidthArr,hasScroll,bodyWidth);
        }
        
//        if(isEdge){
//            
//        }
    
        return thWidthArr;
    };
    
//    this.reCountColTwoScroll = function(){
//        
//    }
    
    /**
    * @param {type} thWidth description
    * @param {type} bodyWidth description
    */
    this.reCountColTwoNoScrollByPercentage = function(thWidth, bodyWidth){
        var rtnWidth = 4;                
        var num = new Number(thWidth*100 /bodyWidth);
        var rtnPercentage = num.toFixed(3);
        
        //100  460 1000
        // -2   -4   -6
        //Between this, the width of table column keep fine
        if(thWidth>410 && thWidth<510){
            rtnWidth = 4;
        }else if(thWidth>460){
            rtnWidth = 4 + ( 5.5 * ( (parseInt(thWidth)-460) / (1000-460) ) ); 
        }else{
            rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnPercentage;
    };
    /**
    * The 2nd column without scroll.
    * The default adjusting width is -4.
    *
    */
    this.reCountColTwoNoScroll = function(thWidth){
        var rtnWidth = 4;
        //100  460 1000
        // -2   -4   -6
        //Between this, the width of table column keep fine
        if(thWidth>410 && thWidth<510){
            rtnWidth = 4;
        }else if(thWidth>460){
            rtnWidth = 4 + ( 5.5 * ( (parseInt(thWidth)-460) / (1000-460) ) ); 
        }else{
            rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountChromeColTwoScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        //100  460 1000
        // -2   -4   -6
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        }else if(colWidth<290 && colWidth>160){
            rtnWidth += 5;
        }else if(colWidth>400){
            rtnWidth += (-2);
            //rtnWidth = 4 + ( 5.5 * ( (parseInt(thWidth)-460) / (1000-460) ) ); 
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountChromeColThreeScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        }else if(colWidth<400 && colWidth>300){
            rtnWidth += 0;
        }else if(colWidth<500 && colWidth>400){
            rtnWidth += -3;
        }else if( colWidth<600 && colWidth>500){    
            rtnWidth += -5;
        }else if( colWidth<700 &&  colWidth>600){
            rtnWidth += -9;
        }else if( colWidth<800 && colWidth>700){
            rtnWidth += -10;
        }else if( colWidth>800){
            rtnWidth += -12;
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountChromeColFourScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        }else if(colWidth<300 && colWidth>160){
            rtnWidth += 2;
        }else if(colWidth<500 && colWidth>400){
            rtnWidth += -2;
        }else if( colWidth<600 && colWidth>500){    
            rtnWidth += -3.5;
        }else if( colWidth<700 &&  colWidth>600){
            rtnWidth += -5.5;
        }else if( colWidth<800 && colWidth>700){
            rtnWidth += -8;
        }else if( colWidth>800){
            rtnWidth += -10;
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountChromeColFiveScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        }else if(colWidth<300 && colWidth>160){
            rtnWidth += 2;
        }else if(colWidth<500 && colWidth>400){
            rtnWidth += -3;
        }else if( colWidth<600 && colWidth>500){    
            rtnWidth += -4;
        }else if( colWidth<700 &&  colWidth>600){
            rtnWidth += -6;
        }else if( colWidth<800 && colWidth>700){
            rtnWidth += -9;
        }else if( colWidth>800){
            rtnWidth += -11;
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
       
        return rtnWidth;
    };
    
    this.reCountChromeColSixScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        
        }
        
        return rtnWidth;
    };
    
    this.reCountIEColTwoScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4.5;
        }else if(colWidth<290 && colWidth>160){
            rtnWidth += 1;
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountIEColThreeScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4.5;
        }else if(colWidth<290 && colWidth>160){
            rtnWidth += 1;
        }else if(colWidth<500 && colWidth>400){
            rtnWidth += -1;
        }else if( colWidth<600 && colWidth>500){    
            rtnWidth += -2;
        }else if( colWidth<700 &&  colWidth>600){
            rtnWidth += -3;
        }else if( colWidth<800 && colWidth>700){
            rtnWidth += -4;
        }else if( colWidth>800){
            rtnWidth += -5;
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountIEColFourScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        }else if(colWidth<290 && colWidth>160){
            rtnWidth += 1;
        }else if(colWidth<500 && colWidth>400){
            rtnWidth += -2;
        }else if( colWidth<600 && colWidth>500){    
            rtnWidth += -3.5;
        }else if( colWidth<700 &&  colWidth>600){
            rtnWidth += -5.5;
        }else if( colWidth<800 && colWidth>700){
            rtnWidth += -8;
        }else if( colWidth>800){
            rtnWidth += -10;
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountIEColFiveScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        
        }else if(colWidth<500 && colWidth>400){
            rtnWidth += -2;
        }else if( colWidth<600 && colWidth>500){    
            rtnWidth += -3.5;
        }else if( colWidth<700 &&  colWidth>600){
            rtnWidth += -4;
        }else if( colWidth<800 && colWidth>700){
            rtnWidth += -8;
        }else if( colWidth>800){
            rtnWidth += -10;
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    this.reCountFFColSixScroll = function(colWidth,defDiff){
        var rtnWidth = defDiff;
        
        //Between this, the width of table column keep fine
        if(colWidth <= 160){
            rtnWidth += 4;
        
        }else{
            //rtnWidth = 2 * ( (parseInt(thWidth)-460) / (460-100) ); 
        }
        
        return rtnWidth;
    };
    
    /**
    * Change the width of each elements for chrome.
    * With scroll or without scroll have different width.
    * NOTE: The width percentage will be changed on the short or long number. 
    */
    this.reviseWidthForChrome = function(thWidthArr,hasScroll, bodyWidth){
        
        if(thWidthArr && thWidthArr.length>0){
            
            var tblWidth = 0;
            
            for(var idx=0 ; idx<thWidthArr.length; idx++){
                tblWidth += parseInt(thWidthArr[idx]);
            }
                
            //reset the width
            var sumFive = 0;
            
            for(var idx=0 ; idx<thWidthArr.length; idx++){
                
                var rtnColWidth;
                switch(idx){
                    case 0:
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+3;
                        if(thWidthArr[idx]<24){
                            thWidthArr[idx] = 24;
                        }
                        sumFive += thWidthArr[idx];
                        break;
                    case 1:
                        thWidthArr[idx] = parseInt(thWidthArr[idx]+ self.reCountChromeColTwoScroll(thWidthArr[idx], -0.2) );
                        sumFive += thWidthArr[idx];
                        break;
                    case 2:
                        thWidthArr[idx] = parseInt(thWidthArr[idx]+ self.reCountChromeColThreeScroll(thWidthArr[idx], 0) );
                        sumFive += thWidthArr[idx];
                        break;
                    case 3:
                        thWidthArr[idx] = parseInt(thWidthArr[idx]+ self.reCountChromeColFourScroll(thWidthArr[idx], -0.2) );
                        sumFive += thWidthArr[idx];
                        break;
                    case 4:
                        thWidthArr[idx] = parseInt(thWidthArr[idx]+ self.reCountChromeColFiveScroll(thWidthArr[idx], -0.1) );
                        sumFive += thWidthArr[idx];
                        break;
                    case 5:
                        thWidthArr[idx] = tblWidth - sumFive;
                        thWidthArr[idx] = parseInt(thWidthArr[idx]+ self.reCountChromeColSixScroll(thWidthArr[idx], 0) );
                        break;
                    default:
                        break;
                }
            }
        }
        
        return thWidthArr;
    };
    
    /**
     * 
     * @param {type} thWidthArr
     * @param {type} hasScroll
     * @param {type} bodyWidth
     * @returns Array thWidthArr The header width array
     */
    this.reviseWidthForIE = function(thWidthArr,hasScroll, bodyWidth){
        
        var tblWidth = 0;
            
        for(var idx=0 ; idx<thWidthArr.length; idx++){
            tblWidth += parseInt(thWidthArr[idx]);
        }

        var sumFive = 0;                        
        if(thWidthArr && thWidthArr.length>0){
            
            for(var idx=0 ; idx<thWidthArr.length; idx++){
                switch(idx){
                    case 0:                        
                        thWidthArr[idx] = 24;                                                
                        sumFive += thWidthArr[idx];
                        break;
                    case 1:
                        //thWidthArr[idx] = parseInt(thWidthArr[idx] + self.reCountIEColTwoScroll(thWidthArr[idx], -1 ) );
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+5;
                        sumFive += thWidthArr[idx];
                        break;
                    case 2:
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+7;
                        //thWidthArr[idx] = parseInt( thWidthArr[idx] + self.reCountIEColThreeScroll(thWidthArr[idx], -0.5 ) );                        
                        sumFive += thWidthArr[idx];
                        break;
                    case 3:
                        //thWidthArr[idx] = parseInt(thWidthArr[idx])-0.5;
                        //thWidthArr[idx] = parseInt( thWidthArr[idx] + self.reCountIEColFourScroll(thWidthArr[idx], -1 ) );
                        
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+7;
                        
                        sumFive += thWidthArr[idx];
                        break;
                    case 4:
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+5;
                        //thWidthArr[idx] = parseInt( thWidthArr[idx] + self.reCountIEColFiveScroll(thWidthArr[idx], -0.5 ) );
                        sumFive += thWidthArr[idx];
                        break;
                    case 5:
                        //All the other width gives the 5th
                        thWidthArr[idx] = tblWidth - sumFive;
                        break;
                    default:
                        break;
                }
            }
        }
        
        return thWidthArr;
    };
    
    /**
    * Adjust the width for Firefox
    */
    this.reviseWidthForFF = function(thWidthArr,hasScroll,bodyWidth){
        
        var tblWidth = 0;
            
        for(var idx=0 ; idx<thWidthArr.length; idx++){
            tblWidth += parseInt(thWidthArr[idx]);
        }

        var sumFive = 0;
        
        
        var tmp = 140;
        
        if(thWidthArr && thWidthArr.length>0){
            for(var idx=0 ; idx<thWidthArr.length; idx++){
                switch(idx){
                    case 0:
                        
                        thWidthArr[idx] = 24;                        
                        
                        sumFive += thWidthArr[idx];
                        break;
                    case 1:
                                                
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+4;
                        
                        
                        sumFive += thWidthArr[idx];
                        break;
                    case 2:

                        thWidthArr[idx] = parseInt(thWidthArr[idx])+3;    
                        
                        sumFive += thWidthArr[idx];
                        break;
                    case 3:
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+4;
                        sumFive += thWidthArr[idx];
                        break;
                    case 4:
                        thWidthArr[idx] = parseInt(thWidthArr[idx])+4;
                        sumFive += thWidthArr[idx];
                        break;
                    case 5:
                        //All the other width gives the 5th                        
                        thWidthArr[idx] = tblWidth - sumFive - _listTableScrollWidth;
                        break;
                    default:
                        break;
                }
            }
        }
        
        return thWidthArr;
    };
    
    /**
    * This function is for fixing jQuery UI resize issue.
    * Just resize the current and the next th td object.
    * Fix the width of 1st check box.
    * @param {type} thObjId description
    * @param {type} thObjWidth description
    */
//    this.resizeListTableByTh = function(thObjId, thObjWidth){
//        //jQuery("#tblNeedsScrolling th").each(function(index){
//            //var thObj = jQuery(this);
//            
//            var thIdArr;
//            var thSeq="";
//            var widthDiff = "";
//            var targetTdWidth = "";
//            var thWidthArr = [];
//            
//            //Get the name field
//            var nameFieldMaxWidth = self.getMaxNameFieldWidth();
//            
//        
//            //Get the class id
//            if(thObjId){
//                thIdArr = thObjId.split("-");
//                if(thIdArr && thIdArr.length===3){
//                    thSeq = thIdArr[2];    
//                }
//            }
//                        
//            //Collect the original width array, this is the original width array
//            //jQuery("#tblNeedsScrolling td").each(function(idxTd){    
//            jQuery("#tblNeedsScrolling td").each(function(idxTd){    
//                var tdObj = jQuery(this);
//                thWidthArr.push(tdObj.width());
//                if(idxTd===5){
//                    return false;
//                }
//            });                                         
//            
//            //Count width
//            //jQuery("#tblNeedsScrolling td").each(function(idxTd){
//            jQuery("#tblNeedsScrolling td").each(function(idxTd){
//                var tdObj = jQuery(this);                
//                
//                //One row has 6 columns
//                if(thSeq===1){                    
//                    tdObj.css("width","20");
//                }else if(thSeq === ((idxTd+1) % 6)){
//                    
//                    
//                    var diffWidth = 0;
//                   if(thSeq===2){//name
////                        
////                        //Set the min width rule by getting the max length of name fields.
//                        if(nameFieldMaxWidth>0 && nameFieldMaxWidth>_listTableMinColWidth[1]){
//                            thObjWidth = nameFieldMaxWidth+3;
//
//                        }
//
//                   }//end if(thSeq==2)
//                    
//                    
//                    
//                    tdObj.css("width",thObjWidth);
//                    
//                }                        
//            });
//            
//            //jQuery("#tblNeedsScrolling th").each(function(idxTh){
//            jQuery("#tblNeedsScrolling th").each(function(idxTh){
//                var thObj = jQuery(this);
//                var thObjWidth = thWidthArr[idxTh];
//                //Fix the different width caused by the scroll 
//                if(idxTh===0){
//                    thObjWidth = parseInt(thObjWidth)+3;
//                }else if(idxTh===5){
//                    thObjWidth = parseInt(thObjWidth)+21;
//                }
//                thObj.css("width",thObjWidth);
//            });
//            //})
//        //})
//    };
    
    /**
    * The max length of all name fields, the width couldn't be smaller than this number.
    * There is one more than the other, use it.
    * All are the same , maxLength will be '0', skip it.
    */
    this.getMaxNameFieldWidth = function(){
        var maxWidth = 0;
        var idxCnt = 0;
        var idxNameTmp=0;
        
        var tmpWidth = 0;
        var allTheSame = false;
        //check all the same
        jQuery(".mlt-media-name-field").each(function(idxName){
            var nameObj = jQuery(this);
            if(tmpWidth === 0){
                tmpWidth = nameObj.width();
            }else{
                if(tmpWidth === nameObj.width()){
                    allTheSame = true;
                }else{
                    allTheSame = false;
                    return false;
                }
            }
        });
            
        if(allTheSame === true){
            return 0;
        }
        
        jQuery(".mlt-media-name-field").each(function(idxName){
            var nameObj = jQuery(this);
            
            if(nameObj.width() > maxWidth){
                maxWidth = nameObj.width();
            }else if(nameObj.width() === maxWidth ){
                idxCnt++;
            }
            idxNameTmp = idxName;
        });

        return maxWidth;
    };
    
    
    /**
    * Check or uncheck all media.
    * @param blnChecked - true check all media.
    */
    this.checkAllMedia = function(blnChecked){
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
                
        if(scrollTbl && scrollTbl[1]){
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var childBody = jQuery(tblBodyObj[0]);
            
            if(childBody && childBody[0]){
                jQuery(childBody[0]).find("input[name=chkMedia]").each(function( indexOut, obj ) {
                    jQuery(this).prop("checked", blnChecked);
                });
            }
        }
                                
//        jQuery( "input[name=chkMedia]" ).each(function(index){
//            jQuery(this).prop("checked", blnChecked);
//        });    
    };
    
    this.unclassAllMedia = function(){
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
        
        //2 table, get the 2nd
        if(scrollTbl && scrollTbl[1]){
            
            //Load media list table with data, 2 body , get the 2nd
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var childBody = jQuery(tblBodyObj[0]);
            
            if(childBody && childBody[0]){
                try{
                    var firstObj = jQuery(childBody[0]).first();
                    var trArr = jQuery(firstObj[0]).children("tr");
                    if(trArr && trArr.length>0){
                        for(var idx=0; idx<trArr.length ; idx++){
                            if(trArr[idx] && trArr[idx].hasClassName && trArr[idx].hasClassName("ui-state-highlight")){
                                trArr[idx].removeClassName("ui-state-highlight");   
                            }
                        }
                    }
                }catch(err){
                    console.log(err);
                }
            
            }//if(childBody && childBody[0]){
        }                
    };
    
	/**
	* Unselect all media of the thumbnail view.
	*/
	this.unSelectAllThumbMedia = function(){
		console.log("unSelectAllThumbMedia!");
		if(_zoneMediaView){
			_zoneMediaView.unselectAll();
		}
	}
    /**
    * Keep or remove the data by json array.
    * @param {type} jsonArr description
    */
    this.refreshByJson = function(jsonArr){
        var removedMediaMap = new Object();
        if(jsonArr && jsonArr.length>0){
            //var targetDivObj = jQuery('#'+attrsObj.divId);
            var targetDivObj = _zoneContentListView;
            if(targetDivObj){
                try{
                    //var childObj = targetDivObj.children("#tblNeedsScrolling");
                    var childObj = targetDivObj.children("#tblNeedsScrolling");
                    var childBody = childObj.children("tbody");
                    var childTrArr = childBody.children("tr");
                    //Get the table
                    if(childTrArr && childTrArr.length>0){
                        for(var tIdx=0; tIdx<childTrArr.length; tIdx++){
                            var childrenTrObj = childTrArr[tIdx];                            
                            var existedInJson = false;                            
                            var childTdNodesArr = childrenTrObj.childNodes;
                            
                            if(childTdNodesArr && childTdNodesArr.length>0){
                                
                                //for(var idxTd=0;idxTd<childTdNodesArr.length; idxTd++){
                                    var childTd = childTdNodesArr[0];

                                    if(childTd && childTd.firstElementChild){
                                        
                                        var mediaId = childTd.firstElementChild.id;
                                        var mediaSeq = childTd.firstElementChild.value;
                                        
                                        
                                        existedInJson = false;
                                        for(var jsonIdx=0; jsonIdx<jsonArr.length; jsonIdx++){
                                            var mediaObj = jsonArr[jsonIdx];
                                            if(mediaObj && mediaObj.mediaid && mediaObj.mediaid==mediaId &&
                                               mediaObj.sequence && mediaObj.sequence==mediaSeq ){
                                                existedInJson = true;
                                                break;
                                            } 
                                        }
                                
                                        if(existedInJson==false && mediaId && mediaId.trim().length>0){//remove it
                                            //childrenTrObj.remove();
                                            if(!removedMediaMap.hasOwnProperty("mediaSeq")){
                                                removedMediaMap[mediaSeq] = mediaId;    
                                            }
                                        }
                                    }
                                    
                                    //do once
                                    //break;
                                //}//end for(var idxTd=0;idxTd<childTdNodesArr.length; idxTd++)
                            }
                        }//end for    
                    }    
                }catch(err){
                    console.log(err);
                }
            }//end if (targetDivObj)   
            
        }//end if(jsonArr && jsonArr.length>0)
        return removedMediaMap;
    };
    
    this.getCheckedValue = function(checkBoxName){
       return jQuery('input:checkbox[name=' + checkBoxName + '][checked=true]').map(function (){
         return $(this).val();}).get().join(',');
    };
    
    /**
     * Initialize the table header html string.
     * @returns {String} The table header html string
     */
    this.initLisTableHeader = function(){
        var tableHeades = tableHeades += '<thead>';
        tableHeades += '<tr class="mediaTableHeader">';
        
        tableHeades += '<th width="'+_listTableColWidthArr[0]+'" class="mediaTableHeaderChk" id="column-header-1" ';
        tableHeades += 'align="center" valign="center">';
        tableHeades += '<input type="checkbox" id="chkMaster"></th>';
        
        tableHeades += '<th align="center" width="'+_listTableColWidthArr[1]+'" class="mediaTableHeaderTh resizeTd" id="column-header-2">'+
            '<b>Media Name</b></th>';
        
        tableHeades += '<th><b>Description</b></th>';
        
        tableHeades += '<th><font color="red">*</font></b><b>Duration</b></th>';
        
        tableHeades += '<th align="center" width="'+_listTableColWidthArr[4]+'" class="mediaTableHeaderTh resizeTd" id="column-header-5">'+
            '<b>Total Elapsed Time</b></th>';
        
        tableHeades += '<th><b>Transition Effect/Duration</b></th>';
        
        tableHeades += '</tr>';
        tableHeades += '</thead>';
        
        return tableHeades;
    };                        
    
    /**
     * 
     * @returns {String}
     */
    this.initMediaListTableHeader = function(){
        
        var tableHeades = '\t\t<thead id="sortableHead"><tr class="mediaTableHeader">\n';
        
            
            //Mapping the 1st check master box to general check box
            //tableHeades += '\t\t\t<th width="'+(parseInt(_listTableColWidthArr[0])+2)+'" class="mediaTableHeaderChk" id="column-header-1" align="center">\n';
            //tableHeades += '\t\t\t<th width="'+_listTableColWidthArr[0]+'" class="mediaTableHeaderChk" id="column-header-1" align="center">\n';
            tableHeades += '\t\t\t<th width="35" class="mediaTableHeaderChk" id="column-header-1" align="center">\n';
            tableHeades += '\t\t\t<input type="checkbox" id="chkMaster">\n';
            tableHeades += '\t\t\t</th>\n';
				
            tableHeades += '\t\t\t<th align="center" width="'+_listTableColWidthArr[1]+'" class="mediaTableHeaderTh resizeTd" id="column-header-2" >\n';
            tableHeades += '\t\t\t<b>Media Name</b>\n';
            tableHeades += '\t\t\t</th>\n';
        
            tableHeades += '\t\t\t<th align="center" width="'+_listTableColWidthArr[2]+'" class="mediaTableHeaderTh resizeTd" id="column-header-3" >\n';
            //tableHeades += '<div>';	
            tableHeades += '\t\t\t<b>Description</b>\n';
            //tableHeades += '</div>';    
            tableHeades += '\t\t\t</th>\n';
        
            tableHeades += '\t\t\t<th align="center" width="'+_listTableColWidthArr[3]+'" class="mediaTableHeaderTh resizeTd" id="column-header-4" >\n';
            //tableHeades += '<div>';	    
            tableHeades += '\t\t\t<font color="red">*</font></b><b>Duration</b>\n';
            //tableHeades += '</div>';    
            tableHeades += '\t\t\t</th>\n';
        
            tableHeades += '\t\t\t<th align="center" width="'+_listTableColWidthArr[4]+'" class="mediaTableHeaderTh resizeTd" id="column-header-5">\n';
            //tableHeades += '<div>';	
            tableHeades += '\t\t\t<b>Total Elapsed Time</b>\n';
            //tableHeades += '</div>';
            tableHeades += '\t\t\t</th>\n';
				
            tableHeades += '\t\t\t<th align="center" class="mediaTableHeaderTh resizeTd" id="column-header-6" width="' +_listTableColWidthArr[5] + '" >';
            //tableHeades += '\t\t\t<th align="center" class="mediaTableHeaderTh resizeTd" id="column-header-6" width="30.5%" >';
            //tableHeades += '<div>';	
            tableHeades += '\t\t\t<b>Transition Effect/Duration</b>\n';
            //tableHeades += '</div>';
            tableHeades += '\t\t\t</th>\n';
        
            tableHeades += '\t\t</tr></thead>\n';
				//'\t</table>\n';
        
        return tableHeades;
    };//end initMediaListTableHeader
    
   
    
    /** 
    * Suppose it could get the media list then loop it. 
    * '\n' may causes the dom childNodes issue, don't add it.
    * @param {type} transitionComboData description
    */
	this.initMediaListData = function(transitionComboData){
        //var zoneMediaArr = attrsObj.zoneMedias;
		var desc = "DESC";
        var duration = "Duration";
        var elapsedTime = "1";
        var transitionEffect = "None";
        var transitionDuration = "0";
		var mediaName = "";
		var mediaid;
		var medialength;
		var sequence = "";
		//var zoneid = "";
		var selected = false;
		var tableContent = "";
        var playlistid;
        //The check box selected flag
		var checkedStr = "";
		var transitionduration;
		var transition;
        var tmpElapsedTime = 0;
		
		
		if(_localZoneMedias && _localZoneMedias.length>0){
			
			//tableContent += '<ul id="sortable">' ;
			tableContent += '<tbody id="tableTbody">\n';
            
            /*
            * Row 1 and 2 with style background
            */
            var trStyle1 =' bgcolor="white" ';
            var trStyle2 =' bgcolor="#e9e9e9" ';
            var trStyle = '';
            
			for(var idx = 0; idx<_localZoneMedias.length; idx++){
                trStyle = ' style="border-right:1px solid grey" ';
                if( (idx+1)%2 === 1){
                    trStyle += trStyle1;
                }else{
                    trStyle += trStyle2;
                }
                
				if(_localZoneMedias[idx]){
					sequence = _localZoneMedias[idx].sequence;
					selected = _localZoneMedias[idx].$selected;
					medialength = _localZoneMedias[idx].medialength;
                    playlistid = _localZoneMedias[idx].playlistid;
                    
                    this.zoneId = _localZoneMedias[idx].zoneid;
                    
					checkedStr = selected ? 'checked': '';
                    transition = _localZoneMedias[idx].transition;
					transitionduration = _localZoneMedias[idx].transitionduration;
                    
                    
                    
					if(_localZoneMedias[idx].media){
                        //this.zoneId = zoneMediaArr[idx].media.zoneid; 
						mediaName = _localZoneMedias[idx].media.name;
                        mediaid = _localZoneMedias[idx].media.mediaid;
                        desc = _localZoneMedias[idx].media.description;
					}
				}
				
                
                //tableContent += '<table width="'+_listTableWidth+'" height="100%" border="0.5" class="mediaTableBody">' ;
                tableContent += '<tr valign="center" class="ui-state-default">';
				
                //tableContent += '<td width="'+_listTableColWidthArr[0]+'" class="mediaTableHeaderTdRight" align="center" valign="center">';
				tableContent += '<td width="'+_listTableColWidthArr[0]+'" class="mediaListableTdChk" align="center" valign="center" '+trStyle+' >';
				//tableContent += '<div style="resize:both;">';
                tableContent += '<input type="checkbox" name="chkMedia" id="'+ mediaid +'" value="'+ sequence +'" ' ;
                tableContent += ' originalValue="'+ sequence +'" ' + checkedStr + ' >';
                //tableContent += '</div>';
				tableContent += '</td>';
				
                tableContent += '<td align="left" width="'+_listTableColWidthArr[1]+'" class="mediaTableHeaderTdRight resizeTd" ';
                tableContent += ' title="'+ mediaName + '" '; 
                tableContent += trStyle+' >';
                tableContent += '<p class="mlt-media-name-field resizeTableTdText" style="cursor: hand;">';
                tableContent += mediaName ; //  + ' '+ mediaid ; //for test
                //tableContent += '<img src="pic_mountain.jpg" alt="Mountain View" ><a href="">xxx.jpg or media</a>';
                tableContent += '</p></td>';
				
                tableContent += '<td align="left" width="'+ _listTableColWidthArr[2] +'" class="mediaTableHeaderTdRight resizeTd" ';
                tableContent += ' title="'+ desc + '" '; 
                tableContent += trStyle + ' >';
                tableContent += desc ;
                tableContent += '</td>';
				
                tableContent += '<td width="'+_listTableColWidthArr[3]+'" align="left" class="mediaTableHeaderTdRight resizeTd" '+trStyle+' >' ;
                tableContent += this.formatMediaTime(medialength) ;
                tableContent += '</td>' ;
				
                tableContent += '<td width="'+_listTableColWidthArr[4]+'" align="left" class="mediaTableHeaderTdRight resizeTd" '+trStyle+' >' ;
                tableContent += this.formatMediaTime(tmpElapsedTime) ;                
                tableContent += '</td>';
				
                tableContent += '<td width="'+_listTableColWidthArr[5]+'" align="left">' ;
				//tableContent += '<td align="left" '+trStyle+' class="resizeTd" >' ;
                //tableContent += '<div>';
                tableContent +=     this.getTransitionEffectCombo(transition,transitionComboData);
                tableContent += '&nbsp;';
                tableContent +=     this.getDurationCombo(transition, transitionduration ) + 's' ;
                //tableContent += '<div>';
                tableContent += '</td>';
				
                tableContent += '</tr>';
                
                tmpElapsedTime += medialength;
			}//end for(var idx = 0; idx<zoneMediaArr.length; idx++)
			
            tableContent += '</tbody>\n';
		}	
        
        return tableContent;
    };//end initMediaListData
    
    /**
    * Handle the none transition to change the selected seconds combo.
    */
    this.lockComboxNone = function(){
        jQuery('.mlt-media-transition-combo').each(function(indexOut, obj){   
            var transitionObj = jQuery(this);
            jQuery('.mlt-media-transition-combo-second').each(function(idxSed, objIn){  
                
                if( indexOut === idxSed ){
                    if(transitionObj){
                        if(transitionObj.val() === 0){
                            
                            jQuery(this).val("0");
                            jQuery(this).prop("disabled", true);
                        }
                    }
                }
            });
            
            
        });
    };//end this.lockComboxNone
    
    /**
    * Group by the transition related events.
    */
    this.attachTransitionEvents = function(){
        self.attachTransitionComboClickEvent();
            
        self.attachTransitionComboChangeEvent();

        self.attachTransitionComboSecondClickEvent();

        self.attachTransitionDurationComboChangeEvent();
    };
    
    
    /**
    * Handle the change event to update the media transition data.
    */
    this.attachTransitionComboChangeEvent = function(){                        
        var scrollTbl = self.getBodyTable();                
        
        if(scrollTbl){
            //var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            //var childBody = jQuery(tblBodyObj[0]);
            var childBody = self.getTbodyObj();
            
            if(childBody){
                jQuery(childBody).find(".mlt-media-transition-combo").each(function( indexOut, obj ) {                                                            
                    jQuery(this).on( "change", function(event) {
                
                        var transitionObj = jQuery(this);

                        var mediaId = jQuery(this).attr("mediaId");
                        var seq = jQuery(this).attr("sequence");
                        var selectedVal = jQuery("option:selected",transitionObj).text();
                        
                        jQuery(childBody).find('.mlt-media-transition-combo-second').each(function(idxSed, objIn){                              
                            
                            var durationMediaId = jQuery(this).attr("mediaId");
                            var durationMediaSeq = jQuery(this).attr("sequence");
                            
                            if( ( durationMediaId == mediaId) && (seq == durationMediaSeq) ){
                                if(transitionObj){
                                    
                                    if(transitionObj.val() && parseInt(transitionObj.val()) === 0){ 
                                        
                                        jQuery(this).val("0");
                                        jQuery(this).prop("disabled", true);
                                    }else{
                                        
                                        jQuery(this).prop("disabled", false);                                                  
                                        jQuery(this).val("3");
                                    }

                                    var transition = transitionObj.val();
                                    var transitionduration = jQuery(this).val();
                                    //Update local media & thumbnail
                                    self.updateMediaTransition(idxSed, transition, transitionduration);
                                    //Update localStorage
                                    self.updateMostRecent(transition, selectedVal);
                                    
                                    
                                    return false; //break the loop
                                }
                            }
                        });

                    });//end bind( "change"
                });//jQuery(childBody[0]).find
            }//end if(childBody)
        }
        
    };//end this.attachTransitionComboClickEvent
    
    /**
    * Handle the change event to update the media transition data.
    */
    this.attachTransitionDurationComboChangeEvent = function(){                            
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
        
        if(scrollTbl && scrollTbl[1]){
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var childBody = jQuery(tblBodyObj[0]);
            
            if(childBody && childBody[0]){
                jQuery(childBody[0]).find(".mlt-media-transition-combo-second").each(function( indexOut, obj ) {                                        
                    var transitionDurationObj;
                    
                    jQuery(this).bind( "change", function(event) {
                
                        var transitionDurationObj = jQuery(this);
                        
                        
                        if(transitionDurationObj){
                            var transition;
                            var transitionduration = jQuery(this).val();
                            //Update local media & thumbnail
                            self.updateMediaTransition(indexOut, transition, transitionduration);

                            return false; //break the loop
                        }
                        
                    });//end bind( "change"
                });//jQuery(childBody[0]).find.each
            }//end if(childBody)
        }//end if(scrollTbl && scrollTbl[1])
    };//end attachTransitionDurationComboChangeEvent

    /**
    * Get the index of the media array.
    * @param oneMedia It's the array index of the _localZoneMedias.
    */
    this.whatIsIndexOfMediaArr = function(oneMedia){
        var rtnIdx = -1;
        if(oneMedia && _localZoneMedias && _localZoneMedias.length>0){
            for(var idx=0; idx<_localZoneMedias.length; idx++){
                var targetMedia = _localZoneMedias[idx];
                if(targetMedia){
                    if(targetMedia.id == oneMedia.id){
                        rtnIdx = idx;
                        break;
                    }
                }
            }
        }
        return rtnIdx;
    };
    
    /**
    * Remove the new media array to the current table.
    * @param mediaIds The selected ID array
    * @param selectedMediaArr The select media object array
    * @param newMediaArr The new full media array.
    */
    this.appendNewMediaArr = function(mediaIds, selectedMediaArr, newMediaArr){
        if(selectedMediaArr && newMediaArr && selectedMediaArr.length>0 && newMediaArr.length>0
          && mediaIds && mediaIds.length>0 ){
            _localZoneMedias = newMediaArr;                        
            //Fix the dragging none issue
            //var transitionCombo = self.getTransitionEffectCombo(-2,transitionComboData);
            //var transitionCombo = self.getTransitionEffectCombo(0,transitionComboData);
            
            //var durationCombo = self.getDurationCombo(0,0);
            //var durationCombo = self.getDurationCombo(-2,-2);
            
            for(var arrIdx=0; arrIdx<mediaIds.length; arrIdx++){                            
                var trHtml = "";
                var arrIndex = -1;
                var mediaId = mediaIds[arrIdx];
                var mediaObj = newMediaArr[mediaId-1];
                
                if(mediaObj){
                    //trHtml = self.printMediaHtmlTr(mediaObj,'',transitionCombo,durationCombo);
                    arrIndex = self.whatIsIndexOfMediaArr(mediaObj);
                    //self.appendMediaTr(trHtml, arrIndex);
                    self.removeMediaTr(arrIndex);
                }
            }
        }
    };
    
    /**
    * Insert the target media tr html.
    * @param {type} arrIndex Media array index.
    */
    this.removeMediaTr = function( arrIndex){
        var scrollTbl = self.getTbodyObj();
        if(scrollTbl && arrIndex>-1){
            var scrollTblTrArr = jQuery(scrollTbl).children();
            if(scrollTblTrArr && scrollTblTrArr.length>0){
                if(scrollTblTrArr[arrIndex] && scrollTblTrArr[arrIndex].remove){
                	scrollTblTrArr[arrIndex].remove();
                }
            }
        }
        
    };
    
    /**
    * Append the new media array to the current table.
    * @param mediaId The selected ID
    * @param selectedMedia The select media object
    * @param mediaArr The full media array.
    */
    this.replaceMedia = function(mediaId, selectedMedia, mediaArr){
        if(selectedMedia && mediaArr && mediaArr.length>0  && mediaId ){
            //Update the local media array
            _localZoneMedias = mediaArr;
            
            //Fix the dragging none issue
            var transitionCombo = self.getTransitionEffectCombo(-2,transitionComboData);
            //var transitionCombo = self.getTransitionEffectCombo(0,transitionComboData);
            
            //var durationCombo = self.getDurationCombo(0,0);
            var durationCombo = self.getDurationCombo(-2,-2);
                        
            var trHtml = "";
            
            var mediaObj = mediaArr[mediaId-1];

            if(mediaObj){
                trHtml = self.printMediaHtmlTr(mediaObj,'',transitionCombo,durationCombo, selectedMedia.id);
                //arrIndex = self.whatIsIndexOfMediaArr(mediaObj);
                self.replaceMediaTr(trHtml, mediaId);
                
            }
            
        }
    };
    
    /**
    * Append the new media array to the current table.
    * @param mediaIds The selected ID array
    * @param selectedMediaArr The select media object array
    * @param newMediaArr The new full media array.
    */
    this.appendNewMediaArr = function(mediaIds, selectedMediaArr, newMediaArr){
        if(selectedMediaArr && newMediaArr && selectedMediaArr.length>0 && newMediaArr.length>0
          && mediaIds && mediaIds.length>0 ){
            //Update the local media array
            _localZoneMedias = newMediaArr;
            
            //Fix the dragging none issue
            var transitionCombo = self.getTransitionEffectCombo(-2,transitionComboData);
            //var transitionCombo = self.getTransitionEffectCombo(0,transitionComboData);
            
            //var durationCombo = self.getDurationCombo(0,0);
            var durationCombo = self.getDurationCombo(-2,-2);
            
            for(var arrIdx=0; arrIdx<mediaIds.length; arrIdx++){
                var trHtml = "";
                var arrIndex = -1;
                var mediaId = mediaIds[arrIdx];
                var mediaObj = newMediaArr[mediaId-1];
                
                if(mediaObj){
                    trHtml = self.printMediaHtmlTr(mediaObj,'',transitionCombo,durationCombo, arrIdx+1);
                    arrIndex = self.whatIsIndexOfMediaArr(mediaObj);
                    self.appendMediaTr(trHtml, arrIndex);
                }
            }
        }
    };
    
    /**
    * Replace the target media tr html.
    * @param {type} trHtml description
    * @param {type} arrIndex description
    */
    this.replaceMediaTr = function(trHtml, arrIndex){
        var scrollTbl = self.getTbodyObj();
        if(scrollTbl &&  trHtml && arrIndex>-1){
            var scrollTblTrArr = jQuery(scrollTbl).children();
            if(scrollTblTrArr && scrollTblTrArr.length>0){                                                
                jQuery(trHtml).insertBefore(scrollTblTrArr[arrIndex-1]);
                
                scrollTblTrArr[arrIndex-1].remove();
                self.lockComboxNone();
                self.reStyleTr();
                

            }else{//No data, insert the 1st one
                jQuery(scrollTbl).append(trHtml);
            }
        }        
    };
    
    /**
    * Insert the target media tr html.
    * @param {type} trHtml description
    * @param {type} arrIndex description
    */
    this.appendMediaTr = function(trHtml, arrIndex){
        var scrollTbl = self.getTbodyObj();
        if(scrollTbl &&  trHtml && arrIndex>-1){
            var scrollTblTrArr = jQuery(scrollTbl).children();
            if(scrollTblTrArr && scrollTblTrArr.length>0){
                if(arrIndex===0){// new 1st row
                    jQuery(trHtml).insertBefore(scrollTblTrArr[0]);
                }else if(arrIndex===1){
                    jQuery(trHtml).insertAfter(scrollTblTrArr[0]);
                }else{
                    if(scrollTblTrArr.length ===1){
                        jQuery(trHtml).insertAfter(scrollTblTrArr[0]);
                    }else if(scrollTblTrArr.length === arrIndex){
                        jQuery(trHtml).insertAfter(scrollTblTrArr[arrIndex-1]);    
                    }else{
                        jQuery(trHtml).insertAfter(scrollTblTrArr[arrIndex-1]);    
                    }
                    
                }
            }else{//No data, insert the 1st one
                jQuery(scrollTbl).append(trHtml);
            }
        }        
    };
    
    /** 
    * Update the data of the table by local media list & thumbnail media list.
    */
    this.updateByMedia = function(){                
        var scrollTbl = self.getTbodyObj();
        
        if(scrollTbl && _localZoneMedias){            
            var scrollTblTrArr = jQuery(scrollTbl).find("tr");
            
            if(scrollTblTrArr && scrollTblTrArr.length>0 && _localZoneMedias.length>0){
                if(_localZoneMedias.length === scrollTblTrArr.length){                                    
                    //TR object, transition combo, transition duration combo object
                    var trObj, transComboObj, transDurationComboObj, chkObj;
                    for(var trIdx=0; trIdx<scrollTblTrArr.length; trIdx++){
                        trObj = scrollTblTrArr[trIdx];
                        if(trObj){
                            transComboObj = jQuery(trObj).find(".mlt-media-transition-combo");
                            if(transComboObj){
                                jQuery(transComboObj).val(_localZoneMedias[trIdx].transition);

                                transDurationComboObj = jQuery(trObj).find(".mlt-media-transition-combo-second");    
                                if(transDurationComboObj){
                                    jQuery(transDurationComboObj).val(_localZoneMedias[trIdx].transitionduration);
                                }

                                
                                //Lock the none combo
                                if( parseInt(jQuery(transComboObj).val()) === 0){
                                    jQuery(transComboObj).val("0");
                                    jQuery(transDurationComboObj).val("0");
                                    jQuery(transDurationComboObj).prop("disabled", true);
                                }else{
                                    //
                                }
                            }

                            chkObj = jQuery(trObj).find("input[name=chkMedia]");
                            if(chkObj){
                                //Update the checked status
                                if(_localZoneMedias[trIdx].$selected && _localZoneMedias[trIdx].$selected===true){
                                    jQuery(chkObj).prop("checked",true);
                                }else{
                                    jQuery(chkObj).prop("checked",false);
                                }
                                //Update the sequence
                                jQuery(chkObj).prop("value",_localZoneMedias[trIdx].sequence);
                                jQuery(chkObj).prop("sequence",_localZoneMedias[trIdx].sequence);
                                
                                jQuery(chkObj).attr("originalValue",trIdx);
                                jQuery(chkObj).attr("rowIdx",trIdx);
                            }

                        }

                    }//end for
                }    
            }  
        }
    };
    
    this.saveRecentUsedStorage = function(){
        
        //conaole.log("");
        var saveJSON = "";
        //var saveJSON=myToJson(recentUsedArray); //JSON.stringify(recentUsedArray);

        localStorage.setItem("webDT_WCM_TransitionEffect",saveJSON); 
    };
    
    /**
     * Get the nodeId from transition data.
     * @param {type} transitionId
     * @returns {comboObj.nodeId|String|cmbObj.nodeId}
     */
    this.getNodeIdFromTransitionData = function(transitionId){
        var nodeId = "";
        
        if(transitionComboData && transitionComboData.length>0){ 
            outLoop:    
            for(var idx=0; idx<transitionComboData.length ; idx++){
                comboObj = transitionComboData[idx];
                if(comboObj && comboObj.length>0){
                    for(var cmbIdx=0; cmbIdx<comboObj.length; cmbIdx++){
                        var cmbObj = comboObj[cmbIdx];

                        if(cmbObj.id == transitionId){
                            nodeId = cmbObj.nodeId;
                            break outLoop;
                        }
                    }
                }else{
                    if(comboObj.id == transitionId){
                        nodeId = comboObj.nodeId;
                        break;
                    }

                }
            }    
            
        }
        
        return nodeId;
    };
    
    /**
     * Update the local storage when select the transition.
     * @param {type} transitionId transition id
     * @param {type} selectedVal the selected value
     * @returns {undefined}
     */
    this.updateMostRecent = function(transitionId, selectedVal){
        
        
        //Get data from local storage
        var loadRecentJSON = jQuery.parseJSON(localStorage.getItem("webDT_WCM_TransitionEffect"));
        //transitionComboData
        
        var nodeId = self.getNodeIdFromTransitionData(transitionId);
        
        
        //Check the transition existed on the data of localStorage or not.
        var hasNode =false;
        if(loadRecentJSON){
            for(var recentIdx=0; recentIdx<loadRecentJSON.length;recentIdx++){
                var recentObj = loadRecentJSON[recentIdx];
                if(nodeId==recentObj.node_id){
                    hasNode = true;
                }
            }
        }else{
            loadRecentJSON = new Array();
        }
        
        
        if(hasNode===false){
            var mostRecentObj = new Object();
            mostRecentObj.html_ = '<span node_id="'+nodeId+'"' +
                    ' transitionid="'+ transitionId +'" class="all sa an">'+
            	'<img src="/image/transition/'+ transitionId + '_.gif" title="'+selectedVal+'" style="display: none;">'+
                '<img src="/image/transition/'+ transitionId +'.gif" title="'+selectedVal+'" style="display: block;">'+
            '</span>';
            mostRecentObj.node_id = nodeId;
            
            loadRecentJSON.push(mostRecentObj);
            
            var saveJSON=myToJson(loadRecentJSON); //JSON.stringify(recentUsedArray);
		
            localStorage.setItem("webDT_WCM_TransitionEffect",saveJSON); 
        }

    };
    
    /** 
     * Update local media list & thumbnail media list 
     * @param {type} idx description
     * @param {type} transition description
     * @param {type} transitionduration description
     */
    this.updateMediaTransition = function(idx, transition, transitionduration){

        if(_localZoneMedias && _localZoneMedias.length>0){
            for(var mediaIdx=0; mediaIdx<_localZoneMedias.length; mediaIdx++){

                if( mediaIdx === idx ){
                    //Just change the duration with transition;
                    if(transition){
                        _localZoneMedias[idx].transition = transition;    
                    }
                    
                    _localZoneMedias[idx].transitionduration = transitionduration;                                           
                    
                    //Update the media array on thumbnail view
                    _zoneData.setZoneMedias(currentZoneId, _localZoneMedias); 
                    
                    
                    
                    break;
                }                                
            }
        }
    };
    
    /** Update the check status of local media list & thumbnail media list */
    this.updateMediaCheck = function(){
        
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");                
        if(scrollTbl && scrollTbl[1]){
            var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
            var childBody = jQuery(tblBodyObj[0]);
            
            if(childBody && childBody[0]){
                jQuery(childBody[0]).find("input[name=chkMedia]").each(function( indexChk, obj ) {
                    if(jQuery(this).prop("checked") === true){
                        if(_localZoneMedias && _localZoneMedias.length>0){
                            for(var mediaIdx=0; mediaIdx<_localZoneMedias.length; mediaIdx++){
                                if(mediaIdx === indexChk ){
                                    _localZoneMedias[indexChk].$selected = jQuery(this).prop("checked");   
                                    break;
                                }
                            }
                        }
                    }
                });
                
                //Update the media array on thumbnail view
                _zoneData.setZoneMedias(currentZoneId, _localZoneMedias); 
            }
        }//end if(scrollTbl && scrollTbl[1])
    };
    
    /**
    * Break the click to bubble up the tr.
    *
    */
    this.attachTransitionComboClickEvent = function(){
        jQuery('.mlt-media-transition-combo').each(function(index, obj){   
            //jQuery(this).bind( "click", function(event) {
            jQuery(this).on( "click", function(event) {
                
                return false;
            });
        });
    };//end this.attachTransitionComboClickEvent
    
    /**
    * Another click event to change the selected check box and style.
    */
    this.attachTransitionComboSecondClickEvent = function(){
        jQuery('.mlt-media-transition-combo-second').each(function(index, obj){   
            jQuery(this).on( "click", function(event) {
                return false;
            });
        });
    };//end this.attachTransitionComboClickEvent
    
    /**
    * Create the select & unselect all events.
    * 
    */
    this.attachChkMasterClickEvent = function(){
        var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");

        //The master check box is on the 1st table header, so get the 1st table.
        if(scrollTbl && scrollTbl[0]){
            var tblHeadObj = jQuery(scrollTbl[0]).find("thead");
            var childHead = jQuery(tblHeadObj[0]);
            
            if(childHead && childHead[0]){
                //Just one check box, find it
                //childHead.find("input").each(function( indexOut, obj ) {
                //jQuery(childHead[0]).find("chkMaster").each(function( indexOut, obj ) {
                childHead.find("#chkMaster").each(function( indexOut, obj ) {
                    jQuery(this).on("click", function(event){
                        //alert(jQuery(this).prop("checked"));
                        var checked = jQuery(this).prop("checked");
                        if(checked){
                            self.checkAllMedia(true);
                        }else{
                            self.checkAllMedia(false);
                            self.unclassAllMedia();
							self.unSelectAllThumbMedia();
                        }
                        self.reStyleTr();

                    });            
                });
            }
        }//end if(scrollTbl && scrollTbl[0])
    };// end attachChkMasterClickEvent
    
    /**
    * Create the select & unselect all events.
    * 
    */
    this.attachChkMediaClickEvent = function(){        
        var scrollTbl = self.getBodyTable();                            
        //The master check box is on the 1st table header, so get the 1st table.
        if(scrollTbl){            
            var childBody = self.getTbodyObj();                        
            if(childBody){
                //Loop the each tr
                jQuery(childBody).find("input").each(function( indexChk, obj ) {
                    //Find the check box    
                    jQuery(this).on("click", function(event){                        
                        //Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
                        event.stopPropagation();                        
                        var checked = jQuery(this).prop("checked");
                        
                        //Update the current tr style
                        
                        //Update the check box master
                        self.updateChkMaster();
                        
                        self.reStyleTr();
                        
                        //Update the local media data and the thumbnail view data
                        self.updateMediaCheck();
                    });            
                });
            }
        }        
    };// end attachChkMediaClickEvent
    
    /**
    * Select the check master.
    */
    this.selectCheckMaster = function(){
        var childHead = self.getTheadObj();
        if(childHead){
            jQuery(childHead).find("input").each(function( index ) {
                jQuery(this).prop("checked",true);
            });    
        }
    };
    
    /**
    * Check all media and update the chkMaster's checked status.
    */
    this.updateChkMaster = function(){
        var lastIdx = 0;
        var selectedCnt = 0;
        var trCnt = 0;
        var allChecked = false;
        var chkLen = 0;
        
        //var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
        //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
        
        //The master check box is on the 1st table header, so get the 1st table.
        //if(scrollTbl && scrollTbl[0] && scrollTbl[1]){
            //var tblHeadObj = jQuery(scrollTbl[0]).find("thead");
            //var childHead = jQuery(tblHeadObj[0]);
        var childHead = self.getTheadObj();
            
            //var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
        //var childBody = jQuery(tblBodyObj[0]);
        var childBody = self.getTbodyObj();
            
        if(childHead  && childBody ){
            //Just one check box, find it

            //jQuery(childHead[0]).find("chkMaster").each(function( indexOut, obj ) {
            jQuery(childBody).find("input").each(function(idx){
                chkLen++;
                var checked = jQuery(this).prop("checked");
                if(checked){
                    allChecked = true;
                }else{
                    allChecked = false;
                    return false; //break
                }
            });            

            jQuery(childHead).find("input").each(function( index ) {
                if(allChecked===true && chkLen>0){
                    jQuery(this).prop("checked",true);
                }else{
                    jQuery(this).prop("checked",false);
                }
            });
        }
        //}        
    };//end this.updateChkMaster
    
    /**
    * Another click event to change the selected check box and style.
    * This function handles the media name click & dblclick events.
    * this.dblclick to open the media page. this.click to nothing
    */
    this.attachMediaNameFieldsDblEvent = function(){
        var timer;
        
        jQuery('.mlt-media-name-field').each(function(index, obj){   
            var firing = false;
            var singleClick = function(){                
                return false;
            };

            var doubleClick = function(){                 
                self.dblclickMediaName(index+1);
            };

            var firingFunc = singleClick;
            
            var fireHandler = function(){
                // Detect the 2nd single click event, so we can set it to doubleClick
                if(firing){
                  firingFunc = doubleClick; 
                  return;
                }

                firing = true;
                timer = setTimeout(function() { 
                   firingFunc(); 

                   // Always revert back to singleClick firing function
                   firingFunc = singleClick;
                   firing = false;
                }, 400);
            };
            
            jQuery(this).on('click', fireHandler);            
            jQuery(this).css("cursor","hand");
        });
    };//end this.attachMediaNameFieldsDblEvent
    
    /**
    * Go the the media detail page.
    * @param {type} seq description
    */
    this.dblclickMediaName = function(seq){
        //Trigger zoneMediaView onItemDblClick (id, ev, html)
        if(_zoneMediaView && zoneMediaCtrl){
            _zoneMediaView.stopEdit();
					
            var mediaObj = _zoneMediaView.get(seq);
            var isUnReadableMedia = zoneMediaCtrl.isUnReadableMedia(mediaObj);
            if (isUnReadableMedia === true) {
                return;
            } else {
                //_editZoneMedia(id);
                //var item = __zoneMediaView.get(id);
                var obj = {};
                                
                if(mediaObj && mediaObj.media){
                    if(mediaObj.media.arend || mediaObj.media.arstart){
                        ;
                    }else{
                        setViewCookie('expiration','hide','30');
                    }


                    obj.rootId = mediaObj.media.parentid;
                    obj.lastClickMedia = [mediaObj.media.mediaid];
                    obj.from = "playlistMediaZone";
                    //obj.backPlaylistid = _playlistId;
                    obj.backPlaylistid = zoneMediaCtrl.getPlayListId();
                    obj.id = seq;
                    obj.zoneid = currentZoneId;
                    obj.complaylist = jQuery("#playlist_toolbar_approve_publish_button").data("comboPlaylistId");

                    var _scriptObject = document.getElementById("dt_cm_modules_playlistWrapper_js");
                    
                    if(_scriptObject && _scriptObject.sceneList){
                        obj.sceneId = _scriptObject.sceneList.selectedId;    
                    }
                    
                    //window.DTCookieUtil.setSiteCookie("contentView_DTUI_MEDIA", JSON.stringify(obj));
                    window.DTCookieUtil.setSiteCookie("mediaView_DTUI_MEDIA", JSON.stringify(obj));
                    window.module_framework.doChangeTab("mediaTab");    
                }                                
            }
        }
    };
    
    /**
    * Re-draw the tr by zebra crossing.
    */ 
    this.reStyleTr = function(){
        
        var trStyle1 =' bgcolor="white" ';
        var trStyle2 =' bgcolor="#e9e9e9" ';
        var trStyle = '';
        var idx=0;
        
        var tbodyObj = self.getTbodyObj();
        
        //var childTrArr = document.querySelectorAll('#'+attrsObj.divId + ' table tbody tr');
        var childTrArr = jQuery(tbodyObj).find("tr");
        
        if(childTrArr && childTrArr.length>0){
            for(var trIdx=0; trIdx<childTrArr.length ; trIdx++){
                var childrenTrObj = childTrArr[trIdx];
                if(childrenTrObj){
                    var childTdArr = childrenTrObj.children;
                    
                    if(childTdArr && childTdArr.length>0){
                        for(var tdIdx=0; tdIdx<childTdArr.length; tdIdx++){
                            var childTd;
                            //index=0, check the selected status
                            if(tdIdx===0){
                                var checkBoxSelected = false;
                                childTd = childTdArr[tdIdx].children;
                                if(childTd && childTd[0]){
                                    checkBoxSelected = childTd[0].checked;
                                }                                                                
                            }//if(tdIdx==0)
                            
                            if(childTd){
                                //Set selected color
                                if(checkBoxSelected){
                                    try{
                                        childTdArr[tdIdx].style.backgroundColor = "#c5f0f6";
                                         //set tr class
                                        if(tdIdx===0){
                                            childrenTrObj.addClassName("ui-state-highlight");
                                        }
                                    }catch(err){
                                        console.log(err);
                                    }

                                    
                                }else{
                                    //Set zebra color
                                    if( (trIdx+1)%2 ===1){
                                        try{
                                            childTdArr[tdIdx].style.backgroundColor = "white";
                                        }catch(err){
                                            console.log(err);
                                        }
                                    }else{
                                        try{
                                            childTdArr[tdIdx].style.backgroundColor = "#e9e9e9";
                                        }catch(err){
                                            console.log(err);
                                        }
                                    }
                                    
                                    //Remove the highlight class
                                    if(tdIdx===0){
                                        jQuery(childrenTrObj).removeClass("ui-state-highlight");
                                    }
                                }

                            }// end if(childTd && childTd.style)end if(childTd && childTd.style)
                            
                        }
                    }
                }
            }
        }                     
    };//end this.reStyleTr function
    
    /**
    * Get the transition combo html.
    * 
    * @param {type} transition description
    * @param {type} transitionComboData description
    * @param {type} mediaId description
    * @param {type} sequence description
    */
    this.getTransitionEffectCombo = function(transition, transitionComboData, mediaId, sequence){
		var comboObj;
        var comboObj2;
        var checkedStr='';
        var combo = '<select class="mlt-media-transition-combo"' + ' mediaId="'+ mediaId +'"' +
                                ' sequence="'+sequence + '"' +'>';
        try{
            //if(this.transitionData && this.transitionData.length>0){
            if(transitionComboData && transitionComboData.length>0){ 
                for(var idx=0; idx<transitionComboData.length ; idx++){
                    comboObj = transitionComboData[idx];
                    
                    if(comboObj && comboObj.length>0){
                        for(var comboIdx=0;comboIdx<comboObj.length;comboIdx++){
                            comboObj2 = comboObj[comboIdx];
                            if(comboObj2 && comboObj2.seq == 0){                                
                                combo += '<optgroup label="'+ comboObj2.name +'">';    
                            }else{
                                combo += '<option value="'+ comboObj2.id +'" ' + ((transition==comboObj2.id)?'selected':'') + '>' + comboObj2.name + '</option>';
                            }
                        }
                    }else{
                        
                        if(comboObj && comboObj.seq == 0){
                            var comGrpName = comboObj.name;                            
                            
                            combo += '<optgroup label="'+ comboObj.name +'">';    
                            var loadRecentJSON = jQuery.parseJSON(localStorage.getItem("webDT_WCM_TransitionEffect"));
                            
                            if(loadRecentJSON && loadRecentJSON.length>0){
                                for(var recentIdx=0; recentIdx<loadRecentJSON.length; recentIdx++ ){
                                    var jsonObj=loadRecentJSON[recentIdx];
                                    if(jsonObj && jsonObj.html_){
                                        var tmpTransitionId = this.getTransitionIdByMostRecentUsedHtml(jsonObj.html_);
                                        if(tmpTransitionId){
                                            var mostRecentObj = this.getMostRecentUsedObjByTransitionId(tmpTransitionId);    
                                            
                                            if(mostRecentObj && mostRecentObj.id!="0" && mostRecentObj.id!="-1"){
                                                combo += '<option value="'+ mostRecentObj.id +'" >' + mostRecentObj.name + '</option>';    
                                            }
                                                
                                        }
                                                
                                    }
                                }
                                
                            }
                            /*
            <span node_id="43" transitionid="35" class="all sa">            	<img src="/image/transition/35_.gif" title="Shape Circle Out" style="display: none;">               <img src="/image/transition/35.gif" title="Shape Circle Out" style="display: block;">↵            </span>
			*/
                            //Compose the most recent used
                            
                        }else{
                            combo += '<option value="'+ comboObj.id +'" ' + ((transition==comboObj.id)?'selected':'') + '>' + comboObj.name + '</option>';    
                        }    
                        
                    }
                }
            }
            combo += '</select>';
			
        }catch(err){
            console.log("error on getTransitionEffectCombo!!!");
        }
        return combo;
    };//end getTransitionEffectCombo
    
    /**
    * Generate the most recent used html string by node id, transition id and the name(title).
    * <span node_id="43" transitionid="35" class="all sa">↵            	
    *    <img src="/image/transition/35_.gif" title="Shape Circle Out" style="display: none;">↵                
    *    <img src="/image/transition/35.gif" title="Shape Circle Out" style="display: block;">↵            
    * </span>"
    */
    this.getMostRecentUsedHtml = function(nodeId, transitionId, title){
        var htmlStr='<span node_id="'+nodeId+'" transitionid="'+transitionId+'"  class='+
                     (transitionId=="-1"||transitionId=="0")?'undefined': '"all sa"' + '>';
        htmlStr += '<img src="/image/transition/'+ transitionId +'_.gif" title="'+ title +'"  '+ 
            (transitionId=="-1"||transitionId=="0")?'':'style="display: none;"' + ' />';
        htmlStr += '<img src="/image/transition/'+ transitionId +'.gif" title="'+ title +'" '+ 
            (transitionId=="-1"||transitionId=="0")?'':'style="display: block;"' +' />';
        htmlStr += '</span>';
			
		return htmlStr;
    };
    
    /**
    * Get the transition id from the html span string.
    * 3 types html string - Get the position of 1st '<' and 1st '>',substring by the 2 index.
    * Then get the transitionid
    * <span node_id="43" transitionid="35" class="all sa">↵            	
    *    <img src="/image/transition/35_.gif" title="Shape Circle Out" style="display: none;">↵                
    *    <img src="/image/transition/35.gif" title="Shape Circle Out" style="display: block;">↵            
    * </span>"
    * <span node_id="2" transitionid="0" class="undefined"> <img src="/image/transition/0.png" title="None"> </span>
    * <span node_id="3" transitionid="-1" class="undefined"> <img src="/image/transition/tf_img001.png" title="Random"> </span>
    */
    this.getTransitionIdByMostRecentUsedHtml = function(mostRecentUsedHtml){
        /*
        var str = '<span node_id="43" transitionid="35" class="all sa">'+
            '<img src="/image/transition/35_.gif" title="Shape Circle Out" style="display: none;">'+
            '<img src="/image/transition/35.gif" title="Shape Circle Out" style="display: block;">'+
            '</span>'; */
        var idxLeft = mostRecentUsedHtml.indexOf("<"); //0
        var idxRight = mostRecentUsedHtml.indexOf(">"); //51
        var rsStr = mostRecentUsedHtml.substring(idxLeft+1,idxRight);
        var strArr = rsStr.split(" ");
        var transitionId = "";
        
        if(strArr && strArr.length>0){
            for(var idx=0; idx<strArr.length; idx++){
                if(strArr[idx] && strArr[idx].length>0 && strArr[idx].indexOf("transitionid")>-1){
                    var transitionidStr = strArr[idx];
                    var transitionidArr = transitionidStr.split("=");
                    if(transitionidArr && transitionidArr[1] && transitionidArr[1].length>0){
                        transitionId = transitionidArr[1].substring(1,transitionidArr[1].length-1);
                    }
                    break;
                }
            }    
        }
                
        return transitionId;
    };
    
    /**
     *  Get the json object from the transition object data. 
     *  @param {type} transitionId description
     */
    this.getMostRecentUsedObjByTransitionId = function(transitionId){
        
        var rtnObj;
        if(transitionComboData && transitionId){
            if(transitionComboData.length && transitionComboData.length>0){
                
                loopOut:
                for(var idx=0; idx<transitionComboData.length; idx++){
                    
                    var inObj = transitionComboData[idx];
                    if(inObj && inObj.length>0){
                        for(var idxIn=0; idxIn<inObj.length; idxIn++){
                            if(inObj[idxIn].id == transitionId){
                                rtnObj = inObj[idxIn];
                                break loopOut;
                            }
                        }
                    }else{
                        if(inObj.id == transitionId){
                            rtnObj = inObj;
                            break;
                        }
                    }
                }
            }
        }   
        
        return rtnObj;
    };
    
    /** 
    * The transition duration select combo.
    * @param mediaId Just for mapping the event.
    * @param sequence Just for mapping the event.
    */
    this.getDurationCombo = function(transition, transitionduration, mediaId, sequence){
        
        var combo = '<select style="width:40px;" class="mlt-media-transition-combo-second"'+
                    ' mediaId='+ mediaId + '"' +
                    ' sequence='+ sequence + '"' + '>';
        combo += '<option value="0" ' + ((transitionduration==0)?'selected':'') +'> 0</option>';
        //if(transition!=0){
            combo += '<option value="1" '+ ((transitionduration===1)?'selected':'')+ '> 1</option>';
            combo += '<option value="2" '+ ((transitionduration===2)?'selected':'') +'> 2</option>';		  
            combo += '<option value="3" '+ ((transitionduration===3)?'selected':'') +'> 3</option>';		  
            combo += '<option value="4" '+ ((transitionduration===4)?'selected':'') +'> 4</option>';		  
            combo += '<option value="5" '+ ((transitionduration===5)?'selected':'') +'> 5</option>';		  
            combo += '<option value="6" '+ ((transitionduration===6)?'selected':'') +'> 6</option>';		  
            combo += '<option value="7" '+ ((transitionduration===7)?'selected':'') +'> 7</option>';		  
            combo += '<option value="8" '+ ((transitionduration===8)?'selected':'') +'> 8</option>';		  
            combo += '<option value="9" '+ ((transitionduration===9)?'selected':'') +'> 9</option>';		  
            combo += '<option value="10" '+ ((transitionduration===10)?'selected':'') +'>10</option>';		  
        //}
        
        combo += '</select>';
        
        return combo;
    };
	
    this.checkTime = function (num) {
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    };
    
	/** 
         * Format the time string.
         * @param {type} timeNum description
         */
    this.formatMediaTime = function(timeNum){
        var rtn="";
        if(timeNum && timeNum>0){
            var stmp = Math.floor(timeNum/1000);
            
            var mtmp = Math.floor(stmp/60);
            var s = this.checkTime(stmp%60);
            
            var htmp = Math.floor(mtmp/60);
            var m = this.checkTime(mtmp%60);
            
            var h = this.checkTime(htmp);
            
            rtn = h+":"+m+":"+s;
        }else{
            
            rtn="00:00:00";
        }
        return rtn;
    };
    
    /**
    * Set the css after creating the scroll table.
    */
    this.attachHeadScroll = function(){
        var headDiv = self.getTheadDiv();
        if(headDiv){
            jQuery(headDiv).css("overflow-y","scroll");
            jQuery(headDiv).css("overflow-x","hidden");
        }        
    };
    
    /**
    * Re-compose the html list table by media list data.
    */
    this.refresh = function(){
        startTime = new Date();        
        if(transitionComboData){
            
            self.countWidthByZoneList();
            
            self.printTable();                        
            
            if(jQuery(this).is(':visible')){
                
                var startTime = new Date();                
                var mainTableScrollObj = jQuery('#'+attrsObj.divId+' .tblMainListCls');
                
                self.scrolify(mainTableScrollObj, _listTableHeight,_listTableWidth); 
                                
                self.attachHeadScroll();
                
                self.initMultipleDragAndDrop();                
            
                //if(isChrome){
                //	self.initResizeEvent();
                //}                                
                
                self.adjustMainStyle();                

                self.setTransitionComboValue();                
                
                self.setTransitionDurationComboValue();                
                
                self.lockComboxNone();                
                
                self.refreshTotalElapsedtime();                 

                self.setTableAreaWidthHeight();                
            }                        
        }else{            
            transitionComboData = self.loadTransitionData();            
        }                
    };
    
    /**
    * Generate the main table list html and print.
    */
    this.printTable = function(){
        //clean the html of the table
        self.cleanMediaListHtml();
        //Set the resizeStatus to off
        self.resizeStatus = false;
            
        var transitionTable = self.printMainTable(transitionComboData);
        
        //Append the html table
        self.loadMediaListData( transitionTable ); 
    };
    
    /**
    * Generate main list table head and body.
    * @param {type} transitionComboData description
    */
    this.printMainTable = function (transitionComboData){
        var htmlTable='';
        
        var divStyle = 'width:'+  _listTableWidth +';border:1px silver solid;';
        
        htmlTable += '<div style="'+divStyle+'">';
        
        htmlTable += '<table border="1" width="100%" id="tblMainList" class="tblMainListCls" style="table-layout:fixed">';
        
        htmlTable += self.printMainTableHead();
        
        //htmlTable += self.printMainTableBody(transitionComboData);
        htmlTable += self.printTableBody(transitionComboData);
        
        htmlTable += '</table>';    
        htmlTable += '</div>';    
            
        return htmlTable;
    };
    
 
    
    /**
    * Count the 6th width.
    */
    this.getSixthWidth = function(){
        
        var sixthWidth = 0;
        var one = parseInt(_listTableColWidthArr[0]);
        var two = parseInt(_listTableColWidthArr[1]);
        var three = parseInt(_listTableColWidthArr[2]);
        var four = parseInt(_listTableColWidthArr[3]);
        var five = parseInt(_listTableColWidthArr[4]);
        
        sixthWidth = _listTableWidth - (one + two + three + four + five + _listTableScrollWidth);
                
        return sixthWidth;
    };
    
    /**
    * New performance tuning function.
    * Call the transition generator once, then call this function to set the transition.
    */
    this.setTransitionComboValue = function(){
        var transition;
        if(_localZoneMedias && _localZoneMedias.length>0){
            var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
            //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
            
            if(scrollTbl && scrollTbl[1]){
                var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
                var childBody = jQuery(tblBodyObj[0]);

                if(childBody && childBody[0]){
                    jQuery(childBody[0]).find(".mlt-media-transition-combo").each(function( indexCombo, obj ) {
                        try{
                            var mediaObj = _localZoneMedias[indexCombo];
                            jQuery(this).val(mediaObj.transition);
                            jQuery(this).attr("mediaId",mediaObj.mediaid);
                            jQuery(this).attr("sequence",mediaObj.sequence);
                        }catch(err){
                            console.log(err);
                        }
                    });
                }
            }
        }//end if(_localZoneMedias && _localZoneMedias.length>0)
    };
    
    /**
    * New performance tuning function.
    * Call the transition generator once, then call this function to set the transition.
    * @param mediaIdx
    */
    this.setTransitionComboValueByIdx = function(mediaIdx){
        var transition;
        if(_localZoneMedias && _localZoneMedias.length>0){
            var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
            //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
            
            if(scrollTbl && scrollTbl[1]){
                var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
                var childBody = jQuery(tblBodyObj[0]);

                if(childBody && childBody[0]){
                    jQuery(childBody[0]).find(".mlt-media-transition-combo").each(function( indexCombo, obj ) {
                        try{
                            if(mediaIdx === (indexCombo+1) ){
                                var mediaObj = _localZoneMedias[indexCombo];
                                jQuery(this).val(mediaObj.transition);
                                jQuery(this).attr("mediaId",mediaObj.mediaid);
                                jQuery(this).attr("sequence",mediaObj.sequence);
                                
                                return;
                            }
                            
                        }catch(err){
                            console.log(err);
                        }
                    });
                }
            }
        }//end if(_localZoneMedias && _localZoneMedias.length>0)
    };
    
    /**
    * New performance tuning function.
    * Call the transition generator once, then call this function to set the transition.
    * Class name mlt-media-transition-combo-second
    * @param {type} mediaIdx description
    */
    this.setTransitionDurationComboValueByIdx = function(mediaIdx){
        var transition;
        if(_localZoneMedias && _localZoneMedias.length>0){            
            var scrollTbl = self.getBodyTable();                                    
            if(scrollTbl){                                
                var childBody = jQuery(self.getTbodyObj());                
                if(childBody){                    
                    jQuery(childBody).find(".mlt-media-transition-combo-second").each(function( indexCombo, obj ) {
                        try{
                            if(mediaIdx === (indexCombo+1) ){
                                var mediaObj = _localZoneMedias[indexCombo];
                                jQuery(this).val(mediaObj.transitionduration);
                                
                                jQuery(this).attr("mediaId",mediaObj.mediaid);
                                jQuery(this).attr("sequence",mediaObj.sequence);
                                if( parseInt(jQuery(this).val()) === 0 ){
                                    jQuery(this).prop("disabled", true);
                                }else{
                                    jQuery(this).prop("disabled", false);
                                }
                                
                                return;
                            }                            
                        }catch(err){
                            console.log(err);
                        }
                    });
                }
            }
        }//end if(_localZoneMedias && _localZoneMedias.length>0)
    };
     /**
    * New performance tuning function.
    * Call the transition generator once, then call this function to set the transition.
    * Class name mlt-media-transition-combo-second
    */
    this.setTransitionDurationComboValue = function(){
        var transition;
        if(_localZoneMedias && _localZoneMedias.length>0){
            //var scrollTbl = jQuery("#" + attrsObj.divId+ " .tblMainListCls");
            var scrollTbl = self.getBodyTable();
            //var scrollTbl = _zoneContentListView.find(".tblMainListCls");
            
            //if(scrollTbl && scrollTbl[1]){
            if(scrollTbl){
                //var tblBodyObj = jQuery(scrollTbl[1]).find("tbody");
                //var tblBodyObj = self.getTbodyObj();
                
                var childBody = jQuery(self.getTbodyObj());

                //if(childBody && childBody[0]){
                if(childBody){
                    //jQuery(childBody[0]).find(".mlt-media-transition-combo-second").each(function( indexCombo, obj ) {
                    jQuery(childBody).find(".mlt-media-transition-combo-second").each(function( indexCombo, obj ) {
                        try{
                            var mediaObj = _localZoneMedias[indexCombo];
                            jQuery(this).val(mediaObj.transitionduration);
                            jQuery(this).attr("mediaId",mediaObj.mediaid);
                            jQuery(this).attr("sequence",mediaObj.sequence);
                        }catch(err){
                            console.log(err);
                        }
                    });
                }
            }
        }//end if(_localZoneMedias && _localZoneMedias.length>0)
    };

    /**
    * This function is for the performance tuning.
    * Re-use the getTransitionEffectCombo string.
    * NOTE: Calling this function needs to call another function to set the correct combo data.
    */
    this.printTableBody = function(){
        //var zoneMediaArr = attrsObj.zoneMedias;
		var desc = "DESC";
        var duration = "Duration";
        var elapsedTime = "1";
        var transitionEffect = "None";
        var transitionDuration = "0";
		var mediaName = "";
		var mediaid;
		var medialength;
        var arTitle;
        var arImg;
		var sequence = "";
		//var zoneid = "";
		var selected = false;
		var tableContent = "";
        var playlistid;
        //The check box selected flag
		var checkedStr = "";
		var transitionduration;
		var transition;
        var tmpElapsedTime = 0;
		
        
        
        var htmlTable = '<tbody>';
        if(_localZoneMedias && _localZoneMedias.length>0){
            /*
            * Row 1 and 2 with style background
            */
            var trStyle1 =' bgcolor="white" ';
            var trStyle2 =' bgcolor="#e9e9e9" ';
            var trStyle = '';
            //text-overflow:ellipsis;
            var tdStyle = "table-layout:fixed;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;";
            
            //Fix the dragging none issue
            var transitionCombo = self.getTransitionEffectCombo(-2,transitionComboData);
            //var transitionCombo = self.getTransitionEffectCombo(0,transitionComboData);
            
            //var durationCombo = self.getDurationCombo(0,0);
            var durationCombo = self.getDurationCombo(-2,-2);
            
            
            var sixthWidth = self.getSixthWidth();
            
            for(var idx = 0; idx<_localZoneMedias.length; idx++){
                trStyle = ' style="border-right:1px solid silver" ';
                if( (idx+1)%2==1 ){
                    trStyle += trStyle1;
                }else{
                    trStyle += trStyle2;
                }
            
                if(_localZoneMedias[idx]){
                    
                    htmlTable += self.printMediaHtmlTr(_localZoneMedias[idx],trStyle,transitionCombo,durationCombo,idx+1, sixthWidth);
                }
            }
        }
        
        htmlTable += '<tbody>';
        
        return htmlTable;
    };
    
    /**
    * Performance tuning - Separate this function for adding and deleting some rows, 
    * just insert or remove the target rows.
    */
    this.printMediaHtmlTr = function(mediaObj, tdStyle, transitionCombo, durationCombo, rowIdx, sixthWidth){
        
        var htmlTable = '';
        if(mediaObj){
            var sequence = mediaObj.sequence;
            var selected = mediaObj.$selected;
            var medialength = mediaObj.medialength;
            var playlistid = mediaObj.playlistid;
            var tmpElapsedTime = 0;
            
            this.zoneId = mediaObj.zoneid;

            var checkedStr = selected ? 'checked': '';
            var transition = mediaObj.transition;
            var transitionduration = mediaObj.transitionduration;

            //Fix the dragging none issue
//            var transitionCombo = self.getTransitionEffectCombo(-2,transitionComboData);
//            //var transitionCombo = self.getTransitionEffectCombo(0,transitionComboData);
//            
//            //var durationCombo = self.getDurationCombo(0,0);
//            var durationCombo = self.getDurationCombo(-2,-2);
            
            if(mediaObj.media){
                //this.zoneId = zoneMediaArr[idx].media.zoneid; 
                mediaName = mediaObj.media.name;
                mediaid = mediaObj.media.mediaid;
                desc = mediaObj.media.description;
                arImg = self.setARImg(mediaObj);
                
                arTitle = self.setARTitle(mediaObj);    
                
            }
            
            htmlTable += '<tr>';

            htmlTable += '<td width="'+ _listTableColWidthArr[0] +'"';
            htmlTable += ' style="' + tdStyle + '"';
            htmlTable += ' nowrap>';
            htmlTable += '<input type="checkbox" name="chkMedia" id="'+ mediaid +'" value="'+ sequence +'" ' ;
            htmlTable += ' originalValue="'+ sequence +'" ' ;
            htmlTable += ' rowIdx="'+ rowIdx +'" '+ checkedStr + ' >';
            htmlTable += '</td>';

            htmlTable += '<td width="' + _listTableColWidthArr[1] + '"';
            htmlTable += ' title="'+ mediaName + '" nowrap ';
            htmlTable += ' style="' + tdStyle + '">';
            htmlTable += '<div class="mlt-media-name-field" style="word-break: keep-all;">';
            htmlTable +=  mediaName;    
            if(arImg && arImg.trim().length>0){
                htmlTable += '<div class="'+arImg+'" height="20" width="20" title="'+arTitle+'">';
                htmlTable += '</div>';    
            }
            htmlTable += "</div>";

            htmlTable += '</td>';

            htmlTable += '<td width="' + _listTableColWidthArr[2] + '"';
            htmlTable += ' title="'+ desc + '" nowrap ';
            htmlTable += ' style="' + tdStyle + '">';
            htmlTable += desc ;
            htmlTable += '</td>';

            htmlTable += '<td width="'+_listTableColWidthArr[3]+'"';
            htmlTable += ' style="' + tdStyle + '"';
            htmlTable += ' nowrap>';
            htmlTable += self.formatMediaTime(medialength);
            htmlTable += '</td>';

            htmlTable += '<td width="'+_listTableColWidthArr[4]+'"';
            htmlTable += ' style="' + tdStyle + '"';
            htmlTable += ' nowrap>';
            htmlTable += self.formatMediaTime(tmpElapsedTime);
            htmlTable += '</td>';

            //htmlTable += '<td width="'+_listTableColWidthArr[5]+'" ';
            htmlTable += '<td width="' + sixthWidth + '" ';
            htmlTable += ' style="' + tdStyle + '"';
            htmlTable += ' nowrap>';
            //htmlTable += self.getTransitionEffectCombo(transition,transitionComboData);
            htmlTable += transitionCombo;

            htmlTable += '&nbsp;';
            //htmlTable += self.getDurationCombo(transition, transitionduration ) + 's' ;
            htmlTable += durationCombo + 's' ;

            htmlTable += '</td>';

            htmlTable += '</tr>';
            
        }
        return htmlTable;
    };
    
    /**
    * This function is from setARImg inside the PlaylistZoneMediaEdit.js __zoneMediaView = new dhtmlXDataView(...)
    */
    this.setARImg = function(obj) {
        var ARType = self.checkAvailableType(obj);
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
    };
    
    /**
    * This function is from setARImg inside the PlaylistZoneMediaEdit.js __zoneMediaView = new dhtmlXDataView(...)
    */            
    this.setARTitle = function(obj) {
        var notAvailable = window.msg["esignage.contentserver.jsp.playlist.availableRange.notAvailable"];
        var available = window.msg["esignage.contentserver.jsp.playlist.availableRange.available"];
        var noAvailableSetting = window.msg["esignage.contentserver.jsp.playlist.availableRange.notset"];
        var ARType = self.checkAvailableType(obj);
        var title = noAvailableSetting;
        var arRange = self.getAvailableRange(obj);

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
    };
    
    this.getAvailableRange = function(obj) {
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
    
    /**
    * This function is from setARImg inside the PlaylistZoneMediaEdit.js __zoneMediaView = new dhtmlXDataView(...)
    * @param {type} obj description
    */  
    this.checkAvailableType = function(obj) {
        var arStart = null;
        var arEnd = null;
        var curTime = null;
        var curTimeString = "";

        if (obj && obj.media) {
            arStart = obj.media.arstart;
            arEnd = obj.media.arend;
            curTime = new Date();

            curTimeString = curTime.getFullYear() + "-" + self.formatDateTimeField(curTime.getMonth() + 1) + "-" +
                self.formatDateTimeField(curTime.getDate()) + " " + self.formatDateTimeField(curTime.getHours()) + ":" +
                self.formatDateTimeField(curTime.getMinutes()) + ":" + self.formatDateTimeField(curTime.getSeconds());

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
    
    this.formatDateTimeField = function(value) {
        if(value < 10) return "0" + value;
        else return value + "";
    };
    
    this.resizeHeadByBrowser = function(thWidthArr, hasScroll, bodyWidth){
        //chrome
        if(isChrome){
            thWidthArr = self.reviseHeadWidthForChrome(thWidthArr,hasScroll,bodyWidth);
        }
        
        //IE11 
        if(isIE){
            thWidthArr = self.reviseHeadWidthForIE(thWidthArr,hasScroll,bodyWidth);
        }
        
        //firefox - mozilla = true , version=45;
        if(isFirefox){
            thWidthArr = self.reviseHeadWidthForFF(thWidthArr,hasScroll,bodyWidth);
        }
        
//        if(isEdge){
//            
//        }
        
        return thWidthArr;
    };
    
    this.reviseHeadWidthForChrome = function(){
        return _listTableColWidthArr;
    };
    
    this.reviseHeadWidthForIE = function(){
        return _listTableColWidthArr;
    };
    
    this.reviseHeadWidthForFF = function(){
        //_listTableColWidthArr[0] = parseInt(_listTableColWidthArr[0])+1;
        _listTableColWidthArr[0] = parseInt(_listTableColWidthArr[0]);
        
        return _listTableColWidthArr;
    };
    
    /**
    * Append the table header html by width array.
    */
    this.printMainTableHead = function(){
        
        //_listTableColWidthArr = self.resizeHeadByBrowser();
        
        var htmlTable = '';
        
        htmlTable += '<thead>';
        htmlTable += '<tr>';
        
        //table-layout:fixed;overflow:hidden; word-wrap:break-word;
        var tdStyle = "table-layout:fixed;overflow:hidden; white-space:nowrap;text-overflow:ellipsis;valign:center";
        
        htmlTable += '<th width="'+_listTableColWidthArr[0]+'"';
        htmlTable += ' style="' + tdStyle + '"';
        htmlTable += ' nowrap>';
        htmlTable += '<div>'; //style="margin-right:2px"
        htmlTable += '<input type="checkbox" id="chkMaster" >';
        htmlTable += '</div>';
        htmlTable += '</th>';
        
        htmlTable += '<th width="'+_listTableColWidthArr[1]+'" ';
        htmlTable += ' style="' + tdStyle + '"';
        htmlTable += 'nowrap>';
        htmlTable += '<b>Media Name</b>';
        htmlTable += '</th>';    
        
        htmlTable += '<th width="'+_listTableColWidthArr[2]+'" ';
        htmlTable += ' style="' + tdStyle + '"';
        htmlTable += 'nowrap>';
        htmlTable += '<b>Description</b>';
        htmlTable += '</th>';   
        
        htmlTable += '<th width="'+_listTableColWidthArr[3]+'" ';
        htmlTable += ' style="' + tdStyle + '"';
        htmlTable += 'nowrap>';
        htmlTable += '<font color="red">*</font></b><b>Duration</b>';
        htmlTable += '</th>';   
        
        htmlTable += '<th width="'+_listTableColWidthArr[4]+'" ';
        htmlTable += ' style="' + tdStyle + '"';
        htmlTable += 'nowrap>';
        htmlTable += '<b>Total Elapsed Time</b>';
        htmlTable += '</th>';  
        
        var fifthWidth = _listTableWidth - (parseInt(_listTableColWidthArr[0])+parseInt(_listTableColWidthArr[1])+parseInt(_listTableColWidthArr[2])+
                                              parseInt(_listTableColWidthArr[3])+parseInt(_listTableColWidthArr[4]));
        
        //htmlTable += '<th width="'+_listTableColWidthArr[5]+'" ';
        htmlTable += '<th width="'+fifthWidth+'" ';
        htmlTable += 'style="'+ tdStyle +'"';
        htmlTable += 'nowrap>';
        
        htmlTable += '<div style="float:left; margin-top:4px; font-weight: bold">Transition Effect/Duration</div>';
        
        htmlTable += '<div style="float:right;margin-right:16px;">';
        htmlTable += '<button name="btnUp" style="cursor:hand;">';
        //htmlTable += '<img src="/modules/playlist/img/totaltime.png" style="width:10px;height:1px;margin-right:4px">';
        htmlTable += '<img src="/modules/playlist/img/up.gif;jsessionid='+
						 window.jsessionid + '" />';
        htmlTable += '</button>';
        htmlTable += '<button name="btnDown" style="cursor:hand;">';
        htmlTable += '<img src="/modules/playlist/img/down.gif;jsessionid='+ 
                         window.jsessionid +'" />';
        htmlTable += '</button>';
        htmlTable += '</div>';
        
        htmlTable += '</th>';
        
        htmlTable += '</tr>';
        
        htmlTable += '</thead>';
        
        return htmlTable;
    };
    
    /**
    * Performance tuning - change the way to get the table.
    * Update the check box index.
    * Any change(add, delete, drag & drop) needs to do this action.
    * Thumbnail view changes should maintain this index too.
    */
    this.refreshIndex = function(){
        var scrollTbl = self.getMainTableScrollObj();
        if(scrollTbl){
            jQuery(scrollTbl).find("tr").each(function(idxTr){
                
                var chkObj = jQuery(this).find("input[name=chkMedia]");
                if(chkObj){
                    jQuery(chkObj).prop("value", idxTr+1);
                    jQuery(chkObj).attr("rowIdx", idxTr+1);
                }
                
            });            
        }
              
    };
    
    /**
    * Performance tuning - change the way to get the table.
    * Update the originalValue of check box by index.
    * NOTE: This step is the last one, should call it to update the originalValue.
    * Thumbnail view changes should maintain this index too.
    */
    this.refreshOriginValue = function(){
        
        var scrollTbl = self.getMainTableScrollObj();
        if(scrollTbl){
            jQuery(scrollTbl).find("tr").each(function(idxTr){
                var chkObj = jQuery(this).find("input[name=chkMedia]");
                if(chkObj){
                    jQuery(chkObj).attr("originalValue", idxTr+1);
                    jQuery(chkObj).attr("rowIdx", idxTr+1);                                        
                }
            });
        }
        
//        jQuery( "input[name=chkMedia]" ).each(function(index){

//            jQuery(this).attr("originalValue", index+1);    
//        });      
    };
    
    this.updateMediaArrByIndex = function(){
        var newMediaArr = [];
        var testChkObjArr = [];
        var originalSelectedMediaIdArr = [];
        
        if(_localZoneMedias && _localZoneMedias.length>0){
            var seq = "";
            var originSeq = "";
            var mediaId = "";
            var noPush = "Yes!";
            
            var chkObj;
            
            var scrollTbl = self.getMainTableScrollObj();
            
            if(scrollTbl){
                
                jQuery(scrollTbl).find( "input[name=chkMedia]" ).each(function(index){
                    chkObj = jQuery(this);

                    testChkObjArr.push(chkObj);

                    seq = chkObj.prop("value");
                    mediaId = chkObj.prop("id");
                    //Get the customize attribute by 'attr'
                    originSeq = chkObj.attr("originalValue");
                    originalSelectedMediaIdArr.push(originSeq);                                        
                    
                    for(var idx=0; idx<_localZoneMedias.length; idx++){
                        noPush = "Yes!"                                                
                        
                        if(_localZoneMedias[idx].mediaid == mediaId && _localZoneMedias[idx].sequence == originSeq){
                            _localZoneMedias[idx].sequence = seq;
                            _localZoneMedias[idx].id = seq;
                            newMediaArr.push(_localZoneMedias[idx]);
                            noPush = "";
                            break;
                        }
                    }
                });    
            }//end if(scrollTbl)
                
        }
                        
        if(_localZoneMedias.length == newMediaArr.length){
            _localZoneMedias = newMediaArr;    
        }else{
            console.log("ERR:_localZoneMedias and newMediaArr size is different!");            
        }
        
        return newMediaArr;
    };
    
    /**
    * Update the local media array object and thumbnail view selected media by the list table selected media.
    * Be sure the local media index is correct after add/delete/drag & drop. 
    * @param {type} lastIdx description
    */
    this.updateThumbnailSelectedIndex = function(lastIdx){
        var selectedMediaArr = self.getSelectedMediaIndexFromTable();
        //var selectedMediaArr = self.getSelectedMediaByArr();
        
        _zoneMediaView.unselectAll();
        
        if(selectedMediaArr && selectedMediaArr.length>0){
            for(var idx=0; idx<selectedMediaArr.length; idx++){
                if(selectedMediaArr[idx]){
                    try{
                        //Update the local media array checked
                        _localZoneMedias[selectedMediaArr[idx]-1].$selected = true;
                        
                        if(_zoneMediaView){
                            
                            _zoneMediaView._select_mark(selectedMediaArr[idx], true);    
                        }
                        
                    }catch(err){
                        console.log(err);
                    }
                }
            }
            
            //Update the media array on thumbnail view
            _zoneData.setZoneMedias(currentZoneId, _localZoneMedias); 
        }
    };
    
    this.updateThumbnailSelectedIndexByArr = function(lastIdx){
        var selectedMediaArr = self.getSelectedMedia(0);
        if(selectedMediaArr && selectedMediaArr.length>0){
            _zoneMediaView.select(selectedMediaArr,false, false);
        }
    };
    
    /**
    * This is for the dropping data function working on list table.
    * Get data from the PlaylistZoneMediaEdit and get the current data, then update back.
    * This just handles the sequence. Refresh after drag & drop.
    * Refresh after delete.
    * @param {type} lastIdx description
    */
    this.dropRefreshThumbnailData = function(lastIdx){
        //Update the index by new drop position
        self.refreshIndex();
        //Update the data by new index.
        self.updateMediaArrByIndex();
        
        if(zoneMediaCtrl && _zoneMediaView && _zoneData && currentZoneId && _localZoneMedias){
            //Update the thumbnail data
            _zoneData.setZoneMedias(currentZoneId, _localZoneMedias);              
            zoneMediaCtrl.setViewData(_localZoneMedias);
        }
        
        var selectedMediaArr = self.getSelectedMedia(0);
        var allMedia = self.getMediaArr();
        
        if(selectedMediaArr && selectedMediaArr.length>0){
            for(var idx=0; idx<selectedMediaArr.length; idx++){
                if(selectedMediaArr[idx]){
                    try{
                        if(_zoneMediaView){
                            _zoneMediaView.unselectAll();
                            //_zoneMediaView._select_mark(selectedMediaArr[idx], true);  
                            _zoneMediaView.select(selectedMediaArr[idx], true);
                        } 
                    }catch(err){
                        console.log(err);
                    }
                }
            }
        }
        self.refreshOriginValue();
    };//end dropRefreshThumbnailData
    
    /**
    * Update the selected status after the media thumbnail view onselect event trigger.
    * NOTE: Update _localZoneMedias before call this function.
    */
    this.refreshTableIndexByMediaArr = function(){
        
        //Suppose the media array will be the same, just check the check box status.
        if(_localZoneMedias && _localZoneMedias.length>0){
            var scrollTbl = self.getMainTableScrollObj();
            if(scrollTbl){
                var trArr = jQuery(scrollTbl).find("tr");
                for(var trIdx=0; trIdx<trArr.length; trIdx++){
                    var chkObj = jQuery(trArr[trIdx]).find("input[name=chkMedia]"); 
                    if(chkObj){
                        if(_localZoneMedias[trIdx].$selected){
                            jQuery(chkObj).prop("checked",true);
                            jQuery(trArr[trIdx]).addClass("ui-state-highlight");
                        }else{
                            jQuery(chkObj).prop("checked",false);
                            jQuery(trArr[trIdx]).removeClass("ui-state-highlight");
                        }    
                    }
                }
            }
        }
    };
    
    /**
    * Performance tuning.
    * This function is for the media drop on thumbnail view, then update the list table.
    * The list view reflects the thumbnail view selected items status.
    * Get the selected media array, remove them, and insert to list table by new index.
    * NOTE: Before the drop event, the onSelectChange event will be triggered and the list table index will be changed.
    *       But the selected index is correct, the data is wrong. 
    *       It should be re-index the row data to the correct sequence. 
    * Assume both the local media array and the list table are correct. Doesn't break by other events. 
    * Mark the selectedSourceIndexs to delete, and insert before the context.target.
    *
    * @param context.start The 1st select media array. (Begin from one.) 
    * @param selectedSourceIndexs.target The drop target index, insert before this one
    * @param selectedSourceIndexs The selected media array index.(Begin from zero.)
    * @param newSelectedStartIdx The final 1st fixed position of the selected items after dropping items.
    */
    this.refreshTableByMediaArr = function(context, selectedSourceIndexs, newSelectedStartIdx){
    	
    	
        var dirParam = 1;   
        //Media index begin from 1.
        var startIdx = parseInt(context.start);
        var targetIdx = parseInt(context.target);
        
        var selectedRowCnt = 0;        
        var selectedSourceArr=[];
        if(selectedSourceIndexs.contains && selectedSourceIndexs.contains(",")){
            selectedSourceArr = selectedSourceIndexs.split(",");    
        }else{
            selectedSourceArr.push(selectedSourceIndexs);
        }
        
        if(selectedSourceArr && selectedSourceArr.length>0){
            selectedRowCnt = selectedSourceArr.length; 
        }
        
        
        var actionObject = new Object();
//        if(context){
//            dirParam = startIdx > targetIdx ? 1 : -1;
//        }
        
        //Move the item to more index value
//        if(dirParam<0){
//            if(selectedRowCnt>1){
//                if( (newSelectedStartIdx-targetIdx)<selectedRowCnt ){
//                    targetIdx++; //is +1 correct? or +(selectedRowCnt-1) -->test it   
//                }                
//            }else{
//                if(newSelectedStartIdx==targetIdx){

//                    targetIdx++;
//                }    
//            }            
//        }else{//Move the item to lower index value
//            if(newSelectedStartIdx>targetIdx){

//                targetIdx++;
//            }
//        }
        
        //Get the selected media array
        var selectedMediaArr = [];
        
        if(_localZoneMedias && _localZoneMedias.length>0){
            //remove the selected first, search by media id and original sequence
            if(selectedSourceIndexs && selectedSourceIndexs.length>0){    
                var scrollTbl = self.getMainTableScrollObj();
                var scrollTbodyObj = self.getTbodyObj();
                
                if(scrollTbl && scrollTbodyObj){
                    var selectedChkArr = [];
                    
                    var selectedTrArr = [];
                    var unselectedTrArr = [];
                    var targetTr;
                    var emptyTr;
                    //var blnSelected = false;
                    var trArr = jQuery(scrollTbodyObj).find("tr");
                    
                    for(var trIdx=0; trIdx<trArr.length; trIdx++){
                        
                        //blnSelected = false;
                        
                        //Save the targeet position object
                        if( (targetIdx-1) === trIdx){
                            targetTr = trArr[trIdx];
                        }
                        
                        //Check the tr in the selected sources id or not
                        for(var selectedIdx=0; selectedIdx<selectedSourceIndexs.length; selectedIdx++){
                            //Use Tr index as the condition, compare to the selected source index 
                            //selectedSourceIndexs is the array index, could compare to the loop index 
                            if(selectedSourceIndexs[selectedIdx] === trIdx){
                                //blnSelected = true;
                                //Remove it and save to the array, insert it before target later
                                selectedTrArr.push(trArr[trIdx]);
                                jQuery(trArr[trIdx]).remove();
                                
                            }
                        }
                        
                    }//end for(var trIdx=0; trIdx<trArr.length; trIdx++)
                    
                    trArr = jQuery(scrollTbodyObj).find("tr");
                    
                    if(selectedTrArr && selectedTrArr.length>0){
                        for(var trIdx=0; trIdx<trArr.length; trIdx++){
                            if( (trIdx+1) === newSelectedStartIdx ){
                                //Insert before the target TR
                                for(var selectIdx = 0; selectIdx<selectedTrArr.length; selectIdx++){
                                    jQuery(selectedTrArr[selectIdx]).insertBefore(jQuery(trArr[trIdx]));                                      
                                }
                                
                            }
                        }
                    }
                    
                }
            }
        }
        
    };
    
  
    
    /**
    * Compare 2 tr objects.
    *
    * @param trOne target objects.
    * @param trTwo target objects.
    * @return true the 2 objects are the same.
    */
    this.compareTrObj = function(trOne, trTwo){
        var blnSame = false;
        if(trOne && trTwo){
            var chkOne = jQuery(trOne).find("input[name=chkMedia]");
            var chkTwo = jQuery(trTwo).find("input[name=chkMedia]");
            if(chkOne && chkTwo){
                if( jQuery(chkOne).prop("id") === jQuery(chkTwo).prop("id") &&  
                  jQuery(chkOne).prop("value") === jQuery(chkTwo).prop("value") ){
                    blnSame = true;
                } 
            }
        }
        
        return blnSame;
    };
    
    /**
    * Get data from the PlaylistZoneMediaEdit and get the current data, then update back.
    * This just handles the sequence. Refresh after drag & drop.
    * Refresh after delete.
    * @param lastIdx
    */
    this.refreshThumbnailData = function(lastIdx){
        //var __zoneData = ;
        var zoneMedias = _zoneData.getZoneMedias(currentZoneId);
        var oneMedia;
        var tmpMediaObj;
        var newMediaArr = [];
        var selectedIdArr = [];
        //Time issue
        jQuery( "input[name=chkMedia]" ).each(function(index){
            oneMedia = new Object();
            oneMedia.$selected = jQuery(this).prop("checked");
            oneMedia.id = jQuery(this).prop("value");
            oneMedia.mediaid = jQuery(this).prop("id");
            
            tmpMediaObj = self.getMediaObjectFromArr(zoneMedias, oneMedia);
            
            
            if(tmpMediaObj){
                tmpMediaObj.id = index+1;
                tmpMediaObj.sequence = index+1;
                tmpMediaObj.$selected = oneMedia.$selected;
                
                //update the current check box id(media id) and value(sequence on the list table).
                jQuery(this).prop("id", tmpMediaObj.mediaid);
                jQuery(this).prop("value", tmpMediaObj.sequence);
                
                newMediaArr.push(tmpMediaObj);
                if(tmpMediaObj.$selected === true){
                    selectedIdArr.push(index+1);
                }
            }
        });    
        
        if(zoneMediaCtrl && zoneMediaCtrl.setViewData){
            
            //zoneMediaCtrl.setViewData(newMediaArr);
            _zoneMediaView.parse(newMediaArr, "json");
            _zoneData.setZoneMedias(currentZoneId, newMediaArr);
            self.setZoneMedias(newMediaArr);
            
            if(selectedIdArr && selectedIdArr.length>0){
                //NOTE: dhtmlx.js needs to unselect all then select by the id array.
                //The 2nd flag will let the 1st selected to last selected to selected status. 
                _zoneMediaView.unselectAll();
                _zoneMediaView.select(selectedIdArr, true, false);
                
//                for(var idx=0; idx<selectedIdArr.length;idx++){
//                    var tmpId = selectedIdArr[idx];
//                    _zoneMediaView.select(tmpId, false);
//                    //_zoneMediaView.select(selectedIdArr[idx]);
//                }
            }else{
                if(lastIdx){
                    _zoneMediaView.select(lastIdx+1, true, false);
                }
            }
        }
        
    };
    
    /**
     * 
     * @param {type} zoneMediaArr
     * @param {type} singleMedia
     * @returns {MediaListTable.getMediaObjectFromArr.zoneMediaArr}
     */
    this.getMediaObjectFromArr = function(zoneMediaArr, singleMedia){
        if(zoneMediaArr && zoneMediaArr.length>0 && singleMedia){
            for(var idx=0; idx<zoneMediaArr.length; idx++){
                
                try{
                    if(zoneMediaArr[idx].sequence == singleMedia.id && zoneMediaArr[idx].mediaid == singleMedia.mediaid){
                        return zoneMediaArr[idx];
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
    };
    
	/** Get combo data and compose the table. */
    this.loadTransitionData = function(){
        
        var comboDat = null;
        var urlDat = "/modules/playlist/transition.action;jsessionid="+window.jsessionid;
        
        jQuery.post( urlDat, null,
              function(data) {            
                  transitionComboData = data;    
                  //comboDat = data;
                  
                  self.initializeMain();    
            
                  return data;
              }
        );
        return comboDat;
    };//end loadTransitionData
    
    /**
    * Initialize the main media list table.
    */
    this.initializeMain = function(){
        
        //Count the width by zoneList before print table  
        self.countWidthByZoneList();
        
        //Create tha main table
        self.printTable();    

        //Set up the related events and UI styles.
        //if(self.getZIndex()>0){
                        
        var startTime = new Date();
        var mainTableScrollObj = jQuery('#'+attrsObj.divId+' .tblMainListCls');
        //var mainTableScrollObj = _zoneContentListView.find(".tblMainListCls");

        self.scrolify(mainTableScrollObj, _listTableHeight,_listTableWidth); 
        var endTime = new Date();
        

        self.attachHeadScroll();
        
        //Initialize the width & height
        self.setTableAreaWidthHeight();
        
        self.initMultipleDragAndDrop();
        
        
        //if(isChrome){
        //	self.initResizeEvent();
        //}                

        self.adjustMainStyle();
        
        self.setTransitionComboValue();
        
        self.setTransitionDurationComboValue();
        
        self.lockComboxNone();
        

        self.refreshTotalElapsedtime();                

        self.resizeCol();        
    };
            
    //End function area
	 /**
    * Because the unsynchronized issue, begin from the data request call,
    * and continue the next step after receiving the data. 
    */
    var comboDat ;
    
    jQuery( document ).ready(function() {
        
        self.initParams();
    
        //Check the combo data
        if(transitionComboData){
            //Call the initialize function with combo data
            self.initializeMain();
        }else{
            //Call the loading combo data first before initializing the table
            self.loadTransitionData();    
        }
    });    
	
	
}//end function MediaListTable

/**
* Fix jQuery clone issue.
* Textarea and select clone() bug workaround | Spencer Tipping
* Licensed under the terms of the MIT source code license
*
* Motivation.
* jQuery's clone() method works in most cases, but it fails to copy the value of textareas and select elements. 
* This patch replaces jQuery's clone() method with a wrapper that fills in the
* values after the fact.
*
* An interesting error case submitted by Piotr Przybył: If two <select> options had the same value, the clone() method would select the wrong one in the cloned box. 
* The fix, suggested by Piotr
* and implemented here, is to use the selectedIndex property on the <select> box itself rather than relying on jQuery's value-based val().
* 
* See https://github.com/spencertipping/jquery.fix.clone/blob/master/jquery.fix.clone.js
*     http://stackoverflow.com/questions/742810/clone-isnt-cloning-select-values
* @param original The original html object.    
*/
(function (original) {
  jQuery.fn.clone = function () {
    var result           = original.apply(this, arguments),
        my_textareas     = this.find('textarea').add(this.filter('textarea')),
        result_textareas = result.find('textarea').add(result.filter('textarea')),
        my_selects       = this.find('select').add(this.filter('select')),
        result_selects   = result.find('select').add(result.filter('select'));

    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
    for (var i = 0, l = my_selects.length;   i < l; ++i) result_selects[i].selectedIndex = my_selects[i].selectedIndex;

    return result;
  };
}) (jQuery.fn.clone);