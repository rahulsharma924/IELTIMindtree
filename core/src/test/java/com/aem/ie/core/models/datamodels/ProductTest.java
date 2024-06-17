package com.aem.ie.core.models.datamodels;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    Product product =new Product();

    @Test
    void getComplianceStatus() {
        product.getComplianceStatus();
    }

    @Test
    void getSeoName() {
        product.getSeoName();
    }

    @Test
    void setSkuIdNotFound() {
        product.setSkuIdNotFound(false);
    }

    @Test
    void getCategorySEOURL(){
        product.getCategorySEOURL();
    }
    @Test
    void productTest() {
    	product.getReachStatus();
    	product.getRoHSStatus();
    	product.gettSCAStatus();
    	product.getBrandSKU();
    	product.isIsNew();
    	product.isIsDiscontinued();
    	product.getInventory();
    	product.getBaseItemSKU();
    	product.getAssets();
    	product.getKeySpecs();
    	product.getName();
    	product.getWebDesc();
    	product.getCurrencyCode();
    	product.getUnitPrice();
    	product.getPricingTiers();
    	product.geteCCN();
    	product.isIsOversized();
    	product.isIsSellable();
    	product.getDefaultColor();
    	product.getColorVariations();
    	product.getBestSellerRank();
    	product.getLengthVariations();
    	product.getLength();
    	product.getColor();
    	String color="color";
    	product.setColor(color);
    	product.getCategory();
    	product.getObjectID();
    	product.getProductId();
    	product.getHierarchicalCategories();
    	product.isSkuIdNotFound();
    	product.isIsProp65();
    	product.getReplacementSKU();
    	product.isIsMasterCA();
    	product.getPdpLength();
    	product.getPdpLengthVariations();
    	product.isIsCustomLengthAllowed();
    	product.isIsBlockedForSale();
    	product.getWeight();
    	double weight=9.0;
    	product.setWeight(weight);
    	
    	
    }
}