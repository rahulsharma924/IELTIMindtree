package com.aem.ie.core.services.impl;

import java.util.Calendar;
import java.util.Optional;

import com.day.cq.commons.Externalizer;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.sitemap.SitemapException;
import org.apache.sling.sitemap.builder.Sitemap;
import org.apache.sling.sitemap.builder.Url;
import org.apache.sling.sitemap.spi.generator.ResourceTreeSitemapGenerator;
import org.apache.sling.sitemap.spi.generator.SitemapGenerator;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.propertytypes.ServiceRanking;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;

@Component(service = SitemapGenerator.class)
@ServiceRanking(20)
public class IESiteMapGeneratorImpl extends ResourceTreeSitemapGenerator {
	private static final Logger sitemapGeneratorLoggger = LoggerFactory.getLogger(IESiteMapGeneratorImpl.class);
	@Reference
	private Externalizer externalizer;

	@Override
	protected void addResource(final String name, final Sitemap sitemap, final Resource resource)
			throws SitemapException {
		final Page page = resource.adaptTo(Page.class);
		if (page == null) {
			sitemapGeneratorLoggger.debug("Skipping resource at {}: not a page", resource.getPath());
			return;
		}
		// Setting page URL
		final String pageUrl = externalizer.publishLink(resource.getResourceResolver(), resource.getPath());
		final Url url = sitemap.addUrl(pageUrl.concat(".html"));

		// Setting Last modified
		final Calendar lastModifiedDate = Optional.ofNullable(page.getLastModified())
				.orElse(page.getContentResource().getValueMap().get(JcrConstants.JCR_CREATED, Calendar.class));
		if (lastModifiedDate != null) {
			url.setLastModified(lastModifiedDate.toInstant());
		}
	}
}