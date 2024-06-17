package com.aem.ie.core.models.datamodels;

public class PricingTier {
	private String quantityRange;
	private String price;
	private String discount;
	private Integer displayOrder;
    private String highQuantityPrice;

    public String getQuantityRange() {
        return quantityRange;
    }

    public void setQuantityRange(String quantityRange) {
        this.quantityRange = quantityRange;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getDiscount() {
        return discount;
    }

    public void setDiscount(String discount) {
        this.discount = discount;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getHighQuantityPrice() {
        return highQuantityPrice;
    }

    public void setHighQuantityPrice(String highQuantityPrice) {
        this.highQuantityPrice = highQuantityPrice;
    }
}
