package com.aem.ie.core.services.impl;

import java.io.IOException;

import com.aem.ie.core.Service.IEOrderConfirmationDetails;
import com.aem.ie.core.configuration.IEOrderConfirmationConfig;
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

import com.aem.ie.core.configuration.IEOrderConfirmationConfig;
import com.google.gson.JsonObject;

@Component(service = IEOrderConfirmationDetails.class, immediate = true)
@Designate(ocd = IEOrderConfirmationConfig.class)
public class IEOrderConfirmationServiceImpl implements IEOrderConfirmationDetails {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IEOrderConfirmationConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(IEOrderConfirmationServiceImpl.class);

	@Activate
	protected void activate(IEOrderConfirmationConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getOrderConfirmationDetails(String ctToken, String orderId, String bearerToken)
			throws ClientProtocolException, IOException {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String response = null;
		try {

			String url = configuration.getOrderConfirmationURL();
			url = url + orderId + "?expand=" + "paymentInfo.payments[*].id";
			HttpGet httpGet = new HttpGet(url);
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
