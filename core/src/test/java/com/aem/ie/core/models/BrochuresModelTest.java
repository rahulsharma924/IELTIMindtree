package com.aem.ie.core.models;

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

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.TreeMap;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class BrochuresModelTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    
    @Mock
    private QueryBuilder queryBuilder;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private Session session;

    @Mock
    private SearchResult searchResult;
    @Mock
    private ContentElement contentelement;
    @Mock
    private Hit hit;

    @Mock
    private Resource resource;
    @Mock
    TreeMap<String, String> sorted;
    @InjectMocks
    private BrochuresModel brochuresModel;
    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(BrochuresModel.class);
        aemContext.request().adaptTo(BrochuresModel.class);
        
    }

    @Test
    void init() throws RepositoryException {
    	Query query=mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
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
        brochuresModel.init();
 
    }
    @Test
    void getBrochuresMyHashMaptest() {
    	brochuresModel.getBrochuresMyHashMap();
    }
    @Test
    void getBrochuresImageMyHashMaptest() {
    	brochuresModel.getBrochuresImageMyHashMap();
    }
    @Test
    void getBrochuresImageHashMaptest() {
    	brochuresModel.getBrochuresImageHashMap();
    }
}
