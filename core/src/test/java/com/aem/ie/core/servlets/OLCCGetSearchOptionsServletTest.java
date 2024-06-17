package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class OLCCGetSearchOptionsServletTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    private OLCCModuleService mockSampleOSGIService;

    @Mock
    OLCCModuleService MOCKOLCCModuleService;

    @InjectMocks
    OLCCGetSearchOptionsServlet MockOLCCGetSearchOptionsServlet;

    private Map<String,String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getSearchOptions","https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/search-options");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
    }

    @Test
    void doPost() throws ServletException, IOException {
        String bearerToken = bearerTokenURLResponse();
        String getSearchOptionsResponse = mockSampleOSGIService.getSearchOptions(searchOptionsRequest(),bearerToken);
        when(MOCKOLCCModuleService.getSearchOptions(Mockito.anyString(),Mockito.anyString())).thenReturn(getSearchOptionsResponse);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("jsonData",searchOptionsRequest());
        request.addRequestParameter("bearertoken",bearerToken);
        MockOLCCGetSearchOptionsServlet.doPost(request,response);
        //assertEquals(true,response.getOutputAsString().contains("recommendations"));
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

    private String searchOptionsRequest() {
        return "{\n" +
                "  \"Connector_One_Selections\": {\n" +
                "    \"searchQuery\": \"400\"\n" +
                "  },\n" +
                "  \"Connector_Two_Selections\": {\n" +
                "\n" +
                "  },\n" +
                "  \"Cable_Selections\": {\n" +
                "\n" +
                "  },\n" +
                "  \"calf\": false,\n" +
                "  \"cahs\": false,\n" +
                "  \"caclock\": false,\n" +
                "  \"rohs\": false,\n" +
                "  \"inStock\": false\n" +
                "}";
    }
}