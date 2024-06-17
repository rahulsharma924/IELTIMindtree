package com.aem.ie.core.services.impl;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.aem.ie.core.configuration.AlgoliaConfig;
import com.aem.ie.core.models.datamodels.PLP;
import com.algolia.search.models.indexing.SearchResult;
import com.google.gson.JsonObject;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
@ExtendWith(AemContextExtension.class)
class AlgoliaPLPServiceImplTest {
    AlgoliaPLPServiceImpl algoliaPLPService = new AlgoliaPLPServiceImpl();
    SearchResult<PLP> result;
    SearchResult<JsonObject> result1;
    @Test
    void getAlgoliaProductListTest() throws IOException {
        AlgoliaConfig algoliaConfig = mock(AlgoliaConfig.class);
        when(algoliaConfig.algoliaId()).thenReturn("testing20MRCI4146");
        when(algoliaConfig.algoliaKey()).thenReturn("8f92b91fdf51d9543748d38e6df813b8");
        when(algoliaConfig.indexInuse()).thenReturn("fm_product_en_dev");
        when(algoliaConfig.indexBs()).thenReturn("fm_product_en_bestseller_qa");
        List<String> webattributeName=new ArrayList();
        webattributeName.add("Antenna Type");
        algoliaPLPService.activate(algoliaConfig);
        result = algoliaPLPService.getAlgoliaProductList("/rf-adapters","ceiling");
        result=algoliaPLPService.getAlgoliaPLPList("/rf-adapters", "12", "1", "1");
        result = algoliaPLPService.getAlgoliaProductList("","");
        result = algoliaPLPService.getAlgoliaNewReleasesList("RF Amplifiers");
        result = algoliaPLPService.getAlgoliaAllList();
        result = algoliaPLPService.getAlgoliaAllPLPList("12", "1", "1");
        result = algoliaPLPService.getAlgoliaBestSellersList("RF Attenuators");
        result = algoliaPLPService.getAlgoliaNewReleasesPLPList("12", "1", "1");
        result = algoliaPLPService.getAlgoliaBestSellersPLPList("12", "1", "1");
        result1 = algoliaPLPService.getAlgoliaCategoryList("/antennas", "tekjhgfds", "antennas", webattributeName);
        result1 = algoliaPLPService.getPricerangeValues("antennas");
       // result = algoliaPLPService.getAlgoliaNewReleasesList("null");
    }
    @Test
    void getAlgoliaProductListNullTest() throws IOException {
    	AlgoliaConfig algoliaConfig = mock(AlgoliaConfig.class);
        when(algoliaConfig.algoliaId()).thenReturn("testing20MRCI4146");
        when(algoliaConfig.algoliaKey()).thenReturn("8f92b91fdf51d9543748d38e6df813b8");
        when(algoliaConfig.indexInuse()).thenReturn("fm_product_en_dev");
        when(algoliaConfig.indexBs()).thenReturn("fm_product_en_bestseller_qa");
        List<String> webattributeName=new ArrayList();
        webattributeName.add("false");
        algoliaPLPService.activate(algoliaConfig);
        result = algoliaPLPService.getAlgoliaBestSellersList(null);
        result = algoliaPLPService.getAlgoliaNewReleasesList(null);
        result = algoliaPLPService.getAlgoliaAllPLPList("12", null, "1");
        result = algoliaPLPService.getAlgoliaNewReleasesPLPList("10", null, "1");
        result = algoliaPLPService.getAlgoliaBestSellersPLPList("13", null, "1");
        result = algoliaPLPService.getAlgoliaPLPList("/rf-adapters", "12", null, "1");
        result1 = algoliaPLPService.getAlgoliaCategoryList("/waveguide-components", "tekjhgfds", "antennas", webattributeName);
   
    }
    
}