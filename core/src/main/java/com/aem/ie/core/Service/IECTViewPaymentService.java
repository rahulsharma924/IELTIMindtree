package com.aem.ie.core.Service;

import com.google.gson.JsonObject;

import javax.json.Json;

public interface IECTViewPaymentService {
	public String getViewPaymentCTUrl(String CTCustomerToken, String bearerToken);
	public String getPaymentToken(String CTCustomerToken,String bearerToken);
	public String processPayment(String CTCustomerToken,String bearerToken, String jsonObject);
	public String choosePayment(String CTCustomerToken, String bearerToken, String jsonObject);
}
