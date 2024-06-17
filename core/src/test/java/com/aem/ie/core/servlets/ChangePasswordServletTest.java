package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTPasswordchangeService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.CTResetPasswordImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
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

class ChangePasswordServletTest {
    AemContext aemContext =  new AemContext();

    private OLCCModuleService mockSampleOSGIService;
    private IECTPasswordchangeService mockcpwdService;

    @Mock
    IECTPasswordchangeService cpwdService;

    @InjectMocks
    ChangePasswordServlet MockChangePasswordServletTest;

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
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(), configProps);

        props.put("getChangepwdCTURL","https://apim-iedtecomm-dev01.azure-api.net/cart/fairview/updateCart");
        mockcpwdService = aemContext.registerInjectActivateService(new CTResetPasswordImpl(),props);
    }

    @Test()
    void doPatch() throws ServletException, IOException,NullPointerException {
            String bearerToken = bearerTokenURLResponse();
            String customer_token = "JrPBnz4Xx467DsuDKpXVWR9uDksziTs3";
            String currentPwd="secret123";
            String newPwd = "secret1234";
            MockSlingHttpServletRequest request = aemContext.request();
            MockSlingHttpServletResponse response = aemContext.response();
            String MockClearCartResponse = mockcpwdService.getPasswordChangeCTUrl(customer_token,currentPwd, newPwd, bearerToken);
            when(cpwdService.getPasswordChangeCTUrl(customer_token,currentPwd, newPwd, bearerToken)).thenReturn(MockClearCartResponse);
            request.addRequestParameter("bearertoken", bearerToken);
            request.addRequestParameter("newPassword", newPwd);
            request.addRequestParameter("currentPassword", currentPwd);
            request.addRequestParameter("CTCustomerToken", customer_token);
            MockChangePasswordServletTest.doPost(request, response);
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