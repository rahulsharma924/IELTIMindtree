package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.ProductDeliveryRatesService;
import com.aem.ie.core.configuration.ProductDeliveryRatesUrlConfig;
import com.aem.ie.core.constants.ApplConstants;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
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

@Component(service = ProductDeliveryRatesService.class, immediate = true)
@Designate(ocd = ProductDeliveryRatesUrlConfig.class)
public class ProductDeliveryRatesServiceImpl implements ProductDeliveryRatesService {

	private static final Logger LOGGER = LoggerFactory.getLogger(ProductDeliveryRatesServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private ProductDeliveryRatesUrlConfig configuration;

	@Activate
	protected void activate(ProductDeliveryRatesUrlConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getProductDeliveryRates(String requestBody, String bearerToken) throws IOException {
		String url = configuration.getProductDeliveryRates();

		CloseableHttpClient httpclient = HttpClients.createDefault();
		String responseValue = "false";
		try {
			CloseableHttpResponse response;
			HttpPost httpPost = new HttpPost(url);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setHeader(ApplConstants.CONTENT_TYPE, ApplConstants.CONTENT_TYPE_JSON);
			httpPost.setEntity(new StringEntity(requestBody));
			response = httpclient.execute(httpPost);
			responseValue = EntityUtils.toString(response.getEntity());
		} catch (IOException e) {
			responseValue = e.getMessage();
			LOGGER.error("Exception Occurred in get All Options", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call {}", e.getMessage());
			}
		}
		return responseValue;
	}
}
