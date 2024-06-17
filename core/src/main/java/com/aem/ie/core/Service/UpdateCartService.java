package com.aem.ie.core.Service;

public interface UpdateCartService {
	public String getUpdateCartCTUrl(String customerTokenVal,String bearerToken, String quantity, String lineItemId, String unitOfMeasurement, String isCustomLineItem);
}
