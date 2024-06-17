package com.aem.ie.core.services.impl;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class RMAFormSkuDetailsTest {
	@Test
    public void testsetSku() {
		RMAFormSkuDetails rmaform = new RMAFormSkuDetails();
		rmaform.setSku("sku");
        assertFalse(rmaform.getSku() == "sku");
    }
	@Test
    public void testsetQuantity() {
		RMAFormSkuDetails rmaform = new RMAFormSkuDetails();
		rmaform.setQuantity("qty");
		assertFalse(rmaform.getQuantity()== "qty");
    }
	@Test
    public void testsetReorder() {
		RMAFormSkuDetails rmaform = new RMAFormSkuDetails();
		rmaform.setReorder("reorder");
		assertFalse(rmaform.getReoder()== "reorder");
    }
}
