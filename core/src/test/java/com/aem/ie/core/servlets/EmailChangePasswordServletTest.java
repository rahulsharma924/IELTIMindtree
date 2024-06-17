package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CTOrderHistoryService;
import com.aem.ie.core.Service.IECTEmailChangePasswordService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.CTOrderHistoryServiceImpl;
import com.aem.ie.core.services.impl.IECTEmailChangePwdImpl;
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
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;

class EmailChangePasswordServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    
    IECTEmailChangePasswordService emailchangepwdService;
    @Mock
    private IECTEmailChangePasswordService mockEmailchangepwdService;
    @InjectMocks
    EmailChangePasswordServlet MockEmailChangePasswordServlet;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String, String> configProps = new HashMap<String, String>();
    private Map<String, String> props = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
        props.put("getEmailChangePwdCTURL","https://apim-iedtecomm-dev01.azure-api.net/customer/fairview/password/reset");
        emailchangepwdService = aemContext.registerInjectActivateService(new IECTEmailChangePwdImpl(), props);
    }

    @Test()
    void doPostTest() throws ServletException, IOException {
            //Code under test
            String bearerToken = bearerTokenURLResponse();
            String tokenidValue = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            String newPwd = "secret123";
            String MockClearCartResponse = emailchangepwdService.getEmailChangePasswordCTUrl(tokenidValue, newPwd, bearerToken);
            when(mockEmailchangepwdService.getEmailChangePasswordCTUrl(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(MockClearCartResponse);
            MockSlingHttpServletRequest request = aemContext.request();
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("CTCustomerToken", tokenidValue);
            request.addRequestParameter("newPassword", newPwd);
            request.addRequestParameter("bearertoken", bearerToken);
            MockEmailChangePasswordServlet.doPost(request, response);
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