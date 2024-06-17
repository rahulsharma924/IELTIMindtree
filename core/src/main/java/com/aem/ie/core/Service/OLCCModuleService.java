package com.aem.ie.core.Service;

import java.io.IOException;

public interface OLCCModuleService {

    String getAllOptions(String requestBody,String bearerToken) throws IOException;


    String getOption(String requestBody,String bearerToken) throws IOException;

    String getSearchOptions(String requestBody,String bearerToken) throws IOException;

    String createAssembly(String requestBody,String bearerToken);

    String getCableAssembly(String sku,String bearerToken);

    String getBearerTokenUrl() throws IOException;
    String addCustomLengthToCartUrl(String token,String currency,String skuValue,String quantity,String unitOfMeasurement,String length,String bearerToken, String cableAssemblyTesting) throws IOException;

    String getSearchCableAssembly(String jsonData, String bearerToken);
}
