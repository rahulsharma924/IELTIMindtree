package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CustomerProfileService;
import com.aem.ie.core.Service.IECTLoginService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.CTResetPasswordImpl;
import com.aem.ie.core.services.impl.CustomerProfileServiceImpl;
import com.aem.ie.core.services.impl.IECTLoginImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;

class CheckoutLoginServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    IECTLoginService loginService;

    private IECTLoginService mockLoginService;
    @InjectMocks
    CheckoutLoginServlet MockCheckoutLoginServlet;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String, String> configProps = new HashMap<String, String>();
    private Map<String, String> props = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        props.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        props.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        props.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        props.put("getGrantTypeBearerTokenUrl", "client_credentials");
        props.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(), props);

        configProps.put("getCheckoutLoginCTURL", "https://apim-iedtecomm-dev.azure-api.net/login/fairview/guest/login");
        mockLoginService = aemContext.registerInjectActivateService(new IECTLoginImpl(), configProps);
    }

    @Test()
    void doPostMethod() throws ServletException, IOException,NullPointerException {
            String bearerToken = bearerTokenURLResponse();
            String CTCustomerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            String email = "test_customerT7@test.com";
            String password = "secret123";
            MockSlingHttpServletRequest request = aemContext.request();
            String MockClearCartResponse = mockLoginService.getCheckoutLogin(CTCustomerToken,email,password, bearerToken);
            when(loginService.getCheckoutLogin(CTCustomerToken, email,password,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken", bearerToken);
            request.addRequestParameter("email", email);
            request.addRequestParameter("password", password);
            request.addRequestParameter("CTCustomerToken", CTCustomerToken);
            MockCheckoutLoginServlet.doPost(request, response);
    }

    private String bearerTokenURLResponse() throws IOException {
        String bearerAccessToken = "bearertoken";
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