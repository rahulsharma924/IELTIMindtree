package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.FetchProductService;
import com.aem.ie.core.Service.IECTRegisterService;
import com.aem.ie.core.services.impl.FetchProductsServiceImpl;
import com.aem.ie.core.services.impl.IECTRegisterImpl;
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

class FetchOrderServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    FetchProductService fetchProductService;
    private FetchProductService mockFetchProductService;
    @InjectMocks
    FetchOrderServlet MockFetchOrderServlet;

    private Map<String, String> configProps = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("fetchOrderProductAPI", "https://apim-iedtecomm-dev01.azure-api.net/cart-direct/fairview/delete/");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockFetchProductService = aemContext.registerInjectActivateService(new FetchProductsServiceImpl(), configProps);
    }
    @Test()
    void doPost() throws ServletException, IOException,NullPointerException {

   //     NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            String CTCustomerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String pastDays ="90";
            String pageSize ="90";

            String MockClearCartResponse = mockFetchProductService.getFetchProductAPI(CTCustomerToken,pastDays,pageSize,bearerToken);
            when(fetchProductService.getFetchProductAPI(CTCustomerToken,pastDays,pageSize,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("pastDays",pastDays);
            request.addRequestParameter("pageSize",pageSize);
            request.addRequestParameter("CTCustomerToken",CTCustomerToken);
            MockFetchOrderServlet.doPost(request,response);
   //     });

    }

}