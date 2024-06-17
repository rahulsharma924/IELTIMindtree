package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.PLPCTGraphqlProductsService;
import com.aem.ie.core.configuration.PLPCTGraphqlProductsConfig;
import com.aem.ie.core.servlets.PLPCTGraphqlProductsServlet;
import com.google.gson.JsonObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Arrays;

@Component(service = PLPCTGraphqlProductsService.class,immediate = true)
@Designate(ocd = PLPCTGraphqlProductsConfig.class)
public class PLPCTGraphqlProductsServiceImpl implements PLPCTGraphqlProductsService {

    private static final Logger log = LoggerFactory.getLogger(PLPCTGraphqlProductsServiceImpl.class);

    private PLPCTGraphqlProductsConfig plpctGraphqlProductsConfig;

    @Activate
    protected void activate(PLPCTGraphqlProductsConfig plpctGraphqlProductsConfig){
        this.plpctGraphqlProductsConfig = plpctGraphqlProductsConfig;
    }

    @Override
    public String getPLPCTGraphqlProducts(String bearerToken, String jsonObject) throws IOException {
        String response = null;
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            String Url = plpctGraphqlProductsConfig.getPLPCTGraphqlProductsUrl();
            HttpPost httpPost = new HttpPost(Url);
            log.info("Json Object : {}", jsonObject);
            HttpEntity stringEntity = new StringEntity(jsonObject, ContentType.APPLICATION_JSON);
            httpPost.setHeader("Authorization", "Bearer " + bearerToken);
            httpPost.setEntity(stringEntity);
            CloseableHttpResponse closeableHttpResponse = httpclient.execute(httpPost);
            response = EntityUtils.toString(closeableHttpResponse.getEntity());
        } catch (IOException e) {
            log.error("Exception occurred in PLPCTGraphqlProductsServiceImpl: {}", e.getMessage());
        } finally {
            try {
                httpclient.close();
            } catch (IOException e) {
                log.error("Error occurred during closing client call in PLPCTGraphqlProductsServiceImpl: {}", e.getMessage());
            }
        }
        return response;
    }
}
