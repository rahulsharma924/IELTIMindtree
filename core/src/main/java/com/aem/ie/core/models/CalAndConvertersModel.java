package com.aem.ie.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CalAndConvertersModel {

	@ValueMapValue(name = "resourceLink")
	private String resourceLink;

	@ValueMapValue(name = "showCustom")
	private String showCustom;

	@ValueMapValue(name = "title")
	private String title;

	@ValueMapValue(name = "description")
	private String description;

	@ValueMapValue(name = "category")
	private String category;

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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

}
