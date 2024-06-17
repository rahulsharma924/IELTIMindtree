package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.ProductSitemapGeneratorConfig;
import com.day.cq.commons.Externalizer;
import com.day.cq.dam.api.AssetManager;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.jcr.*;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;

public class ProductSiteMapGeneratorServiceImplTest {
	@Mock
	Externalizer externalizer;
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
	ProductSitemapGeneratorServiceImpl productSiteMapGeneratorServiceImpl=new ProductSitemapGeneratorServiceImpl();
	 @BeforeEach
	    void setUp() {
			MockitoAnnotations.openMocks(this);
			
		  }
		
		@Test
		void activateTest() {
			productSiteMapGeneratorServiceImpl.activate(productSiteMapGeneratorConfig);
		}
		@Test
		void generateProductSiteMapTest() throws IOException, LoginException, UnsupportedRepositoryOperationException, RepositoryException {
			Map<String, Object> paramMap = new HashMap<>();
            paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
            when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
            when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
			when(productSiteMapGeneratorConfig.applicationId()).thenReturn("testing20MRCI4146");
			when(productSiteMapGeneratorConfig.apiKey()).thenReturn("9c0405dc100de0831e5d1186ccd36fe4");
			when(productSiteMapGeneratorConfig.indexName()).thenReturn("fm_product_en_qa");
			when(productSiteMapGeneratorConfig.xmlPath()).thenReturn("/content/fm/en/sitemap_product.xml");
			when(productSiteMapGeneratorConfig.lastModifiedDate()).thenReturn("2023-07-11");
			when(updatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
            when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(externalizer);
            when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
            when(session.getValueFactory()).thenReturn(valueFactory);
            productSiteMapGeneratorServiceImpl.generateProductSiteMap();
		}
		@Test
		void createURLTest() throws NoSuchMethodException, SecurityException {
			Method privateMethod = ProductSitemapGeneratorServiceImpl.class.getDeclaredMethod("createUrl",Object.class,StringBuilder.class);
	        privateMethod.setAccessible(true);
		}
		
}
