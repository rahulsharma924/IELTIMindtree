package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTAddtoCartService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.IECTAddtoCartImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
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

import static org.mockito.Mockito.when;

class AddtoCartServletTest {

    AemContext aemContext = new AemContext();

    private OLCCModuleService mockSampleOSGIService;

    private  IECTAddtoCartService mockIECTAddtoCartService;

    @Mock
    IECTAddtoCartService MockIECTAddtoCartService;

    @InjectMocks
    AddtoCartServlet addtoCartServlet;

    private Map<String,String> configProps = new HashMap<String, String>();

    private Map<String,String> addConfigProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
        addConfigProps.put("getAddToCartCTURL","https://apim-iedtecomm-dev01.azure-api.net/cart/fairview/addToCart");
        mockIECTAddtoCartService = aemContext.registerInjectActivateService(new IECTAddtoCartImpl(),addConfigProps);
    }

    @Test
    void doPut() throws IOException, ServletException {
        String bearerToken = bearerTokenURLResponse();
        String token = "f2AM7aZ2KfjnIqy8M3Ud98lWcBNa-5Zb";
        String currency = "USD";
        String skuValue = "15AC206";
        String quantity = "1";
        String responseValue=mockIECTAddtoCartService.getAddToCartoCTUrl(token,currency,skuValue,quantity,bearerToken);
        when(MockIECTAddtoCartService.getAddToCartoCTUrl(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString())).thenReturn(responseValue);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("CTCustomerToken",token);
        request.addRequestParameter("currency",currency);
        request.addRequestParameter("sku",skuValue);
        request.addRequestParameter("quantity",quantity);
        request.addRequestParameter("bearertoken",bearerToken);
        addtoCartServlet.doPut(request,response);

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