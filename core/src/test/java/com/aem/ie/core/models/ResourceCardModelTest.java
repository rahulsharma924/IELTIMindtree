package com.aem.ie.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
@TestInstance(value = TestInstance.Lifecycle.PER_CLASS)
class ResourceCardModelTest {

    AemContext aemContext =  new AemContext();

    ResourceCardModel resourceCardModel;
    @BeforeAll
    void setUp() {
        aemContext.addModelsForClasses(ResourceCardModel.class);
        aemContext.load().json("/com/aem/ie/core/models/ResourceCard.json","/component");
        aemContext.currentResource("/component");
        resourceCardModel = aemContext.request().getResource().adaptTo(ResourceCardModel.class);
    }

    @Test
    void testResourceCradModel(){
        resourceCardModel.setResourceLink("/content/fm/en");
        assertEquals("/content/fm/en", resourceCardModel.getResourceLink());
        resourceCardModel.setDescription("Description");
        assertEquals("Description", resourceCardModel.getDescription());
        resourceCardModel.setTitle("Title");
        assertEquals("Title", resourceCardModel.getTitle());
        resourceCardModel.setCtatitle("CTA");
        assertEquals("CTA", resourceCardModel.getCtatitle());
        resourceCardModel.setImage("/content/fm/en/image");
        assertEquals("/content/fm/en/image", resourceCardModel.getImage());
        resourceCardModel.setShowCustom("true");
        assertEquals("true", resourceCardModel.getShowCustom());
        resourceCardModel.setResourceheading("Heading");
        assertEquals("Heading", resourceCardModel.getResourceheading());
        resourceCardModel.setEnablePdfIcon(false);
        resourceCardModel.getEnablePdfIcon();
    }

}