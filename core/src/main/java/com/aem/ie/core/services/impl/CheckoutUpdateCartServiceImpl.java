package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.CheckoutUpdateCartService;
import com.aem.ie.core.configuration.IECTCheckoutConfig;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
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

@Component(service = CheckoutUpdateCartService.class, immediate = true)
@Designate(ocd = IECTCheckoutConfig.class)
public class CheckoutUpdateCartServiceImpl implements CheckoutUpdateCartService {

	private static final Logger log = LoggerFactory.getLogger(CheckoutUpdateCartServiceImpl.class);

	IECTCheckoutConfig iectCheckoutConfig;

	@Activate
	protected void activate(IECTCheckoutConfig iectCheckoutConfig) {
		this.iectCheckoutConfig = iectCheckoutConfig;
	}

	@Override
	public String getUpdatedCart(String customerToken, String jsonbody, String bearerToken) {
		String response = StringUtils.EMPTY;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		// Reading values from the configuration
		String url = iectCheckoutConfig.updateCartCTURL();

		try {
			HttpPatch httpPatch = new HttpPatch(url);
			HttpEntity stringEntity = new StringEntity(jsonbody, ContentType.APPLICATION_JSON);
			httpPatch.setHeader("CTCustomerToken", customerToken);
			httpPatch.setHeader("Authorization", "Bearer " + bearerToken);
			httpPatch.setEntity(stringEntity);
			CloseableHttpResponse closeableHttpResponse = httpclient.execute(httpPatch);
			response = EntityUtils.toString(closeableHttpResponse.getEntity());
		} catch (IOException e) {
			log.error("IO Exception occurred while getting the results from entity{}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException exception) {
				log.error("error occurred during closing the client call {}", exception.getMessage());
			}
		}
		return response;
	}
}
