package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
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
import com.aem.ie.core.Service.IECTPasswordchangeService;
import com.aem.ie.core.configuration.IECTChangePwdConfig;
import com.google.gson.JsonObject;

@Component(service = IECTPasswordchangeService.class, immediate = true)
@Designate(ocd = IECTChangePwdConfig.class)
public class CTResetPasswordImpl implements IECTPasswordchangeService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private IECTChangePwdConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(CTResetPasswordImpl.class);

	@Activate
	protected void activate(IECTChangePwdConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getPasswordChangeCTUrl(String customerTokenVal, String currentPwd, String newPassword,
			String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jobject1 = new JsonObject();
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.getChangepwdCTURL();
			jobject1.addProperty("currentPassword", currentPwd);
			jobject1.addProperty("newPassword", newPassword);
			HttpPatch httpPatch = new HttpPatch(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPatch.setHeader("CTCustomerToken", customerTokenVal);
			httpPatch.setHeader("Authorization", "Bearer " + bearerToken);
			httpPatch.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPatch);
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
