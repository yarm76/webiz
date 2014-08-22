package com.namo.pt.cloud.dgist.component.module.userlogincust.control;

import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.namo.pt.common.service.CommonSiteMapService;
import com.namo.pt.core.common.util.PinetreeUtil;
import com.namo.pt.core.common.util.StringUtil;
import com.namo.pt.core.common.util.property.PropertyService;
import com.namo.pt.core.engine.component.control.AbstractComponentControl;
import com.namo.pt.core.engine.component.data.ComponentResultModel;
import com.namo.pt.core.engine.startup.PineTree;
import com.namo.pt.sitemgr.user.service.UserService;
import com.namo.pt.sitemgr.userinfo.service.SiteUserItemConfigService;

/**
 * UserLoginControl class
 * @author Hai.Vu
 * @version 1.0
 * @since 2013/03/04
 */
@Component
public class UserLoginCustControl extends AbstractComponentControl {
 
    @Override
    public ComponentResultModel doControl(HttpServletRequest request, HttpServletResponse response,
                                          String methodName, Map<String, Object> componentConfig) {
        ComponentResultModel componentResultModel = new ComponentResultModel();
        Map<String, Object> result = new HashMap<String, Object>();
         
        //todo control load process
        
        componentResultModel.setSceneName(sceneName);
        componentResultModel.setResult(result);

        }

        return componentResultModel;
    }
 
    /**
     * do logout action, after logout going to login page
     * @param request
     * @param response
     */
    private void doLogout(HttpServletRequest request, HttpServletResponse response){
             //todo logout process
    }
 

}
