package com.aem.ie.core.models.datamodels;

public class SubCategory {
	private String facetAllKeyValue;
	private String facetAllCountValue;
	private String categoryUrlValue;

    public String getFacetAllKeyValue() {
        return facetAllKeyValue;
    }

    public void setFacetAllKeyValue(String facetAllKeyValue) {
        this.facetAllKeyValue = facetAllKeyValue;
    }

    public String getFacetAllCountValue() {
        return facetAllCountValue;
    }

    public void setFacetAllCountValue(String facetAllCountValue) {
        this.facetAllCountValue = facetAllCountValue;
    }

    public String getCategoryUrlValue() {
        return categoryUrlValue;
    }

    public void setCategoryUrlValue(String categoryUrlValue) {
        this.categoryUrlValue = categoryUrlValue;
    }
}
