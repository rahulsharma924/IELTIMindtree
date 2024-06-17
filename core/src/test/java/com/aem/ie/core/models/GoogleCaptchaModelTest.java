package com.aem.ie.core.models;

import com.aem.ie.core.Service.GoogleCaptchaService;
import com.aem.ie.core.services.impl.GoogleCaptchaServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class GoogleCaptchaModelTest {
    AemContext aemContext =  new AemContext();
    @Mock
    private GoogleCaptchaService googleCaptchaService;

    private Map<String, String> configProps = new HashMap<>();
    @InjectMocks
    private GoogleCaptchaModel googleCaptchaModel;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("secretKey", "6Lc-FYUkAAAAAODsbinz_EWd_h5ksKUEwqGqmNTV");
        googleCaptchaService = aemContext.registerInjectActivateService(new GoogleCaptchaServiceImpl(), configProps);
        when(googleCaptchaModel.getSecretKey()).thenReturn("6Lc-FYUkAAAAAODsbinz_EWd_h5ksKUEwqGqmNTV");
    }

    @Test
    void getSecretKey() {
        assertEquals(googleCaptchaService.getSecretKey(), googleCaptchaModel.getSecretKey());
    }
}