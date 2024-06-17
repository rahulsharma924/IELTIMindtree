package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.GetCalculatedTaxService;
import com.aem.ie.core.configuration.IECTGetTaxConfig;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
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

@Component(service = GetCalculatedTaxService.class, immediate = true)
@Designate(ocd = IECTGetTaxConfig.class)
public class GetCalculatedTaxServiceImpl implements GetCalculatedTaxService {
	private static final Logger log = LoggerFactory.getLogger(GetCalculatedTaxServiceImpl.class);
	IECTGetTaxConfig configuration;

	@Activate
	protected void activate(IECTGetTaxConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getCalculatedTax(String customerToken, String country, String postalCode, String bearerToken) {
		// Reading value from configuration
		String url = configuration.calculatedTaxCTURL();

		JsonObject jsonEntity = new JsonObject();
		jsonEntity.addProperty("country", country);
		jsonEntity.addProperty("postalCode", postalCode);
		return getResponse(url, jsonEntity, customerToken, bearerToken);
	}

	@Override
	public String getCalculateTax(String customerToken, JsonObject jsonObject, String bearerToken) {
		// Reading value from configuration
		String url = configuration.calculateTaxCTURL();
		return getResponse(url, jsonObject, customerToken, bearerToken);
	}

	@Override
	public String getReCalculateTaxUser(String customerToken, String bearerToken) {
		// Reading value from configuration
		String url = configuration.reCalculateTaxURL();

		CloseableHttpClient httpclient = HttpClients.createDefault();
		String response = null;
		try {
			JsonObject jobject1 = new JsonObject();
			/**
			 * Reading values from the configuration
			 */
			HttpGet httpGet = new HttpGet(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpGet.setHeader("CTCustomerToken", customerToken);
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

	public String getResponse(String url, JsonObject jsonEntity, String customerToken, String bearerToken) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String response = StringUtils.EMPTY;
		try {
			HttpPatch httpPatch = new HttpPatch(url);
			String jsonString = jsonEntity.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPatch.setHeader("CTCustomerToken", customerToken);
			httpPatch.setHeader("Authorization", "Bearer " + bearerToken);
			httpPatch.setEntity(stringEntity);
			CloseableHttpResponse closeableHttpResponse = httpclient.execute(httpPatch);
			response = EntityUtils.toString(closeableHttpResponse.getEntity());
		} catch (ClientProtocolException clientProtocolException) {
			log.error("IO Exception occured while getting the results from entity {}",
					clientProtocolException.getMessage());
		} catch (IOException ioException) {
			log.error("error occurred during closing the client call {}", ioException.getMessage());
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