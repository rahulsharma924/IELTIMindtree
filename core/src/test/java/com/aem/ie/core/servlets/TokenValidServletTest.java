package com.aem.ie.core.servlets;

import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.IECTViewPaymentService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.TokenValidService;
import com.aem.ie.core.services.impl.TokenValidateServiceImpl;
import com.aem.ie.core.services.impl.ViewPaymentServiceImpl;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class TokenValidServletTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    @Mock
    private TokenValidService tokenValidService;
    private TokenValidService mockTokenValidService;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String, String> configProps = new HashMap<>();
    @InjectMocks
    TokenValidServlet tokenValidServlet;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getTokenValid", "https://apim-iedtecomm-qa01.azure-api.net/customer/fairview/password-token");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockTokenValidService = aemContext.registerInjectActivateService(new TokenValidateServiceImpl(), configProps);
    }

    @Test()
    void doGet() throws ServletException, IOException,NullPointerException {
        
            //Code under test
        	String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0ie";
        	//String bearerToken = bearerTokenURLResponse();
            String customer_token = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();

            String MockClearCartResponse = mockTokenValidService.tokenValidationUrl(customer_token, bearerToken);
            when(tokenValidService.tokenValidationUrl(customer_token, bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            tokenValidServlet.doGet(request,response);
        

    }

   
}
