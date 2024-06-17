package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import com.google.gson.JsonObject;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.AddNewAddressService;
import com.aem.ie.core.configuration.CTAccountsConfig;

@Component(service = AddNewAddressService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class AddNewAddressServiceImpl implements AddNewAddressService {

	private static final Logger LOGGER = LoggerFactory.getLogger(AddNewAddressServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private CTAccountsConfig configuration;

	@Activate
	protected void activate(CTAccountsConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public JsonObject initialAddressDetails(SlingHttpServletRequest slingRequest, String accessToken,
			String bearerToken) throws ClientProtocolException, IOException {
		JsonObject jsonObject = new JsonObject();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String type = "both";
			String url = configuration.getCustProfileURL();
			HttpGet httpGet = new HttpGet(url);
			httpGet.setHeader("CTCustomerToken", accessToken);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpGet);
			int statusCode = response2.getStatusLine().getStatusCode();
			jsonObject.addProperty("statusCode", statusCode);
			jsonObject.addProperty("customertoken", accessToken);
			jsonObject.addProperty("response", EntityUtils.toString(response2.getEntity()));
		} catch (IOException | RuntimeException e) {
			LOGGER.error("Exception Occurred in addNewAddress", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return jsonObject;
	}

	@Override
	public JsonObject addNewAddress(SlingHttpServletRequest slingRequest, String addressObjct, String accessTokenD,
			String bearerToken) throws ClientProtocolException, IOException {
		JsonObject jsonObject = new JsonObject();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String accessToken = accessTokenD;
			String test1;
			String url = configuration.getNewAddressURL();
			HttpPost httpPost = new HttpPost(url);
			test1 = addressObjct;
			String JSON_FINAL = test1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_FINAL, ContentType.APPLICATION_JSON);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			httpPost.setHeader("CTCustomerToken", accessToken);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			int statusCode = response2.getStatusLine().getStatusCode();
			jsonObject.addProperty("statusCode", statusCode);
			jsonObject.addProperty("customertoken", accessTokenD);
			jsonObject.addProperty("response", EntityUtils.toString(response2.getEntity()));
		} catch (IOException | RuntimeException e) {
			LOGGER.error("Exception Occurred in addNewAddress", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return jsonObject;
	}

	@Override
	public JsonObject updateAddress(SlingHttpServletRequest slingRequest, String addressObjct, String accessTokenD,
			String bearerToken) throws ClientProtocolException, IOException {
		JsonObject jsonObject = new JsonObject();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String accessToken = accessTokenD;
			String type = "both";
			String test1;
			String url = configuration.getEditAddressURL();
			HttpPost httpPost = new HttpPost(url);
			test1 = addressObjct;
			String JSON_FINAL = test1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_FINAL, ContentType.APPLICATION_JSON);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			httpPost.setHeader("CTCustomerToken", accessToken);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			int statusCode = response2.getStatusLine().getStatusCode();
			jsonObject.addProperty("statusCode", statusCode);
			jsonObject.addProperty("customertoken", accessToken);
			jsonObject.addProperty("response", EntityUtils.toString(response2.getEntity()));
		} catch (IOException | RuntimeException e) {
			LOGGER.error("Exception Occurred in addNewAddress", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return jsonObject;
	}

	@Override
	public JsonObject deleteAddress(String details, String accessTokenD, String bearerToken)
			throws ClientProtocolException, IOException {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		JsonObject jsonObject = new JsonObject();
		try {
			String accessToken = accessTokenD;
			String type = "both";
			String test1;
			String url = configuration.getDeleteAddressURL();
			HttpPost httpPost = new HttpPost(url);
			JsonObject jobject1 = new JsonObject();
			jobject1.addProperty("addressId", details);
			String JSON_FINAL = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_FINAL, ContentType.APPLICATION_JSON);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			httpPost.setHeader("CTCustomerToken", accessToken);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			int statusCode = response2.getStatusLine().getStatusCode();
			jsonObject.addProperty("statusCode", statusCode);
			jsonObject.addProperty("customertoken", accessToken);
			jsonObject.addProperty("response", EntityUtils.toString(response2.getEntity()));
		} catch (IOException | RuntimeException e) {
			LOGGER.error("Exception Occurred in deleteAddress", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return jsonObject;
	}
}
