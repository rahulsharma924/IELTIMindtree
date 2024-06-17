package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ContentType;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.poi.sl.usermodel.ObjectMetaData.Application;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.GetProductDeliveryDateService;
import com.aem.ie.core.configuration.GetProductDeliveryDateConfig;
import com.drew.lang.StringUtil;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Component(service = GetProductDeliveryDateService.class, immediate = true)
@Designate(ocd = GetProductDeliveryDateConfig.class)
public class GetProductDeliveryDateServiceImpl implements GetProductDeliveryDateService {
	private static final Logger log = LoggerFactory.getLogger(GetProductDeliveryDateServiceImpl.class);
	GetProductDeliveryDateConfig configuration;

	@Activate
	protected void activate(GetProductDeliveryDateConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getProductDeliveryDate(String bearerToken, String transitTime, JsonObject productJson,
			JsonObject addressJson) {
		JsonObject jsonEntity = new JsonObject();
		jsonEntity.addProperty("transitTimeRequired", transitTime);
		jsonEntity.add("product", productJson);
		jsonEntity.add("address", addressJson);
		return getResponse(bearerToken, jsonEntity);
	}

	@Override
	public String getProductDeliveryDateForCustomSku(String bearerToken, String transitTimeRequired,
			JsonObject customCAProduct, JsonObject address) {
		JsonObject jsonEntity = new JsonObject();
		jsonEntity.addProperty("transitTimeRequired", transitTimeRequired);
		jsonEntity.add("customCAProduct", customCAProduct);
		jsonEntity.add("address", address);

		return getResponse(bearerToken, jsonEntity);
	}

	public String getResponse(String bearerToken, JsonObject jsonEntity) {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		String apiUrl = configuration.getProductDeliveryDateApiUrl();
		String response = StringUtils.EMPTY;

		try {
			HttpPost httpPostReq = new HttpPost(apiUrl);
			String jsonEntityString = jsonEntity.toString();
			HttpEntity stringEntity = new StringEntity(jsonEntityString, ContentType.APPLICATION_JSON);

			httpPostReq.setHeader("Authorization", "Bearer " + bearerToken);
			httpPostReq.setEntity(stringEntity);

			CloseableHttpResponse cHttpResponse = httpClient.execute(httpPostReq);

			response = EntityUtils.toString(cHttpResponse.getEntity());

		} catch (ClientProtocolException cpex) {
			log.error("Error occured while fetching the response {}", cpex.getMessage());
		} catch (IOException ioex) {
			log.error("Error occured while fetching the response {}", ioex.getMessage());
		} finally {
			try {
				httpClient.close();
			} catch (IOException ioException) {
				log.error("Error occured while closing the client {}", ioException.getMessage());
			}
		}
		return response;
	}
}
