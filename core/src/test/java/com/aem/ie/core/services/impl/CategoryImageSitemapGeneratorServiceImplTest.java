package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.CategoryImageSitemapGeneratorConfig;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
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
class CategoryImageSitemapGeneratorServiceImplTest {
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
    CategoryImageSitemapGeneratorConfig categoryImageSitemapGeneratorConfig;
    @InjectMocks
    CategoryImageSitemapGeneratorServiceImpl categoryImageSitemapGeneratorServiceImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void activateTest(){
        categoryImageSitemapGeneratorServiceImpl.activate(categoryImageSitemapGeneratorConfig);
    }

    @Test
    void generateCategoryImageSiteMap() throws IOException, LoginException, RepositoryException {
        Asset asset = aemContext.create().asset("/content/dam/infinite-electronics/images/fairview-microwave/home-page-category",1600,900,"application/pdf");
        Asset asset1 = aemContext.create().asset("/content/dam/infinite-electronics/images/fairview-microwave/home-page-category/test1",1600,900,"application/pdf");
        Resource resource1 = asset1.adaptTo(Resource.class);
        Resource imageItemJcrNode = resource1.getChild("jcr:content");
        imageItemJcrNode.adaptTo(Node.class).setProperty("cq:lastModified","xyz");
        imageItemJcrNode.adaptTo(Node.class).setProperty("jcr:lastModified","01-01-2023");
        Resource resource = asset.adaptTo(Resource.class);
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
        when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
        when(resourceResolver.getResource(categoryImageSitemapGeneratorConfig.categoryImageRootPath())).thenReturn(resource);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getValueFactory()).thenReturn(valueFactory);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(updatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
        categoryImageSitemapGeneratorServiceImpl.generateCategoryImageSiteMap();
    }

}