package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.CheckoutUpdateCartService;
import com.aem.ie.core.Service.OLCCModuleService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CheckoutUpdateCartServiceImplTest {

    AemContext aemContext = new AemContext();
    private CheckoutUpdateCartService checkOutUpdateCartService;
    private CheckoutUpdateCartService exceptionCheckoutUpdateCartService;
    private CheckoutUpdateCartService exception2CheckoutUpdateCartService;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String,String> configProps = new HashMap<String,String>();
    private Map<String,String> props = new HashMap<String,String>();
    private Map<String,String> exceptionProps = new HashMap<String,String>();
    private Map<String,String> exception2Props = new HashMap<String,String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getCableAssembly", "https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/get-cable-assembly");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(), configProps);

        props.put("updateCartCTURL","https://apim-iedtecomm-dev01.azure-api.net/checkout/fairview/updateCart");
        checkOutUpdateCartService = aemContext.registerInjectActivateService(new CheckoutUpdateCartServiceImpl(), props);

        exceptionProps.put("updateCartCTURL","");
        exceptionCheckoutUpdateCartService = aemContext.registerInjectActivateService(new CheckoutUpdateCartServiceImpl(), exceptionProps);

        exception2Props.put("updateCartCTURL","https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        exception2CheckoutUpdateCartService = aemContext.registerInjectActivateService(new CheckoutUpdateCartServiceImpl(), exception2Props);
    }

    @Test
    void testMethod() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String accessToken = "JrPBnz4Xx467DsuDKpXVWR9uDksziTs3";
        String jsonbody = "jsonbody";
        checkOutUpdateCartService.getUpdatedCart(accessToken,jsonbody,bearerToken);
        exceptionCheckoutUpdateCartService.getUpdatedCart(accessToken,jsonbody,bearerToken);
    }

    @Test
    void testMethodException() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String accessToken = "JrPBnz4Xx467DsuDKpXVWR9uDksziTs3";
        String jsonbody = "jsonbody";
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            exception2CheckoutUpdateCartService.getUpdatedCart(accessToken,jsonbody,bearerToken);
        });
        assertEquals(true, exception.getMessage().contains("Illegal character in query at index"));

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