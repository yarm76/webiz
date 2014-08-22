package com.namo.pt.cloud.dgist.component.module.userlogincust.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import sutil.Encrypt;

import com.namo.pt.cloud.dgist.component.module.userlogincust.service.UserLoginCustService;
import com.namo.pt.core.common.Constants;
import com.namo.pt.core.common.util.PinetreeUtil;
import com.namo.pt.core.common.util.StringUtil;
import com.namo.pt.sitemgr.user.data.User;
import com.namo.pt.sitemgr.user.service.UserService;

@Service
public class UserLoginCustServiceImpl implements UserLoginCustService {
	
	@Autowired
	UserService userService;
	
	public static final String[] USER_AUTH_STAFFS = {"감사","교원","단장","본부장","부장","센터장","실장","전공책임교수","전문위원","직원","처장","총장","팀장"};
	public static final String USER_POST_DEPT = "000043";
	
	/**
	 * 로그인 처리를 한다.
	 * @param paramMap
	 * @param request
	 * @return 로그인 결과값이 할당된 MAP
	 */
	@Override
	public Map<String, Object> login(Map<String, Object> paramMap, HttpServletRequest request) {

		String userId = (String)paramMap.get("userId");
		String siteId = PinetreeUtil.getSiteId(request);
		String password = (String)paramMap.get("password");
		String loginType = "";
		
		if(paramMap.get("loginType")!=null){
			loginType = (String)paramMap.get("loginType");
		}
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			if(loginType.equals("siteuser")){
				User user = userService.getBySiteIdUserIdAndPassword(siteId, userId, password);
	            if (user != null && user.getUserNo() > 0) {
	                map.put("success", true);
	                request.getSession().setAttribute(Constants.SYSTEM_ATTR_USERNO, user.getUserNo());
	                request.getSession().setAttribute(Constants.SYSTEM_ATTR_USERID, user.getUserId());
					gainSpringAuthentication(user, siteId);
	
	            }else{
	                 map.put("wrongpwd", true);
	            }
			}else{
				String userName=(String)paramMap.get("korRelPsnNm");
				String sttsClsfDcdNm=(String)paramMap.get("sttsClsfDcdNm");
				String userNo=(String)paramMap.get("sttsNo");
				String infoTeamNo=(String)paramMap.get("posiDeptCd");
				String infoTeamNoNm=(String)paramMap.get("posiDeptCdNm");
				
				Long setInfoTeamNo = null;
				if (siteId.equals("dgist_itc")) {
					// 학술정보팀유저
					if(!StringUtil.isEmpty(infoTeamNo) && infoTeamNo.equals("000043")) {
						setInfoTeamNo = StringUtil.parseLong(userNo, 0);
						userNo = "61";
					} else {
						// 일반유저
						setInfoTeamNo = StringUtil.parseLong(userNo, 0);
						userNo = "62";
					}
				}
		        map.put("wrongid", true);
		        if (siteId != null && userId != null) {
		        	User user = new User();
		        	user.setUserNo(StringUtil.parseLong(userNo, 0));
		        	if (Arrays.asList(USER_AUTH_STAFFS).contains(sttsClsfDcdNm)) {
		        		user.setBusinessNo("1");
		        	} else {
		        		user.setBusinessNo("2");
		        	}
		            user.setUserName(userName);
		            user.setUserEmail("");
		            user.setUserId(userId);
		            user.setInfoTeamNo(setInfoTeamNo);
		            user.setInfoTeamNm(infoTeamNoNm);
		            if (user != null && user.getUserNo() > 0) {
		                map.put("success", true);
		                request.getSession().setAttribute(Constants.SYSTEM_ATTR_USERNO, user.getUserNo());
		                request.getSession().setAttribute(Constants.SYSTEM_ATTR_USERID, userId);
						gainSpringAuthentication(user, siteId);
		
		            }else{
		                 map.put("wrongpwd", true);
		            }
		        }
			}
        } catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return map;
	}
	
	/**
	 * 로그인 아이디 유효성 검사 및 권한을 설정한다.
	 * @param paramMap
	 * @param request
	 * @return 유효성 검증결과가 할당된 MAP
	 */
	@Override
	public Map<String, Object> userIdCheck(Map<String, Object> paramMap, HttpServletRequest request) {
		Map<String, Object> map = new HashMap<String, Object>();
		String businessNo = PinetreeUtil.getLoginUser().getBusinessNo();
		if ("1".equals(businessNo)) {
			map.put("auth", "1");
		} else if ("2".equals(businessNo)){
			map.put("auth", "2");
		} else {
			map.put("auth", "0");
		}
		return map;
	}
	
	/**
	 * 로그인 아이디의 인코딩 데이터를 할당한다.
	 * @param paramMap
	 * @param request
	 * @return 생성된 인코딩데이터가 할당된 MAP 
	 */
	public Map<String, Object> userIdEncode(Map<String, Object> paramMap, HttpServletRequest request) {
		Map<String, Object> map = new HashMap<String, Object>();
		String userId = (String)paramMap.get("userId");
		
		String encodeId = dgistHomePage(userId);
		map.put("encodeId", encodeId);
		return map;
	}
	
	/**
	 * 로그인 아이디의 인코딩 데이터를 생성한다.
	 * @param userId
	 * @return String
	 */
	public String dgistHomePage(String userId) {
		String dgistPortal = "DGISTPORTAL&SSODELI&"+userId;
		return EncodeBySType(dgistPortal);
	}
	
	/**
	 * 인코딩 데이터를 NULL로 치환한다.
	 * @param strData
	 */
	public String EncodeBySType(String strData){
		String strRet = null;
		/*strRet = Encrypt.com_Encode(":" + strData + ":sisenc");*/
		return strRet;	
	}
	
	/**
	 * 디코딩 데이터를 NULL로 치환한다.
	 * @param strData
	 * @return String
	 */
	public String DecodeBySType(String strData){
		String strRet = null;
		/*int e, d, s, i=0;
		strRet = Encrypt.com_Decode(strData);
		e = strRet.indexOf(":");
		d = strRet.indexOf(":sisenc");
		strRet = strRet.substring(e+1, d);*/
		return strRet;
	}

	/**
	 * 솔루션 권한을 할당한다.
	 * @param user
	 * @param siteId
	 */
    private void gainSpringAuthentication(User user, String siteId) throws Exception {
        Authentication auth = getUserAuthentication(user, siteId);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
    
	/**
	 * 권한세션에 사이트 아이디별 사용자아이디 를 할당한다.
	 * @param user
	 * @param siteId
	 * @return UsernamePasswordAuthenticationToken 솔루션 권한객체
	 */
    private UsernamePasswordAuthenticationToken getUserAuthentication(User user, String siteId){
    	List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
    	
    	authorities.add(new GrantedAuthorityImpl(User.ROLE_USER));

        User sessionUser = new User();
        
        sessionUser.setUserNo(user.getUserNo());
        sessionUser.setUserName(user.getUserName());
        sessionUser.setUserEmail(user.getUserEmail());
        sessionUser.setUserId(user.getUserId());
        sessionUser.setUserStatus("A");
        sessionUser.setSiteId(siteId);
        sessionUser.setAdminYn(1);
        sessionUser.setEncryptType("PlainText");
        sessionUser.setUserNickname("");
        sessionUser.setBusinessNo(user.getBusinessNo());
        sessionUser.setPreventSitePageList(null);
        sessionUser.setInfoTeamNo(user.getInfoTeamNo());
        sessionUser.setInfoTeamNm(user.getInfoTeamNm());

        return new UsernamePasswordAuthenticationToken(sessionUser,  user.getUserPassword(), authorities);
    	
    }

}
