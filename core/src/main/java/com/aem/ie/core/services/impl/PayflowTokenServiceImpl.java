package com.aem.ie.core.services.impl;

import java.io.IOException;
import java.math.BigInteger;
import java.security.SecureRandom;

import com.aem.ie.core.Service.PayflowTokenService;
import com.aem.ie.core.configuration.PayflowConfig;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.UUID;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;

import static com.aem.ie.core.constants.ServletConstants.GENERATE_TRANSACTION_ID;

@Component(service = PayflowTokenService.class, immediate = true)
@Designate(ocd = PayflowConfig.class)
public class PayflowTokenServiceImpl implements PayflowTokenService {
	/**
	 * Instance of the OSGi configuration class
	 */
	private PayflowConfig configuration;
	private static final Logger log = LoggerFactory.getLogger(PayflowTokenServiceImpl.class);
	private static final int TOKEN_LEBGTH = 36;
	private static SecureRandom random = new SecureRandom();

	@Activate
	protected void activate(PayflowConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getSecureToken(SlingHttpServletRequest slingRequest, String jsonObject, JsonObject jsonSecureData,
			String customerToken, String bearerToken) {
		String secureTokenResponse = StringUtils.EMPTY;
		String updateAddressUrl;
		updateAddressUrl = configuration.getPaypalUpdateAddressUrl();
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpEntity stringEntity = new StringEntity(jsonObject, ContentType.APPLICATION_JSON);
			if (!updateAddressUrl.isEmpty()) {
				HttpPatch httpPost = new HttpPatch(updateAddressUrl);
				httpPost.setEntity(stringEntity);
				httpPost.setHeader("CTCustomerToken", customerToken);
				httpPost.setHeader("Authorization", "Bearer " + bearerToken);
				CloseableHttpResponse httpResponse = httpclient.execute(httpPost);
				if (httpResponse.getStatusLine().getStatusCode() == 200) {
					secureTokenResponse = generateSecretToken(slingRequest, jsonSecureData, customerToken, bearerToken);
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
		return secureTokenResponse;
	}

	private String generateSecretToken(SlingHttpServletRequest slingRequest, JsonObject jsonObject,
			String customerToken, String bearerToken) {
		String randomnumber=null;
		UUID uuid = UUID.randomUUID();
        String uuidAsString = uuid.toString();
        randomnumber=uuidAsString.replaceAll("-", "");
        randomnumber=randomnumber.toUpperCase();
		String tokenid = new BigInteger(TOKEN_LEBGTH * 5, random).toString(32).toUpperCase().substring(0, TOKEN_LEBGTH);
		String generateTokenResponse = StringUtils.EMPTY;
		String url = configuration.getSecureTokenUrl();
		log.info("PayflowTokenServiceImpl generateSecretToken url : {}", url);
		String username = configuration.getSecureTokenUsername();
		String password = configuration.getSecureTokenPassword();
		String vendor = configuration.getSecureTokenVendor();
		String urlhost = String.valueOf(slingRequest.getRequestURL());
		urlhost = urlhost.replace("/bin/generatesecuretoken", "");
		//String returnURL = urlhost + GENERATE_TRANSACTION_ID;
		String returnURL = urlhost + GENERATE_TRANSACTION_ID + "?x-fm-view=new";
		log.info("PayflowTokenServiceImpl generateSecretToken returnURL : {}", returnURL);
		String currency = null, amt = null, shiptoFirstName = null, shipToZip = null, shipToCity = null,
				shipToCountry = null, shipToStreet = null, shipToState = null, shipToStreet2 = null,
				shiptoLastName = null, referenceNumber=null, email = null, shiptoPhoneNum = null;
		String billtoFirstName = null, billtoLastName = null, billToZip = null, billToCity = null, billToCountry = null,
				billToStreet = null, billToState = null, billToStreet2 = null, billtoPhoneNum = null;
		if (jsonObject.has("currency")) {
			currency = jsonObject.get("currency").getAsString();
		}
		if (jsonObject.has("amt")) {
			amt = jsonObject.get("amt").getAsString();
		}
		if (jsonObject.has("shiptoFirstName")) {
			shiptoFirstName = jsonObject.get("shiptoFirstName").getAsString();
		}
		if (jsonObject.has("shiptoLastName")) {
			shiptoLastName = jsonObject.get("shiptoLastName").getAsString();
		}
		if (jsonObject.has("shiptoPhoneNum")) {
			shiptoPhoneNum = jsonObject.get("shiptoPhoneNum").getAsString();
		}
		if (jsonObject.has("shiptoZip")) {
			shipToZip = jsonObject.get("shiptoZip").getAsString();
		}
		if (jsonObject.has("shiptoCountry")) {
			shipToCountry = jsonObject.get("shiptoCountry").getAsString();
		}
		if (jsonObject.has("shiptoCity")) {
			shipToCity = jsonObject.get("shiptoCity").getAsString();
		}
		if (jsonObject.has("shiptoStreet")) {
			shipToStreet = jsonObject.get("shiptoStreet").getAsString();
		}
		if (jsonObject.has("shiptoStreet1")) {
			shipToStreet2 = jsonObject.get("shiptoStreet1").getAsString();
		}
		if (jsonObject.has("shiptoState")) {
			shipToState = jsonObject.get("shiptoState").getAsString();
		}
		if (jsonObject.has("billtoPhoneNum")) {
			billtoPhoneNum = jsonObject.get("billtoPhoneNum").getAsString();
		}
		if (jsonObject.has("billtoFirstName")) {
			billtoFirstName = jsonObject.get("billtoFirstName").getAsString();
		}
		if (jsonObject.has("billtoLastName")) {
			billtoLastName = jsonObject.get("billtoLastName").getAsString();
		}
		if (jsonObject.has("billtoZip")) {
			billToZip = jsonObject.get("billtoZip").getAsString();
		}
		if (jsonObject.has("billtoCountry")) {
			billToCountry = jsonObject.get("billtoCountry").getAsString();
		}
		if (jsonObject.has("billtoCity")) {
			billToCity = jsonObject.get("billtoCity").getAsString();
		}
		if (jsonObject.has("billtoStreet")) {
			billToStreet = jsonObject.get("billtoStreet").getAsString();
		}
		if (jsonObject.has("billtoStreet1")) {
			billToStreet2 = jsonObject.get("billtoStreet1").getAsString();
		}
		if (jsonObject.has("billtoState")) {
			billToState = jsonObject.get("billtoState").getAsString();
		}
		if (jsonObject.has("referenceNumber")) {
			referenceNumber = jsonObject.get("referenceNumber").getAsString();
		}
		if (jsonObject.has("email")) {
			email = jsonObject.get("email").getAsString();
		}

		String body = "CURRENCY=" + currency + "&RETURNURL=" + returnURL + "&AMT=" + amt + "&PWD=" + password
				+ "&VENDOR=" + vendor + "&SHIPTOFIRSTNAME=" + shiptoFirstName + "&SHIPTOPHONENUM=" + shiptoPhoneNum
				+ "&USER=" + username + "&SECURETOKENID=" + tokenid + "&CREATESECURETOKEN=Y" + "&EMAIL=" + email
				+ "&PARTNER=PayPal" + "&TRXTYPE=A" + "&SHIPTOLASTNAME=" + shiptoLastName + "&SHIPTOZIP=" + shipToZip
				+ "&SHIPTOCOUNTRY=" + shipToCountry + "&SHIPTOCITY=" + shipToCity + "&SHIPTOSTREET=" + shipToStreet
				+ "&SHIPTOSTREET2=" + shipToStreet2 + "&SHIPTOSTATE=" + shipToState + "&BILLTOPHONENUM="
				+ billtoPhoneNum + "&BILLTOLASTNAME=" + billtoLastName + "&BILLTOFIRSTNAME=" + billtoFirstName
				+ "&BILLTOZIP=" + billToZip + "&BILLTOCOUNTRY=" + billToCountry + "&BILLTOCITY=" + billToCity
				+ "&BILLTOSTREET=" + billToStreet + "&BILLTOSTREET2=" + billToStreet2 + "&BILLTOSTATE=" + billToState
				+ "&USER1=" + customerToken + "&USER2=" + bearerToken + "&USER3=" + referenceNumber + "&COMMENT1=" + randomnumber+ "&COMMENT2=" + shiptoPhoneNum;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpEntity stringEntity = new StringEntity(body, ContentType.APPLICATION_JSON);
			if (!url.isEmpty()) {
				HttpPost httpPost = new HttpPost(url);
				httpPost.setEntity(stringEntity);
				CloseableHttpResponse response2 = httpclient.execute(httpPost);
				if (response2 != null) {
					generateTokenResponse = EntityUtils.toString(response2.getEntity());
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
		return generateTokenResponse;
	}

	@Override
	public String placeOrder(String customerTokenVal, String bearerToken, String transactionId, String ponumber) {
		String response = StringUtils.EMPTY;

		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			String url = configuration.getPaypalPlaceOrderUrl();
			log.info("PayflowTokenServiceImpl placeOrder url : {}", url);
			JsonObject jobject1 = new JsonObject();
			jobject1.addProperty("transactionId", transactionId);
			jobject1.addProperty("referenceNumber", ponumber);
			String JSON_STRING = jobject1.toString();
			HttpPost httpPost = new HttpPost(url);
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			httpPost.setHeader("CTCustomerToken", customerTokenVal);
			httpPost.setHeader("Authorization", "Bearer " + bearerToken);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse closeableHttpResponse = httpclient.execute(httpPost);
			log.info("PlaceOrder Response HTTP StatusCode : {}",closeableHttpResponse.getStatusLine().getStatusCode());
			if(closeableHttpResponse.getStatusLine().getStatusCode() == 201){
				response = EntityUtils.toString(closeableHttpResponse.getEntity());
			}
		} catch (IOException e) {
			log.error("Exception Occurred ", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				log.error("error occurred during closing the client call {}", e.getMessage());
			}
		}
		return response;
	}
}
