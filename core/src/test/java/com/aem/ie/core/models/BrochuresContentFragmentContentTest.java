package com.aem.ie.core.models;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class BrochuresContentFragmentContentTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
 
    @Inject
    Resource res;
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
    BrochuresContentFragmentContent brochuresContentFragmentContent;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(BrochuresContentFragmentContent.class);
        aemContext.request().adaptTo(BrochuresContentFragmentContent.class);    
    }

    @Test
    void init() throws RepositoryException, ContentFragmentException {
    	aemContext.request().setAttribute("cfInput1","/content/dam/cf/ie/brochures/brochures1");
        aemContext.request().setAttribute("cfInput2","/content/dam/cf/ie/brochures/brochures1");
        aemContext.request().setAttribute("cfInput3","/content/dam/cf/ie/brochures/brochures1");
        ContentFragment cf = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/brochures/brochures1",
                "title", "Title for article",
                "description", "Lorem ipsum dolor sit amet","description@ContentType","text/html",
                "pdfimagepath", "/content/dam/fm/brochures-image.png",
                "brochureImagePath", "/content/dam/fm/brochures-image.png");
        brochuresContentFragmentContent = aemContext.request().adaptTo(BrochuresContentFragmentContent.class);
        brochuresContentFragmentContent.getBrochuresMyHashMap();
        brochuresContentFragmentContent.getBrochuresImageHashMap();
        brochuresContentFragmentContent.getBrochuresImageMyHashMap();
    }

    @Test
    void initSecondTest() throws RepositoryException {
    	 ContentFragment cf = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/brochures/brochures1",
                "title", "<p>Title for article</p>","description", "<p>Lorem ipsum dolor sit amet</p>",
                "description@ContentType", "<p>Lorem ipsum dolor sit amet</p>",
                "pdfimagepath", "/content/dam/fm/brochures-image.png",
                "brochureImagePath", "/content/dam/fm/brochures-image.png");
        res = aemContext.currentResource("/content");
        aemContext.request().setResource(cf.adaptTo(Resource.class));
        brochuresContentFragmentContent = aemContext.request().adaptTo(BrochuresContentFragmentContent.class);
    }
    @Test
    void getCFMPublishedDataTest() throws RepositoryException {
    	Query query=mock(Query.class);
        when(resourceresolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery( any(), any() ) ).thenReturn( query );
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getResource()).thenReturn(resource);
        ContentFragment contfragment = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/brochures/brochures1",
                "title", "Title for article","description", "<p>Lorem ipsum dolor sit amet</p>",
                "description@ContentType", "<p>Lorem ipsum dolor sit amet</p>",
                "pdfimagepath", "/content/dam/fm/brochures-image.png", "brochureImagePath", "/content/dam/fm/brochures-image1.png");
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contfragment);
        brochuresContentFragmentContent.getCFMPublishedData();
    }
}