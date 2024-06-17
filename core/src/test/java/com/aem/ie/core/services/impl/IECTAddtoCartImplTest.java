package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.IECTAddtoCartService;
import com.aem.ie.core.Service.OLCCModuleService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class IECTAddtoCartImplTest {

    AemContext aemContext = new AemContext();

    private IECTAddtoCartService IECTAddtoCartService;
    private IECTAddtoCartService ExceptionIECTAddtoCartService;
    private IECTAddtoCartService Exception2IECTAddtoCartService;
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
        props.put("getAddToCartCTURL","https://apim-iedtecomm-dev01.azure-api.net/cart/fairview/addToCart");
        IECTAddtoCartService = aemContext.registerInjectActivateService(new IECTAddtoCartImpl(), props);
        exceptionConfigprops.put("getAddToCartCTURL","");
        ExceptionIECTAddtoCartService = aemContext.registerInjectActivateService(new IECTAddtoCartImpl(), exceptionConfigprops);
        exception2Configprops.put("getAddToCartCTURL","https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        Exception2IECTAddtoCartService = aemContext.registerInjectActivateService(new IECTAddtoCartImpl(), exception2Configprops);
    }
    @Test
    void getAddToCartoCTUrl() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String token = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        String currency = "USD";
        String skuValue = "15AC206";
        String quantity = "1";
        IECTAddtoCartService.getAddToCartoCTUrl(token,currency,skuValue,quantity,bearerToken);
        ExceptionIECTAddtoCartService.getAddToCartoCTUrl(token,currency,skuValue,quantity,bearerToken);
    }

    @Test
    void getAddToCartoCTUrlMethod() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String token = " ";
        String currency = "";
        String skuValue = "15AC206";
        String quantity = "1";
        IECTAddtoCartService.getAddToCartoCTUrl(token,currency,skuValue,quantity,bearerToken);
    }

    @Test
    void getAddToCartoCTUrlException() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String token = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        String currency = "USD";
        String skuValue = "15AC206";
        String quantity = "1";
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            Exception2IECTAddtoCartService.getAddToCartoCTUrl(token,currency,skuValue,quantity,bearerToken);
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