package com.aem.ie.core.services.impl;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmailOrderConfirmationDetailTest {

    EmailOrderConfirmationDetail emailOrderConfirmationDetail =  new EmailOrderConfirmationDetail();
    @Test
    void setName() {
        emailOrderConfirmationDetail.setName("Test");
        assertTrue(emailOrderConfirmationDetail.getName() == "Test");
    }

    @Test
    void setQuantity() {
        emailOrderConfirmationDetail.setQuantity("1");
        assertTrue(emailOrderConfirmationDetail.getQuantity() == "1");
    }

    @Test
    void setSubtotalPrice() {
        emailOrderConfirmationDetail.setSubtotalPrice("100");
        assertTrue(emailOrderConfirmationDetail.getSubtotalPrice() == "100");
    }

    @Test
    void setPrice() {
        emailOrderConfirmationDetail.setPrice("1000");
        assertTrue(emailOrderConfirmationDetail.getPrice() == "1000");
    }

    @Test
    void setColor() {
        emailOrderConfirmationDetail.setColor("Cable color");
        assertTrue(emailOrderConfirmationDetail.getColor() == "Cable color");
    }

    @Test
    void setCoaxType() {
        emailOrderConfirmationDetail.setCoaxType("Coax Type");
        assertTrue(emailOrderConfirmationDetail.getCoaxType() == "Coax Type");
    }

    @Test
    void setFlexType() {
        emailOrderConfirmationDetail.setFlexType("Flex type");
        assertTrue(emailOrderConfirmationDetail.getFlexType() == "Flex type");
    }

    @Test
    void setImpedence() {
        emailOrderConfirmationDetail.setImpedence("Impedence");
        assertTrue(emailOrderConfirmationDetail.getImpedence() == "Impedence");
    }

    @Test
    void setAttenuation() {
        emailOrderConfirmationDetail.setAttenuation("IL");
        assertTrue(emailOrderConfirmationDetail.getAttenuation() == "IL");
    }

    @Test
    void setNoOfshields() {
        emailOrderConfirmationDetail.setNoOfshields("sheilds");
        assertTrue(emailOrderConfirmationDetail.getNoOfshields() == "sheilds");
    }

    @Test
    void setMaxfrequency() {
        emailOrderConfirmationDetail.setMaxfrequency("1000");
        assertTrue(emailOrderConfirmationDetail.getMaxfrequency() == "1000");
    }
}