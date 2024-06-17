package com.aem.ie.core.models;

import java.util.Date;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.constants.ApplConstants;
import com.aem.ie.core.utils.FMDateUtils;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class NewsDetailModel {

	private static final Logger log = LoggerFactory.getLogger(NewsDetailModel.class);

	@SlingObject
	private Resource resource;

	@ScriptVariable
	private ResourceResolver resolver;

	private String newsLabel;

	private Date newsDate;

	@ValueMapValue
	private String newsContent;

	private String newsTitle;

	private String backButtonUrl;

	@PostConstruct
	protected void init() {
		PageManager pageManager = resolver.adaptTo(PageManager.class);
		Page currentPage = pageManager.getContainingPage(resource);
		ValueMap pageResValueMap = currentPage.getProperties();
		newsTitle = pageResValueMap.get("pageTitle", String.class);
		newsLabel = pageResValueMap.get("newsLabel", String.class);
		newsDate = pageResValueMap.get("publishDate", new Date());
		backButtonUrl=currentPage.getParent().getPath().concat(".html");
	}

	public String getNewsLabel() {
		String tagTitle = ApplConstants.EMPTY_STRING;
		TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
		if (newsLabel != null && !newsLabel.equals(ApplConstants.EMPTY_STRING) && tagManager != null) {
			Tag tag = tagManager.resolve(newsLabel);
			if (tag != null && !tag.getTitle().equals("")) {
				tagTitle = tag.getTitle();
			}
		}
		return tagTitle;
	}

	public final String getNewsDate() {
		return FMDateUtils.convertToString(newsDate, "MMM dd, yyyy");
	}

	public final String getNewsContent() {
		return newsContent;
	}

	public final String getNewsTitle() {
		return newsTitle;
	}

	public String getBackButtonUrl() {
		return backButtonUrl;
	}

}
