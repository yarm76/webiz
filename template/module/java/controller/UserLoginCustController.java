package com.namo.pt.cloud.dgist.component.module.userlogincust.controller;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: ngo.ty79
 * Date: 12/9/13
 * Time: 5:07 PM
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping("/app/module/userlogincust/")
public class UserLoginCustController {
	
	/**
	 * sample method
	 * @param paramMap
	 * @param result
	 */
	@RequestMapping("sample.json")
	public void sample( HttpServletRequest request,Map<String, Object> paramMap , Map<String, Object> result){
        result.put("jsonData", null);
	}
	 
}
