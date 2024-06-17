package com.aem.ie.core.Service;

import com.aem.ie.core.models.datamodels.Product;

import java.io.IOException;

public interface AlgoliaPDPService {
    Product getAlgoliaProductData(String sku) throws IOException;

}
