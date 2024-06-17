package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.aem.ie.core.services.impl.UpdatePersonalInfoServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import static org.mockito.Mockito.when;
public class UpdatePersonalInfoServletTest {
AemContext aemContext = new AemContext();
private OLCCModuleService mockSampleOSGIService;
private UpdatePersonalInfoService updateinfoService;

@Mock
private UpdatePersonalInfoService mockUpdateinfoService;
@InjectMocks
UpdatePersonalInfoServlet mockUpdatePersonalInfoServlet;
private Map<String,String> configProps = new HashMap<String, String>();
private Map<String,String> props = new HashMap<String, String>();
@BeforeEach
void setUp() {
MockitoAnnotations.openMocks(this);
configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);

props.put("updatepersonalinfo","https://apim-iedtecomm-dev01.azure-api.net/account/fairview/update");
updateinfoService = aemContext.registerInjectActivateService(new UpdatePersonalInfoServiceImpl(),props);
}

@Test
void service() throws IOException, ServletException {
String bearerToken = bearerTokenURLResponse();
String customerTokenValue = "kljijjljls9089d9vdv90dv9dvlm39r0i";
String contact="conatct";
String lastname="user";
String email="test@gmail.com";
String firstname="test";
String company="company";
boolean contactByEmail=true;
String responseValue = updateinfoService.UpdatePersonalInfo(customerTokenValue, contact, lastname, email,
firstname, company,bearerToken,contactByEmail);
when(mockUpdateinfoService.UpdatePersonalInfo(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString(),
Mockito.anyString(), Mockito.anyString(),Mockito.anyString(),Mockito.anyBoolean())).thenReturn(responseValue);
MockSlingHttpServletRequest request = aemContext.request();
MockSlingHttpServletResponse response = aemContext.response();
request.addRequestParameter("CTCustomerToken",customerTokenValue);
request.addRequestParameter("contact",contact);
request.addRequestParameter("lastName",lastname);
request.addRequestParameter("email",email);
request.addRequestParameter("firstName",firstname);
request.addRequestParameter("company",company);
request.addRequestParameter("bearerToken",bearerToken);
request.addRequestParameter("contactByEmail", String.valueOf(contactByEmail));
mockUpdatePersonalInfoServlet.service(request,response);
}
private String bearerTokenURLResponse() throws IOException {
String bearerAccessToken = "bearerToken";
String bearerTokenURLResponse = mockSampleOSGIService.getBearerTokenUrl();
String[] couple = bearerTokenURLResponse.split(",");
for(int i =0; i < couple.length ; i++) {
String[] items =couple[i].split(":");
if(items[0].contains("access_token")) {
bearerAccessToken = items[1].replace("\"","");
bearerAccessToken = bearerAccessToken.replace("}","");
}
}
return bearerAccessToken;
}
}