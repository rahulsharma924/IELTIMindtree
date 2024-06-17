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

import com.aem.ie.core.Service.CTOrderDetailService;
import com.aem.ie.core.Service.CompliancePdfService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.CTOrderDetailServiceImpl;
import com.aem.ie.core.services.impl.CompliancepdfImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class PDFServletTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	   
	CompliancePdfService compliancePdfService;
    @Mock
    private CompliancePdfService mockcompliancePdfService;
    private OLCCModuleService mockSampleOSGIService;
    @InjectMocks
    PDFServlet pdfServlet;
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
        props.put("getPdfPath", "https://apim-iedtecomm-qa01.azure-api.net/compliance");
        compliancePdfService = aemContext.registerInjectActivateService(new CompliancepdfImpl(), props);
    }

    @Test()
    void doGetTest() throws ServletException, IOException {
            //Code under test
            String bearerToken = bearerTokenURLResponse();
            String skuid = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            String datasheet ="j90i90fjdpkfdkfpdk89u89dkld";
            String MockClearCartResponse = compliancePdfService.getpdfpath(bearerToken, skuid, datasheet);
            when(mockcompliancePdfService.getpdfpath(Mockito.anyString(), Mockito.anyString(), Mockito.anyString())).thenReturn(MockClearCartResponse);
            MockSlingHttpServletRequest request = aemContext.request();
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("skuId",skuid);
            request.addRequestParameter("datasheetval",datasheet);
            request.addRequestParameter("bearerToken",bearerToken);
            pdfServlet.doGet(request, response);

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
