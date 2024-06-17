package com.aem.ie.core.Service;

import java.io.IOException;

public interface ProductDeliveryRatesService {

    String getProductDeliveryRates(String jsonData, String bearerToken) throws IOException;
}