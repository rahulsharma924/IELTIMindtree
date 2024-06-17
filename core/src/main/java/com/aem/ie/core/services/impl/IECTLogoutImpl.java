package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.IECTLogoutService;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.configuration.IEDirectCallConfig;

@Component(service = IECTLogoutService.class, immediate = true)
@Designate(ocd = IEDirectCallConfig.class)
public class IECTLogoutImpl implements IECTLogoutService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IEDirectCallConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(IECTLoginImpl.class);

	@Activate
	protected void activate(IEDirectCallConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getLogoutCTURL(String ctToken, String bearerToken) throws ClientProtocolException, IOException {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String logoutCtUrl = configuration.getLogoutCTURL() + "?token=" + ctToken;
		try {
			HttpPost httpPost = new HttpPost(logoutCtUrl);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
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
