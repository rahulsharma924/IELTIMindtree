package com.aem.ie.core.models;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.inject.Inject;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
@TestInstance(value = TestInstance.Lifecycle.PER_CLASS)
class BlogPageModelTest {

    private final AemContext aemContext = new AemContext();
    BlogPageModel blogPageModel;

    @Inject
    Resource res;

    @BeforeAll
    void setUp() {
        aemContext.addModelsForClasses(BlogPageModel.class);
        aemContext.load().json("/com/aem/ie/core/models/Blogpage.json","/component");
        Page page = aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","cq:tags", "tag1","pageTitle","Title","blogCategory","test","author","blogAuthor","bloglink","bloglink");
        res = page.adaptTo(Resource.class);
        aemContext.request().setResource(res);
        blogPageModel = aemContext.request().adaptTo(BlogPageModel.class);
    }

    @Test
    void BlogLabelTest() throws InvalidTagFormatException {
        TagManager tagManager = aemContext.resourceResolver().adaptTo(TagManager.class);
        Tag tag1 = tagManager.createTag("test", "Tag 1 title", "Tag 1 desc");
        aemContext.currentResource(tag1.adaptTo(Resource.class));
        blogPageModel.getBloglabel();
    }

    @Test
    void getBlogauthor() {
        blogPageModel.getBlogauthor();
    }

    @Test
    void getBlogtitle() {
        blogPageModel.getBlogtitle();
    }

    @Test
    void getBlogimage() {
        blogPageModel.getBlogimage();
    }

    @Test
    void getBlogtext() {
        blogPageModel.getBlogtext();
    }

    @Test
    void getBloglabel() {
        blogPageModel.getBloglabel();
    }

    @Test
    void getFormattedDate() {
        blogPageModel.getFormattedDate();
    }
}
