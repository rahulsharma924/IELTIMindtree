package com.aem.ie.core.servlets;

import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.ValidateAddressService;
import com.aem.ie.core.services.impl.IECTLoginImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.aem.ie.core.services.impl.UpdatePersonalInfoServiceImpl;
import com.aem.ie.core.services.impl.ValidateAddressServiceImpl;
import com.google.gson.JsonObject;

import io.wcm.testing.mock.aem.junit5.AemContext;
public class ValidateAddressServletTest {
	AemContext aemContext = new AemContext();
	private ValidateAddressService validateAddressService;
	private OLCCModuleService mockSampleOSGIService;
	@Mock
	private ValidateAddressService mockvalidateAddressService;
	@InjectMocks
	ValidateAddressServlet validateAddressServlet;
	private Map<String,String> configProps = new HashMap<String, String>();
	private Map<String,String> props = new HashMap<String, String>();
	@BeforeEach
	void setUp() {
	MockitoAnnotations.openMocks(this);
	configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
	configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
	configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
	configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
	configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
	mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
	props.put("getValidateAddressCTURL","https://apim-iedtecomm-qa01.azure-api.net/tax/fairview/validateAddress");
	validateAddressService = aemContext.registerInjectActivateService(new ValidateAddressServiceImpl(),props);
	}
	@Test
	void doPost() throws IOException, ServletException {
		String bearerToken = bearerTokenURLResponse();
		//String responseValue = StringUtils.EMPTY;
		String customerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
		JsonObject jsonObject = new JsonObject();
        JsonObject addressObject = new JsonObject();
        String addid="i09erte";
        addressObject.addProperty("addressId",addid);
        jsonObject.add("address", addressObject);
		String responseValue = validateAddressService.getValidateAddressUrl(customerToken, bearerToken, jsonObject);
		when(mockvalidateAddressService.getValidateAddressUrl(Mockito.anyString(), Mockito.anyString(), Mockito.any())).thenReturn(responseValue);
		MockSlingHttpServletRequest request = aemContext.request();
		MockSlingHttpServletResponse response = aemContext.response();
		request.setPathInfo("/bin/validateAddress");
		request.addRequestParameter("CTCustomerToken",customerToken);
		request.addRequestParameter("bearerToken",bearerToken);
		request.addRequestParameter("addressId",addid);
		request.addRequestParameter("jsonData",jsonObject.toString());
		validateAddressServlet.doGet(response, request);
	}
	@Test
	void doPostPathchange() throws IOException, ServletException {
		String bearerToken = bearerTokenURLResponse();
		String jsonData ="jsondata";
		//String responseValue = StringUtils.EMPTY;
		String responseValue = validateAddressService.getValidateAddressGuestUser(jsonData, bearerToken);
		when(mockvalidateAddressService.getValidateAddressGuestUser(jsonData, bearerToken)).thenReturn(responseValue);
		MockSlingHttpServletRequest request = aemContext.request();
		MockSlingHttpServletResponse response = aemContext.response();
		request.setPathInfo("/bin/validateAddress.guestUser");
		request.addRequestParameter("bearerToken",bearerToken);
		request.addRequestParameter("jsonData",jsonData);
		validateAddressServlet.doPost(request, response);
	}
	private String bearerTokenURLResponse() throws IOException {
		String bearerAccessToken = "bearerToken";
		String bearerTokenURLResponse = mockSampleOSGIService.getBearerTokenUrl();
		String[] couple = bearerTokenURLResponse.split(",");
		for(int i =0; i < couple.length ; i++) {
		String[] items =couple[i].split(":");
		if(items[0].contains("access_token")) {
		bearerAccessToken = items[1].replace("\"","");
		bearerAccessToken = bearerAccessToken.replace("}","");
		}
		}
		return bearerAccessToken;
		}
}