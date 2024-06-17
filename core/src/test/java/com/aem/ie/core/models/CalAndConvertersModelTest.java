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
class CalAndConvertersModelTest {
    private final AemContext aemContext = new AemContext();
    CalAndConvertersModel calAndConvertersModel;
    @BeforeAll
    void setUp() {
        aemContext.addModelsForClasses(CalAndConvertersModel.class);
        aemContext.load().json("/com/aem/ie/core/models/ConverterLink.json","/content");
        aemContext.currentResource("/content/link");
        calAndConvertersModel = aemContext.request().getResource().adaptTo(CalAndConvertersModel.class);
    }
    @Test
    void setResourceLink() {
        calAndConvertersModel.setResourceLink("/content/fm/en");
        assertEquals("/content/fm/en", calAndConvertersModel.getResourceLink());
    }
    @Test
    void getResourceLink() {
        assertEquals("/content/fm/en", calAndConvertersModel.getResourceLink());
    }


    @Test
    void setShowCustom() {
        calAndConvertersModel.setShowCustom("true");
        assertEquals("true", calAndConvertersModel.getShowCustom());
    }
    @Test
    void getShowCustom() {
        assertEquals("true", calAndConvertersModel.getShowCustom());
    }

    @Test
    void setTitle() {
        calAndConvertersModel.setTitle("New Title");
        assertEquals("New Title", calAndConvertersModel.getTitle());
    }

    @Test
    void getTitle() {
        assertEquals("New Title", calAndConvertersModel.getTitle());
    }

    @Test
    void setDescription() {
        calAndConvertersModel.setDescription("New Description");
        assertEquals("New Description", calAndConvertersModel.getDescription());
    }

    @Test
    void getDescription() {
        assertEquals("New Description", calAndConvertersModel.getDescription());
    }

    @Test
    void setCategory() {
        calAndConvertersModel.setCategory("New Category");
        assertEquals("New Category", calAndConvertersModel.getCategory());
    }

    @Test
    void getCategory() {
        assertEquals("New Category", calAndConvertersModel.getCategory());
    }


}