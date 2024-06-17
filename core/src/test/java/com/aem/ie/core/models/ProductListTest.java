package com.aem.ie.core.models;

import com.aem.ie.core.Service.AlgoliaPLPService;
import com.aem.ie.core.services.impl.AlgoliaPLPServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@ExtendWith({AemContextExtension.class,MockitoExtension.class})
class ProductListTest {
    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    ProductList ProductListTest = new ProductList();

    @BeforeEach
    void setUp() throws IOException {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void init() throws IOException {
        aemContext.requestPathInfo().setSelectorString("22-5-to-22-5-adapters");
        aemContext.request().adaptTo(ProductList.class);
    }

    @Test
    void getAllMethodTested() throws ParseException {
        ProductListTest.getInventoryValue(0);
        ProductListTest.getInventoryValue(2);
        ProductListTest.isIEHoliday(6, 6, "06");
        ProductListTest.isIEHoliday(25, 1, "12");
        Date formattedDate = new SimpleDateFormat("MM dd, yyyy").parse("06 23, 2023");
        Date holidayDate = new SimpleDateFormat("MM dd, yyyy").parse("06 27, 2023");
        ProductListTest.getNextBusinessDay(formattedDate);
        ProductListTest.getNextBusinessDay(holidayDate);
        ProductListTest.getEstimatedShipmentDate();
        List<LinkedHashMap<String, String>> assetsValue = new ArrayList<>();
        LinkedHashMap<String, String> assetMapLargeImage = new LinkedHashMap<>();
        assetMapLargeImage.put("type", "LargeImage");
        assetMapLargeImage.put("name", "SM4241.jpg");
        assetsValue.add(assetMapLargeImage);
        LinkedHashMap<String, String> assetMapDataSheet = new LinkedHashMap<>();
        assetMapDataSheet.put("type", "DataSheet");
        assetMapDataSheet.put("name", "SM4241.pdf");
        assetsValue.add(assetMapDataSheet);
        ProductListTest.productimagerootpath = "path";
        ProductListTest.datasheetrootpath = "path";
        ProductListTest.getProductListMapValues(1, "Fixed Attenuators", "SKU", 9, assetsValue, "", "");
    }
}
