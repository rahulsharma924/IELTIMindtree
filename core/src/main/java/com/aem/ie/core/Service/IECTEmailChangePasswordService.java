package com.aem.ie.core.Service;

public interface IECTEmailChangePasswordService {
	public String getEmailChangePasswordCTUrl(String tokenId,String newPwd,String beareeToken);
}
