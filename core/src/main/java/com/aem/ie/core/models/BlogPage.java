package com.aem.ie.core.models;

import java.util.ArrayList;
import java.util.List;

public class BlogPage {

	private final List<String> bloglabel;

	private final String blogauthor;

	private final String blogtitle;

	private final String blogimage;
	private final String blogimgtext;

	private final String blogtext;

	private final String bloglink;

	private final String formattedDate;

	public BlogPage(List<String> bloglabel, String blogauthor, String blogtitle, String blogimage, String blogtext,
			String bloglink, String formattedDate,String blogimgtext) {
		super();
		this.bloglabel = new ArrayList<>(bloglabel);
		this.blogauthor = blogauthor;
		this.blogtitle = blogtitle;
		this.blogimage = blogimage;
		this.blogimgtext=blogimgtext;
		this.blogtext = blogtext;
		this.bloglink = bloglink;
		this.formattedDate = formattedDate;
	}

	public BlogPage(List<String> bloglabel, String blogauthor, String blogtitle,
					String bloglink, String formattedDate) {
		super();
		this.bloglabel = new ArrayList<>(bloglabel);
		this.blogauthor = blogauthor;
		this.blogtitle = blogtitle;
		this.blogimage = "";
		this.blogimgtext="";
		this.blogtext = "";
		this.bloglink = bloglink;
		this.formattedDate = formattedDate;
	}

	public List<String> getBloglabel() {
		return new ArrayList<>(bloglabel);
	}

	public final String getBlogauthor() {
		return blogauthor;
	}

	public final String getBlogtitle() {
		return blogtitle;
	}

	public final String getBlogimage() {
		return blogimage;
	}
	public final String getBlogimageText() {
		return blogimgtext;
	}

	public final String getBlogtext() {
		return blogtext;
	}

	public final String getBloglink() {
		return bloglink;
	}

	public final String getFormattedDate() {
		return formattedDate;
	}

}
