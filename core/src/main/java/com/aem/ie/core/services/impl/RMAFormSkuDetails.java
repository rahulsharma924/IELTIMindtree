package com.aem.ie.core.services.impl;

public class RMAFormSkuDetails {
	private String sku = "";
	private String qty = "";
	private String ror="";
	

	public String getSku() {
		return sku;
	}

	public void setSku(String skuValue) {
		this.sku = sku;
	}
	public String getQuantity() {
		return qty;
	}

	public void setQuantity(String quantity) {
		this.qty = qty;
	}

	public String getReoder() {
		return ror;
	}

	public void setReorder(String reorder) {
		this.ror = ror;
	}

}
