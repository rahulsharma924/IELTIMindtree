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
import com.aem.ie.core.Service.ProductProjectionService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.aem.ie.core.services.impl.ProductprojectionServiceImpl;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class ProductprojectionServletTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	   
	ProductProjectionService productProjectionService;
    @Mock
    private ProductProjectionService mockproductProjectionService;
    private OLCCModuleService mockSampleOSGIService;
    @InjectMocks
    ProductprojectionServlet productprojectionServlet;
    private Map<String, String> configProps = new HashMap<String, String>();
    private Map<String, String> props = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
        props.put("getProductProjectionApiUrl", "https://apim-iedtecomm-dev01.azure-api.net/catalog/get-productprojection");
        productProjectionService = aemContext.registerInjectActivateService(new ProductprojectionServiceImpl(), props);
    }

    @Test()
    void doGetTest() throws ServletException, IOException {
            //Code under test
            String bearerToken = bearerTokenURLResponse();
            String cttoken ="tyuhujytrcesd";
            String currency="USD";
            String sku="FMANKIT1029";
            String MockproductProjectionService = productProjectionService.getProductProjectionCTUrl(sku, currency, cttoken, bearerToken);
            when(mockproductProjectionService.getProductProjectionCTUrl(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(MockproductProjectionService);
            MockSlingHttpServletRequest request = aemContext.request();
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("ctToken",cttoken);
            request.addRequestParameter("currency",currency);
            request.addRequestParameter("sku",sku);
            request.addRequestParameter("bearerToken",bearerToken);
            productprojectionServlet.doGet(request, response);

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
