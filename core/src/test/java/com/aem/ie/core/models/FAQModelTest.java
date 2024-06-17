package com.aem.ie.core.models;
import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.adobe.cq.dam.cfm.FragmentData;
import com.aem.ie.core.models.datamodels.FAQ;
import com.day.cq.search.*;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.*;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.Answer;
import org.opentest4j.ValueWrapper;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class FAQModelTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    @Mock
    private QueryBuilder queryBuilder;

    @Mock
    private ResourceResolver resourceResolver;

    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private Resource resource;

    @Mock
    RequestPathInfo requestPathInfo;
    @Mock
    private Session session;

    @InjectMocks
    private FAQModel faqModel;
    @Mock
    private Hit hit;
    @BeforeEach
    public void setup() throws RepositoryException {
        aemContext.addModelsForClasses(FAQModel.class);
        aemContext.request().adaptTo(FAQ.class);
        }

    @Test
    public void testInit() throws RepositoryException, ContentFragmentException {
        Query query = mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(queryBuilder.createQuery(any(), any())).thenReturn(query);
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectorString()).thenReturn("all");
        SearchResult searchResult = mock(SearchResult.class);

        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getResource()).thenReturn(resource);
        ContentFragment contentFragment = mock(ContentFragment.class);
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
        ContentElement contentElement = mock(ContentElement.class);
        when(contentFragment.getElement("faqTag")).thenReturn(contentElement);
        when(contentElement.getValue()).thenReturn(mock(FragmentData.class));
        when(contentFragment.getElement("question")).thenReturn(contentElement);
        when(contentFragment.getElement("answer")).thenReturn(contentElement);
        when(contentElement.getContent()).thenReturn("answer");
        String[] selectors = {"ie:faq/all"};
        when(contentElement.getValue().getValue(String[].class)).thenReturn(selectors);

        faqModel.init();
        faqModel.getFaqCategoryList();
        assertEquals(1, faqModel.getViewAllFaqList().size());

    }

    @Test
    public void testInitTwo() throws RepositoryException, ContentFragmentException {
        Query query = mock(Query.class);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(queryBuilder.createQuery(any(), any())).thenReturn(query);
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectorString()).thenReturn("Cart-and-payment");
        SearchResult searchResult = mock(SearchResult.class);

        when(query.getResult()).thenReturn(searchResult);
        when(searchResult.getTotalMatches()).thenReturn(1L);
        when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
        when(hit.getResource()).thenReturn(resource);
        ContentFragment contentFragment = mock(ContentFragment.class);
        when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
        ContentElement contentElement = mock(ContentElement.class);
        when(contentFragment.getElement("faqTag")).thenReturn(contentElement);
        when(contentElement.getValue()).thenReturn(mock(FragmentData.class));
        when(contentFragment.getElement("question")).thenReturn(contentElement);
        when(contentFragment.getElement("answer")).thenReturn(contentElement);
        when(contentElement.getContent()).thenReturn("answer");
        String[] selectors = {"ie:faq/cart-and-payment"};
        when(contentElement.getValue().getValue(String[].class)).thenReturn(selectors);

        faqModel.init();
        faqModel.getFaqCategoryList();
        assertEquals(0, faqModel.getViewAllFaqList().size());

    }
    @Test
    Map<String, List<FAQ>> getViewAllFaqList() {
        return faqModel.viewAllFaqList;
    }

    @Test
    Map<String, List<FAQ>> getFaqCategoryList() {
        return faqModel.faqCategoryList;
    }


}
