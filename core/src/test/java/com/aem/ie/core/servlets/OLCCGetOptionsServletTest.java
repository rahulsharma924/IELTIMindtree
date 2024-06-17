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

class OLCCGetOptionsServletTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    private OLCCModuleService mockSampleOSGIService;

    @Mock
    OLCCModuleService MOCKOLCCModuleService;

    @InjectMocks
    OLCCGetOptionsServlet MockOLCCGetOptionsServlet;

    private Map<String,String> configProps = new HashMap<String, String>();


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getOption","https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/get-selected-options");
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
        String getOptionsResponse = mockSampleOSGIService.getOption(getOptionRequest(),bearerToken);
        when(MOCKOLCCModuleService.getOption(Mockito.anyString(),Mockito.anyString())).thenReturn(getOptionsResponse);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("jsonData",getOptionRequest());
        request.addRequestParameter("bearertoken",bearerToken);
        MockOLCCGetOptionsServlet.doPost(request,response);
       // assertEquals(true,response.getOutputAsString().contains("connector1Options"));
    }

    private String getOptionRequest() {
        return "{\n" +
                "\n" +
                "    \"Connector_One_Selections\": {\n" +
                "\n" +
                "        \"series\": \"SMA\",\n" +
                "\n" +
                "        \"angle\": \"Right Angle\"\n" +
                "\n" +
                "    },\n" +
                "\n" +
                "    \"Connector_Two_Selections\": {\n" +
                "\n" +
                "        \"gender\": \"Male\"\n" +
                "\n" +
                "    },\n" +
                "\n" +
                "    \"Cable_Selections\": {\n" +
                "\n" +
                "        \"flexType\": \"Corrugated\"\n" +
                "\n" +
                "    },\n" +
                "\n" +
                "    \"calf\": false,\n" +
                "\n" +
                "    \"cahs\": false,\n" +
                "\n" +
                "    \"caclock\": false,\n" +
                "\n" +
                "    \"rohs\": false,\n" +
                "\n" +
                "    \"inStock\": false\n" +
                "\n" +
                "}";
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