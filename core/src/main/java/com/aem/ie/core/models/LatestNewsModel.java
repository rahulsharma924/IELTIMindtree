package com.aem.ie.core.models;

import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.NewsListService;

@Model(adaptables = Resource.class, resourceType = "ie/fm/components/content/latest-news", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)

public class LatestNewsModel {

	private static final Logger log = LoggerFactory.getLogger(LatestNewsModel.class);

	@SlingObject
	private ResourceResolver resourceResolver;

	@OSGiService
	private NewsListService newsListService;

	@ValueMapValue
	private String heading;

	@ValueMapValue
	private String subHeading;

	public List<LatestNewsDetail> getLatestNewsList() {
		String newsRootPath = newsListService.getNewsRootPath();
		return newsListService.getLatestNewsList(newsRootPath, resourceResolver);
	}

	public String getHeading() {
		return heading;
	}

	public String getSubHeading() {
		return subHeading;
	}
}
