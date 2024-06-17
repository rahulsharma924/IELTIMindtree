package com.aem.ie.core.models.datamodels;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class SubCategoryTest {
	SubCategory subCategory=new SubCategory();
	@Test
    void getFacetAllKeyValueTest() {
		subCategory.setFacetAllKeyValue("facetallkey");
        assertEquals("facetallkey", subCategory.getFacetAllKeyValue());
    }
    @Test
    void getFacetAllCountValueTest() {
    	subCategory.setFacetAllCountValue("allcount");
        assertEquals("allcount", subCategory.getFacetAllCountValue());
    }

    @Test
    void getCategoryUrlValueTest() {
    	subCategory.setCategoryUrlValue("/category");
        assertEquals("/category", subCategory.getCategoryUrlValue());
    }

}
