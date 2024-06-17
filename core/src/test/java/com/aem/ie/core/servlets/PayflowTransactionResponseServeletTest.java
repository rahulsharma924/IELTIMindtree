package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.PayflowTokenService;
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

class PayflowTransactionResponseServeletTest {

    AemContext aemContext = new AemContext();

    @Mock
    PayflowTokenService mockPaypalTokenService;

    @InjectMocks
    PayflowTransactionResponseServelet mockPayflowTransactionResponseServelet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doPost() throws ServletException, IOException {
        String responseValue = "response";
        when(mockPaypalTokenService.placeOrder(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyString())).thenReturn(responseValue);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        response.sendRedirect("/content/fm/en/shipping-information.html");
        request.addRequestParameter("TRANSACTIONID","1234");
        request.addRequestParameter("User1","");
        request.addRequestParameter("User2","");
        mockPayflowTransactionResponseServelet.doPost(request,response);
    }
}