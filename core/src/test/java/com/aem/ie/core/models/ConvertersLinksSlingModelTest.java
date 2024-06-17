package com.aem.ie.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.inject.Inject;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ConvertersLinksSlingModelTest {

    AemContext aemContext = new AemContext();

    ConvertersLinksSlingModel convertersLinksSlingModel;

    @Mock
    ConvertersLinksModel convertersLinksModel;
    @Inject
    Resource res;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(ConvertersLinksSlingModel.class);
        aemContext.addModelsForClasses(ConvertersLinksModel.class);
        aemContext.load().json("/com/aem/ie/core/models/ConverterLink.json","/content");
    }

    @Test
    void init() {
        aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","category","articledescription");
        res = aemContext.currentResource("/content");
        aemContext.request().setResource(res);
        convertersLinksSlingModel = aemContext.request().adaptTo(ConvertersLinksSlingModel.class);
        convertersLinksSlingModel.getConvertersLinksDetails();
        convertersLinksSlingModel.pageInfoUpdate(convertersLinksModel,"true");
    }
}