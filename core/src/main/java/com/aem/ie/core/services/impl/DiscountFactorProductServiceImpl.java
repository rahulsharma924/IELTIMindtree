package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.CustomLengthPriceService;
import com.aem.ie.core.Service.DiscountFactorProductService;
import com.aem.ie.core.configuration.CartConfig;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
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

import java.io.IOException;

@Component(service = DiscountFactorProductService.class, immediate = true)
@Designate(ocd = CartConfig.class)
public class DiscountFactorProductServiceImpl implements DiscountFactorProductService {

	private static final Logger LOGGER = LoggerFactory.getLogger(DiscountFactorProductServiceImpl.class);

	private CartConfig configuration;

	@Activate
	protected void activate(CartConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getdiscountFactorProduct(String token, String bearerToken, String SKU) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String response = StringUtils.EMPTY;
		try {
			String url = configuration.getDiscountFactorPriceURL();
			url = url + "?currency=USD&sku=" + SKU;
			HttpGet httpGet = new HttpGet(url);
			httpGet.setHeader("CTCustomerToken", token);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse closeableHttpResponse = httpclient.execute(httpGet);
			response = EntityUtils.toString(closeableHttpResponse.getEntity());
		} catch (IOException e) {
			LOGGER.error("Exception Occurred while fetching the discount factor", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("Error occurred during closing the client call {}", e.getMessage());
			}
		}
		return response;
	}
}
