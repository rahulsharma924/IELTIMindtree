package com.aem.ie.core.Service;

public interface IECTRegisterService {
	String getRegistrationCTUrl(String registartionData, String bearerToken);
	String getCheckoutGuestRegistration(String customerToken, String registrationData,String bearerToken);
}
