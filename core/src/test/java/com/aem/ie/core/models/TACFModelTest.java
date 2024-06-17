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

import javax.jcr.RepositoryException;
import javax.jcr.Session;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class TACFModelTest {

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
    @InjectMocks
    private TACFModel tacfModel;
    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(TACFModel.class);
        aemContext.request().adaptTo(TACFModel.class);
        
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
        ContentFragment contfragment = aemContext.create().contentFragmentStructured("/content/dam/cf/ie/technicalarticles/technicalarticle1",
                "title", "Title for article","description", "<p>Lorem ipsum dolor sit amet</p>",
                "description@ContentType", "<p>Lorem ipsum dolor sit amet</p>",
                "articlePageLink", "/content/fm/en/tools-resources/technical_resources/technical-articles/guide-to-wave.html");
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contfragment);
        tacfModel.init();
 
    }
    @Test
    void getTechnicalArticlesImageMyHashMaptest() {
    	tacfModel.getTechnicalArticlesImageMyHashMap();
    }
    @Test
    void getTechnicalArticlesMyHashMaptest() {
    	tacfModel.getTechnicalArticlesMyHashMap();
    }
    
}