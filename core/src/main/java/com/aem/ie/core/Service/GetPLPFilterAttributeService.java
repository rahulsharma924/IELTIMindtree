package com.aem.ie.core.Service;

import org.apache.http.client.ClientProtocolException;

import java.io.IOException;

public interface GetPLPFilterAttributeService {
    public String getPLPFilterAttributes(String bearerToken,String brandName,String categoryName) throws ClientProtocolException, IOException;
}
