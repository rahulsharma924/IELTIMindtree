package com.aem.ie.core.models;

import com.aem.ie.core.Service.AlgoliaConfigService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AlgoliaConfigModel {
    @OSGiService
    private AlgoliaConfigService algoliaConfigService;

    public String getAlgoliaId() {
        return algoliaConfigService.getAlgoliaId();
    }
    public String getAlgoliaKey() {
        return algoliaConfigService.getAlgoliaKey();
    }
    public String getIndexInuse() { return algoliaConfigService.getIndexInuse();}
    public String getIndexNmAsc() { return algoliaConfigService.getIndexNmAsc();}
    public String getIndexNmDsc() { return algoliaConfigService.getIndexNmDsc();}
    public String getIndexPrAsc() { return algoliaConfigService.getIndexPrAsc();}
    public String getIndexPrDsc() { return algoliaConfigService.getIndexPrDsc();}
    public String getIndexBs() { return algoliaConfigService.getIndexBs();}
    public String getIndexContent() { return algoliaConfigService.getIndexContent();}
    public String getIndexContentAsc() { return algoliaConfigService.getIndexContentAsc();}
    public String getIndexContentDsc() { return algoliaConfigService.getIndexContentDsc();}
    public String getIndexQuerySuggest() { return algoliaConfigService.getIndexQuerySuggest();}
}
