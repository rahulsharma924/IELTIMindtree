package com.aem.ie.core.models.datamodels;

import com.algolia.search.com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;

public class PLP {
    private String reachStatus;
    private String roHSStatus;
    private String tSCAStatus;
    private String brandSKU;
    private boolean isNew;
    private boolean isDiscontinued;
    private int inventory;
    private List<LinkedHashMap<String, String>> assets = new ArrayList<>();
    private List<LinkedHashMap<String, String>> keySpecs = new ArrayList<>();
    private String name;
    private String webDesc;
    private String currencyCode;
    private double unitPrice;
    private double startingPrice;
    private List<LinkedHashMap<String, Double>> pricingTiers = new ArrayList<>();
    private String eCCN;
    private boolean isOversized;
    private boolean isSellable;
    private String defaultColor;
    private List<String> colorVariations = new ArrayList<>();
    private int bestSellerRank;
    private List<Integer> lengthVariations = new ArrayList<>();
    private int length;
    private String color;
    private List<String> category = new ArrayList<>();
    private List<String> categorySEOURL = new ArrayList<>();
    private String objectID;
    private String productId;
    private String complianceStatus;
    private String seoName;
    private List<LinkedHashMap<String, ArrayList<String>>> hierarchicalCategories = new ArrayList<>();
    private boolean skuIdNotFound;
    private boolean isProp65;
    private String replacementSKU;
    private boolean isMasterCA;
    private String pdpLength;
    private List<LinkedHashMap<String, String>> pdpLengthVariations = new ArrayList<>();
    private boolean isCustomLengthAllowed;
    private boolean isBlockedForSale;
    private boolean isInPlp;
    private boolean hasCategory;

    public String getReachStatus() {
        return reachStatus;
    }

    public String getRoHSStatus() {
        return roHSStatus;
    }

    public String gettSCAStatus() {
        return tSCAStatus;
    }

    public String getBrandSKU() {
        return brandSKU;
    }

    public boolean isIsNew() {
        return isNew;
    }

    public boolean isIsDiscontinued() {
        return isDiscontinued;
    }

    public int getInventory() {
        return inventory;
    }

    public List<LinkedHashMap<String, String>> getAssets() {
        return new ArrayList<>(assets);
    }

    public List<LinkedHashMap<String, String>> getKeySpecs() {
        return new ArrayList<>(keySpecs);
    }

    public String getName() {
        return name;
    }

    public String getWebDesc() {
        return webDesc;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public double getStartingPrice() {
        return startingPrice;
    }

    public List<LinkedHashMap<String, Double>> getPricingTiers() {
        return new ArrayList<>(pricingTiers);
    }

    public String geteCCN() {
        return eCCN;
    }

    public boolean isIsOversized() {
        return isOversized;
    }

    public boolean isIsSellable() {
        return isSellable;
    }

    public String getDefaultColor() {
        return defaultColor;
    }

    public List<String> getColorVariations() {
        return new ArrayList<>(colorVariations);
    }

    public int getBestSellerRank() {
        return bestSellerRank;
    }

    public List<Integer> getLengthVariations() {
        return new ArrayList<>(lengthVariations);
    }

    public int getLength() {
        return length;
    }

    @JsonProperty("Color")
    public String getColor() {
        return color;
    }
    @JsonProperty("Color")
    public void setColor(String color) {
        this.color = color;
    }

    public List<String> getCategory() {
        return new ArrayList<>(category);
    }

    public List<String> getCategorySEOURL() {
        return new ArrayList<>(categorySEOURL);
    }

    public String getObjectID() {
        return objectID;
    }

    public String getProductId() {
        return productId;
    }

    public String getComplianceStatus() {
        return complianceStatus;
    }

    public String getSeoName() {
        return seoName;
    }

    public List<LinkedHashMap<String, ArrayList<String>>> getHierarchicalCategories() {
        return new ArrayList<>(hierarchicalCategories);
    }

    public boolean isSkuIdNotFound() {
        return skuIdNotFound;
    }

    public void setSkuIdNotFound(boolean skuIdNotFound) {
        this.skuIdNotFound = skuIdNotFound;
    }

    public boolean isIsProp65() {
        return isProp65;
    }

    public String getReplacementSKU() {
        return replacementSKU;
    }

    public boolean isIsMasterCA() {
        return isMasterCA;
    }

    public String getPdpLength() {
        return pdpLength;
    }

    public List<LinkedHashMap<String, String>> getPdpLengthVariations() {
        if(pdpLengthVariations != null){
            return new ArrayList<>(pdpLengthVariations);
        }
        else{
            return Collections.emptyList();
        }
    }

    public boolean isIsCustomLengthAllowed() {
        return isCustomLengthAllowed;
    }

    public boolean isIsBlockedForSale() {
        return isBlockedForSale;
    }

    public boolean isIsInPlp() {
        return isInPlp;
    }

    public void setInPlp(boolean inPlp) {
        isInPlp = inPlp;
    }

    public boolean isHasCategory() {
        return hasCategory;
    }

    public void setHasCategory(boolean hasCategory) {
        this.hasCategory = hasCategory;
    }
}
