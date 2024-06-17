package com.aem.ie.core.Service;

 

import java.io.IOException;

 

import org.apache.http.client.ClientProtocolException;
import org.apache.sling.api.SlingHttpServletRequest;

 

public interface CTCustomerOrderedProductService {

     public String getCustomerOrderedProduct(String customer_token, String past30Days, String past90Days,String past180days,String past270days,String past360days, String past60days,String bearerToken) throws ClientProtocolException, IOException;
    public String getCustomerOrderedProductSearch(String customer_token,String QueryParam,String bearerToken) throws ClientProtocolException, IOException;
}