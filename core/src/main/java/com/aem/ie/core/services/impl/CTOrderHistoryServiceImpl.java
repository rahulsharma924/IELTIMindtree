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

import com.aem.ie.core.Service.CTOrderHistoryService;
import com.aem.ie.core.configuration.CTIOrderConfig;

@Component(service = CTOrderHistoryService.class, immediate = true)
@Designate(ocd = CTIOrderConfig.class)
public class CTOrderHistoryServiceImpl implements CTOrderHistoryService {

	private static final Logger LOGGER = LoggerFactory.getLogger(CTOrderHistoryServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private CTIOrderConfig configuration;

	@Activate
	protected void activate(CTIOrderConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getOrderHistory(String customer_token, String bearerToken, String pageNo, String pageSize,
			String sortField, String sortingOrder) {
		String response = null;
		CloseableHttpClient httpclient = null;
		String urlnew = null;
		try {
			httpclient = HttpClients.createDefault();
			String url = configuration.getOrderHistoryURL();
			urlnew = url + "?pageNo=" + pageNo + "&pageSize=" + pageSize + "&sortField=" + sortField + "&sortingOrder="
					+ sortingOrder;
			HttpGet httpGet = new HttpGet(urlnew);
			httpGet.setHeader("CTCustomerToken", customer_token);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			if (httpclient != null) {
				CloseableHttpResponse response2 = httpclient.execute(httpGet);
				response = EntityUtils.toString(response2.getEntity());
			}
		} catch (IOException e) {
			LOGGER.error("CTOrderHistoryServiceImpl class, getOrderHistoryURL" + e.getMessage(), e);
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
