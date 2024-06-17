package com.aem.ie.core.services.impl;

import java.io.IOException;

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

import com.aem.ie.core.Service.IECTLoginService;
import com.aem.ie.core.Service.TokenValidService;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.configuration.IEDirectCallConfig;
import com.google.gson.JsonObject;

@Component(service = TokenValidService.class, immediate = true)
@Designate(ocd = IEDirectCallConfig.class)
public class TokenValidateServiceImpl implements TokenValidService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IEDirectCallConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(TokenValidateServiceImpl.class);

	@Activate
	protected void activate(IEDirectCallConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String tokenValidationUrl(String CTCustomerToken, String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			/*
			 * Reading values from the configuration
			 */
			String url = configuration.getTokenValid();
			String ctUrl = url + "=" + CTCustomerToken;
			HttpGet httpGet = new HttpGet(ctUrl);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpGet);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			log.error("IO Exception occured while getting the results from entity{}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occured during closing the client call{}", e.getMessage());
			}
		}
		return response;
	}
}
