package com.aem.ie.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * 
 * @author M1098572
 *
 */
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TAModel {
	
	  @ValueMapValue(name = "linktext")
	  private String linktext;

	  @ValueMapValue(name = "enableHeading")
	  private String enableHeading;
	  
	  @ValueMapValue(name = "articlelink")
	  private String articlelink;
	  
	  @ValueMapValue(name = "articletitle")
	  private String articletitle;
	  
	  @ValueMapValue(name = "articledescription")
	  private String articledescription;

	public String getLinktext() {
		return linktext;
	}

	public void setLinktext(String linktext) {
		this.linktext = linktext;
	}

	public String getEnableHeading() {
		return enableHeading;
	}

	public void setEnableHeading(String enableHeading) {
		this.enableHeading = enableHeading;
	}

	public String getArticlelink() {
		return articlelink;
	}

	public void setArticlelink(String articlelink) {
		this.articlelink = articlelink;
	}

	public String getArticletitle() {
		return articletitle;
	}

	public void setArticletitle(String articletitle) {
		this.articletitle = articletitle;
	}

	public String getArticledescription() {
		return articledescription;
	}

	public void setArticledescription(String articledescription) {
		this.articledescription = articledescription;
	} 
	  
}
