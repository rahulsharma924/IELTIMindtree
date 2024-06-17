package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTRegisterService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.IECTRegisterImpl;
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

class CheckoutGuestRegistrationServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    IECTRegisterService IECTRegisterService;
    private IECTRegisterService mockIECTRegisterService;
    @InjectMocks
    CheckoutGuestRegistrationServlet MockCheckoutGuestRegistrationServlet;
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

        configProps.put("getCheckoutGuestRegCTURL","https://apim-iedtecomm-dev.azure-api.net/registration/fairview/register-in-checkout");
        mockIECTRegisterService = aemContext.registerInjectActivateService(new IECTRegisterImpl(), configProps);
    }

    @Test()
    void doPostMethod() throws ServletException, IOException,NullPointerException {
            String bearerToken = bearerTokenURLResponse();
            String customer_token = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            String registration = "j90i90fjdpkfdkfpdk89u89dkld";
            String MockClearCartResponse = mockIECTRegisterService.getCheckoutGuestRegistration(customer_token,registration,bearerToken);
            when(IECTRegisterService.getCheckoutGuestRegistration(customer_token,registration,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletRequest request = aemContext.request();
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            request.addRequestParameter("registration",registration);
            MockCheckoutGuestRegistrationServlet.doPost(request,response);
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