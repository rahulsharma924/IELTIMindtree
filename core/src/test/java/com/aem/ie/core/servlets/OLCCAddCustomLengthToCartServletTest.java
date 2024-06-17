package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class OLCCAddCustomLengthToCartServletTest {

    AemContext aemContext = new AemContext();

    @Mock
    OLCCModuleService mockolccModuleService;

    @InjectMocks
    OLCCAddCustomLengthToCartServlet OLCCAddCustomLengthToCartServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doPut() throws ServletException, IOException {
        String stringB = "{\n" +
                "\n" +
                "    \"cart\": {\n" +
                "\n" +
                "        \"id\": \"fe3fdefb-251b-45d5-916d-91549b599158\"\n" +
                "\n" +
                "    }\n" +
                "}";
        when(mockolccModuleService.addCustomLengthToCartUrl(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString())).thenReturn(stringB);
        String test = mockolccModuleService.addCustomLengthToCartUrl(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString());
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("CTCustomerToken","");
        request.addRequestParameter("bearertoken","bearertoken");
        request.addRequestParameter("currency","USD");
        request.addRequestParameter("masterSku","FMC5427/0071");
        request.addRequestParameter("quantity","30");
        request.addRequestParameter("unitOfMeasurement","IN");
        request.addRequestParameter("length","15");
        request.addRequestParameter("cableAssemblyTesting","{\"amount\":25}");
        OLCCAddCustomLengthToCartServlet.doPut(request,response);
        //assertEquals(true,response.getOutputAsString().contains("id"));
    }
}
