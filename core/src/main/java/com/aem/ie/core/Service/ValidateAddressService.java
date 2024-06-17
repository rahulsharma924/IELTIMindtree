package com.aem.ie.core.Service;

import com.google.gson.JsonObject;

public interface ValidateAddressService {
    String getValidateAddressUrl(String customerTokenVal,String bearerToken, JsonObject jsonObject);
    String getValidateAddressGuestUser( String jsonObject,String bearerToken);
}
