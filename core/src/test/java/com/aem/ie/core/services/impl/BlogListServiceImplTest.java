package com.aem.ie.core.services.impl;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.Property;
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

import com.aem.ie.core.Service.BlogListService;
import com.aem.ie.core.models.BlogPage;
import com.day.cq.commons.jcr.JcrConstants;
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

public class BlogListServiceImplTest {
	AemContext aemContext = new AemContext();
	BlogListService blogListService;
	@Mock
    QueryBuilder queryBuilder;
	@Mock
	PredicateGroup predicateGroup;
	@Mock
	ResourceResolver resourceResolver;
	@Mock
	PageManager pageManager;
	@Mock
	Session session;
	@Mock
	 List<String> bloglabelTitle;
	@Mock
	Query query;
	@Mock
	SearchResult searchResult;
	@Mock
	Hit hit;
	@Mock
    Resource resource;
	@Mock
	List<BlogPage> pageData;
	@Mock
	Resource pageRes;
	@Mock
	Page currentPage;
	@Mock
	ValueMap pageResValueMap;
	@Mock
	TagManager tagManager;
	@Mock
	Tag tag;
	@Mock
	Date blogdateValue;
	@Mock
	Date date;
	@Mock
	Node tagNode;
	@Mock
	Property property;
	
	@InjectMocks
	BlogListServiceImpl blogListServiceImpl;
	@BeforeEach
    void setUp() {
		MockitoAnnotations.openMocks(this);
		
	  }
	
	@Test
    void getBlogListTest() throws RepositoryException {
		String path="/content/fm/en/blog";
		String nodePath = path.concat("/jcr:content/root/container/blogpage");
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
        when(resourceResolver.getResource(nodePath)).thenReturn(resource);
        when(currentPage.getProperties()).thenReturn(pageResValueMap);
        String[] bloglabels= {"new-lable","new-lable1"};
        when(pageResValueMap.get("pageTitle", String.class)).thenReturn("news_detail");
        when(pageResValueMap.get("blogCategory", String[].class)).thenReturn(bloglabels);
        when(resource.getResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(TagManager.class)).thenReturn(tagManager);
        when(pageResValueMap.get("author", String.class)).thenReturn("blogauthor");
        Date date=new Date();
        when(pageResValueMap.get("publishDate", Date.class)).thenReturn(date);
        blogListServiceImpl.getBlogList(path, resourceResolver, nodePath);
     }
	@Test
	void getCategoriesTest() throws RepositoryException {
		String path="/content/fm/en/blog";
		String nodePath = path.concat("/jcr:content/root/container/blogpage");
		Query query=mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery( any(), any() ) ).thenReturn( query );
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getPath()).thenReturn(path);
        when(resourceResolver.resolve(path)).thenReturn(resource);
        when(resource.adaptTo(Node.class)).thenReturn(tagNode);
        when(tagNode.getProperty(JcrConstants.JCR_TITLE)).thenReturn(property);
        when(property.getString()).thenReturn("blogpage");
        blogListServiceImpl.getCategories();
	}
	@Test
	void getArchivesTest() throws RepositoryException {
		String path="/content/fm/en/blog";
		String nodePath = path.concat("/jcr:content/root/container/blogpage");
		Query query=mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery( any(), any() ) ).thenReturn( query );
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getPath()).thenReturn(path);
        when(resourceResolver.resolve(path)).thenReturn(resource);
        when(resource.adaptTo(Node.class)).thenReturn(tagNode);
        when(tagNode.getName()).thenReturn("blog");
        blogListServiceImpl.getArchives(path, resourceResolver);
	}
	
}
