package com.aem.ie.core.services.impl;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.google.gson.JsonObject;

@Component(service = UpdatePersonalInfoService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class UpdatePersonalInfoServiceImpl implements UpdatePersonalInfoService {
	private static final Logger LOGGER = LoggerFactory.getLogger(UpdatePersonalInfoServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private CTAccountsConfig configuration;

	private String getDomainname;

	@Activate
	protected void activate(CTAccountsConfig configuration) {

		this.configuration = configuration;
		this.getDomainname = configuration.updateDomaininfo();
	}

	public String getDomainName() {
		return getDomainname;
	}

	@Override
	public String UpdatePersonalInfo(String customerTokenVal, String contact, String lastname, String email,
			String firstname, String company, String bearerToken, boolean contactByEmail) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			JsonObject jobject1 = new JsonObject();
			/**
			 * Reading values from the configuration
			 */
			String url = configuration.updatepersonalinfo();
			jobject1.addProperty("contact", contact);
			jobject1.addProperty("lastName", lastname);
			jobject1.addProperty("email", email);
			jobject1.addProperty("firstName", firstname);
			jobject1.addProperty("company", company);
			jobject1.addProperty("contactByEmail", contactByEmail);
			HttpPatch httpPatch = new HttpPatch(url);
			String JSON_STRING = jobject1.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPatch.setHeader("CTCustomerToken", customerTokenVal);
			httpPatch.setHeader("Authorization", "Bearer " + bearerToken);
			httpPatch.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPatch);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException e) {
			LOGGER.error("IO Exception occured while getting the results from entity" + e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call" + e.getMessage());
			}
		}
		return response;
	}
}
