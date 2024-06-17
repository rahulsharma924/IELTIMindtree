package com.aem.ie.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;

@Model(adaptables = SlingHttpServletRequest.class)
public class PDFMetaDataModel {

	private static final Logger log = LoggerFactory.getLogger(PDFMetaDataModel.class);

	@Inject
	SlingHttpServletRequest request;

	@ScriptVariable
	private ResourceResolver resolver;

	private String url;

	private String title;

	private String description;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@PostConstruct
	protected void init() {
		url = request.getRequestPathInfo().getResourcePath();
		String requestURL = request.getRequestURL().toString();
		String damPath = StringUtils.substringAfter(requestURL, "html");
		Resource res = resolver.getResource(damPath);
		if (null != res) {
			Asset asset = res.adaptTo(Asset.class);
			if ((null != asset)) {
				title = asset.getMetadataValue(DamConstants.DC_TITLE);
				description = asset.getMetadataValue(DamConstants.DC_DESCRIPTION);
			}
		}
	}

}
