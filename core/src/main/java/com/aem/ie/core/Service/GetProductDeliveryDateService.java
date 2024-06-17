package com.aem.ie.core.Service;

import com.google.gson.JsonObject;

public interface GetProductDeliveryDateService {
    public String getProductDeliveryDate(String bearerToken,
                                         String transitTimeRequired,
                                         JsonObject productJson,
                                         JsonObject addressJson);

    public String getProductDeliveryDateForCustomSku(String bearerToken,
                                                     String transitTimeRequired,
                                                     JsonObject customCAProduct,
                                                     JsonObject address);
}
