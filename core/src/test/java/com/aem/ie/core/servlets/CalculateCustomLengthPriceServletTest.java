package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CTOrderDetailService;
import com.aem.ie.core.Service.CustomLengthPriceService;
import com.aem.ie.core.services.impl.CTOrderDetailServiceImpl;
import com.aem.ie.core.services.impl.CustomLengthPriceServiceImpl;
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

class CalculateCustomLengthPriceServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    CustomLengthPriceService CustomLengthPriceService;
    private CustomLengthPriceService mockCustomLengthPriceService;
    @InjectMocks
    CalculateCustomLengthPriceServlet MockCalculateCustomLengthPriceServlet;

    private Map<String, String> configProps = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getCustomLengthPriceURL", "https://apim-iedtecomm-dev01.azure-api.net/account/fairview/reorder");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockCustomLengthPriceService = aemContext.registerInjectActivateService(new CustomLengthPriceServiceImpl(), configProps);
    }

    @Test()
    void doPost() throws ServletException, IOException,NullPointerException {
        //Code under test
        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            String customer_token = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String jsonData = "j90i90fjdpkfdkfpdk89u89dkld";

            String MockClearCartResponse = mockCustomLengthPriceService.getCustomLengthPrice(customer_token, jsonData, bearerToken);
            when(CustomLengthPriceService.getCustomLengthPrice(customer_token, jsonData, bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken", bearerToken);
            request.addRequestParameter("customer_token", customer_token);
            request.addRequestParameter("jsonData", jsonData);
            MockCalculateCustomLengthPriceServlet.doPost(request, response);
        });
    }
}