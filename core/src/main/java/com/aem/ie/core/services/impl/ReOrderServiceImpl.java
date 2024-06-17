package com.aem.ie.core.services.impl;

import java.io.IOException;
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
import com.aem.ie.core.Service.ReOrderService;
import com.aem.ie.core.configuration.IEReOrderConfig;
import com.google.gson.JsonObject;

@Component(service = ReOrderService.class, immediate = true)
@Designate(ocd = IEReOrderConfig.class)
public class ReOrderServiceImpl implements ReOrderService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IEReOrderConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(ReOrderServiceImpl.class);

	@Activate
	protected void activate(IEReOrderConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getReOrderCTUrl(String tokenId, String bearerToken, String orderIdValue) {
		String response = null;
		/**
		 * Reading values from the configuration
		 */
		String url = configuration.getReOrderURL();
		JsonObject jobject1 = new JsonObject();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			jobject1.addProperty("order", orderIdValue);
			HttpPost httpPost = new HttpPost(url);
			String JSON_STRING = jobject1.toString();
			httpPost.setHeader("CTCustomerToken", tokenId);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPost.setEntity(stringEntity);
			if (httpclient != null && httpPost != null) {
				CloseableHttpResponse reorderResponse = httpclient.execute(httpPost);
				if (reorderResponse != null) {
					response = EntityUtils.toString(reorderResponse.getEntity());
				}
			}
		} catch (IOException e) {
			log.error("IO Exception occured while getting the results from entity : {} ", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occured during closing the client call {} ", e.getMessage());
			}
		}
		return response;
	}
}
