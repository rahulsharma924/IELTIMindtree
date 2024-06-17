package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.GetCalculatedTaxService;
import com.aem.ie.core.Service.IECTPasswordchangeService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.CTResetPasswordImpl;
import com.aem.ie.core.services.impl.GetCalculatedTaxServiceImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.google.gson.JsonObject;
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

import static org.mockito.Mockito.when;

class CheckoutCalculateTaxServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    GetCalculatedTaxService getCalculatedTaxService;

    private GetCalculatedTaxService mockgetCalculatedTaxService;

    @InjectMocks
    CheckoutCalculateTaxServlet MockCheckoutCalculateTaxServlet;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String, String> configProps = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(), configProps);

        configProps.put("calculateTaxCTURL","https://apim-iedtecomm-dev01.azure-api.net/tax/fairview/apply-tax");
        mockgetCalculatedTaxService = aemContext.registerInjectActivateService(new GetCalculatedTaxServiceImpl(), configProps);
    }

    @Test()
    void doPatchMethod() throws ServletException, IOException,NullPointerException {
            String bearerToken = bearerTokenURLResponse();
            String customer_token = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("jsonData",jsonData());
            MockSlingHttpServletRequest request = aemContext.request();
            String MockClearCartResponse = mockgetCalculatedTaxService.getCalculateTax(customer_token,jsonObject, bearerToken);
            when(getCalculatedTaxService.getCalculateTax(customer_token,jsonObject, bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken", bearerToken);
            request.addRequestParameter("jsonData", String.valueOf(jsonObject));
            request.addRequestParameter("CTCustomerToken", customer_token);
            MockCheckoutCalculateTaxServlet.service(request, response);
    }
    private String bearerTokenURLResponse() throws IOException {
        String bearerAccessToken = "bearertoken";
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
                "  \"shippingAddress\": {\n" +
                "    \"addressId\": \"A1OWHikz\"\n" +
                "  },\n" +
                "  \"useYourOwnShippingAccount\": false,\n" +
                "  \"shippingMethod\": {\n" +
                "  \"carrier\": FEDEX,\n" +
                "  \"method\": GRND,\n" +
                "  \"amount\": 9.0\n" +
                " },\n" +
                "}";
    }
}

