package com.aem.ie.core.Service;

import com.google.gson.JsonObject;

public interface GetCalculatedTaxService {
    String getCalculatedTax(String customerToken, String country, String postalCode, String bearerToken);
    String getCalculateTax(String customerToken, JsonObject jsonObject,String bearerToken);
    String getReCalculateTaxUser(String customerToken,String bearerToken);

}
