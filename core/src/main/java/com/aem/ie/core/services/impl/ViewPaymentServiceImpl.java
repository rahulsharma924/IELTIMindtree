package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
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

import com.aem.ie.core.Service.IECTViewPaymentService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.google.gson.JsonObject;

@Component(service = IECTViewPaymentService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class ViewPaymentServiceImpl implements IECTViewPaymentService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private CTAccountsConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(ViewPaymentServiceImpl.class);

	@Activate
	protected void activate(CTAccountsConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getViewPaymentCTUrl(String CTCustomerToken, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jobject1 = new JsonObject();
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.getViewPaymentMethodURL();
			HttpGet httpGet = new HttpGet(url);
			httpGet.setHeader("CTCustomerToken", CTCustomerToken);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpGet);
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

	public String getPaymentToken(String CTCustomerToken, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jobject1 = new JsonObject();
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.getPaymentToken();
			HttpGet httpGet = new HttpGet(url);
			httpGet.setHeader("CTCustomerToken", CTCustomerToken);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpGet);
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

	@Override
	public String processPayment(String customerTokenVal, String bearerToken, String jsonString) {
		String response = null;

		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String url = configuration.processPayment();
			HttpPost httpPost = new HttpPost(url);
			// String jsonString = jsonObject.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", customerTokenVal);
			httpPost.setHeader("Content-Type", "application/json");
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			log.error("Exception Occurred in remove product {}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occurred during closing the client call {}", e.getMessage());
			}
		}
		return response;
	}

	@Override
	public String choosePayment(String customerTokenVal, String bearerToken, String jsonObject) {
		String response = null;

		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String url = configuration.choosePayment();
			HttpPost httpPost = new HttpPost(url);
			HttpEntity stringEntity = new StringEntity(jsonObject, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", customerTokenVal);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			log.error("Exception Occurred in remove product {}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occurred during closing the client call {}", e.getMessage());
			}
		}
		return response;
	}
}
