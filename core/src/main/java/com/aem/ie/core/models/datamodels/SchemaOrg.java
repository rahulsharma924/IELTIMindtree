package com.aem.ie.core.models.datamodels;

public class SchemaOrg {

	private String newsArticleBody;
	private String newsArticleSection;
	private String newsArticleTitle;
	private String blogPost;
	private String datePublished;
	private String image;
	private String imageAltText;
	private String blogAuthor;

    public String getBlogAuthor() {
        return blogAuthor;
    }

    public void setBlogAuthor(String blogAuthor) {
        this.blogAuthor = blogAuthor;
    }

    public String getNewsArticleBody() {
        return newsArticleBody;
    }

    public void setNewsArticleBody(String newsArticleBody) {
        this.newsArticleBody = newsArticleBody;
    }

    public String getNewsArticleSection() {
        return newsArticleSection;
    }

    public void setNewsArticleSection(String newsArticleSection) {
        this.newsArticleSection = newsArticleSection;
    }

    public String getNewsArticleTitle() {
        return newsArticleTitle;
    }

    public void setNewsArticleTitle(String newsArticleTitle) {
        this.newsArticleTitle = newsArticleTitle;
    }

    public String getBlogPost() {
        return blogPost;
    }

    public void setBlogPost(String blogPost) {
        this.blogPost = blogPost;
    }

    public String getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(String datePublished) {
        this.datePublished = datePublished;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getImageAltText() {
        return imageAltText;
    }

    public void setImageAltText(String imageAltText) {
        this.imageAltText = imageAltText;
    }
}
