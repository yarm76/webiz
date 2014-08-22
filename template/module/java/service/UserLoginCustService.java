package com.namo.pt.cloud.dgist.component.module.userlogincust.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface UserLoginCustService {

	public Map<String, Object> login(Map<String, Object> paramMap, HttpServletRequest request);
	 
	public Map<String, Object> userIdCheck(Map<String, Object> paramMap, HttpServletRequest request);
	
	public Map<String, Object> userIdEncode(Map<String, Object> paramMap, HttpServletRequest request);
	
}
