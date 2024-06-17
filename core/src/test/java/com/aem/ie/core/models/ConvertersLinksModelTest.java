package com.aem.ie.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith({AemContextExtension.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ConvertersLinksModelTest {
    private final AemContext aemContext = new AemContext();

    ConvertersLinksModel convertersLinksModel;
    @BeforeAll
    void setUp() {
        aemContext.addModelsForClasses(ConvertersLinksModel.class);
        aemContext.load().json("/com/aem/ie/core/models/ConverterLink.json","/content");
        aemContext.currentResource("/content/link");
        convertersLinksModel = aemContext.request().getResource().adaptTo(ConvertersLinksModel.class);
    }

    @Test
    void setResourceLink() {
        convertersLinksModel.setResourceLink("/content/fm/en");
        assertEquals("/content/fm/en", convertersLinksModel.getResourceLink());
    }
    @Test
    void getResourceLink() {
        assertEquals("/content/fm/en", convertersLinksModel.getResourceLink());
    }


    @Test
    void setShowCustom() {
        convertersLinksModel.setShowCustom("true");
        assertEquals("true", convertersLinksModel.getShowCustom());
    }
    @Test
    void getShowCustom() {
        assertEquals("true", convertersLinksModel.getShowCustom());
    }

    @Test
    void setTitle() {
        convertersLinksModel.setTitle("New Title");
        assertEquals("New Title", convertersLinksModel.getTitle());
    }

    @Test
    void getTitle() {
        assertEquals("New Title", convertersLinksModel.getTitle());
    }

    @Test
    void setDescription() {
        convertersLinksModel.setDescription("New Description");
        assertEquals("New Description", convertersLinksModel.getDescription());
    }

    @Test
    void getDescription() {
        assertEquals("New Description", convertersLinksModel.getDescription());
    }

    @Test
    void setCategory() {
        convertersLinksModel.setCategory("New Category");
        assertEquals("New Category", convertersLinksModel.getCategory());
    }

    @Test
    void getCategory() {
        assertEquals("New Category", convertersLinksModel.getCategory());
    }


}