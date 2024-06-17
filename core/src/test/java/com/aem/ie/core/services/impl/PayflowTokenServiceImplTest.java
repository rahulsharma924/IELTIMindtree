package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.configuration.OLCCUrlConfig;
import com.aem.ie.core.configuration.PayflowConfig;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

//import com.algolia.search.com.fasterxml.jackson.databind.JsonNode;
//import com.algolia.search.com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(AemContextExtension.class)
class PayflowTokenServiceImplTest {

    AemContext aemContext = new AemContext();
    private OLCCModuleServiceImpl olccModuleService = new OLCCModuleServiceImpl();
    IECTLoginImpl loginService = new IECTLoginImpl();
    PayflowTokenServiceImpl payflowTokenServiceImpl = new PayflowTokenServiceImpl();
    PayflowTokenServiceImpl payflowTokenServiceImplSecureException = new PayflowTokenServiceImpl();
    PayflowTokenServiceImpl payflowSecureException = new PayflowTokenServiceImpl();
    PayflowConfig configuration = mock(PayflowConfig.class);
    OLCCUrlConfig config = mock(OLCCUrlConfig.class);
    PayflowConfig configurationSecureException = mock(PayflowConfig.class);
    PayflowConfig secretException = mock(PayflowConfig.class);
    IECTLoginConfig configurationIECTLogin = mock(IECTLoginConfig.class);

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(config.getBearerTokenUrl()).thenReturn("https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        when(config.getClientIdBearerTokenUrl()).thenReturn("3090757e-7360-4213-99bb-32f07945b4fc");
        when(config.getClientSecretBearerTokenUrl()).thenReturn("Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        when(config.getGrantTypeBearerTokenUrl()).thenReturn("client_credentials");
        when(config.getScopeBearerTokenUrl()).thenReturn("00000002-0000-0000-c000-000000000000/.default");
        when(configuration.getPaypalPlaceOrderUrl()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/paypal/fairview/placeOrder");
        when(configuration.getPaypalUpdateAddressUrl()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/paypal/fairview/updateAddress");
        when(configuration.getSecureTokenUrl()).thenReturn("https://pilot-payflowpro.paypal.com");
        when(configuration.getSecureTokenUsername()).thenReturn("FAIRVIEWNCCAPITEST");
        when(configuration.getSecureTokenPassword()).thenReturn("Fairview2015u");
        when(configuration.getSecureTokenVendor()).thenReturn("FAIRVIEWNCCTEST");
        when(configuration.getPlaceOrderServelet()).thenReturn("http://author-p78402-e955507.adobeaemcloud.com/bin/payflowProcessOrder");
        when(configurationIECTLogin.getLoginCTURL()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/login/fairview");
        loginService.activate(configurationIECTLogin);
        olccModuleService.activate(config);
        payflowTokenServiceImpl.activate(configuration);
    }

    @Test
    void getSecureToken() throws IOException {
        JsonObject jsonSecureData = JsonParser.parseString(getJsonSecureData()).getAsJsonObject();
        //String customerToken = customerTokenUrlResponse();
        String customerToken = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        String bearerToken = bearerTokenURLResponse();
        MockSlingHttpServletRequest request = aemContext.request();
        payflowTokenServiceImpl.getSecureToken(request,getJsonData(),jsonSecureData,customerToken,bearerToken);
    }

    @Test
    void getSecureTokenException() throws IOException,StringIndexOutOfBoundsException {
        when(configurationSecureException.getPaypalUpdateAddressUrl()).thenReturn("xyz123456");
        when(configurationSecureException.getPaypalPlaceOrderUrl()).thenReturn("xyz123456");
        payflowTokenServiceImplSecureException.activate(configurationSecureException);
        JsonObject jsonSecureData = JsonParser.parseString(getJsonSecureData()).getAsJsonObject();
        //String customerToken = customerTokenUrlResponse();
        String customerToken = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        String bearerToken = bearerTokenURLResponse();
         MockSlingHttpServletRequest request = aemContext.request();
        String jsondata = "";
        payflowTokenServiceImplSecureException.getSecureToken(request,jsondata,jsonSecureData,customerToken,bearerToken);
        String customerTokenVal  = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        String transactionId = "1234";
        String ponumberval="poval";
        payflowTokenServiceImplSecureException.placeOrder(customerTokenVal,bearerToken,transactionId,ponumberval);
    }

    @Test
    void getSecureTokenSecretException() throws IOException {
        when(secretException.getPaypalUpdateAddressUrl()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/paypal/fairview/updateAddress");
        when(secretException.getSecureTokenUrl()).thenReturn("xyz123456");
        payflowSecureException.activate(secretException);
        MockSlingHttpServletRequest request = aemContext.request();
        JsonObject jsonSecureData = JsonParser.parseString(getJsonSecureData()).getAsJsonObject();
        String customerToken = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        String bearerToken = bearerTokenURLResponse();
        payflowSecureException.getSecureToken(request,getJsonData(),jsonSecureData,customerToken,bearerToken);
    }

    @Test
    void placeOrder() throws IOException {
        String bearerToken=olccModuleService.getBearerTokenUrl();
        String ponumberval="1234";
        String customerTokenVal = "OB7j7fvoPBipyWkpIG8TcH7KBX3EggJi";
        String transactionId = "1234";
        payflowTokenServiceImpl.placeOrder(customerTokenVal,bearerToken,transactionId,ponumberval);
    }

    private String getJsonData(){
        return "{\n" +
                "    \"billingAddress\": {\n" +
                "    \"state\": \"KS\",\n" +
                "    \"country\": \"US\",\n" +
                "    \"line2\": \"test-line2\",\n" +
                "    \"zipcode\": \"66012\",\n" +
                "    \"line1\": \"test-line1\",\n" +
                "    \"phone\": \"7455786756\",\n" +
                "    \"name\": \"test\",\n" +
                "    \"city\": \"test-city\",\n" +
                "    \"company\": \"test-company\"\n" +
                "}\n" +
                "}";
    }

    private String getJsonSecureData(){
        return "{\n" +
                "    \"currency\": \"USD\",\n" +
                "    \"amt\": \"40\",\n" +
                "    \"shiptoFirstName\": \"US\",\n" +
                "    \"shiptoLastName\": \"test-line2\",\n" +
                "    \"billtoPhoneNum\": \"66012\",\n" +
                "    \"billtoFirstName\": \"test-line1\",\n" +
                "    \"billtoLastName\": \"7455786756\",\n" +
                "    \"shiptoZip\": \"7455786756\",\n" +
                "    \"shiptoCountry\": \"7455786756\",\n" +
                "    \"shiptoCity\": \"7455786756\",\n" +
                "    \"shiptoStreet\": \"7455786756\",\n" +
                "    \"shiptoStreet1\": \"7455786756\",\n" +
                "    \"shiptoState\": \"7455786756\",\n" +
                "    \"billtoZip\": \"7455786756\",\n" +
                "    \"billtoCountry\": \"7455786756\",\n" +
                "    \"billtoCity\": \"7455786756\",\n" +
                "    \"billtoStreet\": \"7455786756\",\n" +
                "    \"billtoStreet1\": \"7455786756\",\n" +
                "    \"billtoState\": \"7455786756\",\n" +
                "    \"email\": \"test\",\n" +
                "    \"shiptoPhoneNum\": \"test-company\"\n" +
                "}";
    }

    private String bearerTokenURLResponse() throws IOException {
        String bearerAccessToken = "bearerToken";
        String bearerTokenURLResponse = olccModuleService.getBearerTokenUrl();
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

   /* String customerTokenUrlResponse() throws IOException {
        String customerToken = "customerToken";
        String emailid = "testdemouser13@yopmail.com";
        String pwd = "secret1234";
        String bearerToken = bearerTokenURLResponse();
        String customerTokenUrlResponse = loginService.getLoginCTUrl(emailid,pwd,bearerToken);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(customerTokenUrlResponse);
        customerToken = node.get("customertoken").asText();
        return customerToken;
    }*/
}