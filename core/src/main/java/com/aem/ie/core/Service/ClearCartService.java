package com.aem.ie.core.Service;

import java.io.IOException;
import org.apache.http.client.ClientProtocolException;
import org.apache.sling.api.SlingHttpServletRequest;

public interface ClearCartService {

    public String clearCart(SlingHttpServletRequest slingRequest, String cartID, String access_token, String version, String bearerToken) throws ClientProtocolException, IOException;
}