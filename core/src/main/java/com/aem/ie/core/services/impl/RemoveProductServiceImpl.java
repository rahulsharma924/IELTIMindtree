package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.RemoveProductService;
import com.aem.ie.core.configuration.RemoveProductConfig;
import com.google.gson.JsonObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPatch;
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

@Component(service = RemoveProductService.class, immediate = true)
@Designate(ocd = RemoveProductConfig.class)
public class RemoveProductServiceImpl implements RemoveProductService {

	private static final Logger LOGGER = LoggerFactory.getLogger(RemoveProductServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private RemoveProductConfig config;

	@Activate
	protected void activate(RemoveProductConfig config) {
		this.config = config;
	}

	@Override
	public String removeProduct(String customerTokenVal, String bearerToken, String lineItemId,
			String unitOfMeasurement, String isCustomLineItem) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jsonObject = new JsonObject();
			String url = config.getRemoveProductURL();
			if (Boolean.parseBoolean(isCustomLineItem)) {
				url = url + "?isCustomLineItem=true";
				jsonObject.addProperty("unitOfMeasurement", unitOfMeasurement);
			}
			jsonObject.addProperty("quantity", 0);
			jsonObject.addProperty("lineItemId", lineItemId);
			HttpPatch httpPatch = new HttpPatch(url);
			String jsonString = jsonObject.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPatch.setHeader("CTCustomerToken", customerTokenVal);
			httpPatch.setHeader("Authorization", "Bearer " + bearerToken);
			httpPatch.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPatch);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			LOGGER.error("Exception Occurred in remove product", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occurred during closing the client call {}", e.getMessage());
			}
		}
		return response;
	}
}
