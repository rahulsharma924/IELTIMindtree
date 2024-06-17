package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.BlogSitemapGeneratorConfig;
import com.aem.ie.core.configuration.NewsSitemapGeneratorConfig;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class})
class BlogSitemapGeneratorServiceImplTest {
    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    @Mock
    UpdatePersonalInfoService updatePersonalInfoService;
    @Mock
    AssetManager assetManager;
    @Mock
    Session session;
    @Mock
    ValueFactory valueFactory;
    @Mock
    ResourceResolver resourceResolver;
    @Mock
    ResourceResolverFactory resourceResolverFactory;
    @Mock
    BlogSitemapGeneratorConfig blogSitemapGeneratorConfig;
    @InjectMocks
    BlogSitemapGeneratorServiceImpl blogSitemapGeneratorServiceImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void activateTest(){
        blogSitemapGeneratorServiceImpl.activate(blogSitemapGeneratorConfig);
    }

    @Test
    void generateBlogSiteMap() throws IOException, LoginException, RepositoryException {
        Page page = aemContext.create().page("/content/fm/en/meganavigation/tools-resources/technical-resources/blog");
        Resource resource = page.adaptTo(Resource.class);
        Resource blogRootPageJcrNode = resource.getChild("jcr:content");
        blogRootPageJcrNode.adaptTo(Node.class).setProperty("cq:lastModified","xyz");
        Page page1 = aemContext.create().page("/content/fm/en/meganavigation/tools-resources/technical-resources/blog/test1");
        Resource resource1 = page1.adaptTo(Resource.class);
        Resource blogPageJcrNode = resource1.getChild("jcr:content");
        blogPageJcrNode.adaptTo(Node.class).setProperty("cq:lastModified","xyz");
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
        when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
        when(resourceResolver.getResource(blogSitemapGeneratorConfig.blogRootPath())).thenReturn(resource);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getValueFactory()).thenReturn(valueFactory);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(updatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
        blogSitemapGeneratorServiceImpl.generateBlogSiteMap();
    }

}