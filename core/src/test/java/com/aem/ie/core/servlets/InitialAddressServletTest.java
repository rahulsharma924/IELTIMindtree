package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.AddNewAddressService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.AddNewAddressServiceImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.google.gson.JsonObject;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class InitialAddressServletTest {

    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    private OLCCModuleService mockSampleOSGIService;
    private AddNewAddressService mockSampleAddNewAddressService;

    @Mock
    AddNewAddressService addNewAddressService;

    @InjectMocks
    InitialAddressServlet InitialAddressServlet;

    private Map<String, String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);

        configProps.put("getNewAddressURL", "https://apim-iedtecomm-dev01.azure-api.net/customer/fairview/me");
        mockSampleAddNewAddressService = aemContext.registerInjectActivateService(new AddNewAddressServiceImpl(), configProps);
    }

    @Test()
    void doPost() throws ServletException, IOException,NullPointerException {
            String bearertoken = bearerTokenURLResponse();
            JsonObject responseValue = new JsonObject();
            String accessToken ="j90i90fjdpkfdkfpdk89u89dkld";
            MockSlingHttpServletRequest request = aemContext.request();
            responseValue = mockSampleAddNewAddressService.initialAddressDetails(request,accessToken,bearertoken);
            when(addNewAddressService.initialAddressDetails(request,accessToken,bearertoken)).thenReturn(responseValue);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearertoken);
            request.addRequestParameter("accessToken",accessToken);
            InitialAddressServlet.doPost(request,response);
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