package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CTOrderDetailService;
import com.aem.ie.core.Service.CTOrderHistoryService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.CTOrderDetailServiceImpl;
import com.aem.ie.core.services.impl.CTOrderHistoryServiceImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
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

class OrderHistoryServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    CTOrderHistoryService CTorderHistoryService;
    private CTOrderHistoryService mockCTOrderHistoryService;
    @InjectMocks
    OrderHistoryServlet MockOrderHistoryServlet;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String, String> configProps = new HashMap<String, String>();
    private Map<String, String> props = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        props.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        props.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        props.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        props.put("getGrantTypeBearerTokenUrl", "client_credentials");
        props.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(), props);
        configProps.put("getOrderHistoryURL", "https://apim-iedtecomm-dev01.azure-api.net/customer/me/orders");
        mockCTOrderHistoryService = aemContext.registerInjectActivateService(new CTOrderHistoryServiceImpl(), configProps);
    }

    @Test()
    void doGetMethod() throws ServletException, IOException,NullPointerException {
            String bearerToken = bearerTokenURLResponse();
            String customer_token = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            
            String pageNo="1";
        	String pageSize="10";
        	String sortField="date";
        	String sortingOrder="desc";
            MockSlingHttpServletRequest request = aemContext.request();
            String MockClearCartResponse = mockCTOrderHistoryService.getOrderHistory(customer_token, bearerToken, pageNo,pageSize,sortField,sortingOrder);
            when(CTorderHistoryService.getOrderHistory(customer_token, bearerToken, pageNo,pageSize,sortField,sortingOrder)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            
            request.addRequestParameter("pageNo", pageNo);
            request.addRequestParameter("pageSize", pageSize);
            request.addRequestParameter("sortField", sortField);
            request.addRequestParameter("sortingOrder", sortingOrder);
            request.addRequestParameter("bearertoken", bearerToken);
            request.addRequestParameter("customer_token", customer_token);
            MockOrderHistoryServlet.doPost(request, response);
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