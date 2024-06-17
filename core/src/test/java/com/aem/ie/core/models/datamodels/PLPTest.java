package com.aem.ie.core.models.datamodels;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class PLPTest {
	PLP plp = new PLP();

	@Test
	void getReachStatusTest() {
		plp.getReachStatus();
	}

	@Test
	void getRoHSStatusTest() {
		plp.getRoHSStatus();
	}

	@Test
	void getBrandSKUTest() {
		plp.getBrandSKU();

	}

	@Test
	void isIsNewTest() {
		plp.isIsNew();
	}

	@Test
	void isIsDiscontinuedTest() {
		plp.isIsDiscontinued();
	}

	@Test
	void getInventoryTest() {
		plp.getInventory();
	}

	@Test
	void getNameTest() {

	}

	@Test
	void getWebDescTest() {
		plp.getWebDesc();
	}

	@Test
	void getCurrencyCode() {
		plp.getCurrencyCode();
	}

	@Test
	void getUnitPriceTest() {
		plp.getUnitPrice();
	}

	@Test
	void getStartingPriceTest() {
		plp.getStartingPrice();
	}

	@Test
	void geteCCNTest() {
		plp.geteCCN();
	}

	@Test
	void isIsOversizedTest() {
		plp.isIsOversized();
	}

	@Test
	void isIsSellableTest() {
		plp.isIsSellable();
	}

	@Test
	void getDefaultColorTest() {
		plp.getDefaultColor();
	}

	@Test
	void isIsBlockedForSaleTest() {
		plp.isIsBlockedForSale();
	}

	@Test
	void isIsInPlpTest() {
		plp.isIsInPlp();
	}

	@Test
	void isHasCategoryTest() {
		plp.isHasCategory();
	}
	@Test
	void plptest() {
		plp.isIsProp65();
		plp.getReplacementSKU();
		plp.isIsMasterCA();
		plp.getPdpLength();
		plp.isIsCustomLengthAllowed();
		plp.gettSCAStatus();
		plp.getAssets();
		plp.getKeySpecs();
		plp.getName();
		plp.getPricingTiers();
		plp.getColorVariations();
		plp.getBestSellerRank();
		plp.getPdpLengthVariations();
		plp.getLength();
		String color="color";
		plp.setColor(color);
		plp.getColor();
		plp.getCategory();
		plp.getCategorySEOURL();
		plp.getObjectID();
		plp.getProductId();
		plp.getComplianceStatus();
		plp.getSeoName();
		plp.getHierarchicalCategories();
		plp.isSkuIdNotFound();
		boolean skuIdNotFound=true;
		plp.setSkuIdNotFound(skuIdNotFound);
		plp.getPdpLengthVariations();
		boolean inPlp=true;
		plp.setInPlp(inPlp);
		boolean hasCategory=true;
		plp.setHasCategory(hasCategory);
		}

}
