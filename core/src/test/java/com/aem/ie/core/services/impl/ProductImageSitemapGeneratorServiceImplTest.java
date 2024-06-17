package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.ProductSitemapGeneratorConfig;
import com.day.cq.dam.api.AssetManager;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class ProductImageSitemapGeneratorServiceImplTest {
    @Mock
    UpdatePersonalInfoService updatePersonalInfoService;
    @Mock
    ProductSitemapGeneratorConfig productSiteMapGeneratorConfig;
    @Mock
    ResourceResolverFactory resourceResolverFactory;
    @Mock
    ResourceResolver resourceResolver;
    @Mock
    AssetManager assetManager;
    @Mock
    Session session;
    @Mock
    ValueFactory valueFactory;
    @InjectMocks
    ProductImageSitemapGeneratorServiceImpl productImageSitemapGeneratorServiceImpl;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void activateTest() {
        productImageSitemapGeneratorServiceImpl.activate(productSiteMapGeneratorConfig);
    }
    @Test
    void generateProducDatasheetPdfSitemapTest() throws LoginException, RepositoryException, IOException {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
        when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(productSiteMapGeneratorConfig.applicationId()).thenReturn("testing20MRCI4146");
        when(productSiteMapGeneratorConfig.apiKey()).thenReturn("9c0405dc100de0831e5d1186ccd36fe4");
        when(productSiteMapGeneratorConfig.indexName()).thenReturn("fm_product_en_qa");
        when(productSiteMapGeneratorConfig.xmlPath()).thenReturn("/content/fm/en/sitemap_product.xml");
        when(productSiteMapGeneratorConfig.lastModifiedDate()).thenReturn("2023-07-11");
        when(productSiteMapGeneratorConfig.productImageXmlPath()).thenReturn("/content/fm/sitemap_productimage.xml");
        when(productSiteMapGeneratorConfig.productImageRootPath()).thenReturn("/content/dam/infinite-electronics/product-assets/fairview-microwave/images/");
        when(updatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getValueFactory()).thenReturn(valueFactory);
        productImageSitemapGeneratorServiceImpl.generateProductImageSiteMap();
    }
}