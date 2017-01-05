<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tags/dt.tld" prefix="dt"%>
<%@ taglib uri="/WEB-INF/struts-bean.tld" prefix="bean"%>
<%@ taglib uri="/WEB-INF/struts-html.tld" prefix="html"%>
<%@ taglib uri="/WEB-INF/struts-logic.tld" prefix="logic"%>
<%@ page import="java.util.*,org.apache.struts.Globals"%>
<%
	response.setHeader("Pragma", "No-Cache");
	response.setHeader("Cache-Control", "No-Cache");
	response.setDateHeader("Expires", 0);
%>
<%@ include file="./messages.jsp"%>

<link rel="stylesheet" type="text/css"
	href="<%=request.getContextPath()%>/modules/playlist/css/playlist.css" />
<!-- Begin template usage JavaScript -->
<script  type="text/javascript" src="<%=request.getContextPath()%>/js/common/cookie4view.js">
</script>
<script src="/modules/playlist/js/SpryAccordion.js" type="text/javascript"></script>
<script src="/modules/playlist/js/transitionAnimation.js" type="text/javascript"></script>
<link href="/modules/playlist/css/SpryAccordion.css" rel="stylesheet" type="text/css" />
<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/outer/toolbar.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/js/common/common.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/updateTemplate.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/common/dialog/SelectMediaDialog/js/MediaViewDialog.js"></script>

<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/DecimalInput.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/PixelDecimalInput.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/FloatCompute.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/EquationMaintainer.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Position.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/PixelPosition.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/PercentPosition.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Scale.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/SynPerAndPix.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Mode.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Observer.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/TemplateObject.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Shape.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Resize.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/UnlockResize.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/LockResize.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Stick.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Rectangle.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/DottedLine.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/ScreenGrid.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/BgimageZone.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/NormalZone.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/BorderRectangle.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/DragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/LeftTopDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/LeftBottomDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/LeftMiddleDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/RightTopDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/RightBottomDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/RightMiddleDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/BottomMiddleDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/TopMiddleDragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Default8DragDiv.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/DragRectangle.js"></script>

<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/TemplateImp.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/TickerZone.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Container.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/base64.js"></script>

<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Attribute.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/Zindex.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/template/TemplateDetailFrame.js"></script>

<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/playlist/old/js/fontfamilylist.js"></script>


<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/js/TemplateEventInteractor.js"></script>

<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/jsp/dialog/playlistSetting/PlaylistSettingDialog.js"></script>
	
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/dialog/searchPlaylistDialog/js/searchPlaylist.js"></script>
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/common/pageToolbar/js/searchtoolbar2.js"></script> 
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/jsp/dialog/playlistSetting/PlaylistSetting.js"></script>
	
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/jsp/dialog/textMarqueeEditor/textMarqueeEditor.js"></script>

<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/jsp/dialog/PlaylistSceneDialog/SceneAttr.js"></script>

<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/js/EditPlaylist.js"></script>	

<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/js/DataView.js"></script>

<script type="text/javascript" 
	src="<%=request.getContextPath()%>/modules/common/dialog/selectPlaylistDialog/js/selectPlaylisDialog.js">
</script>
		
<script language="javascript"
	src="<%=request.getContextPath()%>/modules/playlist/js/PlaylistView.js"></script>

 <script  type="text/javascript" src="<%=request.getContextPath()%>/modules/playlist/js/playlistAttr.js">
</script>
<script type="text/javascript" 	
    src="<%=request.getContextPath()%>/modules/playlist/js/Playlist_Scenelist.js">	
</script>
<script type="text/javascript" 	
    src="<%=request.getContextPath()%>/modules/playlist/js/SceneMemento.js">	
</script> 
<script type="text/javascript" 	
    src="<%=request.getContextPath()%>/modules/playlist/js/ThumbnailFunc.js">	
</script>
<!-- End template usage JavaScript -->

<script type="text/javascript" 
	src="<%=request.getContextPath()%>/modules/playlist/dialog/publishPlaylist/js/publishPlaylistDialog.js">
</script>

<script type="text/javascript" 
	src="<%=request.getContextPath()%>/modules/playlist/js/PlaylistZoneTickerEdit.js">
</script>

<script type="text/javascript" 
	src="<%=request.getContextPath()%>/modules/media/js/extension.js">
</script>

<script type="text/javascript" 
	src="<%=request.getContextPath()%>/modules/playlist/zone/excel/js/dlgWindow.js">
</script>
<link href="<%=request.getContextPath()%>/modules/playlist/zone/excel/css/main.css" rel="stylesheet" type="text/css" />

<script type="text/javascript"
        src="<%=request.getContextPath()%>/modules/playlist/js/PlaylistZoneMediaEdit.js">
</script>

<script type="text/javascript"
        src="<%=request.getContextPath()%>/modules/playlist/js/PlaylistZoneMediaListTable.js">
</script>
<script type="text/javascript"
        src="<%=request.getContextPath()%>/modules/playlist/js/colResizable-1.6.js">
</script>
<script type="text/javascript"
        src="<%=request.getContextPath()%>/modules/playlist/js/multidraggable.js">
</script>
<link href="<%=request.getContextPath()%>/modules/playlist/css/multidraggable.css" rel="stylesheet" type="text/css" />


<script type="text/javascript" 
	src="<%=request.getContextPath()%>/modules/playlist/js/transition.js">
</script>

<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/playlist/js/EIPlaylist.js">
</script>
<script type="text/javascript" id="dt_cm_modules_playlistWrapper_js"
	src="<%=request.getContextPath()%>/modules/playlist/js/playlistWrapper.js">	
</script>
<!-- script /modules/playlist/js/dragSelect.js">	</script-->
<script  type="text/javascript" src="<%=request.getContextPath()%>/modules/common/copyAndPaste/copyAndPasteDialog2.js">
</script>
<script  type="text/javascript" src="<%=request.getContextPath()%>/modules/common/dialog/colorpicker/ColorPickerDialog.js">
</script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/modules/playlist/jsp/dialog/textMarqueeEditor/textMarqueeGenerate.js"></script>
<script type="text/javascript" src="/modules/playlist/js/html2canvas/html2canvas.js"></script>

<%@ include file="./layout/messageJS.jsp"%>
<%@ include file="./playlistFrame.jsp"%>
<!--jsp:include page="./playlistFrame.jsp" flush="true"/-->
<%@ include file="./sceneList.html"%>
<%@ include file="./playlistViewNodeTemplate.html"%> 