package com.aem.ie.core.services.impl;

import java.io.IOException;

import com.aem.ie.core.Service.ClearCartService;
import com.aem.ie.core.configuration.CartConfig;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import com.google.gson.JsonObject;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = ClearCartService.class, immediate = true)
@Designate(ocd = CartConfig.class)
public class ClearCartServiceImpl implements ClearCartService {
	private static final Logger LOGGER = LoggerFactory.getLogger(ClearCartServiceImpl.class);
	/**
	 * Instance of the OSGi configuration class
	 *
	 */

	private CartConfig config;

	@Activate
	protected void activate(CartConfig config) {
		this.config = config;
	}

	@Override
	public String clearCart(SlingHttpServletRequest slingRequest, String cartID, String access_token, String version,
			String bearerToken) throws ClientProtocolException, IOException {
		String response = null;
		JsonObject jobject = new JsonObject();
		jobject.addProperty("version", version);
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String JSON_STRING = jobject.toString();

			String urlnew = config.getClearCartURL();
			String url = urlnew + cartID + "?version=" + version;
			HttpDelete HttpDelete = new HttpDelete(url);
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			HttpDelete.setHeader("CTCustomerToken", access_token);
			HttpDelete.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(HttpDelete);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			LOGGER.error("Exception Occurred in clearCart", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return response;
	}
}