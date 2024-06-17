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

import com.aem.ie.core.Service.IECTDefaultPaymentService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.google.gson.JsonObject;

@Component(service = IECTDefaultPaymentService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class DefaultPaymentServiceImpl implements IECTDefaultPaymentService {
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
	public String getdefaultPaymentCTUrl(String CTCustomerToken, String paymentToken, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jobject1 = new JsonObject();
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.getdefaultMethodSetURL();
			jobject1.addProperty("paymentToken", paymentToken);

			HttpPut httpPut = new HttpPut(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPut.setHeader("Authorization", "Bearer " + bearerToken);
			httpPut.setEntity(stringEntity);
			httpPut.setHeader("CTCustomerToken", CTCustomerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpPut);
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

}
