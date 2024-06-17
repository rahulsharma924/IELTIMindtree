package com.aem.ie.core.Service;

import com.google.gson.JsonObject;

public interface UpdateAddressService {
    JsonObject updateAddress(String customerTokenVal,String bearerToken, String jsonObject);
}


