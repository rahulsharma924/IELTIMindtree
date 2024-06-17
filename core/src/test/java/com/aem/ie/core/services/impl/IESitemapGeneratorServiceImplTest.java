package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.IESitemapGeneratorConfig;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.LoginException;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class IESitemapGeneratorServiceImplTest {

    @Mock
    AssetManager assetManager;
    @Mock
    ValueFactory valueFactory;
    @Mock
    UpdatePersonalInfoService updatePersonalInfoService;
    @Mock
    Hit hit;
    @Mock
    QueryBuilder queryBuilder;
    @Mock
    Session session;
    @Mock
    ResourceResolver resourceResolver;
    @Mock
    ResourceResolverFactory resourceResolverFactory;
    @Mock
    IESitemapGeneratorConfig ieSitemapGeneratorConfig;
    @InjectMocks
    IESitemapGeneratorServiceImpl ieSitemapGeneratorServiceImpl;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void activateTest(){
        ieSitemapGeneratorServiceImpl.activate(ieSitemapGeneratorConfig);
    }

    @Test
    void generateIESiteMapTest() throws IOException, LoginException, RepositoryException {
        Map<String,Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE,"fm-service-user");
        when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
        Query query=mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(queryBuilder.createQuery(any(),any())).thenReturn(query);
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getPath()).thenReturn("/content/fm/sitemap-news.xml");
        when(updatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
        when(session.getValueFactory()).thenReturn(valueFactory);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        ieSitemapGeneratorServiceImpl.generateIESiteMap();
    }
}