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
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.IECTLogoutService;
import com.aem.ie.core.Service.IEUserActiveCart;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.configuration.IEDirectCallConfig;
import com.google.gson.JsonObject;

@Component(service = IEUserActiveCart.class, immediate = true)
@Designate(ocd = IEDirectCallConfig.class)
public class IEActiveUserCartImpl implements IEUserActiveCart {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IEDirectCallConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(IEActiveUserCartImpl.class);

	@Activate
	protected void activate(IEDirectCallConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getUserActiveCart(String ctToken, String bearerToken) throws ClientProtocolException, IOException {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String response = null;
		try {
			JsonObject jobject1 = new JsonObject();
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.getUserActiveCart();
			HttpGet httpGet = new HttpGet(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpGet.setHeader("CTCustomerToken", ctToken);
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
}
