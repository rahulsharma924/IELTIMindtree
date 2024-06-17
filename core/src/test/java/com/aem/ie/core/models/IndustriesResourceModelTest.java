package com.aem.ie.core.models;

import com.day.cq.dam.api.Asset;
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
class IndustriesResourceModelTest {

    private final AemContext aemContext=new AemContext();

    IndustriesResourceModel industriesResourceModel;

    @Inject
    Resource res;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(IndustriesResourceModel.class);
        aemContext.load().json("/com/aem/ie/core/models/ResourceDetails.json","/resource");
    }

    @Test
    void init() throws LoginException {
        aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","category","service-cards-clientlib");
        res = aemContext.currentResource("/resource");
        aemContext.request().setResource(res);
        industriesResourceModel = aemContext.request().adaptTo(IndustriesResourceModel.class);
        industriesResourceModel.getResourcesdetails();
    }

    @Test
    void initAssetInfoUpdate() throws LoginException {
        aemContext.create().asset("/content/dam/fm/product/datasheets/test.pdf",1600,900,"application/pdf");
        res = aemContext.currentResource("/resource");
        aemContext.request().setResource(res);
        industriesResourceModel = aemContext.request().adaptTo(IndustriesResourceModel.class);
        industriesResourceModel.getResourcesdetails();
    }
}