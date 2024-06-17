package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.AddNewAddressService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.commons.io.FileUtils;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AddNewAddressServiceImplTest {

    AemContext aemContext = new AemContext();
    private AddNewAddressService addNewAddressService;
    private AddNewAddressService exceptionAddNewAddressService;
    private OLCCModuleService mockSampleOSGIService;
    private Map<String,String> configProps = new HashMap<String,String>();
    private Map<String,String> props = new HashMap<String,String>();
    private Map<String,String> exceptionProps = new HashMap<String,String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getCableAssembly","https://apim-iedtecomm-dev01.azure-api.net/olcc/fairview/get-cable-assembly");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);

        props.put("getCustProfileURL","https://apim-iedtecomm-dev01.azure-api.net/customer/fairview/me");
        props.put("getNewAddressURL","https://apim-iedtecomm-dev01.azure-api.net/account/fairview/addAddress");
        props.put("getEditAddressURL", "https://apim-iedtecomm-dev01.azure-api.net/account/fairview/updateAddress");
        props.put("getDeleteAddressURL","https://apim-iedtecomm-dev01.azure-api.net/account/fairview/deleteAddress");
        addNewAddressService = aemContext.registerInjectActivateService(new AddNewAddressServiceImpl(),props);

        exceptionProps.put("getCustProfileURL","https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        exceptionProps.put("getNewAddressURL","https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        exceptionProps.put("getEditAddressURL", "https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        exceptionProps.put("getDeleteAddressURL","https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        exceptionAddNewAddressService = aemContext.registerInjectActivateService(new AddNewAddressServiceImpl(),exceptionProps);
    }

    @Test
    void testMethod() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String accessToken = "JrPBnz4Xx467DsuDKpXVWR9uDksziTs3";
        MockSlingHttpServletRequest request = aemContext.request();
        addNewAddressService.initialAddressDetails(request,accessToken,bearerToken);
        String addressObjct = "addressObjct";
        addNewAddressService.addNewAddress(request,addressObjct,accessToken,bearerToken);
        addNewAddressService.updateAddress(request,addressObjct,accessToken,bearerToken);
        addNewAddressService.deleteAddress(addressObjct,accessToken,bearerToken);
    }

    @Test
    void testExceptionMethod() throws IOException {
        String bearerToken = bearerTokenURLResponse();
        String accessToken = "JrPBnz4Xx467DsuDKpXVWR9uDksziTs3";
        MockSlingHttpServletRequest request = aemContext.request();
        exceptionAddNewAddressService.initialAddressDetails(request,accessToken,bearerToken);
        String addressObjct = "";
        exceptionAddNewAddressService.addNewAddress(request,addressObjct,accessToken,bearerToken);
        exceptionAddNewAddressService.updateAddress(request,addressObjct,accessToken,bearerToken);
        exceptionAddNewAddressService.deleteAddress(addressObjct,accessToken,bearerToken);
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