package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.IECTEmailChangePasswordService;
import com.aem.ie.core.Service.IECTLoginService;
import com.aem.ie.core.Service.IECTLogoutService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.configuration.IEDirectCallConfig;
import com.algolia.search.org.apache.http.HttpEntity;
import com.algolia.search.org.apache.http.client.methods.CloseableHttpResponse;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import uk.org.lidalia.slf4jtest.TestLogger;
import uk.org.lidalia.slf4jtest.TestLoggerFactory;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class IECTEmailChangePwdImplTest {
    AemContext aemContext = new AemContext();
    private TestLogger logger = TestLoggerFactory.getTestLogger(IECTEmailChangePwdImpl.class);

    private IECTEmailChangePasswordService EmailChangePasswordService;
    @Mock
    private IECTEmailChangePasswordService mockEmailChangePasswordService;
    private OLCCModuleService mockSampleOSGIService;

    @InjectMocks
    IECTEmailChangePwdImpl iectEmailChangePwd;
    private Map<String, String> configProps = new HashMap<String, String>();
    private Map<String,String> props = new HashMap<String, String>();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        IEDirectCallConfig config = mock(IEDirectCallConfig.class);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
        props.put("getEmailChangePwdCTURL", "https://apim-iedtecomm-dev01.azure-api.net/customer/fairview/password/reset");
        iectEmailChangePwd = aemContext.registerInjectActivateService(new IECTEmailChangePwdImpl(),props);
    }
    @Test()
    void getEmailChangePasswordCTUrlTest() throws IOException, ServletException {
        String bearerToken=bearerTokenURLResponse();
        String tokenValue="kljijjljls9089d9vdv90dv9dvlm39r";
        String newPassword ="secret1234";
        IEDirectCallConfig config = mock(IEDirectCallConfig.class);
        CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
        HttpEntity httpEntity=mock(HttpEntity.class);
        String MockClearCartResponse = mockEmailChangePasswordService.getEmailChangePasswordCTUrl(tokenValue,newPassword,bearerTokenURLResponse());
        when(iectEmailChangePwd.getEmailChangePasswordCTUrl(tokenValue,newPassword, bearerToken)).thenReturn(MockClearCartResponse);
        iectEmailChangePwd.activate(config);
        when(response2.getEntity()).thenReturn(httpEntity);
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
