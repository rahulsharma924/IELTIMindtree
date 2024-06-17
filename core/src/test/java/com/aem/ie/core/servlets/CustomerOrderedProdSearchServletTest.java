package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CTCustomerOrderedProductService;
import com.aem.ie.core.Service.ClearCartService;
import com.aem.ie.core.services.impl.CTCustomerOrderedProductServiceImpl;
import com.aem.ie.core.services.impl.ClearCartServiceImpl;
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

class CustomerOrderedProdSearchServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    CTCustomerOrderedProductService CTCustomerOrderedProductService;

    private CTCustomerOrderedProductService mockCTCustomerOrderedProductService;

    @InjectMocks
    CustomerOrderedProdSearchServlet MockCustomerOrderedProdSearchServlet;

    private Map<String, String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getCustomerOrderedProductURL", "https://apim-iedtecomm-dev.azure-api.net/account/fairview/fetch-products");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockCTCustomerOrderedProductService = aemContext.registerInjectActivateService(new CTCustomerOrderedProductServiceImpl(), configProps);
    }
    @Test()
    void doPost() throws ServletException, IOException,NullPointerException {

        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String query = "test";
            String customer_token ="j90i90fjdpkfdkfpdk89u89dkld";

            String MockClearCartResponse = mockCTCustomerOrderedProductService.getCustomerOrderedProductSearch(customer_token,query,bearerToken);
            when(CTCustomerOrderedProductService.getCustomerOrderedProductSearch(customer_token,query,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("customer_token",customer_token);
            request.addRequestParameter("query",query);
            MockCustomerOrderedProdSearchServlet.doPost(request,response);
        });

    }
}