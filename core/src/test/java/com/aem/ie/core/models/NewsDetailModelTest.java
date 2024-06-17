package com.aem.ie.core.models;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.inject.Inject;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class NewsDetailModelTest {

    AemContext aemContext = new AemContext();

    NewsDetailModel newsDetailModel;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(NewsDetailModel.class);
        aemContext.create().page("/content/fm/en/news-releases","/conf/fm/settings/wcm/templates/home-page");
        Page page = aemContext.create().page("/content/fm/en/news-releases/testpage","/conf/fm/settings/wcm/templates/home-page","pageTitle","title","newsLabel","label");
        aemContext.request().setResource(page.adaptTo(Resource.class));
        newsDetailModel = aemContext.request().adaptTo(NewsDetailModel.class);

    }

    @Test
    void newsDetailsModelTestClass() {
        newsDetailModel.getNewsContent();
        newsDetailModel.getNewsDate();
        newsDetailModel.getNewsTitle();
        newsDetailModel.getBackButtonUrl();
    }

    @Test
    void getNewsLabel() throws InvalidTagFormatException {
        TagManager tagManager = aemContext.resourceResolver().adaptTo(TagManager.class);
        Tag tag = tagManager.createTag("label","label","first tag");
        aemContext.currentResource(tag.adaptTo(Resource.class));
        newsDetailModel.getNewsLabel();
    }
}