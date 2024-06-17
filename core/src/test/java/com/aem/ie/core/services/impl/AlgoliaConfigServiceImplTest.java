package com.aem.ie.core.services.impl;

import com.aem.ie.core.configuration.AlgoliaConfig;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AlgoliaConfigServiceImplTest {

    private AlgoliaConfigServiceImpl algoliaConfigServiceImpl = new AlgoliaConfigServiceImpl();

    @Test
    void testMethod() {
        AlgoliaConfig config = mock(AlgoliaConfig.class);
        when(config.algoliaId()).thenReturn("algoliaId");
        when(config.algoliaKey()).thenReturn("algoliaKey");
        when(config.indexInuse()).thenReturn("indexInuse");
        when(config.indexNmAsc()).thenReturn("indexNmAsc");
        when(config.indexNmDsc()).thenReturn("indexNmDsc");
        when(config.indexPrAsc()).thenReturn("indexPrAsc");
        when(config.indexPrDsc()).thenReturn("indexPrDsc");
        when(config.indexBs()).thenReturn("indexBs");
        when(config.indexContent()).thenReturn("indexContent");
        when(config.indexContentAsc()).thenReturn("indexContentAsc");
        when(config.indexContentDsc()).thenReturn("indexContentDsc");
        when(config.indexQuerySuggest()).thenReturn("indexQuerySuggest");

        algoliaConfigServiceImpl.activate(config);
        algoliaConfigServiceImpl.getAlgoliaId();
        algoliaConfigServiceImpl.getAlgoliaKey();
        algoliaConfigServiceImpl.getIndexInuse();
        algoliaConfigServiceImpl.getIndexNmAsc();
        algoliaConfigServiceImpl.getIndexNmDsc();
        algoliaConfigServiceImpl.getIndexPrAsc();
        algoliaConfigServiceImpl.getIndexPrDsc();
        algoliaConfigServiceImpl.getIndexBs();
        algoliaConfigServiceImpl.getIndexContent();
        algoliaConfigServiceImpl.getIndexContentAsc();
        algoliaConfigServiceImpl.getIndexContentDsc();
        algoliaConfigServiceImpl.getIndexQuerySuggest();
    }

}