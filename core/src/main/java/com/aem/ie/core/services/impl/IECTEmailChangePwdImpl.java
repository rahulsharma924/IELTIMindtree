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

import com.aem.ie.core.Service.IECTEmailChangePasswordService;
import com.aem.ie.core.configuration.IEDirectCallConfig;
import com.google.gson.JsonObject;

@Component(service = IECTEmailChangePasswordService.class, immediate = true)
@Designate(ocd = IEDirectCallConfig.class)
public class IECTEmailChangePwdImpl implements IECTEmailChangePasswordService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IEDirectCallConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(IECTEmailChangePwdImpl.class);

	@Activate
	protected void activate(IEDirectCallConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getEmailChangePasswordCTUrl(String tokenId, String newPwd, String bearerToken) {
		String response = null;
		/**
		 * Reading values from the configuration
		 */
		String url = configuration.getEmailChangePwdCTURL();
		JsonObject jobject1 = new JsonObject();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			jobject1.addProperty("tokenValue", tokenId);
			jobject1.addProperty("newPassword", newPwd);
			HttpPost httpPost = new HttpPost(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			if (httpclient != null && httpPost != null) {
				CloseableHttpResponse response2 = httpclient.execute(httpPost);
				if (response2 != null) {
					response = EntityUtils.toString(response2.getEntity());
				}
			}
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
