package com.aem.ie.core.services.impl;

import java.io.IOException;

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
import com.aem.ie.core.Service.UpdateCartService;
import com.aem.ie.core.configuration.CartConfig;
import com.google.gson.JsonObject;

@Component(service = UpdateCartService.class, immediate = true)
@Designate(ocd = CartConfig.class)
public class UpdateCartServiceImpl implements UpdateCartService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private CartConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(UpdateCartServiceImpl.class);

	@Activate
	protected void activate(CartConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getUpdateCartCTUrl(String customerTokenVal, String bearerToken, String qty, String lineItemId,
			String unitOfMeasurement, String isCustomLineItem) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jsonObject = new JsonObject();
			String url = configuration.getUpdateCartURL();
			if (Boolean.parseBoolean(isCustomLineItem)) {
				url = url + "?isCustomLineItem=true";
				jsonObject.addProperty("unitOfMeasurement", unitOfMeasurement);
			}
			jsonObject.addProperty("quantity", qty);
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
			log.error("Exception Occurred in update cart{}", e.getMessage());
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
