package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CTCustomerOrderedProductService;
import com.aem.ie.core.Service.IECTDefaultPaymentService;
import com.aem.ie.core.services.impl.CTCustomerOrderedProductServiceImpl;
import com.aem.ie.core.services.impl.DefaultPaymentServiceImpl;
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

class CustomerOrderedProductServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    CTCustomerOrderedProductService CTCustomerOrderedProductService;

    private CTCustomerOrderedProductService mockCTCustomerOrderedProductService;

    @InjectMocks
    CustomerOrderedProductServlet MockCustomerOrderedProductServlet;

    private Map<String, String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getCustomerOrderedProductURL", "https://apim-iedtecomm-dev.azure-api.net");
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
            String customer_token ="j90i90fjdpkfdkfpdk89u89dkld";
            String past30daysProducts ="past30days";
            String past60daysProducts ="past60days";
            String past90daysProducts ="past90days";
            String past180daysProducts ="past180days";
            String past270daysProducts ="past270days";
            String past360daysProducts ="past360days";

            String MockClearCartResponse = mockCTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past60daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,bearerToken);
            when(CTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past60daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            request.addRequestParameter("past30daysProducts",past30daysProducts);
            request.addRequestParameter("past60daysProducts",past60daysProducts);
            request.addRequestParameter("past90daysProducts",past90daysProducts);
            request.addRequestParameter("past180daysProducts",past180daysProducts);
            request.addRequestParameter("past270daysProducts",past270daysProducts);
            request.addRequestParameter("past360daysProducts",past360daysProducts);
            MockCustomerOrderedProductServlet.doPost(request,response);
        });

    }
    @Test()
    void doPostnull() throws ServletException, IOException,NullPointerException {

        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String customer_token ="j90i90fjdpkfdkfpdk89u89dkld";
            String past30daysProducts = "false";
            String past60daysProducts ="true";
            String past90daysProducts ="false";
            String past180daysProducts ="false";
            String past270daysProducts ="false";
            String past360daysProducts ="false";

            String MockClearCartResponse = mockCTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past60daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,bearerToken);
            when(CTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past60daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            request.addRequestParameter("past30daysProducts",null);
            request.addRequestParameter("past60daysProducts",past60daysProducts);
            request.addRequestParameter("past90daysProducts",past90daysProducts);
            request.addRequestParameter("past180daysProducts",past180daysProducts);
            request.addRequestParameter("past270daysProducts",past270daysProducts);
            request.addRequestParameter("past360daysProducts",past360daysProducts);
            MockCustomerOrderedProductServlet.doPost(request,response);
        });

    }
    @Test()
    void doPostnull2() throws ServletException, IOException,NullPointerException {

        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String customer_token ="j90i90fjdpkfdkfpdk89u89dkld";
            String past30daysProducts = "false";
            String past60daysProducts ="false";
            String past90daysProducts ="false";
            String past180daysProducts ="true";
            String past270daysProducts ="false";
            String past360daysProducts ="false";

            String MockClearCartResponse = mockCTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken);
            when(CTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            request.addRequestParameter("past30daysProducts",null);
            request.addRequestParameter("past60daysProducts",past60daysProducts);
            request.addRequestParameter("past90daysProducts",null);
            request.addRequestParameter("past180daysProducts",past180daysProducts);
            request.addRequestParameter("past270daysProducts",past270daysProducts);
            request.addRequestParameter("past360daysProducts",past360daysProducts);
            MockCustomerOrderedProductServlet.doPost(request,response);
        });

    }
    @Test()
    void doPostnull3() throws ServletException, IOException,NullPointerException {

        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String customer_token ="j90i90fjdpkfdkfpdk89u89dkld";
            String past30daysProducts = "false";
            String past60daysProducts ="false";
            String past90daysProducts ="false";
            String past180daysProducts ="false";
            String past270daysProducts ="true";
            String past360daysProducts ="false";

            String MockClearCartResponse = mockCTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken);
            when(CTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            request.addRequestParameter("past30daysProducts",null);
            request.addRequestParameter("past60daysProducts",past60daysProducts);
            request.addRequestParameter("past90daysProducts",null);
            request.addRequestParameter("past180daysProducts",null);
            request.addRequestParameter("past270daysProducts",past270daysProducts);
            request.addRequestParameter("past360daysProducts",past360daysProducts);
            MockCustomerOrderedProductServlet.doPost(request,response);
        });

    }
    @Test()
    void doPostnull4() throws ServletException, IOException,NullPointerException {

        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String customer_token ="j90i90fjdpkfdkfpdk89u89dkld";
            String past30daysProducts = "false";
            String past60daysProducts ="false";
            String past90daysProducts ="false";
            String past180daysProducts ="false";
            String past270daysProducts ="false";
            String past360daysProducts ="true";

            String MockClearCartResponse = mockCTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken);
            when(CTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            request.addRequestParameter("past30daysProducts",null);
            request.addRequestParameter("past60daysProducts",past60daysProducts);
            request.addRequestParameter("past90daysProducts",null);
            request.addRequestParameter("past180daysProducts",null);
            request.addRequestParameter("past270daysProducts",null);
            request.addRequestParameter("past360daysProducts",past360daysProducts);
            MockCustomerOrderedProductServlet.doPost(request,response);
        });

    }
    @Test()
    void doPostnull5() throws ServletException, IOException,NullPointerException {

        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            //Code under test
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String customer_token ="j90i90fjdpkfdkfpdk89u89dkld";
            String past30daysProducts = "false";
            String past60daysProducts ="true";
            String past90daysProducts ="false";
            String past180daysProducts ="false";
            String past270daysProducts ="false";
            String past360daysProducts ="false";

            String MockClearCartResponse = mockCTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken);
            when(CTCustomerOrderedProductService.getCustomerOrderedProduct(customer_token,past30daysProducts,past90daysProducts,past180daysProducts,past270daysProducts,past360daysProducts,past60daysProducts,bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",customer_token);
            request.addRequestParameter("past30daysProducts",null);
            request.addRequestParameter("past60daysProducts",past60daysProducts);
            request.addRequestParameter("past90daysProducts",null);
            request.addRequestParameter("past180daysProducts",null);
            request.addRequestParameter("past270daysProducts",null);
            request.addRequestParameter("past360daysProducts",null);
            MockCustomerOrderedProductServlet.doPost(request,response);
        });

    }
}