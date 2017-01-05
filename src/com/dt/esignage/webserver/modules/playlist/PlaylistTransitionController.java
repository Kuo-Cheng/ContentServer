package com.dt.esignage.webserver.modules.playlist;


import java.util.Locale;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts.Globals;
import org.apache.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.context.support.ResourceBundleMessageSource;

import com.dt.esignage.webserver.secret.ActionSecretDefine;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * This controller provides the transition combo data of the media list table.
 * Ths layoutZoneEdit.jsp has more fields than this controller, and any change should keep these 2 class and the table the same.
 *   
 * @author Alex
 *
 */
@Controller
public class PlaylistTransitionController {

	private static Logger logger = Logger.getLogger(PlaylistTransitionController.class);

	// @Autowired
	// private PlaylistExportService playlistExportService;

	@Autowired
	private ResourceBundleMessageSource resources;

	private Locale locale;

	/**
	 *
	 * 
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modules/playlist/transition")
	public void getTransitionData(HttpServletRequest request, HttpServletResponse response) {
		try {
			HttpSession session = request.getSession();
			String languageStr = "en_US";
			locale = (Locale) request.getSession().getAttribute(Globals.LOCALE_KEY);
			if (null != locale) {
				languageStr = locale.toString();
			}
			String siteId = session.getAttribute(ActionSecretDefine.DTSITEID) == null ? "" : session.getAttribute(ActionSecretDefine.DTSITEID).toString();
			//String message = getMessage("esignage.contentserver.jsp.playlist.transitioneffect.random");
			
			// resourceBundleMessageSource.getMessage(arg0, arg1, arg2, arg3)
			// String playlistIdStr = request.getParameter("playlistIds");
			response.setContentType("application/json");
			response.getWriter().print(getTransitionData().toString());
		} catch (Throwable t) {
			t.printStackTrace();
			logger.error("Get transition data error: ", t);
		}
	}
	
	private Object getTransitionData(){
		//LinkedHashMap<String, String> mapDat = new LinkedHashMap<String, String>();  
		//JSONObject jsonObject = new JSONObject();  
		JSONArray jsonArray = new JSONArray();  
		
		//jsonObject.put(create("1","0", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.none")));
		jsonArray.add(create("1","0", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.none"),"2"));
		
		 
		jsonArray.add(create("1","-1",getMessage("esignage.contentserver.jsp.playlist.transitioneffect.random"),"3"));
		
		jsonArray.add(create("0","folder.1",getMessage("esignage.contentserver.jsp.playlist.transition.folder.1"),""));
		
		JSONArray jsonArray2 = new JSONArray(); 
		//jsonObject = new JSONObject();
		jsonArray2.add(create("0", "folder.2", getMessage("esignage.contentserver.jsp.playlist.transition.folder.2"),"" ) );
		
		jsonArray2.add(create("1","19", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.003"),"9"));
		jsonArray2.add(create("2","1001", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.004"),"10"));
		jsonArray2.add(create("3","20", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.005"),"11"));
		jsonArray2.add(create("4","1002", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.006"),"12"));
		jsonArray2.add(create("5","21", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.007"),"13"));
		jsonArray2.add(create("6","1003", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.008"),"14"));
		jsonArray2.add(create("7","22", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.009"),"15"));
		jsonArray2.add(create("8","1004", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.010"),"16"));
		jsonArray2.add(create("9","23", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.011"),"17"));
		jsonArray2.add(create("10","24", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.012"),"18"));
		jsonArray2.add(create("11","1005", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.013"),"19"));
		jsonArray2.add(create("12","25", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.014"),"20"));
		jsonArray2.add(create("13","1006", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.015"),"21"));
		jsonArray2.add(create("14","26", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.016"),"22"));
		jsonArray2.add(create("15","13", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.017"),"23"));
		jsonArray2.add(create("16","14", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.018"),"24"));
		jsonArray2.add(create("17","1007", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.019"),"25"));
		jsonArray2.add(create("18","15", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.020"),"26"));
		jsonArray2.add(create("19","1008", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.021"),"27"));
		jsonArray2.add(create("20","27", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.022"),"28"));
		jsonArray2.add(create("21","28", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.023"),"29"));
		jsonArray2.add(create("22","29", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.024"),"30"));
		jsonArray2.add(create("23","30", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.025"),"31"));
		jsonArray2.add(create("24","44", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.026"),"32"));
		jsonArray2.add(create("25","43", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.027"),"33"));
		jsonArray2.add(create("26","45", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.028"),"34"));
		jsonArray.add(jsonArray2);
		
		JSONArray jsonArray3 = new JSONArray(); 
		jsonArray3.add(create("0","folder.3", getMessage("esignage.contentserver.jsp.playlist.transition.folder.3"),""));
		jsonArray3.add(create("1","17", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.029"),"35"));
		jsonArray3.add(create("2","18", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.030"),"36"));
		jsonArray3.add(create("3","39", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.031"),"37"));
		jsonArray3.add(create("4","40", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.032"),"38"));
		jsonArray3.add(create("5","41", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.033"),"39"));
		jsonArray3.add(create("6","42", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.034"),"40"));
		jsonArray3.add(create("7","33", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.035"),"41"));
		jsonArray3.add(create("8","34", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.036"),"42"));
		jsonArray3.add(create("9","35", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.037"),"43"));
		jsonArray3.add(create("10","36", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.038"),"44"));
		jsonArray3.add(create("11","1009", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.039"),"45"));
		jsonArray3.add(create("12","37", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.040"),"46"));
		jsonArray3.add(create("13","38", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.041"),"47"));
		jsonArray3.add(create("14","1010", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.042"),"48"));
		jsonArray3.add(create("15","1011", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.043"),"49"));
		jsonArray.add(jsonArray3);
		
		JSONArray jsonArray4 = new JSONArray(); 
		jsonArray4.add(create("0","folder.4", getMessage("esignage.contentserver.jsp.playlist.transition.folder.4"),""));
		jsonArray4.add(create("1","1", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.044"),"50"));
		jsonArray4.add(create("2","2001", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.060"),"201"));
		jsonArray4.add(create("3","16", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.045"),"51"));
		jsonArray4.add(create("4","46", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.046"),"52"));
		jsonArray4.add(create("5","47", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.047"),"53"));
		jsonArray4.add(create("6","48", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.048"),"54"));
		jsonArray4.add(create("7","1012", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.049"),"55"));
		jsonArray4.add(create("8","49", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.050"),"56"));
		jsonArray4.add(create("9","1013", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.051"),"57"));
		jsonArray.add(jsonArray4);
		
		JSONArray jsonArray5 = new JSONArray();
		jsonArray5.add(create("0","folder.5", getMessage("esignage.contentserver.jsp.playlist.transition.folder.5"),""));
		jsonArray5.add(create("1","50", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.052"),"58"));
		jsonArray5.add(create("2","1014", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.053"),"59"));
		jsonArray5.add(create("3","51", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.054"),"60"));
		jsonArray5.add(create("4","11", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.055"),"61"));
		jsonArray5.add(create("5","1015", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.056"),"62"));
		jsonArray5.add(create("6","12", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.057"),"63"));
		jsonArray5.add(create("7","31", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.058"),"64"));
		jsonArray5.add(create("8","32", getMessage("esignage.contentserver.jsp.playlist.transitioneffect.builtin.059"),"65"));
		jsonArray.add(jsonArray5);
		
		
        //System.out.println("jsonObject2 FROM HASHMAP：" + JSONArray.fromObject(jsonArray));  
        
		//StringBuilder sb=new StringBuilder("");
		
		return JSONArray.fromObject(jsonArray);
	}
	
	private JSONObject create(String seq, String id, String name, String nodeId){
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("seq", seq);
		jsonObject.put("id", id);
		jsonObject.put("nodeId", nodeId);
		jsonObject.put("name", name);
		return jsonObject;
	}
	
	private String getMessage(String key){
		return resources.getMessage(key, null, null, locale);
	}

}
