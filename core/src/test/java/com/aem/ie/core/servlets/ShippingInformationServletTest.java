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

import com.aem.ie.core.Service.AddNewAddressService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.services.impl.AddNewAddressServiceImpl;
import com.aem.ie.core.services.impl.UpdatePersonalInfoServiceImpl;
import com.google.gson.JsonObject;

import io.wcm.testing.mock.aem.junit5.AemContext;
public class ShippingInformationServletTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    @Mock
    private AddNewAddressService addNewAddressService;
    private AddNewAddressService mockaddNewAddressService;
    private Map<String, String> configProps = new HashMap<>();
    @InjectMocks
    ShippingInformationServlet shippingInformationServlet;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getNewAddressURL", "https://apim-iedtecomm-qa01.azure-api.net/account/fairview/addAddress");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockaddNewAddressService = aemContext.registerInjectActivateService(new AddNewAddressServiceImpl(), configProps);
    }
    @Test()
    void doGet() throws ServletException, IOException,NullPointerException {
    	JsonObject responseValue = new JsonObject();
            //Code under test
        	String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0ie";
        	//String bearerToken = bearerTokenURLResponse();
            String accessToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            String addressType = "addressType";
            String firstName = "name";
            String lastName = "lastName";
            String company = "company";
            String country = "US";
            String addressOne = "addressOne";
            String addressTwo = "addressTwo";
            String phoneNumber = "9848012345";
            String ZipCode = "zipcode";
            String state = "TX";
            String cityName = "city";
            String details = "{\"type\":\"" + addressType + "\",\"address\":{\"name\":\"" + firstName + "\",\"lastName\":\"" + lastName + "\",\"company\":\"" + company + "\",\"country\":\"" + country + "\",\"line1\":\"" + addressOne + "\",\"line2\":\"" + addressTwo + "\",\"phone\":\""+phoneNumber+"\",\"zipcode\":\"" + ZipCode + "\",\"state\":\"" + state + "\",\"city\":\"" + cityName + "\",\"isDefault\":\"false\"}}";
            MockSlingHttpServletRequest request = aemContext.request();
            responseValue = mockaddNewAddressService.addNewAddress(request, addressOne, accessToken, bearerToken);
            when(addNewAddressService.addNewAddress(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any())).thenReturn(responseValue);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken",bearerToken);
            request.addRequestParameter("CTCustomerToken",accessToken);
            request.addRequestParameter("name",firstName);
            request.addRequestParameter("company",company);
            request.addRequestParameter("country",country);
            request.addRequestParameter("line1",addressOne);
            request.addRequestParameter("line2",company);
            request.addRequestParameter("zipcode",addressTwo);
            request.addRequestParameter("state",state);
            request.addRequestParameter("city",cityName);
            request.addRequestParameter("phone",phoneNumber);
            shippingInformationServlet.doPost(request, response);
       
    }

}
