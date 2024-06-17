package com.aem.ie.core.Service;

public interface IECTPasswordchangeService {
	public String getPasswordChangeCTUrl(String customerTokenVal,String currentPwd,String newPassword, String bearerToken);
}
