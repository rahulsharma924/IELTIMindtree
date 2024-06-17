package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import javax.servlet.ServletException;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class OLCCSearchCableAssemblyServletTest {

    AemContext aemContext = new AemContext();

    @Mock
    OLCCModuleService mockOLCCModuleService;

    @InjectMocks
    OLCCSearchCableAssemblyServlet OLCCSearchCableAssemblyServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doPost() throws ServletException, IOException {

        String stringInput = "{\n" +
                "    \"caCon1\": \"SC7016\",\n" +
                "    \"caCon2\": \"SC7016\",\n" +
                "    \"caCoax\": \"FM-SR141TB\",\n" +
                "    \"assemblyOption\": {\n" +
                         "    \"lf\": false,\n" +
                         "    \"hs\": true,\n" +
                         "    \"clock\": 0\n" +
                         "}\n" +
        "}";

        String responseValue = "{\n"+
                " \"sku\":\"FMC00568\",\n" +
                "}";

        when(mockOLCCModuleService.getSearchCableAssembly(Mockito.anyString(),Mockito.anyString())).thenReturn(responseValue);
        String test = mockOLCCModuleService.getSearchCableAssembly(Mockito.anyString(),Mockito.anyString());
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("bearerToken","bearerToken");
        request.addRequestParameter("jsonData",stringInput);
        OLCCSearchCableAssemblyServlet.doPost(request,response);
        //assertEquals(true,response.getOutputAsString().contains("sku"));
    }

    @Test
    void doPostEmptyCase() throws ServletException, IOException {

        String stringInput = "{\n" +
                "    \"caCon1\": \"SC7016\",\n" +
                "    \"caCon2\": \"SC7016\",\n" +
                "    \"caCoax\": \"FM-SR141TB\",\n" +
                "    \"assemblyOption\": {\n" +
                "    \"lf\": false,\n" +
                "    \"hs\": true,\n" +
                "    \"clock\": 0\n" +
                "}\n" +
                "}";
        String responseValueEmpty = "";
        when(mockOLCCModuleService.getSearchCableAssembly(Mockito.anyString(),Mockito.anyString())).thenReturn(responseValueEmpty);
        String test = mockOLCCModuleService.getSearchCableAssembly(Mockito.anyString(),Mockito.anyString());
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("bearerToken","bearerToken");
        request.addRequestParameter("jsonData",stringInput);
        OLCCSearchCableAssemblyServlet.doPost(request,response);
        //assertEquals(true,response.getOutputAsString().contains("sku"));
    }
}