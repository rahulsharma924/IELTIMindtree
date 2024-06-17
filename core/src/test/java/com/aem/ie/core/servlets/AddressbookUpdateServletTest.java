package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.AddNewAddressService;
import com.aem.ie.core.services.impl.AddNewAddressServiceImpl;
import com.google.gson.JsonObject;
import io.wcm.testing.mock.aem.junit5.AemContext;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AddressbookUpdateServletTest {
    AemContext aemContext =  new AemContext();

    private transient AddNewAddressService mockSampleAddNewAddressService;

    @Mock
    AddNewAddressService addNewAddressService;

    @InjectMocks
    AddressbookUpdateServlet MockAddNewAddressServlet;

    private Map<String, String> configProps = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getUpdateAddressURL", "https://apim-iedtecomm-dev01.azure-api.net/account/fairview/updateAddress");

        mockSampleAddNewAddressService = aemContext.registerInjectActivateService(new AddNewAddressServiceImpl(), configProps);
    }
    @Test()
    void doPost() throws ServletException, IOException,NullPointerException {

            //Code under test
            String addressId = "dhue8ehd";
            String addressType = "shipping";
            String firstName = "dhsgddef";
            String lastName = "hfeiufhef";
            String company = "jhddjfsd";
            String country = "jfbsheei";
            String addressOne = "jkddhdsuie";
            String addressTwo = "hjdfehfiwe";
            String phoneNumber = "6757887656";
            String ZipCode = "4343434";
            String state = "uewdeuhd";
            String cityName = "fdfjsdhfd";
            String access_token ="j90i90fjdpkfdkfpdk89u89dkld";
            String defaultAddress = "true";
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String details ="{\"type\":\""+addressType+"\",\"address\":{\"name\":\""+firstName+"\",\"lastName\":\""+lastName+"\",\"company\":\""+company+"\",\"country\":\""+country+"\",\"line1\":\""+addressOne+"\",\"line2\":\""+addressTwo+"\",\"phone\":\""+phoneNumber+"\",\"zipcode\":\""+ZipCode+"\",\"state\":\""+state+"\",\"city\":\""+cityName+"\",\"isDefault\":\""+defaultAddress+"\"},\"addressId\":\""+addressId+"\"}";


            JsonObject MockAddNewAddressResponse = mockSampleAddNewAddressService.addNewAddress(request,details,access_token,bearerToken);
            when(addNewAddressService.updateAddress(request,details,access_token,bearerToken)).thenReturn(MockAddNewAddressResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("addressId",addressId);
            request.addRequestParameter("addressType",addressType);
            request.addRequestParameter("firstName",firstName);
            request.addRequestParameter("lastName",lastName);
            request.addRequestParameter("company",company);
            request.addRequestParameter("country",country);
            request.addRequestParameter("addressOne",addressOne);
            request.addRequestParameter("addressTwo",addressTwo);
            request.addRequestParameter("phoneNumber",phoneNumber);
            request.addRequestParameter("ZipCode",ZipCode);
            request.addRequestParameter("state",state);
            request.addRequestParameter("cityName",cityName);
            request.addRequestParameter("defaultAddress",defaultAddress);
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("access_token",access_token);
            MockAddNewAddressServlet.doPost(request,response);

    }
}