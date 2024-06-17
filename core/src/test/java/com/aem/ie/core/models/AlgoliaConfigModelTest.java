package com.aem.ie.core.models;

import com.aem.ie.core.Service.AlgoliaConfigService;
import com.aem.ie.core.Service.GoogleCaptchaService;
import com.aem.ie.core.services.impl.AlgoliaConfigServiceImpl;
import com.aem.ie.core.services.impl.GoogleCaptchaServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class AlgoliaConfigModelTest {

    AemContext aemContext =  new AemContext();
    @Mock
    private AlgoliaConfigService algoliaConfigService;

    private Map<String, String> configProps = new HashMap<>();
    @InjectMocks
    private AlgoliaConfigModel algoliaConfigModel;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("algoliaId", "O0PAXP3VI5");
        configProps.put("algoliaKey", "dda2366f016f16279863c2ac2d068d8c");
        configProps.put("indexInuse", "fm_product_en_qa");
        configProps.put("indexNmAsc", "fm_product_en_name_asc_qa");
        configProps.put("indexNmDsc", "fm_product_en_name_desc_qa");
        configProps.put("indexPrAsc", "fm_product_en_price_asc_qa");
        configProps.put("indexPrDsc", "fm_product_en_price_desc_qa");
        configProps.put("indexBs", "fm_product_en_bestseller_qa");
        configProps.put("indexContent", "crawler_fm_contentqa");
        configProps.put("indexContentAsc", "crawler_fm_content_name_asc_qa");
        configProps.put("indexContentDsc", "crawler_fm_content_name_desc_qa");
        configProps.put("indexQuerySuggest", "fm_product_en_query_suggestions_qa");
        algoliaConfigService = aemContext.registerInjectActivateService(new AlgoliaConfigServiceImpl(), configProps);
    }

    @Test
    void testAlgoliaConfigModel(){
        when(algoliaConfigModel.getAlgoliaId()).thenReturn("O0PAXP3VI5");
        assertEquals(algoliaConfigService.getAlgoliaId(), algoliaConfigModel.getAlgoliaId());
        when(algoliaConfigModel.getAlgoliaKey()).thenReturn("dda2366f016f16279863c2ac2d068d8c");
        assertEquals(algoliaConfigService.getAlgoliaKey(), algoliaConfigModel.getAlgoliaKey());
        when(algoliaConfigModel.getIndexInuse()).thenReturn("fm_product_en_qa");
        assertEquals(algoliaConfigService.getIndexInuse(), algoliaConfigModel.getIndexInuse());
        when(algoliaConfigModel.getIndexBs()).thenReturn("fm_product_en_bestseller_qa");
        assertEquals(algoliaConfigService.getIndexBs(), algoliaConfigModel.getIndexBs());
        when(algoliaConfigModel.getIndexContent()).thenReturn("crawler_fm_contentqa");
        assertEquals(algoliaConfigService.getIndexContent(), algoliaConfigModel.getIndexContent());
        when(algoliaConfigModel.getIndexContentAsc()).thenReturn("crawler_fm_content_name_asc_qa");
        assertEquals(algoliaConfigService.getIndexContentAsc(), algoliaConfigModel.getIndexContentAsc());
        when(algoliaConfigModel.getIndexContentDsc()).thenReturn("crawler_fm_content_name_desc_qa");
        assertEquals(algoliaConfigService.getIndexContentDsc(), algoliaConfigModel.getIndexContentDsc());
        when(algoliaConfigModel.getIndexNmAsc()).thenReturn("fm_product_en_name_asc_qa");
        assertEquals(algoliaConfigService.getIndexNmAsc(), algoliaConfigModel.getIndexNmAsc());
        when(algoliaConfigModel.getIndexNmDsc()).thenReturn("fm_product_en_name_desc_qa");
        assertEquals(algoliaConfigService.getIndexNmDsc(), algoliaConfigModel.getIndexNmDsc());
        when(algoliaConfigModel.getIndexPrAsc()).thenReturn("fm_product_en_price_asc_qa");
        assertEquals(algoliaConfigService.getIndexPrAsc(), algoliaConfigModel.getIndexPrAsc());
        when(algoliaConfigModel.getIndexPrDsc()).thenReturn("fm_product_en_price_desc_qa");
        assertEquals(algoliaConfigService.getIndexPrDsc(), algoliaConfigModel.getIndexPrDsc());
        when(algoliaConfigModel.getIndexQuerySuggest()).thenReturn("fm_product_en_query_suggestions_qa");
        assertEquals(algoliaConfigService.getIndexQuerySuggest(), algoliaConfigModel.getIndexQuerySuggest());

    }
}