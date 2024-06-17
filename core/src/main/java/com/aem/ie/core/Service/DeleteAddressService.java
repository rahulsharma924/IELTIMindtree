package com.aem.ie.core.Service;

import com.google.gson.JsonObject;

public interface DeleteAddressService {

    String deleteAddress(String customerTokenVal, JsonObject jsonObject);

}
