package com.aem.ie.core.Service;

public interface IECTAddtoCartService {
	public String getAddToCartoCTUrl(String token,String currency,String skuValue,String quantity, String bearerToken);
}
