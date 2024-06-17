package com.aem.ie.core.services.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import java.io.IOException;

import com.adobe.xfa.Bool;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.configuration.OLCCUrlConfig;
//import netscape.javascript.JSObject;
import org.apache.http.client.ClientProtocolException;
import org.apache.sling.api.SlingHttpServletRequest;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import com.aem.ie.core.configuration.IEDirectCallConfig;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Author SHRUTHIN KUMAR N
 *
 * @author M1081896
 *
 */
@ExtendWith(AemContextExtension.class)
public class OLCCModuleImplTest {
    private OLCCModuleServiceImpl olccModuleService = new OLCCModuleServiceImpl();
    private TestLogger logger = TestLoggerFactory.getTestLogger(olccModuleService.getClass());

    @BeforeEach
    void setup() {
        TestLoggerFactory.clear();
    }
    @Test
    void OLCCTest() throws ClientProtocolException, IOException, JSONException {
        OLCCUrlConfig config = mock(OLCCUrlConfig.class);
        when(config.getAllOptions()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/get-all-options");
        when(config.getOption()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/get-selected-options");
        when(config.getSearchOptions()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/search-options");
        when(config.getCreateUrl()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/create-olcc");
        when(config.getCustomLengthToCartUrl()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/cart/fairview/addCustomLengthToCart");
        when(config.getSearchCableAssembly()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/search-cable-assembly");
        when(config.getCableAssembly()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/get-cable-assembly");
        when(config.getBearerTokenUrl()).thenReturn("https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        when(config.getClientIdBearerTokenUrl()).thenReturn("3090757e-7360-4213-99bb-32f07945b4fc");
        when(config.getClientSecretBearerTokenUrl()).thenReturn("Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        when(config.getGrantTypeBearerTokenUrl()).thenReturn("client_credentials");
        when(config.getScopeBearerTokenUrl()).thenReturn("00000002-0000-0000-c000-000000000000/.default");
        olccModuleService.activate(config);
        String bearer = "Bearer";
        String bearerToken = "bearerToken";
        String getAllOption=olccModuleService.getAllOptions("",bearerToken);
        Boolean getAllOptionTest = jsonTest(getAllOption);

        String getOption=olccModuleService.getOption(getOptionRequest(),bearerToken);
        Boolean getOptionTest = jsonTest(getOption);

        String getSearchOptions=olccModuleService.getSearchOptions(searchOptionsRequest(),bearerToken);
        Boolean getSearchOptionsTest = jsonTest(getSearchOptions);;

        String getCreateUrl=olccModuleService.createAssembly(createAssemblyRequest(),bearerToken);
        Boolean getCreateUrlTest = jsonTest(getCreateUrl);

        String getToken=olccModuleService.getBearerTokenUrl();

        String tokenEmpty = " ";
        String token = "f_vaJzxMBK0OyE-PlVfx6vaWTkYK_D7I";
        String currency = "USD";
        String skuValue = "FMC5427/0071";
        String quantity = "30";
        String unitOfMeasurement = "IN";
        String length = "15";
        String cableAssemblyTesting="{\"amount\":25}";
        String getAddCustomLengthToCartUrl=olccModuleService.addCustomLengthToCartUrl(token,currency,skuValue,quantity,unitOfMeasurement,length,bearerToken,cableAssemblyTesting);
        Boolean getAddCustomLengthToCartTest = jsonTest(getAddCustomLengthToCartUrl);

        String getAddCustomLengthToCartUrlEmpty=olccModuleService.addCustomLengthToCartUrl(tokenEmpty,currency,skuValue,quantity,unitOfMeasurement,length,bearerToken,cableAssemblyTesting);
        Boolean getAddCustomLengthToCartTestEmpty = jsonTest(getAddCustomLengthToCartUrlEmpty);

        String getCableAssembly=olccModuleService.getCableAssembly(skuValue,bearerToken);
        Boolean getCableAssemblyTest = jsonTest(getCableAssembly);

        String getSearchCableAssembly=olccModuleService.getSearchCableAssembly(searchCableAssemblyRequest(),bearerToken);
        Boolean getSearchCableAssemblyTest = jsonTest(getSearchCableAssembly);

        //assertEquals(true,getAllOptionTest);
        //assertEquals(true,getOptionTest);
        //assertEquals(true,getSearchOptionsTest);
        //assertEquals(true,getCreateUrlTest);
        //assertEquals(true,getAddCustomLengthToCartTest);
        //assertEquals(true,getAddCustomLengthToCartTestEmpty);
        //assertEquals(true,getCableAssemblyTest);
        //assertEquals(true,getSearchCableAssemblyTest);
        //assertEquals(true,getToken.contains(bearer));
    }

    @Test
    public void OLCCModuleTestException() throws ClientProtocolException, IOException, JSONException {
        String bearerToken = "bearerToken";
        OLCCUrlConfig config = mock(OLCCUrlConfig.class);
        when(config.getBearerTokenUrl()).thenReturn("");
        when(config.getClientIdBearerTokenUrl()).thenReturn("3090757e-7360-4213-99bb-32f07945b4fc");
        when(config.getClientSecretBearerTokenUrl()).thenReturn("Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        when(config.getGrantTypeBearerTokenUrl()).thenReturn("client_credentials");
        when(config.getScopeBearerTokenUrl()).thenReturn("00000002-0000-0000-c000-000000000000/.default");
        when(config.getCustomLengthToCartUrl()).thenReturn("");
        when(config.getSearchCableAssembly()).thenReturn("");
        when(config.getCableAssembly()).thenReturn("https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        olccModuleService.activate(config);
        String getToken=olccModuleService.getBearerTokenUrl();
        String getSearchCableAssembly=olccModuleService.getSearchCableAssembly(searchCableAssemblyRequest(),bearerToken);
        String tokenEmpty = " ";
        String token = "f_vaJzxMBK0OyE-PlVfx6vaWTkYK_D7I";
        String currency = "USD";
        String skuValue = "FMC5427/0071";
        String quantity = "30";
        String unitOfMeasurement = "IN";
        String length = "15";
        String cableAssemblyTesting="{\"amount\":25}";
        String getAddCustomLengthToCartUrlNUll=olccModuleService.addCustomLengthToCartUrl(tokenEmpty,currency,skuValue,quantity,unitOfMeasurement,length,bearerToken,cableAssemblyTesting);
        String getCableAssembly=olccModuleService.getCableAssembly(skuValue,bearerToken);
        //assertNull(getToken);
        //assertNull(getSearchCableAssembly);
        //assertNull(getAddCustomLengthToCartUrlNUll);
        //assertNull(getCableAssembly);
    }

    private Boolean jsonTest(String jsonString){
        try {
            new JSONObject(jsonString);
            return true;
        } catch (JSONException e) {
            return false;
        }
    }

    private String searchCableAssemblyRequest() {
        return "{\n" +
                "    \"caCon1\": \"SC7016\",\n" +
                "    \"caCon2\": \"SC7016\",\n" +
                "    \"caCoax\": \"FM-SR141TB\",\n" +
                "    \"assemblyOption\": {\n" +
                "    \"lf\": false,\n" +
                "    \"hs\": true,\n" +
                "    \"clock\": 0\n" +
                "}\n" +
                "}";
    }

    private String createAssemblyRequest() {
        return "{\n" +
                "  \"caCon1\": \"EZ-400-TM-X\",\n" +
                "  \"caCon2\": \"EZ-200-TM-X\",\n" +
                "  \"caCoax\": \"LMR-400\",\n" +
                "  \"assemblyOption\": {\n" +
                "    \"lf\": true,\n" +
                "    \"hs\": true,\n" +
                "    \"clock\": 360\n" +
                "  }\n" +
                "}";
    }
    private String searchOptionsRequest() {
        return "{\n" +
                "  \"Connector_One_Selections\": {\n" +
                "\n" +
                "  },\n" +
                "  \"Connector_Two_Selections\": {\n" +
                "    \"searchQuery\": \"FRPE\"\n" +
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

}
