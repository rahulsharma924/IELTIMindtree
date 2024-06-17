package com.aem.ie.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ResourceCardModel {

	@ValueMapValue(name = "resourceLink")
	private String resourceLink;

	@ValueMapValue(name = "showCustom")
	private String showCustom;

	@ValueMapValue(name = "title")
	private String title;

	@ValueMapValue(name = "description")
	private String description;

	@ValueMapValue(name = "image")
	private String image;

	@ValueMapValue(name = "ctatitle")
	private String ctatitle;

	@ValueMapValue(name = "resourceheading")
	private String resourceheading;
	@ValueMapValue(name = "enablePdfIcon")
	private boolean enablePdfIcon;

	public boolean getEnablePdfIcon() {
		return enablePdfIcon;
	}

	public void setEnablePdfIcon(boolean enablePdfIcon) {
		this.enablePdfIcon = enablePdfIcon;
	}

	public void setResourceheading(String resourceheading) {
		this.resourceheading = resourceheading;
	}

	public String getResourceheading() {
		return resourceheading;
	}

	public void setCtatitle(String ctatitle) {
		this.ctatitle = ctatitle;
	}

	public String getCtatitle() {
		return ctatitle;
	}

	public String getResourceLink() {
		return resourceLink;
	}

	public void setResourceLink(String resourceLink) {
		this.resourceLink = resourceLink;
	}

	public String getShowCustom() {
		return showCustom;
	}

	public void setShowCustom(String showCustom) {
		this.showCustom = showCustom;
	}

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

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

}
