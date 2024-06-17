package com.aem.ie.core.servlets;

import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.UpdateCartService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.aem.ie.core.services.impl.UpdateCartServiceImpl;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class UpdateCartServletTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	
	UpdateCartService updatecartservice;
	@Mock
    private UpdateCartService mockupdatecartservice;
    private OLCCModuleService mockSampleOSGIService;
    @InjectMocks
    UpdateCartServlet MockUpdateCartServlet;
    private Map<String, String> configProps = new HashMap<String, String>();
    private Map<String,String> props = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
        props.put("getUpdateCartURL", "https://apim-iedtecomm-qa01.azure-api.net/cart/fairview/updateCart");
        updatecartservice = aemContext.registerInjectActivateService(new UpdateCartServiceImpl(), props);
    }
    @Test()
    void doPatchTest() throws ServletException, IOException {
        //Code under test
            String bearerToken = bearerTokenURLResponse();
            MockSlingHttpServletRequest request = aemContext.request();
            String customerTokenValue = "kljijjljls9089d9vdv90dv9dvlm39r0ier";
            String lineItemId = "7beffb8c-ed44-43f2-930e-2de908da4438";
            String quantity = "1";
            String unitOfMeasurement = "1";
            String isCustomLineItem = "True";
            String MockClearCartResponse = updatecartservice.getUpdateCartCTUrl(customerTokenValue, bearerToken, quantity, lineItemId, unitOfMeasurement, isCustomLineItem);
            when(mockupdatecartservice.getUpdateCartCTUrl(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("CTCustomerToken", customerTokenValue);
            request.addRequestParameter("bearerToken", bearerToken);
            request.addRequestParameter("qnty", quantity);
            request.addRequestParameter("id", lineItemId);
            request.addRequestParameter("unitOfMeasurement", unitOfMeasurement);
            request.addRequestParameter("isCustomLineItem", isCustomLineItem);
            MockUpdateCartServlet.service(request, response);
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
