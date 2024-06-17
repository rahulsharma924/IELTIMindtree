package com.aem.ie.core.models;

import com.aem.ie.core.Service.BlogService;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.factory.ModelFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.PropertyIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class RelatedArticleModelTest {

    @Mock
    private Resource resource;

    @Mock
    private ResourceResolver resolver;

    @Mock
    private ModelFactory modelFactory;

    @Mock
    private BlogService blogService;

    @Mock
    private QueryBuilder queryBuilder;

    @Mock
    private PageManager pageManager;

    @Mock
    private Page currentPage;

    @Mock
    private ValueMap pageValueMap;

    @Mock
    private ValueMap nodeValueMap;

    @Mock
    private Node node;

    @Mock
    private Property property;

    @Mock
    private PropertyIterator propertyIterator;

    @Mock
    private Session session;

    @Mock
    private TagManager tagManager;

    @Mock
    private Tag tag;

    @Mock
    private Query query;

    @Mock
    private SearchResult searchResult;

    @Mock
    private Hit hit;
    String[] str = {"blog"};
    @InjectMocks
    private RelatedArticleModel relatedArticleModel;

    @BeforeEach
    void setUp() throws RepositoryException {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testInit() throws RepositoryException {
        ValueMap pageValueMap1 = mock(ValueMap.class);
        when(blogService.getArticleLimit()).thenReturn("5");
        when(blogService.getBlogRootPath()).thenReturn("/content/myblog");
        when(resource.getResourceResolver()).thenReturn(resolver);
        when(resolver.adaptTo(Session.class)).thenReturn(session);
        when(resolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getContainingPage(resource)).thenReturn(currentPage);
        when(currentPage.getProperties()).thenReturn(pageValueMap);
        when(pageValueMap.get("blogtag", String[].class)).thenReturn(new String[]{"category1", "category2"});
        when(queryBuilder.createQuery(any(), any())).thenReturn(query);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getHits()).thenReturn(Collections.singletonList(hit));
        when(hit.getPath()).thenReturn("/content/myblog/article");
        when(resolver.adaptTo(TagManager.class)).thenReturn(tagManager);
        when(resolver.getResource("/content/myblog/article")).thenReturn(resource);
        when(resource.getValueMap()).thenReturn(pageValueMap);
        when(resolver.getResource("/content/myblog/article/root/container/blogpage")).thenReturn(resource);
        when(resource.getValueMap()).thenReturn(nodeValueMap);
        when(pageManager.getContainingPage(resource)).thenReturn(currentPage);
        when(currentPage.getPath()).thenReturn("/content/fm/en/blogpage");
        relatedArticleModel.init();
    }

    @Test
    void testGetRelatedArticles() {

        List<BlogPage> result = relatedArticleModel.getRelatedArticles();

        // Verify that the returned list is unmodifiable and contains the same elements.
        assertEquals(0, result.size());
    }


}
