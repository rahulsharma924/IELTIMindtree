package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.CTOrderDetailService;
import com.aem.ie.core.configuration.CTIOrderConfig;

@Component(service = CTOrderDetailService.class, immediate = true)
@Designate(ocd = CTIOrderConfig.class)
public class CTOrderDetailServiceImpl implements CTOrderDetailService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CTOrderDetailServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private CTIOrderConfig configuration;

	@Activate
	protected void activate(CTIOrderConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getOrderDetails(String customer_token, String order_id, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = null;
		try {
			httpclient = HttpClients.createDefault();
			String url = configuration.getOrderDetailsURL();
			String urlOrder = url + order_id;
			HttpGet httpGet = new HttpGet(urlOrder);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			httpGet.setHeader("CTCustomerToken", customer_token);
			if (httpclient != null) {
				CloseableHttpResponse response2 = httpclient.execute(httpGet);
				response = EntityUtils.toString(response2.getEntity());
			}
		} catch (IOException e) {
			LOGGER.error("CTIOrderDetailServiceImpl class, getOrderDetails" + e.getMessage(), e);
		} finally {
			try {
				if (httpclient != null) {
					httpclient.close();
				}
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return response;
	}

}
