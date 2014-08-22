package com.namo.pt.cloud.dgist.component.module.userlogincust.dao;

import java.util.Map;

import com.namo.pt.sitemgr.user.data.User;

public interface UserLoginCustDao {
	
	/**
	 * 로그인 하는 사용자 정보를 가져온다.
	 * @param paramMap
	 * @return USER - 사용자 객체
	 */
	public User getUserInfo(Map<String, Object> paramMap);

}
