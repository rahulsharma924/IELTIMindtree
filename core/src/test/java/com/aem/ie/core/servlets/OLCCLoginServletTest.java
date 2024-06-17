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
import org.mockito.MockitoAnnotations;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class OLCCLoginServletTest {

    private Map<String,String> configProps = new HashMap<String, String>();

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    private OLCCModuleService mockSampleOSGIService;

    @Mock
    OLCCModuleService MOCKOLCCModuleService;

    @InjectMocks
    OLCCLoginServlet MockOLCCLoginServlet;

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
    void doGet() throws IOException, ServletException {
        String bearerTokenURLResponse = bearerTokenURLResponse();
        when(MOCKOLCCModuleService.getBearerTokenUrl()).thenReturn(bearerTokenURLResponse);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        MockOLCCLoginServlet.doGet(request,response);
        assertEquals(true,bearerTokenURLResponse.contains("access_token"));
    }

    private String bearerTokenURLResponse() throws IOException {
        String bearerTokenURLResponse = mockSampleOSGIService.getBearerTokenUrl();
        return bearerTokenURLResponse;
    }
}