package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.NewsSitemapGeneratorConfig;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class})
class NewsSitemapGeneratorServiceImplTest {
	AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
	@Mock
	UpdatePersonalInfoService updatePersonalInfoService;
	@Mock
	AssetManager assetManager;
	@Mock
	Session session;
	@Mock
	ValueFactory valueFactory;
	@Mock
	ResourceResolver resourceResolver;
	@Mock
	ResourceResolverFactory resourceResolverFactory;
	@Mock
	NewsSitemapGeneratorConfig newsSitemapGeneratorConfig;
	@InjectMocks
	NewsSitemapGeneratorServiceImpl newsSitemapGeneratorServiceImpl;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void activateTest(){
		newsSitemapGeneratorServiceImpl.activate(newsSitemapGeneratorConfig);
	}

	@Test
	void generateNewsSiteMap() throws IOException, LoginException, RepositoryException {
		Page page = aemContext.create().page("/content/fm/en/news-releases");
		Resource resource = page.adaptTo(Resource.class);
		Resource newsRootPageJcrNode = resource.getChild("jcr:content");
		newsRootPageJcrNode.adaptTo(Node.class).setProperty("cq:lastModified","xyz");
		Page page1 = aemContext.create().page("/content/fm/en/news-releases/test1");
		Resource resource1 = page1.adaptTo(Resource.class);
		Resource newsPageJcrNode = resource1.getChild("jcr:content");
		newsPageJcrNode.adaptTo(Node.class).setProperty("cq:lastModified","xyz");
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
		when(resourceResolverFactory.getServiceResourceResolver(paramMap)).thenReturn(resourceResolver);
		when(resourceResolver.getResource(newsSitemapGeneratorConfig.newsRootPath())).thenReturn(resource);
		when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
		when(session.getValueFactory()).thenReturn(valueFactory);
		when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
		when(updatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
		newsSitemapGeneratorServiceImpl.generateNewsSiteMap();
	}

}