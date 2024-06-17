package com.aem.ie.core.models;

public class LatestNewsDetail {

	private final String latestNewsTitle;
	private final String latestNewsLabel;
	private final String latestNewsDate;
	private final String latestNewsPagePath;

	public LatestNewsDetail(String latestNewsTitle, String latestNewsLabel, String latestNewsDate,
			String latestNewsPagePath) {
		super();
		this.latestNewsTitle = latestNewsTitle;
		this.latestNewsLabel = latestNewsLabel;
		this.latestNewsDate = latestNewsDate;
		this.latestNewsPagePath = latestNewsPagePath;
	}

	public final String getLatestNewsTitle() {
		return latestNewsTitle;
	}

	public final String getLatestNewsLabel() {
		return latestNewsLabel;
	}

	public final String getLatestNewsDate() {
		return latestNewsDate;
	}

	public final String getLatestNewsPagePath() {
		return latestNewsPagePath;
	}

}
