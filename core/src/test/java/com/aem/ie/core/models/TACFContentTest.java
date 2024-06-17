package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
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
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import java.util.Arrays;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TACFContentTest {

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
    TACFContent tacfContent;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(TACFContent.class);
        aemContext.request().adaptTo(TACFContent.class);    
    }

    @Test
    void init() throws RepositoryException, ContentFragmentException {
    	aemContext.request().setAttribute("cfInput1","/content/dam/cf/ie/technicalarticles/technicalarticle1");
        aemContext.request().setAttribute("cfInput2","/content/dam/cf/ie/technicalarticles/technicalarticle1");
        aemContext.request().setAttribute("cfInput3","/content/dam/cf/ie/technicalarticles/technicalarticle1");
        ContentFragment cf = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/technicalarticles/technicalarticle1",
                "title", "<p>Title for article</p>",
                "description", "<p>Lorem ipsum dolor sit amet</p>","description@ContentType","text/html",
                "articlePageLink", "/content/fm/en/tools-resources/technical_resources/technical-articles/guide-to-wave.html");
        tacfContent = aemContext.request().adaptTo(TACFContent.class);
        tacfContent.getTechnicalArticlesImageMyHashMap();
        tacfContent.getTechnicalArticlesMyHashMap();
       }

    @Test
    void initSecondTest() throws RepositoryException {
    	 ContentFragment cf = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/technicalarticles/technicalarticle1",
                "title", "<p>Title for article</p>","description", "<p>Lorem ipsum dolor sit amet</p>",
                "description@ContentType", "<p>Lorem ipsum dolor sit amet</p>",
                "articlePageLink", "/content/fm/en/tools-resources/technical_resources/technical-articles/guide-to-wave.html");
        res = aemContext.currentResource("/content");
        aemContext.request().setResource(cf.adaptTo(Resource.class));
        tacfContent = aemContext.request().adaptTo(TACFContent.class);
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
        ContentFragment contfragment = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/technicalarticles/technicalarticle1",
                "title", "Title for article","description", "<p>Lorem ipsum dolor sit amet</p>",
                "description@ContentType", "<p>Lorem ipsum dolor sit amet</p>",
                "articlePageLink", "/content/fm/en/tools-resources/technical_resources/technical-articles/guide-to-wave.html");
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contfragment);
        tacfContent.getCFMPublishedData();
    }
    
}