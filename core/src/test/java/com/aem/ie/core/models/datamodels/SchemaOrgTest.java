package com.aem.ie.core.models.datamodels;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class SchemaOrgTest {
    SchemaOrg schemaOrg = new SchemaOrg();
    @Test
    void setBlogAuthor() {
        schemaOrg.setBlogAuthor("Blog Author");
        assertEquals("Blog Author", schemaOrg.getBlogAuthor());
    }
    @Test
    void setNewsArticleBody() {
        schemaOrg.setNewsArticleBody("News Article Body");
        assertEquals("News Article Body", schemaOrg.getNewsArticleBody());
    }

    @Test
    void setNewsArticleSection() {
        schemaOrg.setNewsArticleSection("News Article Section");
        assertEquals("News Article Section", schemaOrg.getNewsArticleSection());
    }

    @Test
    void setNewsArticleTitle() {
        schemaOrg.setNewsArticleTitle("News Article Title");
        assertEquals("News Article Title", schemaOrg.getNewsArticleTitle());
    }

    @Test
    void setBlogPost() {
        schemaOrg.setBlogPost("Blog Post Body");
        assertEquals("Blog Post Body", schemaOrg.getBlogPost());
    }

    @Test
    void setDatePublished() {
        schemaOrg.setDatePublished("23 April, 2023");
        assertEquals("23 April, 2023", schemaOrg.getDatePublished());
    }

    @Test
    void setImage() {
        schemaOrg.setImage("/content/image");
        assertEquals("/content/image", schemaOrg.getImage());
    }
    @Test
    void setImageAltText() {
        schemaOrg.setImageAltText("Image Alt Text");
        assertEquals("Image Alt Text", schemaOrg.getImageAltText());
    }

}