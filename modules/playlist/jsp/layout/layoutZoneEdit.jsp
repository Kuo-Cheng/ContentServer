<%--
Dest:
Date:
Author:
--%>
<%@ page import="com.dt.esignage.webserver.utils.CommonUtils"%>
<%@ page import="java.util.Locale"%>
<%@ page import="org.apache.struts.Globals"%>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean"%>
<%
	String languageStr = "en_US";
	Locale aLocale = (Locale) session.getAttribute(Globals.LOCALE_KEY);
	if (null != aLocale) {
		languageStr = aLocale.toString();

	}
%>

<style>
  ul { list-style-type: none; margin: 0; padding: 0; margin-bottom: 10px; }
  li { margin: 5px; padding: 5px; width: 150px; }
</style>
<script language="javascript">
/*
  jQuery(function() {
    jQuery( "#sortable" ).sortable({
      revert: true
    });
    jQuery( "#draggable" ).draggable({
      connectToSortable: "#sortable",
      helper: "clone",
      revert: "invalid"
    });
    jQuery( "ul, li" ).disableSelection();
  });
  */
 
	
</script>
  
<div id="layoutZoneEdit" class="ui-layout-center">

	<!--Start layout zone area div-->
	<div id="layoutArea" class="ui-layout-center templateBg" align="center"
		style="overflow: hidden; z-index: 0;">
		<div id="containerDiv"
			style="height: 100%; width: 100%; overflow: auto;">
			<div id="templateborder9"
				style="position: relative; border: 0px solid blue; margin-top: 10px; margin-bottom: 10px; width: 488px; height: 278px; visibility: hidden"
				align="center">
				<div id="templatDivId"
					style="position: relative; margin: 1px; overflow: hidden; z-index: 0; left :0px; top: 0px; width: 480px; height: 270px; border: solid 0px #666666; background-color: #000000; visibility: hidden"></div>
			</div>
		</div>
	</div>
	<!--End layout zone area div-->

	<div id="zoneList" class="ui-layout-south">
		<!--start attr_tab zone-->
		<div id="attr_tab" class="ui-layout-north">
			<table style="width:100%;height:50px;">
				<tr align="left" valign="top">
					<td nowrap style="width:288px">
						<!--start attr_tab zone right-->
						<div id="attrTabRight" class="attr_tab_right_01" style="width:288px;"> 
							
								<div id="addMedia" class="icon_addMedia002 icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.insert'/>"></div>
								
								<div id="mediaList" class="icon_listMedia icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.edit'/>" ></div>
								
								<div id="importMedia" class="icon_ImportMediaWizard icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.importMediaWizard'/>" ></div>
								
								<div id="replaceMedia" class="icon_replaceMedia icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.replaceMedia'/>" ></div>

								<div id="deleteMedia" class="icon_deleteMedia002 icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.delete'/>" ></div>	
								<!--
								<div id="switchMediaListView" class="icon_listtableMedia icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.edit'/>" style="display:inline"></div>
								<div id="switchMediaThumbnailView" class="icon_unlistMedia icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.edit'/>" style="display:none"></div>
								-->
								<div id="switchMediaListView" class="icon_listtableMedia icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.listView'/>" style="display:inline"></div>
								<div id="switchMediaThumbnailView" class="icon_thumbnailMedia icon_Space010" title="<bean:message key='esignage.playlist.jsp.zone.thumbnail'/>" style="display:none"></div>
								
								<div id="showZoneMedia" class="icon_showBottomZone icon_Space010" ></div>
						</div>
						<div id="attrTabRightTicker" class="attr_tab_right_02" style="display:none;overflow:visible">
                        	<div id="addTicker" class="icon_addMedia002 icon_Space010"  title="<bean:message key='esignage.contentserver.jsp.builtin.library.ticker.rss.tip.newcontent'/>"></div>
                            <div id="deleteTicker" class="icon_deleteMedia002 icon_Space010" title="<bean:message key='playlist.jsp.playlistdetail.delete'/>"></div>	
						</div>
						
					</td>
					<td style="width:100%">
						
						<table style="width:100%;table-layout:fixed">
							<tr>
								<td id="previousZone" class="icon_previousZone" >
								</td>
								<td id="nextZone" class="icon_nextZone">
								</td>
								<td>
									<div style="width:100%;overflow:hidden;position:relative;">
										<div  id="attrTabLeft" style="overflow:hidden;width:145px;height:50px;position:relative;">	
										</div>
									</div>
								</td>
							</tr>
						</table>
						
					</td>
				</tr>
			</table>
		</div>
		<!--end attr_tab zone-->

		<div id="zone_content_area" class="ui-layout-center zone_content_bg">
			<!--start Zone_Content zone-->
			<div id="zone_content" style="background:url(../../../../image/playlistBg/media_<%=languageStr %>.png) no-repeat center center" class="w p2">
			</div>
			
			<%--Content list table: It may show the media list like the original porlet style.--%>
			<!--div id="zone_content_list" style="background:url(../../../../image/playlistBg/media_<%=languageStr %>.png) no-repeat center center" class="w p2"-->
			<div id="zone_content_list" style="background:url(../../../../image/playlistBg/media_<%=languageStr %>.png) no-repeat center center" class="listTbContainer">
				
			</div>
			<!--end Zone_Content_list zone-->
			
			<div id="zone_content_ticker" style="display:none">
			</div>
		</div>
	</div>
	
	
</div>
<div class="fullborder" align="left" id="TransitionEffectDiv" name="TransitionEffectDiv" style="display:none;position:relative;outline:none;BACKGROUND-COLOR:#FFFFFF;border:0px solid #CCCCCC;z-index:1; width:320px; height:380px" isInDiv="false"  tabindex="0" > 
	<table  id="TransitionEffectTab"  bgcolor="white" width="100%"  height="200" style="border:1px solid #ABADB3" cellpadding="0" cellspacing="0" effectvalue="" >
		<tr>
			<td>
				<!-- iframe id="transitionTree" frameborder="0" width="100%" height="330px" src="/modules/playlist/jsp/transitiontree.jsp;jsessionid=<%=session.getId() %>?<%=Math.random() %>"></iframe-->
				<!-- iframe id="transitionTree"  scrolling="no" frameborder="0" width="100%" height="380px" src="/modules/playlist/jsp/playlistTransition.jsp;jsessionid=<%=session.getId() %>?<%=Math.random() %>"></iframe -->
			</td>
		</tr>
	</table>
 </div>

 