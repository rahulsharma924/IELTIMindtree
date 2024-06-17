package com.aem.ie.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith({AemContextExtension.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IRModelTest {
    private final AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    IRModel irModel = new IRModel();

    @BeforeAll
    void setUp() {
        aemContext.addModelsForClasses(IRModel.class);
       aemContext.load().json("/com/aem/ie/core/models/IR.json","/component");
        aemContext.currentResource("/component/irItem");
        irModel = aemContext.request().getResource().adaptTo(IRModel.class);
    }


    @Test
    void setLabelname() {
        String labelName = "labelName";
        irModel.setLabelname(labelName);
        assertEquals(labelName, irModel.getLabelname());
    }
    @Test
    void getLabelname() {
        assertEquals("labelname", irModel.getLabelname());
    }

    @Test
    void getEnableHeading() {
        assertEquals("true", irModel.getEnableHeading());
    }

    @Test
    void getTitle() {
        assertEquals("title", irModel.getTitle());
    }

    @Test
    void getDescription() {
        assertEquals("description", irModel.getDescription());
    }

    @Test
    void getImage() {
        assertEquals("/content/dam/fm", irModel.getImage());
    }

    @Test
    void getPdftitle() {
        assertEquals("View PDF", irModel.getPdftitle());
    }
    /*@Test
    void getIconimagepath() {
        assertEquals("/content/dam/fm/pdf.svg", irModel.getIconimagepath());
    }*/

    @Test
    void getPdflink() {assertEquals("/content/fm/en/article/sample-article-2", irModel.getPdflink());}

    @Test
    void getListFrom() {
        String listForm = "/content/fm";
        irModel.setListFrom(listForm);
        assertEquals(listForm, irModel.getListFrom());
    }

    @Test
    void setListFrom() {
        String listForm = "/content/fm";
        irModel.setListFrom(listForm);
        assertEquals(listForm, irModel.getListFrom());
    }

    @Test
    void setEnableHeading() {
        String enableHeading = "true";
        irModel.setEnableHeading(enableHeading);
        assertEquals(enableHeading, irModel.getEnableHeading());
    }

    @Test
    void setTitle() {
        String title = "title";
        irModel.setTitle(title);
        assertEquals(title, irModel.getTitle());
    }

    @Test
    void setDescription() {
        String description = "description";
        irModel.setDescription(description);
        assertEquals(description, irModel.getDescription());
    }

    @Test
    void setImage() {
        String image = "/content/dam/fm";
        irModel.setImage(image);
        assertEquals(image, irModel.getImage());
    }

    @Test
    void setPdftitle() {
        String pdfTitle = "View PDF";
        irModel.setPdftitle(pdfTitle);
        assertEquals(pdfTitle, irModel.getPdftitle());
    }

    @Test
    void setPdflink() {
        String pdfLink = "/content/fm/en/article/sample-article-2";
        irModel.setPdflink(pdfLink);
        assertEquals(pdfLink, irModel.getPdflink());
    }
    @Test
    void setIconimagepath() {
        String iconimagepath = "/content/dam/fm/pdf.svg";
        irModel.setIconimagepath(iconimagepath);
        assertEquals(iconimagepath, irModel.getIconimagepath());
    }
}