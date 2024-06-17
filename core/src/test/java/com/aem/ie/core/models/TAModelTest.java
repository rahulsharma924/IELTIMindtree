package com.aem.ie.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TAModelTest {
    private final AemContext aemContext = new AemContext();
    TAModel taModel = new TAModel();
    @BeforeAll
    void setUp() {
        aemContext.addModelsForClasses(TAModel.class);
        aemContext.load().json("/com/aem/ie/core/models/TAItem.json","/content");
        aemContext.currentResource("/content/taItem");
        taModel = aemContext.request().getResource().adaptTo(TAModel.class);
    }

    @Test
    void setLinktext() {
        taModel.setLinktext("View Now");
        assertEquals("View Now", taModel.getLinktext());
    }
    @Test
    void getLinktext() {
        assertEquals("View Now", taModel.getLinktext());
    }

    @Test
    void setEnableHeading() {
        taModel.setEnableHeading("false");
        assertEquals("false", taModel.getEnableHeading());
    }

    @Test
    void getEnableHeading() {
        assertEquals("false", taModel.getEnableHeading());
    }

    @Test
    void setArticlelink() {
        taModel.setArticlelink("/content/fm/en/article");
        assertEquals("/content/fm/en/article", taModel.getArticlelink());
    }

    @Test
    void getArticlelink() {
        assertEquals("/content/fm/en/article", taModel.getArticlelink());
    }

    @Test
    void setArticletitle() {
        taModel.setArticletitle("Article Title");
        assertEquals("Article Title", taModel.getArticletitle());
    }

    @Test
    void getArticletitle() {
        assertEquals("Article Title", taModel.getArticletitle());
    }

    @Test
    void setArticledescription() {
        taModel.setArticledescription("Article Description");
        assertEquals("Article Description", taModel.getArticledescription());
    }
    @Test
    void getArticledescription() {
        assertEquals("Article Description", taModel.getArticledescription());
    }


}