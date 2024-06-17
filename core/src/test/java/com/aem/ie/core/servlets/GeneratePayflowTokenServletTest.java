package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.PayflowTokenService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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

import static org.mockito.Mockito.when;

class GeneratePayflowTokenServletTest {

    AemContext aemContext = new AemContext();

    @Mock
    PayflowTokenService mockPaypalTokenService;

    @InjectMocks
    GeneratePayflowTokenServlet mockGeneratePayflowTokenServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doPost() throws ServletException, IOException {
        String jsonData = "{\n" +
                "\n" +
                "    \"cart\": {\n" +
                "\n" +
                "        \"id\": \"fe3fdefb-251b-45d5-916d-91549b599158\"\n" +
                "\n" +
                "    }\n" +
                "}";
        String responseValue = "response";
        when(mockPaypalTokenService.getSecureToken(Mockito.any(),Mockito.anyString(),Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(responseValue);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("jsonData",jsonData);
        request.addRequestParameter("jsonSecureTokenData",jsonData);
        request.addRequestParameter("bearerToken","");
        request.addRequestParameter("customerToken","");
        mockGeneratePayflowTokenServlet.doPost(request,response);
    }
}