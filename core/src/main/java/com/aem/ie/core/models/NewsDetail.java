package com.aem.ie.core.models;

public class NewsDetail {

	private final String newsTitle;
	private final String newsLabel;
	private final String newsDate;
	private final String newsPagePath;

	public NewsDetail(String newsTitle, String newsLabel, String newsDate, String newsPagePath) {
		super();
		this.newsTitle = newsTitle;
		this.newsLabel = newsLabel;
		this.newsDate = newsDate;
		this.newsPagePath = newsPagePath;
	}

	public NewsDetail(String newsTitle, String newsDate, String newsPagePath) {
		super();
		this.newsTitle = newsTitle;
		this.newsLabel = "";
		this.newsDate = newsDate;
		this.newsPagePath = newsPagePath;
	}

	public final String getNewsTitle() {
		return newsTitle;
	}

	public final String getNewsLabel() {
		return newsLabel;
	}

	public final String getNewsDate() {
		return newsDate;
	}

	public final String getNewsPagePath() {
		return newsPagePath;
	}

}
