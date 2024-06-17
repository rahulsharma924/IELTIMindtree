package com.aem.ie.core.Service;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.sling.api.SlingHttpServletRequest;
import com.google.gson.JsonObject;

public interface AddNewAddressService {
	
	public JsonObject initialAddressDetails(SlingHttpServletRequest slingRequest, String accessToken, String bearerToken) throws ClientProtocolException, IOException;

	public JsonObject addNewAddress(SlingHttpServletRequest slingRequest, String addressObjct, String accessToken, String bearerToken) throws ClientProtocolException, IOException;

	public JsonObject updateAddress(SlingHttpServletRequest slingRequest, String addressObjct, String accessToken,String bearerToken) throws ClientProtocolException, IOException;

	public JsonObject deleteAddress(String details, String accessToken,String bearerToken) throws ClientProtocolException, IOException;

}
