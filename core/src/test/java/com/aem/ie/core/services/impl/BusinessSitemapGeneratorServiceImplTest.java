package com.aem.ie.core.services.impl;

import com.aem.ie.core.configuration.BusinessSitemapGeneratorConfig;
import com.aem.ie.core.utils.SitemapUtils;
import com.day.cq.commons.Externalizer;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import org.apache.sling.api.resource.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.w3c.dom.Document;
import javax.jcr.Binary;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import java.io.FileInputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class BusinessSitemapGeneratorServiceImplTest {

    @Mock
    private ResourceResolverFactory resourceResolverFactory;

    @Mock
    private BusinessSitemapGeneratorConfig businessSitemapGeneratorConfig;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private AssetManager assetManager;

    @Mock
    private Externalizer externalizer;

    @Mock
    private Document document;
    @Mock
    ValueMap pageValueMap;
    @Mock
    Session session;
    @Mock
    ValueFactory valueFactory;
    @Mock
    private Binary binary;
@Mock
    FileInputStream fileInputStream;
    private BusinessSitemapGeneratorServiceImpl sitemapGeneratorService;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        sitemapGeneratorService = new BusinessSitemapGeneratorServiceImpl();
        sitemapGeneratorService.resourceResolverFactory = resourceResolverFactory;
        sitemapGeneratorService.businessSitemapGeneratorConfig = businessSitemapGeneratorConfig;
    }

    @Test
    public void testGenerateBusinessSiteMap() throws Exception {
        Resource rootResource = mock(Resource.class);
        Resource childResource = mock(Resource.class);
        Resource jcrNodeResource = mock(Resource.class);
        Binary binary1= mock(Binary.class);
        when(resourceResolverFactory.getServiceResourceResolver(anyMap())).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(businessSitemapGeneratorConfig.xmlPath()).thenReturn("/path/to/xml");
        when(session.getValueFactory()).thenReturn(valueFactory);

        when(document.createElement(anyString())).thenReturn(null);
        when(document.getDocumentElement()).thenReturn(null);
        when(document.createElement("urlset")).thenReturn(null);
        when(document.createAttribute(anyString())).thenReturn(null);
        when(externalizer.publishLink(eq(resourceResolver), anyString())).thenReturn("http://example.com");
        String[] blogPath={"/content/fm/en"};
        when(businessSitemapGeneratorConfig.businessPagesRootPaths()).thenReturn(blogPath);
        when(jcrNodeResource.getValueMap()).thenReturn(pageValueMap);
        when(resourceResolver.getResource("/content/fm/en")).thenReturn(rootResource);
        when(rootResource.hasChildren()).thenReturn(true);
        when(rootResource.getChild("jcr:content")).thenReturn(jcrNodeResource);
        when(rootResource.getPath()).thenReturn("/content/fm/en");
        when(childResource.getName()).thenReturn("childPage");
        when(childResource.getChild("jcr:content")).thenReturn(jcrNodeResource);

        Map<String, String> expectedResult = new HashMap<>();
        expectedResult.put("/content/fm/en", "2023-08-22");
        expectedResult.put("/content/fm/en/childPage", "2023-08-22");
        when(valueFactory.createBinary(fileInputStream)).thenReturn(binary1);
        sitemapGeneratorService.generateBusinessSiteMap();

        verify(resourceResolverFactory).getServiceResourceResolver(anyMap());
        verify(resourceResolver).commit();
        verify(resourceResolver).refresh();
        verify(assetManager).createOrUpdateAsset(eq("/path/to/xml"), any(), eq("application/xml"), eq(true));
    }

    @Test
    public void testGenerateBusinessSiteMapWithLoginException() throws Exception {
        when(resourceResolverFactory.getServiceResourceResolver(anyMap())).thenThrow(LoginException.class);

        sitemapGeneratorService.generateBusinessSiteMap();

        // Verify appropriate logging or exception handling behavior
    }

    @Test
    public void testGetNewsPageData() {
        Resource rootResource = mock(Resource.class);
        Resource childResource = mock(Resource.class);
        Resource jcrNodeResource = mock(Resource.class);
        when(resourceResolver.getResource(eq("/content/fm/en"))).thenReturn(rootResource);
        String[] blogPath={"/content/fm/en"};
        when(businessSitemapGeneratorConfig.businessPagesRootPaths()).thenReturn(blogPath);
       when(jcrNodeResource.getValueMap()).thenReturn(pageValueMap);
        when(rootResource.hasChildren()).thenReturn(true);
        when(rootResource.getChild("jcr:content")).thenReturn(jcrNodeResource);
        when(childResource.getName()).thenReturn("childPage");
        when(childResource.getChild("jcr:content")).thenReturn(jcrNodeResource);
        when(rootResource.getPath()).thenReturn("/content/fm/en/child");

        Map<String, String> expectedResult = new HashMap<>();
        expectedResult.put("/content/fm/en", "2023-08-22");
        expectedResult.put("/content/fm/en/childPage", "2023-08-22");

        Map<String, String> result = sitemapGeneratorService.getNewsPageData(resourceResolver);

    }
}
