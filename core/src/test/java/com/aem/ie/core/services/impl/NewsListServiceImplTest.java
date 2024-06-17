package com.aem.ie.core.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.NewsListService;
import com.aem.ie.core.configuration.NewsListConfig;
import com.aem.ie.core.models.NewsDetail;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class NewsListServiceImplTest {
	AemContext aemContext = new AemContext();
	
	NewsListService newsListService;
	@Mock
    QueryBuilder queryBuilder;
	@Mock
	PredicateGroup predicateGroup;
	@Mock
	NewsListConfig newsListConfig;
	@Mock
	ResourceResolver resourceResolver;
	@Mock
	PageManager pageManager;
	@Mock
	Session session;
	@Mock
	Query query;
	@Mock
	SearchResult searchResult;
	@Mock
	Hit hit;
	@Mock
    Resource resource;
	@Mock
	Resource pageRes;
	@Mock
	Page currentPage;
	@Mock
	ValueMap pageResValueMap;
	@Mock
	Date newsDateValue;
	@Mock
	NewsDetail newsDetail;
	@Mock
	HashSet<String> resultPaths;
	@Mock
	List<NewsDetail> latestNewsList;
	@Mock
	ValueMap pageValueMap;
	@Mock
	TagManager tagManager;
	@Mock
	Tag tag;
	@Mock
	Date newsDateValue1;
	
	@InjectMocks
	NewsListServiceImpl newsListServiceImpl=new NewsListServiceImpl();
	
	HashSet<String> pagePaths = new HashSet<>();
	
	String newsDetailPath="/jcr:content/root/container/news_detail";
	
    String newsRootPath="/content/fm/en/newsReleases";
    @BeforeEach
    void setUp() {
		MockitoAnnotations.openMocks(this);
		
	  }
	
	@Test
	void getNewsRootPathTest() {
		newsListServiceImpl.getNewsRootPath();
	}
	@Test
	void getNewsDetailPathTest() {
		NewsListConfig newsListConfig = mock(NewsListConfig.class);
		when(newsListConfig.getNewsDetailPath()).thenReturn("/jcr:content/root/container/news_detail");
		when(newsListConfig.getNewsRootPath()).thenReturn("/content/fm/en/newsReleases");
		newsListServiceImpl.activate(newsListConfig);
		assertEquals(newsListServiceImpl.getNewsDetailPath(),newsDetailPath);
	}
    @Test
    void getNewsListTest() throws RepositoryException {
    	NewsListConfig newsListConfig = mock(NewsListConfig.class);
    	when(newsListConfig.getNewsDetailPath()).thenReturn("/jcr:content/root/container/news_detail");
    	newsListServiceImpl.activate(newsListConfig);
    	String queryPath="querypathval";
    	String path="/content/fm/en/newsReleases";
    	String nodepath="/content/fm/en/newsReleases/jcr:content/root/container/news_detail";
    	Query query=mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery( any(), any() ) ).thenReturn( query );
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getPath()).thenReturn(path);
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(resourceResolver.getResource(path)).thenReturn(pageRes);
        when(pageManager.getContainingPage(pageRes)).thenReturn(currentPage);
        when(currentPage.getProperties()).thenReturn(pageResValueMap);
        when(resourceResolver.getResource(nodepath)).thenReturn(resource);
        when(pageResValueMap.get("pageTitle", String.class)).thenReturn("newrelease");
        when(pageResValueMap.get("publishDate", Date.class)).thenReturn(newsDateValue);
        newsListServiceImpl.getNewsList(queryPath,resourceResolver);
    	
    }
    @Test
    void getLatestNewsListTest() throws RepositoryException {
    	NewsListConfig newsListConfig = mock(NewsListConfig.class);
    	when(newsListConfig.getNewsDetailPath()).thenReturn("/jcr:content/root/container/news_detail");
    	newsListServiceImpl.activate(newsListConfig);
    	String queryPath="querypathval";
    	String path="/content/fm/en/newsReleases";
    	String nodepath="/content/fm/en/newsReleases/jcr:content/root/container/news_detail";
    	Query query=mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery( any(), any() ) ).thenReturn( query );
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getPath()).thenReturn(path);
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(resourceResolver.getResource(path)).thenReturn(pageRes);
        when(pageManager.getContainingPage(pageRes)).thenReturn(currentPage);
        when(currentPage.getProperties()).thenReturn(pageResValueMap);
        when(resourceResolver.getResource(nodepath)).thenReturn(resource);
        when(resource.getValueMap()).thenReturn(pageValueMap);
        when(pageResValueMap.get("pageTitle", String.class)).thenReturn("news_detail");
        when(pageResValueMap.get("newsLabel", String.class)).thenReturn("new-lable");
        when(resource.getResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(TagManager.class)).thenReturn(tagManager);
        when(pageResValueMap.get("publishDate", Date.class)).thenReturn(newsDateValue1);
        newsListServiceImpl.getLatestNewsList(queryPath, resourceResolver);
    }
}
