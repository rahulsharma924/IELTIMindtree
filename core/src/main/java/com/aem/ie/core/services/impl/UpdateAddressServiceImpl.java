package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.UpdateAddressService;
import com.aem.ie.core.configuration.CTAccountsConfig;
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

@Component(service = UpdateAddressService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class UpdateAddressServiceImpl implements UpdateAddressService {

	private static final Logger LOGGER = LoggerFactory.getLogger(UpdateAddressServiceImpl.class);

	private CTAccountsConfig configuration;

	@Activate
	protected void activate(CTAccountsConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public JsonObject updateAddress(String customerTokenVal, String bearerToken, String jsonObject) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		JsonObject jsonBody = new JsonObject();
		try {
			String url = configuration.getUpdateAddressURL();
			HttpPost httpPost = new HttpPost(url);
			HttpEntity stringEntity = new StringEntity(jsonObject, ContentType.APPLICATION_JSON);
			httpPost.setEntity(stringEntity);
			httpPost.setHeader("CTCustomerToken", customerTokenVal);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			int statusCode = response2.getStatusLine().getStatusCode();
			jsonBody.addProperty("statusCode", statusCode);
			jsonBody.addProperty("customerToken", customerTokenVal);
			jsonBody.addProperty("response", EntityUtils.toString(response2.getEntity()));
		} catch (IOException e) {
			LOGGER.error("Exception Occurred while updating the address{}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("Error occurred during closing the client call {}", e.getMessage());
			}
		}
		return jsonBody;
	}
}
