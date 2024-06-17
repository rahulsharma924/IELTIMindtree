package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTDeliveryService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.IECTDeliveryServiceImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class DeliveryOptionsServletTest {

    AemContext aemContext = new AemContext();

    private OLCCModuleService mockSampleOSGIService;
    private IECTDeliveryService deliveryService;

    @Mock
    IECTDeliveryService mockDeliveryService;

    @InjectMocks
    DeliveryOptionsServlet DeliveryOptionsServlet;

    private Map<String,String> props = new HashMap<String, String>();

    private Map<String,String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        props.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        props.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        props.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        props.put("getGrantTypeBearerTokenUrl", "client_credentials");
        props.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(), props);

        configProps.put("deliveryCTURL","https://apim-iedtecomm-dev01.azure-api.net/delivery/fairview/getDeliveryRates");
        deliveryService = aemContext.registerInjectActivateService(new IECTDeliveryServiceImpl(),configProps);
    }

    @Test
    void doPost() throws IOException, ServletException {
        String bearertoken = bearerTokenURLResponse();
        String CTCustomerToken = "";
        String transitTimeRequired = "transitTimeRequired";
        String addressId = "addressId";
        String jsonData = "jsonData";
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("transitTimeRequired", transitTimeRequired);
        JsonObject addressObject = new JsonObject();
        addressObject.addProperty("id", addressId);
        jsonObject.add("address", addressObject);
        String responseValue = deliveryService.getDeliveryOptions(CTCustomerToken, jsonObject,bearertoken);
        when(mockDeliveryService.getDeliveryOptions(Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(responseValue);
        MockSlingHttpServletResponse response = aemContext.response();
        MockSlingHttpServletRequest request = aemContext.request();
        request.addRequestParameter("bearertoken", bearertoken);
        request.addRequestParameter("CTCustomerToken", CTCustomerToken);
        request.addRequestParameter("transitTimeRequired", transitTimeRequired);
        request.addRequestParameter("addressId", addressId);
        request.addRequestParameter("jsonData", jsonData);
        request.setPathInfo("/bin/getDeliveryOptions");
        DeliveryOptionsServlet.doPost(request,response);
    }

    @Test
    void doPostMethod() throws IOException, ServletException {
        String bearertoken = bearerTokenURLResponse();
        String CTCustomerToken = "";
        String transitTimeRequired = "false";
        String addressId = "addressId";
        String jsonData = "jsonData";
        JsonObject jsonObject = JsonParser.parseString(jsonData()).getAsJsonObject();
        String responseValue = deliveryService.getDeliveryOptions(CTCustomerToken, jsonObject,bearertoken);
        when(mockDeliveryService.getDeliveryOptions(Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(responseValue);
        MockSlingHttpServletResponse response = aemContext.response();
        MockSlingHttpServletRequest request = aemContext.request();
        request.addRequestParameter("bearertoken", bearertoken);
        request.addRequestParameter("CTCustomerToken", CTCustomerToken);
        request.addRequestParameter("transitTimeRequired", transitTimeRequired);
        request.addRequestParameter("addressId", addressId);
        request.addRequestParameter("jsonData", jsonData());
        request.setPathInfo("/bin/getDeliveryOptions.guestUser");
        DeliveryOptionsServlet.doPost(request,response);
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

    private String jsonData() {
        return "{\n" +
                "  \"transitTimeRequired\": false,\n" +
                "  \"address\": {\n" +
                "    \"zipcode\": \"66012\",\n" +
                "    \"country\": \"US\",\n" +
                "    \"state\": \"KS\"\n" +
                "  }\n" +
                "}";
    }
}