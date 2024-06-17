package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCAssetUploadTokenService;
import com.aem.ie.core.Service.OLCCDamAssetUploadService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.osgi.service.component.annotations.Reference;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class OLCCMergedPDFUploadServletTest {

    AemContext aemContext = new AemContext();

    @Mock
    private OLCCAssetUploadTokenService olccAssetUploadTokenService;

    @Mock
    private OLCCDamAssetUploadService olccDamAssetUploadService;

    @InjectMocks
    OLCCMergedPDFUploadServlet olccMergedPDFUploadServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testMethod() throws IOException, ServletException {
        String accessToken = "accessToken";
        String responseValue = "responseValue";
        when(olccAssetUploadTokenService.getAssetUploadJWTToken(Mockito.any())).thenReturn(accessToken);
        when(olccDamAssetUploadService.mergePDF(Mockito.any(),Mockito.any(),Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(responseValue);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("mergedFileName","mergedFileName");
        request.addRequestParameter("connector1","connector1");
        request.addRequestParameter("connector2","connector2");
        request.addRequestParameter("cable","cable");
        olccMergedPDFUploadServlet.doPost(request,response);
    }


}