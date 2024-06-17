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

import com.aem.ie.core.Service.ProductProjectionService;
import com.aem.ie.core.configuration.getproductprojectionconfig;

@Component(service = ProductProjectionService.class, immediate = true)
@Designate(ocd = getproductprojectionconfig.class)
public class ProductprojectionServiceImpl implements ProductProjectionService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private getproductprojectionconfig configuration;
	private static final Logger log = LoggerFactory.getLogger(ProductprojectionServiceImpl.class);

	@Activate
	protected void activate(getproductprojectionconfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getProductProjectionCTUrl(String Sku,String currency,String ctToken,String bearerToken) {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			/*
			 * Reading values from the configuration
			 */
			String url = configuration.getProductProjectionApiUrl();
			String finalURL = url+"?currency="+currency+"&sku="+Sku;
			HttpGet httpGet = new HttpGet(finalURL);
			httpGet.setHeader("Authorization", "Bearer " + bearerToken);
			httpGet.setHeader("CTCustomerToken", ctToken);
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
