package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.AddNewAddressService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.AddNewAddressServiceImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.commons.io.FileUtils;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.servlet.ServletException;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class DeleteAddressServletTest {

    AemContext aemContext = new AemContext();
    @Mock
    AddNewAddressService mockAddNewAddressService;
    AddNewAddressService addNewAddressService;
    private OLCCModuleService mockSampleOSGIService;

    @InjectMocks
    DeleteAddressServlet MockdeleteAddressServlet;
    private Map<String, String> configProps = new HashMap<>();
    private Map<String,String> props = new HashMap<>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getDeleteAddressURL", "https://apim-iedtecomm-dev01.azure-api.net/account/fairview/deleteAddress");
        addNewAddressService = aemContext.registerInjectActivateService(new AddNewAddressServiceImpl(), configProps);

        props.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        props.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        props.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        props.put("getGrantTypeBearerTokenUrl", "client_credentials");
        props.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),props);
    }

    @Test
    void doPost() throws IOException, ServletException,NullPointerException {
        String bearerToken = bearerTokenURLResponse();
        String addressId = "MqZvqXt5";
        String details = addressId;
        String customer_token = "uV62-pb6wg9-86kyrmy2Ahf0OVFz1d0O";
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();

        ClassLoader classLoader = this.getClass().getClassLoader();
        File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/ServletResponse.json")
                .getFile());
        assertTrue(jsonFile.exists());
        String MockActiveCartResponse = FileUtils.readFileToString(jsonFile);
        JsonParser parser = new JsonParser();
        JsonObject JSONObject = parser.parse(MockActiveCartResponse).getAsJsonObject();
        //JsonObject responseValue = mockAddNewAddressService.deleteAddress(details, customer_token, bearerToken);
        when(mockAddNewAddressService.deleteAddress(details,customer_token,bearerToken)).thenReturn(JSONObject);
        request.addRequestParameter("addressId", addressId);
        request.addRequestParameter("bearerToken", bearerToken);
        request.addRequestParameter("accessToken", customer_token);
        MockdeleteAddressServlet.doPost(request,response);
    }

    private String bearerTokenURLResponse() throws IOException {
        String bearerAccessToken = "bearertoken";
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