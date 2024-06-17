package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.DeleteAddressService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.google.gson.JsonObject;
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

import java.io.IOException;

@Component(service = DeleteAddressService.class, immediate = true)
@Designate(ocd = CTAccountsConfig.class)
public class DeleteAddressServiceImpl implements DeleteAddressService {
	private static final Logger log = LoggerFactory.getLogger(DeleteAddressServiceImpl.class);
	private CTAccountsConfig ctAccountsConfig;

	@Activate
	protected void activate(CTAccountsConfig ctAccountsConfig) {
		this.ctAccountsConfig = ctAccountsConfig;
	}

	@Override
	public String deleteAddress(String customerTokenVal, JsonObject jsonObject) {
		String response = StringUtils.EMPTY;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String url = ctAccountsConfig.getDeleteAddressURL();
			HttpPost httpPost = new HttpPost(url);
			String jsonString = jsonObject.toString();
			HttpEntity stringEntity = new StringEntity(jsonString, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", customerTokenVal);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			response = EntityUtils.toString(response2.getEntity());
		} catch (IOException | RuntimeException e) {
			log.error("Exception Occurred in remove product", e.getMessage());
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
