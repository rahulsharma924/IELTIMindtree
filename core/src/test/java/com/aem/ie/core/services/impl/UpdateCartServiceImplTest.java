package com.aem.ie.core.services.impl;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.UpdateCartService;
import com.aem.ie.core.configuration.CartConfig;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class UpdateCartServiceImplTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	private UpdateCartService updateCartService;
	@Mock
    private UpdateCartService mockupdateCartService;
	
	private OLCCModuleService mockSampleOSGIService;
	
	@InjectMocks
	UpdateCartServiceImpl updateCartServiceImpl;
	private Map<String, String> configProps = new HashMap<String, String>();
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
		props.put("getUpdateCartURL", "https://apim-iedtecomm-qa01.azure-api.net/cart/fairview/updateCart");
		updateCartService = aemContext.registerInjectActivateService(new UpdateCartServiceImpl(),props);
	}
	@Test()
    void getUpdateCartCTUrlTest() throws IOException, ServletException {
		String bearerToken=bearerTokenURLResponse();
		 CartConfig config = mock(CartConfig.class);
         CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
         HttpEntity hattpEntity=mock(HttpEntity.class);
         String customerTokenValue = "kljijjljls9089d9vdv90dv9dvlm39r0ier";
         String lineItemId = "7beffb8c-ed44-43f2-930e-2de908da4438";
         String quantity = "1";
         String unitOfMeasurement = "1";
         String isCustomLineItem = "True";
         String MockClearCartResponse = updateCartService.getUpdateCartCTUrl(customerTokenValue, bearerToken, quantity, lineItemId, unitOfMeasurement, isCustomLineItem);
         when(mockupdateCartService.getUpdateCartCTUrl(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(MockClearCartResponse);
         updateCartServiceImpl.activate(config);
         when(response2.getEntity()).thenReturn(hattpEntity);
		
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

