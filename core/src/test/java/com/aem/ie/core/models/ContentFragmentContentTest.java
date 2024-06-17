package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ContentFragmentContentTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder queryBuilder;

    @Mock
    private ResourceResolver resourceresolver;

    @Mock
    private Session session;

    @Mock
	private Query query;
    
    @Mock
	PredicateGroup predicate;
    
    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hit;

    @Mock
    private Resource resource;
    @InjectMocks
    ContentFragmentContent contentFragmentContent;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(ContentFragmentContent.class);
    }

    @Test
    void init() {
        aemContext.request().setAttribute("cfInput1","/content/dam/cf/ie/whitepapers/whitepaper1");
        aemContext.request().setAttribute("cfInput2","/content/dam/cf/ie/whitepapers/whitepaper1");
        aemContext.request().setAttribute("cfInput3","/content/dam/cf/ie/whitepapers/whitepaper1");
        aemContext.request().setAttribute("cfInput4","/content/dam/cf/ie/whitepapers/whitepaper1");
        ContentFragment cf = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/whitepapers/whitepaper1",
                "title", "<p>Title for article</p>",
                "description", "<p>Lorem ipsum dolor sit amet</p>","description@ContentType","text/html",
                "pdfimagepath", "/content/dam/fm/whitepaper-image.png");
        contentFragmentContent = aemContext.request().adaptTo(ContentFragmentContent.class);
        contentFragmentContent.getWhitePaperMyHashMap();
        contentFragmentContent.getWhitePaperImageMyHashMap();
    }

    @Test
    void getCFMPublishedData() throws RepositoryException {
    	Query query=mock(Query.class);
        when(resourceresolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery( any(), any() ) ).thenReturn( query );
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getResource()).thenReturn(resource);
        ContentFragment cf = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/whitepapers/whitepaper1",
                "title", "<p>Title for article</p>",
                "description", "<p>Lorem ipsum dolor sit amet</p>","description@ContentType","text/html",
                "pdfimagepath", "/content/dam/fm/whitepaper-image.png");
        when(resource.adaptTo(ContentFragment.class)).thenReturn(cf);
        contentFragmentContent.getCFMPublishedData();
    }
}