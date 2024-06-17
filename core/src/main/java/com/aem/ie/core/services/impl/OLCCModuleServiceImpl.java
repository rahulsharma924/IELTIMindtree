package com.aem.ie.core.services.impl;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.configuration.OLCCUrlConfig;
import com.aem.ie.core.constants.ApplConstants;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.utils.URIBuilder;
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

import static com.aem.ie.core.constants.ApplConstants.*;

@Component(service = OLCCModuleService.class, immediate = true)
@Designate(ocd = OLCCUrlConfig.class)
public class OLCCModuleServiceImpl implements OLCCModuleService {

	private static final Logger LOGGER = LoggerFactory.getLogger(OLCCModuleServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private OLCCUrlConfig configuration;

	@Activate
	protected void activate(OLCCUrlConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getAllOptions(String requestBody, String bearerToken) throws IOException {
		String url = configuration.getAllOptions();
		return executeApiCall(url, requestBody, POST, bearerToken);
	}

	@Override
	public String getOption(String requestBody, String bearerToken) throws IOException {
		String url = configuration.getOption();
		return executeApiCall(url, requestBody, POST, bearerToken);
	}

	@Override
	public String getSearchOptions(String requestBody, String bearerToken) throws IOException {
		String url = configuration.getSearchOptions();
		return executeApiCall(url, requestBody, POST, bearerToken);
	}

	@Override
	public String createAssembly(String requestBody, String bearerToken) {
		String url = configuration.getCreateUrl();
		return executeApiCall(url, requestBody, POST, bearerToken);
	}

	@Override
	public String getCableAssembly(String sku, String bearerToken) {
		String url = configuration.getCableAssembly();
		Map<String, String> params = new HashMap<>();
		params.put(SKU, sku);

		return executeApiCall(getProcessedURI(url, params), "", GET, bearerToken);
	}

	@Override
	public String getSearchCableAssembly(String requestBody, String bearerToken) {
		String url = configuration.getSearchCableAssembly();
		return executeApiCall(url, requestBody, POST, bearerToken);
	}

	@Override
	public String addCustomLengthToCartUrl(String token, String currency, String skuValue, String quantity,
			String unitOfMeasurement, String length, String bearerToken, String cableAssemblyTesting)
			throws IOException {
		String response = null;
		CloseableHttpClient httpclient = HttpClients.createDefault();
		JsonObject jobject = new JsonObject();
		try {
			String url = configuration.getCustomLengthToCartUrl();
			jobject.addProperty("currency", currency);
			jobject.addProperty("masterSku", skuValue);
			jobject.addProperty("quantity", quantity);
			jobject.addProperty("unitOfMeasurement", unitOfMeasurement);
			jobject.addProperty("length", length);
			if (cableAssemblyTesting.indexOf("na") < 0 && cableAssemblyTesting != null) {
				JsonObject jsonObjectAlt = JsonParser.parseString(cableAssemblyTesting).getAsJsonObject();
				jobject.add("cableAssemblyTesting", jsonObjectAlt);
			}
			HttpPut httpPut = new HttpPut(url);
			httpPut.setHeader("Authorization", "Bearer " + bearerToken);
			String JSON_STRING = jobject.toString();
			HttpEntity stringEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
			if (token != null && !token.equals(" ") && !token.equals("undefined")) {
				httpPut.setHeader("CTCustomerToken", token);
				httpPut.setEntity(stringEntity);
				CloseableHttpResponse httpResponse = httpclient.execute(httpPut);
				response = EntityUtils.toString(httpResponse.getEntity());
			} else {
				httpPut.setEntity(stringEntity);
				CloseableHttpResponse httpResponse = httpclient.execute(httpPut);
				response = EntityUtils.toString(httpResponse.getEntity());
			}
		} catch (IOException e) {
			response = e.getMessage();
			LOGGER.error("IO Exception occurred while getting the result from AddCustomLengthToCartURL : {}",
					e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occurred during closing the call AddCustomLengthToCartURL {}", e.getMessage());
			}
		}
		return response;
	}

	String getProcessedURI(String url, Map<String, String> params) {
		try {
			URIBuilder processedURI = new URIBuilder(url);
			for (Map.Entry<String, String> entry : params.entrySet()) {
				processedURI.addParameter(entry.getKey(), entry.getValue());
			}
			return processedURI.toString();
		} catch (URISyntaxException e) {
			LOGGER.error("error occured during URI Encoding {}", e.getMessage());
		}
		return "";
	}

	HttpGet doGetCall(String url, String bearerToken) {
		HttpGet httpGet = new HttpGet(url);
		httpGet.setHeader("Authorization", "Bearer " + bearerToken);
		httpGet.setHeader(ApplConstants.CONTENT_TYPE, ApplConstants.CONTENT_TYPE_JSON);
		return httpGet;
	}

	HttpPost doPostCall(String url, String requestBody, String bearerToken) throws IOException {
		HttpPost httpPost = new HttpPost(url);
		httpPost.setHeader("Authorization", "Bearer " + bearerToken);
		httpPost.setHeader(ApplConstants.CONTENT_TYPE, ApplConstants.CONTENT_TYPE_JSON);
		httpPost.setEntity(new StringEntity(requestBody));
		return httpPost;
	}

	private String executeApiCall(String url, String requestBody, String method, String bearerToken) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String responseValue = "false";
		try {
			CloseableHttpResponse response;
			if (POST.equals(method))
				response = httpclient.execute(doPostCall(url, requestBody, bearerToken));
			else
				response = httpclient.execute(doGetCall(url, bearerToken));
			responseValue = EntityUtils.toString(response.getEntity());
		} catch (IOException e) {
			responseValue = e.getMessage();
			LOGGER.error("Exception Occurred in get All Options", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call {}", e.getMessage());
			}
		}

		return responseValue;
	}

	@Override
	public String getBearerTokenUrl() throws IOException {
		String url = configuration.getBearerTokenUrl();
		String bClientId = configuration.getClientIdBearerTokenUrl();
		String bClientSecret = configuration.getClientSecretBearerTokenUrl();
		String bGrantType = configuration.getGrantTypeBearerTokenUrl();
		String bScope = configuration.getScopeBearerTokenUrl();

		Map<String, String> bkv = new HashMap<>();
		bkv.put("grant_type", bGrantType);
		bkv.put("client_id", bClientId);
		bkv.put("scope", bScope);
		bkv.put("client_secret", bClientSecret);
		String stringCt = "";
		List<String> st = bkv.entrySet().stream().map((entry) -> entry.getKey() + "=" + entry.getValue() + "&")
				.collect(Collectors.toList());
		for (int i = 0; i < st.size(); i++) {
			stringCt = stringCt + st.get(i);
		}
		return executeTokenApiCall(url, stringCt);
	}

	private String executeTokenApiCall(String url, String stringCt) {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String responseValue = "false";
		String accessToken = "token";
		try {
			HttpPost httpPost = new HttpPost(url);
			httpPost.setHeader(ApplConstants.CONTENT_TYPE, ApplConstants.CONTENT_TYPE_URLENCODED);
			HttpEntity stringEntity = new StringEntity(stringCt);
			httpPost.setEntity(stringEntity);
			CloseableHttpResponse response = httpclient.execute(httpPost);
			responseValue = EntityUtils.toString(response.getEntity());
			String[] couple = responseValue.split(",");
			for (int i = 0; i < couple.length; i++) {
				String[] items = couple[i].split(":");
				if (items[0].contains("access_token")) {
					accessToken = items[1].replace("}", "");
				}
			}

		} catch (IOException e) {
			responseValue = e.getMessage();
			LOGGER.error("Exception Occurred in TokenApiCall", e);
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occured during closing the client call {}", e.getMessage());
			}
		}
		return responseValue;
	}
}
