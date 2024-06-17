package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class})
class NewsReleasesModelTest {
    @InjectMocks
    NewsReleasesModel newsReleasesModel;
    @Mock
    ResourceResolver resourceResolver;
    @Inject
    Resource res;
    @Mock
    private Query query;
    @Mock
    private ResourceResolver resourceresolver;
    @Mock
    private Session session;
    @Mock
    private QueryBuilder queryBuilder;
    @Mock
    private SearchResult searchResult;
    @Mock
    private Hit hit;
    @Mock
    Resource resouecetag;
    @Mock
    TagManager tagManager;
    @Mock
    private Resource resource;
    @Mock
    ContentFragment contfragment;
    @Mock
    Tag tag;
    @Test
    void initTest() throws RepositoryException {
        Query query=mock(Query.class);
        newsReleasesModel.newsreleasetitle = true;
        newsReleasesModel.bestsellertitle = false;
        when(resourceresolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery(any(),any())).thenReturn(query);
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getResource()).thenReturn(resource);
        when(query.getResult()).thenReturn(searchResult);
        when(resouecetag.getResourceResolver()).thenReturn(resourceresolver);
        when(resourceresolver.adaptTo(TagManager.class)).thenReturn(tagManager);
        ContentFragment contentFragment = mock(ContentFragment.class);
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
        ContentElement contentElement1 = mock(ContentElement.class);
        when(contentFragment.getElement("producttag")).thenReturn(contentElement1);
        when(contentElement1.getContent()).thenReturn("news-releases");
        when(tagManager.resolve(any())).thenReturn(tag);
        when(tag.getName()).thenReturn("news-releases");
        when(contentFragment.getElement("title")).thenReturn(contentElement1);
        when(contentFragment.getElement("description")).thenReturn(contentElement1);
        newsReleasesModel.init();
        newsReleasesModel.getMyHashMap();
    }

    @Test
    void initTestTwo() throws RepositoryException {
        Query query=mock(Query.class);
        newsReleasesModel.newsreleasetitle = false;
        newsReleasesModel.bestsellertitle = true;
        when(resourceresolver.adaptTo(Session.class)).thenReturn(session);
        when( queryBuilder.createQuery(any(),any())).thenReturn(query);
        SearchResult searchResult = mock(SearchResult.class);
        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getResource()).thenReturn(resource);
        when(query.getResult()).thenReturn(searchResult);
        when(resouecetag.getResourceResolver()).thenReturn(resourceresolver);
        when(resourceresolver.adaptTo(TagManager.class)).thenReturn(tagManager);
        ContentFragment contentFragment = mock(ContentFragment.class);
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
        ContentElement contentElement2 = mock(ContentElement.class);
        when(contentFragment.getElement("producttag")).thenReturn(contentElement2);
        when(contentElement2.getContent()).thenReturn("best-seller");
        when(tagManager.resolve(any())).thenReturn(tag);
        when(tag.getName()).thenReturn("best-seller");
        when(contentFragment.getElement("title")).thenReturn(contentElement2);
        when(contentFragment.getElement("description")).thenReturn(contentElement2);
        newsReleasesModel.init();
        newsReleasesModel.getMyHashMap();
    }
}