package com.aem.ie.core.servlets;

import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.aem.ie.core.Service.IECTLoginService;
import com.aem.ie.core.services.impl.IECTLoginImpl;
import com.aem.ie.core.services.impl.IECTResetPasswordEmailImpl;

import io.wcm.testing.mock.aem.junit5.AemContext;

public class SignInServletTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	@Mock
	IECTLoginService loginService;
    private IECTLoginService mockIECTLoginService;
    @InjectMocks
    SignInServlet MockSignInServlet;
    private Map<String, String> configProps = new HashMap<String, String>();
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("getLoginCTURL", "https://apim-iedtecomm-qa01.azure-api.net/login/fairview");
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockIECTLoginService = aemContext.registerInjectActivateService(new IECTLoginImpl(), configProps);
    }
    @Test()
    void doPost() throws ServletException, IOException,NullPointerException {
        //Code under test
        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            String bearerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
            MockSlingHttpServletRequest request = aemContext.request();
            String email = "test@yopmail.com";
            String pwd="secret123";
            String MockClearCartResponse = mockIECTLoginService.getLoginCTUrl(email, pwd, bearerToken);
            when(loginService.getLoginCTUrl(email, pwd, bearerToken)).thenReturn(MockClearCartResponse);
            MockSlingHttpServletResponse response = aemContext.response();
            request.addRequestParameter("bearertoken", bearerToken);
            request.addRequestParameter("email", email);
            request.addRequestParameter("password", pwd);
            MockSignInServlet.doPost(request, response);
        });
    }
}