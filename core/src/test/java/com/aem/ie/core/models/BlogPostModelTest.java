package com.aem.ie.core.models;

import com.adobe.granite.asset.api.AssetManager;
import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class BlogPostModelTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    BlogPostModel blogPostModel;
    @Mock
    private ResourceResolver resourceResolver;
    @Mock
    private AssetManager assetManager;
    @Inject
    Resource res;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(BlogPostModel.class);
        aemContext.assetManager();
        aemContext.load().json("/com/aem/ie/core/models/BlogPostModel.json","/resource");
    }



    @Test
    void init() throws InvalidTagFormatException, RepositoryException {
        TagManager tagManager = aemContext.resourceResolver().adaptTo(TagManager.class);


        Tag tag = tagManager.createTag("testcategory","testcategory","testcategory");
        Page page = aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","blogCategory","testcategory","author","testAuthor");
        Node nodeNew = page.adaptTo(Node.class);
        Node childNode = nodeNew.addNode("jcr:content/root/container/blogpage");
        childNode.setProperty("blogtext", "shortdesc shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc");
        res = aemContext.currentResource("/resource/testone");
        aemContext.request().setResource(res);
        blogPostModel = aemContext.request().adaptTo(BlogPostModel.class);
        blogPostModel.resourceResolver=resourceResolver;
        blogPostModel.getHeading();
        blogPostModel.getSubHeading();
        blogPostModel.getBlogPosts();
        blogPostModel.getBlogPostList();
    }

    @Test
    void init1() throws InvalidTagFormatException, RepositoryException {
        TagManager tagManager = aemContext.resourceResolver().adaptTo(TagManager.class);
        Tag tag = tagManager.createTag("testcategory","testcategory","testcategory");
        Page page = aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","blogCategory","testcategory","author","testAuthor");
        Node nodeNew = page.adaptTo(Node.class);
        Node childNode = nodeNew.addNode("jcr:content/root/container/blogpage");
        childNode.setProperty("blogtext", "shortdesc shortdesc shortdesc  shortdesc  shortdesc" +
                " shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc");
        res = aemContext.currentResource("/resource/testone");
        aemContext.request().setResource(res);
        blogPostModel = aemContext.request().adaptTo(BlogPostModel.class);
        blogPostModel.getHeading();
        blogPostModel.getSubHeading();
        blogPostModel.getBlogPosts();
        blogPostModel.getBlogPostList();
    }

    @Test
    void initSecondTest() throws InvalidTagFormatException, RepositoryException {
        TagManager tagManager = aemContext.resourceResolver().adaptTo(TagManager.class);
        Tag tag = tagManager.createTag("testcategory","testcategory","testcategory");
        Page page = aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","blogCategory","testcategory","author","testAuthor");
        Node nodeNew = page.adaptTo(Node.class);
        Node childNode = nodeNew.addNode("jcr:content/root/container/blogpage");
        childNode.setProperty("blogtext", "shortdesc shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc  shortdesc");
        res = aemContext.currentResource("/resource/testtwo");
        aemContext.request().setResource(res);
        blogPostModel = aemContext.request().adaptTo(BlogPostModel.class);
    }
}