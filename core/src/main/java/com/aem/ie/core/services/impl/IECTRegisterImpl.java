package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.commons.lang3.StringUtils;
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

import com.aem.ie.core.Service.IECTRegisterService;
import com.aem.ie.core.configuration.IECTLoginConfig;

@Component(service = IECTRegisterService.class, immediate = true)
@Designate(ocd = IECTLoginConfig.class)
public class IECTRegisterImpl implements IECTRegisterService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IECTLoginConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(IECTRegisterImpl.class);

	@Activate
	protected void activate(IECTLoginConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getRegistrationCTUrl(String registartionData, String bearerToken) {
		String response = null;
		/*
		 * Reading values from the configuration
		 */
		String url = configuration.getRegistrationCTURL();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httpPost = new HttpPost(url);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			HttpEntity stringEntity = new StringEntity(registartionData, ContentType.APPLICATION_JSON);
			httpPost.setEntity(stringEntity);
			if (httpclient != null && httpPost != null) {
				CloseableHttpResponse response2 = httpclient.execute(httpPost);
				if (response2 != null) {
					response = EntityUtils.toString(response2.getEntity());
				}
			}
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

	@Override
	public String getCheckoutGuestRegistration(String customerToken, String registrationData, String bearerToken) {
		String response = StringUtils.EMPTY;
		/*
		 * Reading values from the configuration
		 */
		String url = configuration.getCheckoutGuestRegCTURL();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httpPost = new HttpPost(url);
			HttpEntity stringEntity = new StringEntity(registrationData, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", customerToken);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			log.error("IO Exception occurred while getting the results from entity{}", e.getMessage());
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
