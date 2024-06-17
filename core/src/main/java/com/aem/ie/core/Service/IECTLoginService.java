package com.aem.ie.core.Service;

public interface IECTLoginService {
    String getLoginCTUrl(String email, String pwd, String bearerToken);

    String getCheckoutLogin(String customerToken, String email, String pwd,String bearerToken);
}
