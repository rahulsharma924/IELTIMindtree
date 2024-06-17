/*
package com.aem.ie.core.services.impl;

import com.aem.ie.core.configuration.CategorySiteMapGeneratorConfig;
import com.aem.ie.core.configuration.ProductSiteMapGeneratorConfig;
import com.day.cq.commons.Externalizer;
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
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class})
class ProductCategorySitemapGeneratorServiceImplTest {
    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    @InjectMocks
    ProductCategorySitemapGeneratorServiceImpl productCategorySitemapGeneratorServiceImpl=new ProductCategorySitemapGeneratorServiceImpl();
    @Mock
    CategorySiteMapGeneratorConfig categorySiteMapGeneratorConfig;
    @Mock
    ResourceResolverFactory resourceResolverFactory;
    @Mock
    ResourceResolver resourceResolver;
    @Mock
    AssetManager assetManager;
    @Mock
    Externalizer externalizer;
    @Mock
    Session session;
    @Mock
    ValueFactory valueFactory;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        aemContext.load().json("/com/aem/ie/core/models/Categories.json","/resource");
    }

    @Test
    void activate() {
        productCategorySitemapGeneratorServiceImpl.activate(categorySiteMapGeneratorConfig);
    }

    @Test
    void generateProductCategorySiteMap() throws LoginException, RepositoryException, IOException {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
        when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(categorySiteMapGeneratorConfig.categoryJsonPath()).thenReturn("O0PAXP3VI5");
        when(categorySiteMapGeneratorConfig.lastModifiedDate()).thenReturn("dda2366f016f16279863c2ac2d068d8c");
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(externalizer);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getValueFactory()).thenReturn(valueFactory);
        productCategorySitemapGeneratorServiceImpl.generateProductCategorySiteMap();
    }


    */
/*@Test
    void generateProductCategorySiteMapTest() throws LoginException, RepositoryException, IOException {
        Date date = new Date();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
        when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);

        //when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(categorySiteMapGeneratorConfig.categoryJsonPath()).thenReturn("/com/aem/ie/core/models/Categories.json");
        when(categorySiteMapGeneratorConfig.lastModifiedDate()).thenReturn(date.toString());
        *//*
*/
/*when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(externalizer);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getValueFactory()).thenReturn(valueFactory);*//*
*/
/*
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json",1600,900,"application/json");

        Resource res= aemContext.currentResource("/resource");
        //Asset asset = res.adaptTo(Asset.class);
        //Resource original = asset.getOriginal();
        InputStream content = res.adaptTo(InputStream.class);
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json",content,"application/json");
        aemContext.request().setResource(res);
        when(resourceResolver.getResource(Mockito.any())).thenReturn(res);
        productCategorySitemapGeneratorServiceImpl.activate(categorySiteMapGeneratorConfig);
        productCategorySitemapGeneratorServiceImpl.generateProductCategorySiteMap();
    }*//*

}*/
