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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.IECTLogoutService;
import com.aem.ie.core.Service.IECTResetPasswordEmailValidation;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.configuration.IEDirectCallConfig;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class IECTResetPasswordEmailImplTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	//private TestLogger logger = TestLoggerFactory.getTestLogger(IECTLogoutImpl.class);
	private IECTResetPasswordEmailValidation ieCTResetPasswordEmailValidation;
	@Mock
    private IECTResetPasswordEmailValidation mockieCTResetPasswordEmailValidation;
	private OLCCModuleService mockSampleOSGIService;
	@InjectMocks
	IECTResetPasswordEmailImpl ieCTResetPasswordEmailImpl;
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
		props.put("getResetPasswordCTURL", "https://apim-iedtecomm-qa01.azure-api.net/customer/fairview/password-token");
		ieCTResetPasswordEmailValidation = aemContext.registerInjectActivateService(new IECTResetPasswordEmailImpl(),props);
	}
	@Test()
    void getResetPasswordEmailCTUrlTest() throws ServletException, IOException, NullPointerException{
		String bearerToken=bearerTokenURLResponse();
		String emailid="test@gmail.com";
		String customerToken="kljijjljls9089d9vdv90dv9dvlm39r";
		IEDirectCallConfig config = mock(IEDirectCallConfig.class);
         CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
         HttpEntity hattpEntity=mock(HttpEntity.class);
         String resultResponse = ieCTResetPasswordEmailValidation.getResetPasswordEmailCTUrl(emailid, bearerToken);
         when(mockieCTResetPasswordEmailValidation.getResetPasswordEmailCTUrl(Mockito.anyString(), Mockito.anyString())).thenReturn(resultResponse);
         ieCTResetPasswordEmailImpl.activate(config);
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

