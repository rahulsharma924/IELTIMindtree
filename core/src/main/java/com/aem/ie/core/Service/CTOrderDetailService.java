package com.aem.ie.core.Service;

public interface CTOrderDetailService {
	
	public String getOrderDetails(String customer_token, String order_id, String bearerToken);

}