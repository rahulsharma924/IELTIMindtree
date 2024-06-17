package com.aem.ie.core.services.impl;

public class EmailOrderDetail {
	private String name = "";
	private String sku = "";
	private String image="";
	private String quantity = "";
	private String unitprice = "";
	private String subtotalPrice = "";
	private String price = "";
	private String color = "";
	private String coaxType = "";
	private String flexType = "";
	private String impedence = "";
	private String attenuation = "";
	private String noOfshields = "";
	private String maxfrequency ="";
	public final  String IMPEDENCE = "Impedence";
	public final  String COLOR = "Cable color";
	public final  String NUMBER_OF_SHIELDS = "Number of sheilds";
	public final  String FLEX_TYPE = "Flex type";
	public final  String ATTENEATION = "IL (db/100)";
	public final  String MAXFREQUENCY = "Max frequency";
	public final  String COAXTYPE = "Coax Type";
	public final  String S_K_U = "SKU";

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}
	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}
	public String getQuantity() {
		return quantity;
	}

	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}
	public void setUnitPrice(String unitprice) {
		this.unitprice = unitprice;
	}
	public String getUnitPrice() {
		return unitprice;
	}
	
	public void setSubtotalPrice(String subtotalPrice) {
		this.subtotalPrice = subtotalPrice;
	}

	public String getSubtotalPrice() {
		return subtotalPrice;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getCoaxType() {
		return coaxType;
	}

	public void setCoaxType(String coaxType) {
		this.coaxType = coaxType;
	}

	public String getFlexType() {
		return flexType;
	}

	public void setFlexType(String flexType) {
		this.flexType = flexType;
	}

	public String getImpedence() {
		return impedence;
	}

	public void setImpedence(String impedence) {
		this.impedence = impedence;
	}

	public String getAttenuation() {
		return attenuation;
	}

	public void setAttenuation(String attenuation) {
		this.attenuation = attenuation;
	}

	public String getNoOfshields() {
		return noOfshields;
	}

	public void setNoOfshields(String noOfshields) {
		this.noOfshields = noOfshields;
	}

	public String getMaxfrequency() {
		return maxfrequency;
	}

	public void setMaxfrequency(String maxfrequency) {
		this.maxfrequency = maxfrequency;
	}

}
