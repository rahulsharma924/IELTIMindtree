package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
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
import com.aem.ie.core.Service.IECTLoginService;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.google.gson.JsonObject;

@Component(service = IECTLoginService.class, immediate = true)
@Designate(ocd = IECTLoginConfig.class)
public class IECTLoginImpl implements IECTLoginService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IECTLoginConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(IECTLoginImpl.class);

	@Activate
	protected void activate(IECTLoginConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getLoginCTUrl(String emailid, String pwd, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jobject1 = new JsonObject();
			/*
			 * Reading values from the configuration
			 */
			String url = configuration.getLoginCTURL();
			jobject1.addProperty("email", emailid);
			jobject1.addProperty("password", pwd);
			HttpPost httpPost = new HttpPost(url);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			String jsonString = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			log.error("IO Exception occured while getting the results from entity{}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occured during closing the client call{}", e.getMessage());
			}
		}
		return response;
	}

	@Override
	public String getCheckoutLogin(String customerToken, String email, String password, String bearerToken) {
		String response = StringUtils.EMPTY;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			/*
			 * Reading values from the configuration
			 */
			String url = configuration.getCheckoutLoginCTURL();
			HttpPost httpPost = new HttpPost(url);
			httpPost.setHeader("CTCustomerToken", customerToken);
			JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("email", email);
			jsonObject.addProperty("password", password);
			String jsonString = jsonObject.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			log.error("IO Exception occurred while getting the results from entity{}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occurred during closing the client call{}", e.getMessage());
			}
		}
		return response;
	}
}
