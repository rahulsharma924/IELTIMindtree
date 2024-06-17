package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.GetProductDeliveryDateService;
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

class GetProductDeliveryDateServletTest {

    AemContext aemContext = new AemContext();

    @Mock
    GetProductDeliveryDateService mockDeliveryDateService;

    @InjectMocks
    GetProductDeliveryDateServlet mockGetProductDeliveryDateServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doPost() throws ServletException, IOException {
        String responseValue = "response";
        when(mockDeliveryDateService.getProductDeliveryDate(Mockito.anyString(),Mockito.anyString(),Mockito.any(),Mockito.any())).thenReturn(responseValue);
        when(mockDeliveryDateService.getProductDeliveryDateForCustomSku(Mockito.anyString(),Mockito.anyString(),Mockito.any(),Mockito.any())).thenReturn(responseValue);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.setPathInfo("/bin/getproddeldate");
        request.addRequestParameter("zipcode","zipcode");
        request.addRequestParameter("skuId","skuId");
        request.addRequestParameter("countryCode","countryCode");
        request.addRequestParameter("prodQty","prodQty");
        request.addRequestParameter("bearerToken","bearerToken");
        request.addRequestParameter("transitTime","transitTime");
        request.addRequestParameter("uom","uom");
        request.addRequestParameter("length","length");
        mockGetProductDeliveryDateServlet.doPost(request,response);
        request.setPathInfo("/bin/getproddeldate.custom");
        mockGetProductDeliveryDateServlet.doPost(request,response);
    }
}