package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.IECTDeliveryService;
import com.aem.ie.core.configuration.IECTDeliveryConfig;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
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

@Component(service = IECTDeliveryService.class, immediate = true)
@Designate(ocd = IECTDeliveryConfig.class)
public class IECTDeliveryServiceImpl implements IECTDeliveryService {
	private static final Logger log = LoggerFactory.getLogger(IECTDeliveryServiceImpl.class);
	IECTDeliveryConfig configuration;

	@Activate
	protected void activate(IECTDeliveryConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getdeliveryRates(String customerTokenValue, String transitTimeRequired, String zipcode,
			String country, String bearerToken) {
		JsonObject jsonEntity = new JsonObject();
		JsonObject addressObject = new JsonObject();
		addressObject.addProperty("zipcode", zipcode);
		addressObject.addProperty("country", country);
		jsonEntity.addProperty("transitTimeRequired", transitTimeRequired);
		jsonEntity.add("address", addressObject);
		return getResponse(jsonEntity, customerTokenValue, bearerToken);
	}

	@Override
	public String getDeliveryOptions(String customerTokenValue, JsonObject jsonObject, String bearerToken) {
		return getResponse(jsonObject, customerTokenValue, bearerToken);
	}

	public String getResponse(JsonObject jsonEntity, String customerToken, String bearerToken) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		// Reading value from configuration
		String url = configuration.deliveryCTURL();
		String response = StringUtils.EMPTY;
		try {
			HttpPost httpPost = new HttpPost(url);
			String jsonString = jsonEntity.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", customerToken);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse closeableHttpResponse = httpclient.execute(httpPost);
			response = EntityUtils.toString(closeableHttpResponse.getEntity());
		} catch (ClientProtocolException clientProtocolException) {
			log.error("error occured during closing the client call {}", clientProtocolException.getMessage());
		} catch (IOException ioException) {
			log.error("error occurred while fetching the response {}", ioException.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException ioException) {
				log.error("error occurred during closing the client call {}", ioException.getMessage());
			}
		}
		return response;
	}
}