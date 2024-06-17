package com.aem.ie.core.models;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ErrorHandlingModelTest {
	AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

	@Mock
	private Resource resource;

	@Mock
	private QueryBuilder builder;

	@Mock
	private ResourceResolver resourceResolver;

	@Mock
	private Session session;
	@Mock
	private SearchResult searchResult;
	@Mock
	private Hit hit;
	@InjectMocks
	private ErrorHandlingModel errorHandlingModel;
	@BeforeAll
	public void setUp() throws Exception {
		aemContext.addModelsForClasses(ErrorHandlingModel.class);
	}
	@Test
	public void testInit() throws RepositoryException, ContentFragmentException {
			Query query = mock(Query.class);
			when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
			when(builder.createQuery(any(), any())).thenReturn(query);
			SearchResult searchResult = mock(SearchResult.class);
			when(query.getResult()).thenReturn(searchResult);
			when(searchResult.getTotalMatches()).thenReturn(1L);
			when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
			when(hit.getResource()).thenReturn(resource);
			ContentFragment contentFragment = mock(ContentFragment.class);
			when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
			ContentElement contentElement1 = mock(ContentElement.class);
			when(contentFragment.getElement("errortype")).thenReturn(contentElement1);
			when(contentFragment.getElement("errordescription")).thenReturn(contentElement1);
			when(contentFragment.getElement("errordescriptionvalue")).thenReturn(contentElement1);
			when(contentElement1.getContent()).thenReturn("test value");
			errorHandlingModel.init();
			errorHandlingModel.getMyHashMap();
	}
}
