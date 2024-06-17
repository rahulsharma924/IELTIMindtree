package com.aem.ie.core.Service;

public interface UpdatePersonalInfoService {
    public String UpdatePersonalInfo(String customerTokenVal, String contact, String lastname, String email,
            String firstname, String company,String bearerToken,boolean contactByEmail);
    public String getDomainName();
}
