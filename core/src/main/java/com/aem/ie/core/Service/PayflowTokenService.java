package com.aem.ie.core.Service;

import com.google.gson.JsonObject;
import org.apache.sling.api.SlingHttpServletRequest;

import javax.servlet.ServletException;
import java.io.IOException;

public interface PayflowTokenService {
    String getSecureToken(SlingHttpServletRequest slingRequest,String jsonData, JsonObject jsonSecureData, String customerToken, String bearerToken)
            throws ServletException, IOException;

    String placeOrder(String customerTokenVal, String bearerToken, String transactionId, String ponumber) throws ServletException, IOException;
}