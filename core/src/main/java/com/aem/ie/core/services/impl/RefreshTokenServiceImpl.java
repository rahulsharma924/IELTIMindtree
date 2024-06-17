package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
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

import com.aem.ie.core.Service.ClearCartService;
import com.aem.ie.core.Service.RefreshTokenService;
import com.aem.ie.core.configuration.RefreshTokenConfig;
import com.google.gson.JsonObject;

@Component(service = RefreshTokenService.class, immediate = true)
@Designate(ocd = RefreshTokenConfig.class)
public class RefreshTokenServiceImpl implements RefreshTokenService  {
	/**
	 * Instance of the OSGi configuration class
	 */
	private RefreshTokenConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(RefreshTokenServiceImpl.class);

	@Activate
	protected void activate(RefreshTokenConfig configuration) {
		this.configuration = configuration;
	}
	@Override
	public String getRefreshTokenVal(String refreshToken, String bearerToken) throws IOException{
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			/*
			 * Reading values from the configuration
			 */
			String url = configuration.getRefreshTokenCTURL();
			HttpPost httpPost = new HttpPost(url);
			httpPost.setHeader("RefreshToken", refreshToken);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
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
