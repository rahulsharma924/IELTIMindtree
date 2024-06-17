package com.aem.ie.core.services.impl;

import java.io.IOException;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.CTCustomerOrderedProductService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.google.gson.JsonObject;

@Component(service = CTCustomerOrderedProductService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class CTCustomerOrderedProductServiceImpl implements CTCustomerOrderedProductService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CTCustomerOrderedProductServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private CTAccountsConfig configuration;

	@Activate
	protected void activate(CTAccountsConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getCustomerOrderedProduct(String customer_token, String past30Days, String past90Days,
			String past180days, String past270days, String past360days, String past60days, String bearerToken)
			throws ClientProtocolException, IOException {
		String response = null;
		String url = configuration.getCustomerOrderedProductURL();
		JsonObject jobject = new JsonObject();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			if (past30Days.equals("true")) {
				jobject.addProperty("pastDays", 30);
			} else if (past90Days.equals("true")) {
				jobject.addProperty("pastDays", 90);
			} else if (past180days.equals("true")) {
				jobject.addProperty("pastDays", 180);
			} else if (past270days.equals("true")) {
				jobject.addProperty("pastDays", 270);
			} else if (past360days.equals("true")) {
				jobject.addProperty("pastDays", 360);
			} else if (past60days.equals("true")) {
				jobject.addProperty("pastDays", 60);
			} else {
				jobject.addProperty("pastDays", 60);
			}
			jobject.addProperty("pageSize", 5);

			HttpPost httpPost = new HttpPost(url);
			String JSON_STRING = jobject.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			httpPost.setHeader("CTCustomerToken", customer_token);
			httpPost.setHeader("Content-Type", "application/json");
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			LOGGER.error("IO Exception occured" + e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return response;
	}

	public static Logger getLogger() {
		return LOGGER;
	}

	@Override
	public String getCustomerOrderedProductSearch(String customer_token, String QueryParam, String bearerToken)
			throws ClientProtocolException, IOException {
		String response = null;
		String url = configuration.getCustomerOrderedProductURL();
		JsonObject jobject = new JsonObject();
		QueryParam = "\"" + QueryParam + "\"";
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			jobject.addProperty("pastDays", 60);
			jobject.addProperty("pageSize", 5);
			jobject.addProperty("query", QueryParam);

			HttpPost httpPost = new HttpPost(url);
			String JSON_STRING = jobject.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			httpPost.setHeader("CTCustomerToken", customer_token);
			httpPost.setHeader("Content-Type", "application/json");
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			LOGGER.error("IO Exception occured" + e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return response;
	}
}