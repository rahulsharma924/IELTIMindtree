package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.RemoveProductService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.aem.ie.core.services.impl.RemoveProductServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
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

class RemoveProductServletTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    private OLCCModuleService mockSampleOSGIService;

    private RemoveProductService mockRemoveProductService;


    private Map<String,String> configProps = new HashMap<String, String>();

    private Map<String,String> removeConfigProps = new HashMap<String, String>();

    @Mock
    RemoveProductService MOCKCTRemoveProductService;

    @InjectMocks
    RemoveProductServlet removeProductServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);

        removeConfigProps.put("getRemoveProductURL","https://apim-iedtecomm-dev01.azure-api.net/cart/fairview/updateCart");
        mockRemoveProductService = aemContext.registerInjectActivateService(new RemoveProductServiceImpl(),removeConfigProps);
    }

    @Test
    void doPatch() throws IOException, ServletException {
        String bearerToken = bearerTokenURLResponse();
        String CTCustomerToken = "HzjoVS6Z_Yxgk53Sjyr4fad0QcP4h79R";
        String lineItemId = "20f4a908-400b-4770-ba5b-2bdf260f0c00";
        String unitOfMeasurement = "IN";
        String isCustomLineItem = "true";
        String responseValue=mockRemoveProductService.removeProduct(CTCustomerToken,bearerToken,lineItemId, unitOfMeasurement, isCustomLineItem);
        when(MOCKCTRemoveProductService.removeProduct(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString())).thenReturn(responseValue);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("CTCustomerToken",CTCustomerToken);
        request.addRequestParameter("bearerToken",bearerToken);
        request.addRequestParameter("id",lineItemId);
        request.addRequestParameter("unitOfMeasurement",unitOfMeasurement);
        request.addRequestParameter("isCustomLineItem",isCustomLineItem);
        removeProductServlet.service(request,response);
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