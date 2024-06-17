package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.IECTViewPaymentService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.configuration.CTAccountsConfig;
import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.configuration.OLCCUrlConfig;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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

/** Author SHRUTHIN KUMAR N
 *
 * @author M1081896
 *
 */
@ExtendWith(AemContextExtension.class)
public class ViewPaymentServiceImplTest {
    private IECTViewPaymentService viewPaymentService;
    @Mock
    private IECTViewPaymentService mockViewPaymentService;
    private OLCCModuleService mockSampleOSGIService;
    AemContext aemContext = new AemContext();
    @InjectMocks
    ViewPaymentServiceImpl viewPaymentServiceImpl;
    private Map<String,String> props = new HashMap<String, String>();
    private Map<String, String> configProps = new HashMap<String, String>();
    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        IECTLoginConfig config = mock(IECTLoginConfig.class);
        configProps.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configProps.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configProps.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configProps.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configProps.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        mockSampleOSGIService = aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configProps);
        props.put("getViewPaymentMethodURL", "https://apim-iedtecomm-dev01.azure-api.net/account/fairview/view-payment-methods");
        props.put("choosePayment", "https://apim-iedtecomm-dev01.azure-api.net/payment/fairview/choosePayment");
        props.put("getPaymentToken", "https://apim-iedtecomm-dev.azure-api.net/payment/fairview/token");
        props.put("processPayment", "https://apim-iedtecomm-dev01.azure-api.net/payment/fairview/processPayment");

        viewPaymentService = aemContext.registerInjectActivateService(new ViewPaymentServiceImpl(),props);

    }

    @Test
    void getViewPaymentCTUrl() throws IOException, ServletException {
        String bearerToken=bearerTokenURLResponse();
        String customerToken = "kljijjljls9089d9vdv90dv9dvlm39r0i";
        CTAccountsConfig config = mock(CTAccountsConfig.class);
        CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
        HttpEntity hattpEntity=mock(HttpEntity.class);
        String MockClearCartResponse = mockViewPaymentService.getViewPaymentCTUrl(customerToken, bearerToken);
        when(viewPaymentService.getViewPaymentCTUrl(customerToken, bearerToken)).thenReturn(MockClearCartResponse);
        viewPaymentServiceImpl.activate(config);
        when(response2.getEntity()).thenReturn(hattpEntity);
    }
    @Test()
    void getPaymentTokenTest() throws IOException, ServletException {
        String bearerToken=bearerTokenURLResponse();
        String customerToken="kljijjljls9089d9vdv90dv9dvlm39r";
        CTAccountsConfig config = mock(CTAccountsConfig.class);
        CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
        HttpEntity hattpEntity=mock(HttpEntity.class);
        String MockClearCartResponse = mockViewPaymentService.getPaymentToken(customerToken, bearerToken);
        when(viewPaymentService.getPaymentToken(customerToken,bearerToken)).thenReturn(MockClearCartResponse);
        viewPaymentServiceImpl.activate(config);
        when(response2.getEntity()).thenReturn(hattpEntity);

    }

    @Test()
    void processPaymentTest() throws IOException, ServletException {
        String bearerToken=bearerTokenURLResponse();
        String customerToken="kljijjljls9089d9vdv90dv9dvlm39r";
        String jsonString=processPaymentMethod();
        CTAccountsConfig config = mock(CTAccountsConfig.class);
        CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
        HttpEntity hattpEntity=mock(HttpEntity.class);
        String MockClearCartResponse = mockViewPaymentService.processPayment(customerToken, bearerToken,jsonString);
        when(viewPaymentService.processPayment(customerToken,bearerToken,jsonString)).thenReturn(MockClearCartResponse);
        viewPaymentServiceImpl.activate(config);
        when(response2.getEntity()).thenReturn(hattpEntity);

    }

    @Test()
    void choosePaymentTest() throws IOException, ServletException {
        String bearerToken=bearerTokenURLResponse();
        String customerToken="kljijjljls9089d9vdv90dv9dvlm39r";
        String jsonObject=choosePaymentMethod();
        CTAccountsConfig config = mock(CTAccountsConfig.class);
        CloseableHttpResponse response2=mock(CloseableHttpResponse.class);
        HttpEntity hattpEntity=mock(HttpEntity.class);
        String MockClearCartResponse = mockViewPaymentService.choosePayment(customerToken, bearerToken,jsonObject);
        when(viewPaymentService.choosePayment(customerToken,bearerToken,jsonObject)).thenReturn(MockClearCartResponse);
        viewPaymentServiceImpl.activate(config);
        when(response2.getEntity()).thenReturn(hattpEntity);

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

    private String processPaymentMethod() {
        return "{\n" +
                "  \"billingAddress\": {\n" +
                "    \"id\": 123456\n" +
                "  }\n" +
                "  \"purchaseOrderNumber\": 1233\n" +
                "}";
    }
    private String choosePaymentMethod() {
        return "{\n" +
                "  \"paymentMethod\": {\n" +
                "  \"method\": WireTransfer,\n" +
                "  \"isHandlingChargeApplicable\": true,\n" +
                "  \"amount\": 40\n" +
                "}";
    }

}
