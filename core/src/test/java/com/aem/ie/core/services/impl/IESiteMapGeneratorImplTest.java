package com.aem.ie.core.services.impl;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.util.Calendar;
import java.util.Date;

import com.day.cq.commons.jcr.JcrConstants;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.sitemap.SitemapException;
import org.apache.sling.sitemap.builder.Sitemap;
import org.apache.sling.sitemap.builder.Url;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.day.cq.commons.Externalizer;
import com.day.cq.wcm.api.Page;

import io.wcm.testing.mock.aem.junit5.AemContext;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

@ExtendWith({AemContextExtension.class})
public class IESiteMapGeneratorImplTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	@Mock
	Url url;
	@Mock
	Resource mockResource;
	@Mock
	Sitemap sitemap;
	@Mock
	Externalizer externalizer;
	@InjectMocks
	IESiteMapGeneratorImpl ieSiteMapGeneratorImpl;
	@BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
	}
	@Test()
    void addResourceTest() throws SitemapException {
		ieSiteMapGeneratorImpl.addResource(anyString(), sitemap, mockResource);
	}

	@Test()
	void addResourceTestTwo() throws SitemapException, RepositoryException {
		Page testPage = aemContext.create().page("/content/fm/en/homepage");
		Resource testResource = testPage.adaptTo(Resource.class);
		testResource.adaptTo(Node.class).setProperty("cq:lastModified","2015-11-04T17:38:45.030+05:30");
		Resource testResourcePageJcrNode = testResource.getChild("jcr:content");
		testResourcePageJcrNode.adaptTo(Node.class).setProperty(JcrConstants.JCR_CREATED,"2015-11-04T17:38:45.030+05:30");
		when(mockResource.adaptTo(Page.class)).thenReturn(testPage);
		when(externalizer.publishLink(mockResource.getResourceResolver(), mockResource.getPath())).thenReturn(testPage.getPath());
		when(sitemap.addUrl(anyString().concat(".html"))).thenReturn(url);
		ieSiteMapGeneratorImpl.addResource(anyString(), sitemap, mockResource);
	}

   }

