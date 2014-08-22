package com.namo.pt.cloud.dgist.component.widget.sns.controller;

import com.namo.pt.core.engine.startup.PineTree;
import org.apache.commons.lang.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

/**
 * SnsController
 * <p/>
 * User: thuong
 * Date: 5/23/13
 * Time: 4:38 PM
 */
@Controller
public class SnsController {
    @RequestMapping("/app/view/sns/get-me2day-data.html")
    public void getMe2dayData(HttpServletResponse response, int page, String url){
        HttpClient httpclient = new DefaultHttpClient();
        try {
            // Making a POST request to Me2day API

            if (!StringUtils.isBlank(url)){
                String me2dayAccName = url;
                if (me2dayAccName.indexOf("/") > 0){
                    me2dayAccName = me2dayAccName.substring(me2dayAccName.lastIndexOf("/") + 1, me2dayAccName.length());
                }
                HttpPost httpPost = new HttpPost("http://me2day.net/api/get_posts/" +me2dayAccName+".json");
                List<NameValuePair> params = new ArrayList<NameValuePair>();
                params.add(new BasicNameValuePair("count", "10"));

                String offSet = (page * 10) +"";
                params.add(new BasicNameValuePair("offset", offSet));
                UrlEncodedFormEntity entity = new UrlEncodedFormEntity(params, "UTF-8");
                httpPost.setEntity(entity);

                ResponseHandler<String> responseHandler = new BasicResponseHandler();
                String responseBody = httpclient.execute(httpPost, responseHandler);
                Writer out = response.getWriter();
                out.write(responseBody);
            }
        } catch (Exception e) {
            PineTree.logger.error(e);
        } finally {
            try { httpclient.getConnectionManager().shutdown(); } catch (Exception ignore) {}
        }
    }

}
