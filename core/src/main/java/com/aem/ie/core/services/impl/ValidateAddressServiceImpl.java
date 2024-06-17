package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.ValidateAddressService;
import com.aem.ie.core.configuration.IECTGetTaxConfig;
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

@Component(service = ValidateAddressService.class, immediate = true)
@Designate(ocd = IECTGetTaxConfig.class)
public class ValidateAddressServiceImpl implements ValidateAddressService {

	private static final Logger LOGGER = LoggerFactory.getLogger(ValidateAddressServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private IECTGetTaxConfig configuration;

	@Activate
	protected void activate(IECTGetTaxConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getValidateAddressUrl(String customerTokenVal, String bearerToken, JsonObject jsonObject) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String url = configuration.getValidateAddressCTURL();
			HttpPost httpPost = new HttpPost(url);
			String jsonString = jsonObject.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", customerTokenVal);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			LOGGER.error("Exception Occurred in validate address{}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occurred during closing the client call {}", e.getMessage());
			}
		}
		return response;
	}

	@Override
	public String getValidateAddressGuestUser(String jsonObject, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String url = configuration.getValidateAddressCTURL();
			HttpPost httpPost = new HttpPost(url);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			HttpEntity stringEntity = new StringEntity(jsonObject, ContentType.APPLICATION_JSON);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			LOGGER.error("Exception Occurred in validate address {}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occurred during closing the client call{}", e.getMessage());
			}
		}
		return response;
	}
}
