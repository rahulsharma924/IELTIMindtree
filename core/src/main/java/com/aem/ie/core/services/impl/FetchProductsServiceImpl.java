package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
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

import com.aem.ie.core.Service.FetchProductService;
import com.aem.ie.core.Service.IECTAddtoCartService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.aem.ie.core.configuration.IECTAddtocartConfig;
import com.google.gson.JsonObject;

@Component(service = FetchProductService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class FetchProductsServiceImpl implements FetchProductService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private CTAccountsConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(FetchProductsServiceImpl.class);

	@Activate
	protected void activate(CTAccountsConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getFetchProductAPI(String token, String pastdays, String pagesize, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		JsonObject jobject1 = new JsonObject();
		try {
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.fetchOrderProductAPI();

			jobject1.addProperty("pastDays", pastdays);
			jobject1.addProperty("pageSize", pagesize);
			HttpPost httpPost = new HttpPost(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", token);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			log.error("IO Exception occured while getting the results from entity" + e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return response;
	}
}
