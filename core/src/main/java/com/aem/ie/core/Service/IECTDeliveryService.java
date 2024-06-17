package com.aem.ie.core.Service;

import com.google.gson.JsonObject;

public interface IECTDeliveryService {
    String getdeliveryRates(String customerTokenValue, String transitTimeRequired, String zipcode, String country,String bearerToken);
    String getDeliveryOptions(String customerTokenValue, JsonObject jsonObject,String bearerToken);
}
