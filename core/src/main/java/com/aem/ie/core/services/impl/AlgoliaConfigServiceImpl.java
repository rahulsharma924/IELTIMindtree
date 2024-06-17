package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.AlgoliaConfigService;
import com.aem.ie.core.configuration.AlgoliaConfig;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

@Component(service = AlgoliaConfigService.class, immediate = true)
@Designate(ocd = AlgoliaConfig.class)
public class AlgoliaConfigServiceImpl implements AlgoliaConfigService {
    private String algoliaId;
    private String algoliaKey;
    private String indexInuse;
    private String indexNmAsc;
    private String indexNmDsc;
    private String indexPrAsc;
    private String indexPrDsc;
    private String indexBs;
    private String indexContent;
    private String indexContentAsc;
    private String indexContentDsc;
    private String indexQuerySuggest;

    @Activate
    protected void activate(AlgoliaConfig algoliaConfig) {
        algoliaId = algoliaConfig.algoliaId();
        algoliaKey = algoliaConfig.algoliaKey();
        indexInuse = algoliaConfig.indexInuse();
        indexNmAsc = algoliaConfig.indexNmAsc();
        indexNmDsc = algoliaConfig.indexNmDsc();
        indexPrAsc = algoliaConfig.indexPrAsc();
        indexPrDsc = algoliaConfig.indexPrDsc();
        indexBs = algoliaConfig.indexBs();
        indexContent = algoliaConfig.indexContent();
        indexContentAsc = algoliaConfig.indexContentAsc();
        indexContentDsc = algoliaConfig.indexContentDsc();
        indexQuerySuggest = algoliaConfig.indexQuerySuggest();
    }

    @Override
    public String getAlgoliaId() {return algoliaId;}

    @Override
    public String getAlgoliaKey() {return algoliaKey;}

    public String getIndexInuse() {return indexInuse;}

    public String getIndexNmAsc() {return indexNmAsc;}

    public String getIndexNmDsc() {return indexNmDsc;}

    public String getIndexPrAsc() {return indexPrAsc;}

    public String getIndexPrDsc() {return indexPrDsc;}

    public String getIndexBs() {return indexBs;}

    public String getIndexContent() {return indexContent;}

    public String getIndexContentAsc() {return indexContentAsc;}

    public String getIndexContentDsc() {return indexContentDsc;}

    public String getIndexQuerySuggest() {return indexQuerySuggest;}
}
