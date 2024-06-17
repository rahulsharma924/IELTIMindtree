package com.aem.ie.core.services.impl;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class EmailOrderDetailTest {

	@Test
    public void testSetName() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setName("test");
        assertTrue(emailorder.getName() == "test");
    }
	@Test
    public void testsetQuantity() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setQuantity("qty");
        assertTrue(emailorder.getQuantity()== "qty");
    }
	@Test
    public void testsetSubtotalPrice() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setSubtotalPrice("0.45");
        assertTrue(emailorder.getSubtotalPrice() == "0.45");
    }
	@Test
    public void testSetImage() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setImage("image");
        assertTrue(emailorder.getImage() == "image");
    }
	@Test
    public void testSetPrice() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setPrice("10");
        assertTrue(emailorder.getPrice() == "10");
    }
	@Test
    public void testSetColor() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setColor("blue");
        assertTrue(emailorder.getColor() == "blue");
    }
	@Test
    public void testSetunitprice() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setUnitPrice("unitprice");
        assertTrue(emailorder.getUnitPrice() == "unitprice");
    }
	@Test
    public void testsetCoaxType() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setCoaxType("coax");
        assertTrue(emailorder.getCoaxType() == "coax");
    }
	@Test
    public void testsetFlexType() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setFlexType("flex");
        assertTrue(emailorder.getFlexType() == "flex");
    }
	@Test
    public void testsetImpedence() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setImpedence("impedence");
        assertTrue(emailorder.getImpedence() == "impedence");
    }
	@Test
    public void testsetAttenuation() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setAttenuation("Attenuate");
        assertTrue(emailorder.getAttenuation() == "Attenuate");
    }
	@Test
    public void testsetNoOfshields() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setNoOfshields("sheilds");
        assertTrue(emailorder.getNoOfshields() == "sheilds");
    }
	@Test
    public void testsetMaxfrequency() {
		EmailOrderDetail emailorder = new EmailOrderDetail();
		emailorder.setMaxfrequency("frequency");
        assertTrue(emailorder.getMaxfrequency() == "frequency");
    }

    @Test
    public void testsetSku() {
        EmailOrderDetail emailorder = new EmailOrderDetail();
        emailorder.setSku("t10003");
        assertTrue(emailorder.getSku()== "t10003");
    }
}
