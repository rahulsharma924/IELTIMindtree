package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.GetProductDeliveryDateService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GetProductDeliveryDateServiceImplTest {

    AemContext aemContext = new AemContext();

    GetProductDeliveryDateService GetProductDeliveryDateService;

    private OLCCModuleService mockSampleOSGIService;

    private Map<String,String> props = new HashMap<String, String>();

    private Map<String,String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);

        props.put("getProductDeliveryDateApiUrl","https://apim-iedtecomm-dev01.azure-api.net/delivery/fairview/getProductDeliveryRates");
        GetProductDeliveryDateService = aemContext.registerInjectActivateService(new GetProductDeliveryDateServiceImpl(),props);
    }

    @Test
    void getProductDeliveryDate() throws IOException {
        String bearerToken=bearerTokenURLResponse();
        String transitTime = "";
        JsonObject productJson = new JsonObject();
        JsonObject addressJson = new JsonObject();
        GetProductDeliveryDateService.getProductDeliveryDate(bearerToken,transitTime,productJson,addressJson);
    }
    @Test
    void getProductDeliveryDateForCustomSkuTest() throws IOException {
    	String bearerToken=bearerTokenURLResponse();
        String transitTime = "";
        JsonObject productJson = new JsonObject();
        JsonObject addressJson = new JsonObject();
    	GetProductDeliveryDateService.getProductDeliveryDateForCustomSku(bearerToken, transitTime,productJson, addressJson);
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