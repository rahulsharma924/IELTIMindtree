package com.aem.ie.core.models;


import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class})
class PDFMetaDataModelTest {
    private final AemContext aemContext = new AemContext();
    PDFMetaDataModel PDFMetaDataModel = new PDFMetaDataModel();
    @Test
    void setTitle() {
        String title = "title";
        PDFMetaDataModel.setTitle(title);
        assertEquals(title, PDFMetaDataModel.getTitle());
    }

    @Test
    void setDescription() {
        String description = "description";
        PDFMetaDataModel.setDescription(description);
        assertEquals(description, PDFMetaDataModel.getDescription());
    }

    @Test
    void setUrl() {
        String url = "url";
        PDFMetaDataModel.setUrl(url);
        assertEquals(url, PDFMetaDataModel.getUrl());
    }

    @Test
    void init() {
        aemContext.create().asset("/content/dam/fm/sample.pdf",1600,900,"application/pdf");
        MockSlingHttpServletRequest request = aemContext.request();
        aemContext.request().setPathInfo("/content/fm/en/about-us.html/content/dam/fm/sample.pdf");
        PDFMetaDataModel = aemContext.request().adaptTo(PDFMetaDataModel.class);
        PDFMetaDataModel.request = aemContext.request();
    }
}

