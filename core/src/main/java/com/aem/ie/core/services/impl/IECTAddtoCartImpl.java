package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;
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
import com.aem.ie.core.Service.IECTAddtoCartService;
import com.aem.ie.core.configuration.IECTAddtocartConfig;
import com.google.gson.JsonObject;

@Component(service = IECTAddtoCartService.class, immediate = true)
@Designate(ocd = IECTAddtocartConfig.class)
public class IECTAddtoCartImpl implements IECTAddtoCartService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IECTAddtocartConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(CTResetPasswordImpl.class);

	@Activate
	protected void activate(IECTAddtocartConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getAddToCartoCTUrl(String token, String currency, String skuValue, String quantity,
			String bearerToken) {
		String response = null;

		CloseableHttpClient httpclient = HttpClients.createDefault();
		JsonObject jobject1 = new JsonObject();
		try {
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.getAddToCartCTURL();

			jobject1.addProperty("currency", currency);
			jobject1.addProperty("sku", skuValue);
			jobject1.addProperty("quantity", quantity);
			HttpPut httpPut = new HttpPut(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			if (token != null && !token.equals(" ") && !token.equals("undefined")) {
				httpPut.setHeader("Authorization", "Bearer " + bearerToken);
				httpPut.setHeader("CTCustomerToken", token);
				httpPut.setEntity(stringEntity);
				CloseableHttpResponse response2 = httpclient.execute(httpPut);
				response = EntityUtils.toString(response2.getEntity());
			} else {
				httpPut.setHeader("Authorization", "Bearer " + bearerToken);
				httpPut.setEntity(stringEntity);
				CloseableHttpResponse response2 = httpclient.execute(httpPut);
				response = EntityUtils.toString(response2.getEntity());
			}
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
}
