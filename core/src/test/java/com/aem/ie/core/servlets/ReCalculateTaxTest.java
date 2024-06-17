package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.ClearCartService;
import com.aem.ie.core.Service.GetCalculatedTaxService;
import com.aem.ie.core.services.impl.ClearCartServiceImpl;
import com.aem.ie.core.services.impl.GetCalculatedTaxServiceImpl;
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

class ReCalculateTaxTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    GetCalculatedTaxService getCalculatedTaxService;
    private GetCalculatedTaxService mockGetCalculatedTaxService;
    @InjectMocks
    ReCalculateTax MockReCalculateTax;

    private Map<String, String> configProps = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("reCalculateTaxURL", "https://apim-iedtecomm-dev01.azure-api.net/cart-direct/fairview/delete/");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockGetCalculatedTaxService = aemContext.registerInjectActivateService(new GetCalculatedTaxServiceImpl(), configProps);
    }
    @Test()
    void doPost() throws ServletException, IOException,NullPointerException {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String access_token ="j90i90fjdpkfdkfpdk89u89dkld";

            String MockClearCartResponse = mockGetCalculatedTaxService.getReCalculateTaxUser(access_token,bearerToken);
            when(getCalculatedTaxService.getReCalculateTaxUser(access_token,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",access_token);
            MockReCalculateTax.doPost(request,response);

    }

}