package com.aem.ie.core.Service;

public interface CTOrderHistoryService {
	
	public String getOrderHistory(String customer_token,String bearerToken, String pageNo,String pageSize,String sortField,String sortingOrder);
	
}
