package com.aem.ie.core.models;

import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.resourceresolver.MockResourceResolverFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.Answer;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TechnicalArticleModelTest {

    private final AemContext aemContext=new AemContext(ResourceResolverType.JCR_MOCK);

    TechnicalArticleModel technicalArticleModel;

    @Inject
    Resource res;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(TechnicalArticleModel.class);
        aemContext.load().json("/com/aem/ie/core/models/TechnicalArticleModel.json","/resource");
    }

    @Test
    void init() throws LoginException {
        //create a page with page properties
        aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","jcr:description","articledescription");
        res = aemContext.currentResource("/resource");
        aemContext.request().setResource(res);
        technicalArticleModel = aemContext.request().adaptTo(TechnicalArticleModel.class);
        technicalArticleModel.getResourcesdetails();
    }

}