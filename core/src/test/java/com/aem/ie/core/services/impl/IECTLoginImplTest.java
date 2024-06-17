package com.aem.ie.core.services.impl;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.IECTLoginService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.ValidateAddressService;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.servlets.ValidateAddressServlet;

import io.wcm.testing.mock.aem.junit5.AemContext;
import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;
public class IECTLoginImplTest {
	AemContext aemContext = new AemContext();
	private TestLogger logger = TestLoggerFactory.getTestLogger(IECTLoginImpl.class);
	
	private IECTLoginService loginService;
	@Mock
    private IECTLoginService mockIECTLoginService;
	private OLCCModuleService mockSampleOSGIService;
	
	@InjectMocks
	IECTLoginImpl ieCTLoginImpl;
	private Map<String, String> configProps = new HashMap<String, String>();
	private Map<String,String> props = new HashMap<String, String>();
	@BeforeEach
    void setUp() {
		MockitoAnnotations.openMocks(this);
		IECTLoginConfig config = mock(IECTLoginConfig.class);
		configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
		configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
		configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
		configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
		configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
		mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
		props.put("getLoginCTURL", "https://apim-iedtecomm-qa01.azure-api.net/login/fairview");
		props.put("getCheckoutLoginCTURL", "https://apim-iedtecomm-qa01.azure-api.net/login/fairview/guest/login");
		loginService = aemContext.registerInjectActivateService(new IECTLoginImpl(),props);
	}
	@Test()
    void getLoginCTUrlTest() throws IOException, ServletException {
		String bearerToken=bearerTokenURLResponse();
		 String email = "test@yopmail.com";
         String pwd="secret123";
         IECTLoginConfig config = mock(IECTLoginConfig.class);
         CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
         HttpEntity hattpEntity=mock(HttpEntity.class);
         String MockClearCartResponse = mockIECTLoginService.getLoginCTUrl(email, pwd, bearerToken);
         when(loginService.getLoginCTUrl(email, pwd, bearerToken)).thenReturn(MockClearCartResponse);
         ieCTLoginImpl.activate(config);
         when(response2.getEntity()).thenReturn(hattpEntity);
	}
	@Test()
    void getCheckoutLoginTest() throws IOException, ServletException {
		String bearerToken=bearerTokenURLResponse();
		 String email = "test@yopmail.com";
         String pwd="secret123";
         String customerToken="kljijjljls9089d9vdv90dv9dvlm39r";
         IECTLoginConfig config = mock(IECTLoginConfig.class);
         CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
         HttpEntity hattpEntity=mock(HttpEntity.class);
         String MockClearCartResponse = mockIECTLoginService.getCheckoutLogin(customerToken, email, pwd, bearerToken);
         when(loginService.getCheckoutLogin(customerToken, email, pwd, bearerToken)).thenReturn(MockClearCartResponse);
         ieCTLoginImpl.activate(config);
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
