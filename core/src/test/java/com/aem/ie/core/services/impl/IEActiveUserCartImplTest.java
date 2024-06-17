package com.aem.ie.core.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.IECTAddtoCartService;
import com.aem.ie.core.Service.IEUserActiveCart;
import com.aem.ie.core.Service.OLCCModuleService;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class IEActiveUserCartImplTest {
	AemContext aemContext = new AemContext();

    private IEUserActiveCart ieUserActiveCart;
    private IEUserActiveCart ExceptionIEUserActiveCart;
    private IEUserActiveCart Exception2IEUserActiveCart;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String,String> configProps = new HashMap<String,String>();
    private Map<String,String> configProps2 = new HashMap<String,String>();
    private Map<String,String> props = new HashMap<String,String>();
    private Map<String,String> exceptionConfigprops = new HashMap<String,String>();
    private Map<String,String> exception2Configprops = new HashMap<String,String>();
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
        props.put("getUserActiveCart","https://apim-iedtecomm-qa01.azure-api.net/cart-direct/fairview/active-cart");
        ieUserActiveCart = aemContext.registerInjectActivateService(new IEActiveUserCartImpl(), props);
        exceptionConfigprops.put("getUserActiveCart","");
        ExceptionIEUserActiveCart = aemContext.registerInjectActivateService(new IEActiveUserCartImpl(), exceptionConfigprops);
        exception2Configprops.put("getUserActiveCart","https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        Exception2IEUserActiveCart = aemContext.registerInjectActivateService(new IEActiveUserCartImpl(), exception2Configprops);
    }
    @Test
    void getUserActiveCart() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String token = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        ieUserActiveCart.getUserActiveCart(token, bearerToken);
        ExceptionIEUserActiveCart.getUserActiveCart(token, bearerToken);
    }

    @Test
    void getUserActiveCartException() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String token = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
         IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
        	 Exception2IEUserActiveCart.getUserActiveCart(token, bearerToken);
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
