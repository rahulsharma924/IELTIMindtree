package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.DeleteAddressService;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class DeleteAddressServiceImplTest {

    AemContext aemContext = new AemContext();

    private DeleteAddressService deleteAddressService;

    private DeleteAddressService deleteAddressService2;

    private Map<String,String> props = new HashMap<>();

    private Map<String,String> deleteProps = new HashMap<>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        props.put("getDeleteAddressURL", "https://apim-iedtecomm-dev01.azure-api.net/account/fairview/deleteAddress");
        deleteAddressService = aemContext.registerInjectActivateService(new DeleteAddressServiceImpl(),props);

        deleteProps.put("getDeleteAddressURL", "https://apim-iedtecomm-dev01.azure-api.net/q/h?s=^IXIC");
        deleteAddressService2 = aemContext.registerInjectActivateService(new DeleteAddressServiceImpl(),deleteProps);
    }

    @Test
    void deleteAddress() {
        String customerTokenVal = "JrPBnz4Xx467DsuDKpXVWR9uDksziTs3";
        JsonObject jsonObject = new JsonObject();
        deleteAddressService.deleteAddress(customerTokenVal,jsonObject);
    }

    @Test
    void deleteAddressMethod() {
        String customerTokenVal = "JrPBnz4Xx467DsuDKpXVWR9uDksziTs3";
        JsonObject jsonObject = new JsonObject();
        deleteAddressService2.deleteAddress(customerTokenVal,jsonObject);
    }
}