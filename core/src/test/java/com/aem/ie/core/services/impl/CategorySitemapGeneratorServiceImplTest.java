package com.aem.ie.core.services.impl;

import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.CategorySitemapGeneratorConfig;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
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
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CategorySitemapGeneratorServiceImplTest {
    @Mock
    AssetManager assetManager;
    @Mock
    ValueFactory valueFactory;
    @Mock
    Session session;
    @Mock
    UpdatePersonalInfoService updatePersonalInfoService;
    @Mock
    Asset asset;
    @Mock
    Resource resource;
    @Mock
    ResourceResolver resourceResolver;
    @Mock
    ResourceResolverFactory resourceResolverFactory;
    @Mock
    CategorySitemapGeneratorConfig categorySiteMapGeneratorConfig;
    @InjectMocks
    CategorySitemapGeneratorServiceImpl categorySitemapGeneratorServiceImpl;

    // Mock the JSON data
    String json = "[{\n" +
            " \"category\" : {\n" +
            " \"categoryId\" : \"9288221d-c70a-431d-9bca-40678357af3c\",\n" +
            " \"name\" : \"Antennas\",\n" +
            " \"seoName\" : \"antennas\",\n" +
            " \"seoTagName\" : \"antennasss\",\n" +
            " \"webDescription\" : \"antennas\",\n" +
            " \"categoryPath\" : \"antennas\",\n" +
            " \"categoryUrl\" : \"antennas\",\n" +
            " \"thumbnailUrl\" : \"null\",\n" +
            " \"categorySeoUrl\" : \"antennas\",\n" +
            " \"childCategories\" : [ {\n" +
            " \"categoryId\" : \"327a8805-7799-42bb-bfb5-e044884e7656\",\n" +
            " \"name\" : \"Directional Antennas\",\n" +
            " \"seoName\" : \"directional-antennas\",\n" +
            " \"seoTagName\" : \"directional-antennas\", \n" +
            " \"categorySeoUrl\" : \"antennas|directional-antennas\",\n" +
            " \"childCategories\" : [ {\n" +
            " \"categoryId\" : \"0a49fb7c-60ff-4e65-a25c-f04d31f65d2d\",\n" +
            " \"name\" : \"Log Periodic Antennas\",\n" +
            " \"seoName\" : \"log-periodic-antennas\",\n" +
            " \"seoTagName\" : \"log-periodic-antennas\",\n" +
            " \"categorySeoUrl\" : \"antennas|directional-antennas|log-periodic-antennas\",\n" +
            " \"webDescription\" : \"Log Periodic Antennas\"\n" +
            "}]"+
            "}]"+
            "}\n" +
            "}]";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void activateTest(){
        categorySitemapGeneratorServiceImpl.activate(categorySiteMapGeneratorConfig);
    }

    @Test
    void generateCategorySiteMapTest() throws IOException, LoginException, RepositoryException {
        Map<String,Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE,"fm-service-user");
        when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
        when(categorySiteMapGeneratorConfig.categoryJsonPath()).thenReturn("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json");
        when(resourceResolver.getResource(any())).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        com.day.cq.dam.api.Rendition rendition = mock(com.day.cq.dam.api.Rendition.class);
        when(asset.getRendition("original")).thenReturn(rendition);
        when(asset.getOriginal()).thenReturn(rendition);
        InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        when(updatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(session.getValueFactory()).thenReturn(valueFactory);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        categorySitemapGeneratorServiceImpl.generateCategorySiteMap();
    }
}