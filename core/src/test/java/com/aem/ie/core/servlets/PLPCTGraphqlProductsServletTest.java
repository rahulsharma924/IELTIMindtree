package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.PLPCTGraphqlProductsService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.aem.ie.core.services.impl.PLPCTGraphqlProductsServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class PLPCTGraphqlProductsServletTest {

    AemContext aemContext = new AemContext();
    PLPCTGraphqlProductsService plpctGraphqlProductsService;

    OLCCModuleService olccModuleService;

    @Mock
    PLPCTGraphqlProductsService mockPlpctGraphqlProductsService;

    private final Map<String,String> configProps = new HashMap<>();

    private final Map<String,String> configPropsOLCC = new HashMap<>();

    @InjectMocks
    PLPCTGraphqlProductsServlet MockPLPCTGraphqlProductsServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getPLPCTGraphqlProductsUrl","https://apim-iedtecomm-dev01.azure-api.net/graphql/products");
        plpctGraphqlProductsService = aemContext.registerInjectActivateService(new PLPCTGraphqlProductsServiceImpl(),configProps);
        configPropsOLCC.put("getSearchOptions","https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/search-options");
        configPropsOLCC.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configPropsOLCC.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configPropsOLCC.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configPropsOLCC.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configPropsOLCC.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        olccModuleService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configPropsOLCC);
    }

    @Test
    void doPost() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String jsonData = "{\n" +
                "\"query\":\"query Products($skus: [String!]!){productProjectionSearch(limit: 500, offset: 0,staged: false,filters:[{model:{value:{path:\\\"variants.sku\\\",values: $skus}}}]){results{masterVariant {sku attributesRaw(includeNames:[\\\"startingPrice\\\"]){name value}availability{noChannel{availableQuantity}}}}}}\",\n" +
                "\"variables\":{\n" +
                "\"skus\":[\n" +
                "\"SA6A-20\",\n" +
                "\"FMCN1638\"\n" +
                "]\n" +
                "}\n" +
                "}";
        String PLPCTGraphqlProducts = plpctGraphqlProductsService.getPLPCTGraphqlProducts(bearerToken,jsonData);
        when(mockPlpctGraphqlProductsService.getPLPCTGraphqlProducts(Mockito.anyString(),Mockito.anyString())).thenReturn(PLPCTGraphqlProducts);
        MockSlingHttpServletRequest mockSlingHttpServletRequest = aemContext.request();
        MockSlingHttpServletResponse mockSlingHttpServletResponse = aemContext.response();
        mockSlingHttpServletRequest.addRequestParameter("bearerToken",bearerToken);
        mockSlingHttpServletRequest.addRequestParameter("jsonData",jsonData);
        MockPLPCTGraphqlProductsServlet.doPost(mockSlingHttpServletRequest,mockSlingHttpServletResponse);
    }

    private String bearerTokenURLResponse() throws IOException {
        String bearerAccessToken = "bearerToken";
        String bearerTokenURLResponse = olccModuleService.getBearerTokenUrl();
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