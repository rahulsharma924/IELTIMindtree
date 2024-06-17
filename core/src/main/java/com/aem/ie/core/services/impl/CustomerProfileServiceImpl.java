package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.CustomerProfileService;
import com.aem.ie.core.configuration.IEDirectCallConfig;
import org.apache.commons.lang3.StringUtils;
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
import java.io.IOException;

@Component(service = CustomerProfileService.class, immediate = true)
@Designate(ocd = IEDirectCallConfig.class)
public class CustomerProfileServiceImpl implements CustomerProfileService {
	IEDirectCallConfig ieDirectCallConfig;
	private static final Logger log = LoggerFactory.getLogger(CustomerProfileServiceImpl.class);

	@Activate
	protected void activate(IEDirectCallConfig ieDirectCallConfig) {
		this.ieDirectCallConfig = ieDirectCallConfig;
	}

	@Override
	public String getCustomerProfile(String customerToken, String bearerToken) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String response = StringUtils.EMPTY;
		try {
			// Reading values from the configuration
			String url = ieDirectCallConfig.getCustomerProfile();
			HttpGet httpGet = new HttpGet(url);
			httpGet.setHeader("CTCustomerToken", customerToken);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse closeableHttpResponse = httpclient.execute(httpGet);
			response = EntityUtils.toString(closeableHttpResponse.getEntity());
		} catch (IOException ioException) {
			log.error("IO Exception occured while getting the results from entity{}", ioException.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException ioException) {
				log.error("error occured during closing the client call{}", ioException.getMessage());
			}
		}
		return response;
	}
}
