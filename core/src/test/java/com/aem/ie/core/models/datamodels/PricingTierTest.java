package com.aem.ie.core.models.datamodels;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class PricingTierTest {
	PricingTier pricingTier=new PricingTier();
	@Test
    void getQuantityRangeTest() {
		pricingTier.setQuantityRange("range");
		assertEquals("range", pricingTier.getQuantityRange());
	}
	@Test
    void getPriceTest() {
		pricingTier.setPrice("price");
		assertEquals("price", pricingTier.getPrice());
	}
	@Test
    void getDiscountTest() {
		pricingTier.setDiscount("discount");
		assertEquals("discount", pricingTier.getDiscount());
	}
	@Test
    void getDisplayOrderTest() {
		pricingTier.setDisplayOrder(1);
		assertEquals(1, pricingTier.getDisplayOrder());
	}

}
