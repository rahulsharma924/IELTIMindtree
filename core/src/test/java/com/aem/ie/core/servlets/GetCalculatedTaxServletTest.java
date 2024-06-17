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

class GetCalculatedTaxServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    GetCalculatedTaxService GetCalculatedTaxService;
    private GetCalculatedTaxService mockGetCalculatedTaxService;
    @InjectMocks
    GetCalculatedTaxServlet MockGetCalculatedTaxServlet;

    private Map<String, String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("calculatedTaxCTURL", "https://apim-iedtecomm-dev01.azure-api.net/tax/fairview/estimateTax");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockGetCalculatedTaxService = aemContext.registerInjectActivateService(new GetCalculatedTaxServiceImpl(), configProps);
    }
    @Test()
    void doPatch() throws ServletException, IOException,NullPointerException {

        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String countryCode = "L106789";
            String postalCode = "9809klk";
            String access_token ="j90i90fjdpkfdkfpdk89u89dkld";

            String MockClearCartResponse = mockGetCalculatedTaxService.getCalculatedTax(access_token,countryCode,postalCode,bearerToken);
            when(GetCalculatedTaxService.getCalculatedTax(access_token,countryCode,postalCode,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("countryCode",countryCode);
            request.addRequestParameter("access_token",access_token);
            request.addRequestParameter("CTCustomerToken",access_token);
            MockGetCalculatedTaxServlet.doPatch(request,response);
        });

    }
    @Test()
    void service() throws ServletException, IOException,NullPointerException {
        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            MockSlingHttpServletRequest request = aemContext.request();
            MockSlingHttpServletResponse response = aemContext.response();
            //Code under test
            MockGetCalculatedTaxServlet.service(request, response);
        });

    }

}