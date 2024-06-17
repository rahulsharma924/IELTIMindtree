package com.aem.ie.core.models.datamodels;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.aem.ie.core.constants.ApplConstants;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;

@Model(adaptables = { SlingHttpServletRequest.class,
		Resource.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)

public class BlogPost {

	private String blogTitle;
	List<String> blogLabel;

	HashMap<String,String > blogLink;
	private String blogAuthor;
	private String blogDate;
	private String blogText;
	private String blogDescription;
	private String blogPagePath;

	@SlingObject
	private Resource resource;

	@ValueMapValue
	private String blog;

	@ValueMapValue
	private String enableHeading;

	@ValueMapValue
	private String label;

	@ValueMapValue
	private String author;

	@ValueMapValue
	private Date date;

	@ValueMapValue
	private String title;

	@ValueMapValue
	private String description;

	public String getBlogTitle() {
		return blogTitle;
	}

	public void setBlogTitle(String blogTitle) {
		this.blogTitle = blogTitle;
	}

	public List<String> getBlogLabel() {
		return blogLabel;
	}

	public void setBlogLabel(List<String> blogLabel) {
		this.blogLabel = blogLabel;
	}

	public HashMap<String,String> getBlogLink() {
		return blogLink;
	}

	public void setBlogLink(HashMap<String,String> blogLink) {
		this.blogLink = blogLink;
	}

	public String getBlogAuthor() {
		return blogAuthor;
	}

	public void setBlogAuthor(String blogAuthor) {
		this.blogAuthor = blogAuthor;
	}

	public String getBlogDate() {
		return blogDate;
	}

	public void setBlogDate(String blogDate) {
		this.blogDate = blogDate;
	}

	public String getBlogText() {
		return blogText;
	}

	public void setBlogText(String blogText) {
		this.blogText = blogText;
	}

	public String getBlogPagePath() {
		return blogPagePath;
	}

	public void setBlogPagePath(String blogPagePath) {
		this.blogPagePath = blogPagePath;
	}

	public String getBlog() {
		return blog;
	}

	public String getEnableHeading() {
		return enableHeading;
	}

	public String getLabel() {
		String tagTitle = ApplConstants.EMPTY_STRING;
		TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
		if (label != null && !label.equals(ApplConstants.EMPTY_STRING) && tagManager != null) {
			Tag tag = tagManager.resolve(label);
			if (tag != null && !tag.getTitle().equals("")) {
				tagTitle = tag.getTitle();
			}
		}
		return tagTitle;
	}

	public String getAuthor() {
		return author;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public String getFormattedDate() {
		return date == null ? ApplConstants.EMPTY_STRING : new SimpleDateFormat("MMM dd, yyyy").format(date);
	}

	public final String getBlogDescription() {
		return blogDescription;
	}

	public final void setBlogDescription(String blogDescription) {
		this.blogDescription = blogDescription;
	}

}
