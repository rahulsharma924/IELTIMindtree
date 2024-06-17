package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.OLCCAssetUploadTokenService;
import com.aem.ie.core.configuration.OLCCAssetUploadConfig;
import com.aem.ie.core.constants.ApplConstants;
import com.google.common.io.ByteStreams;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.URL;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class OLCCAssetUploadServiceTokenImplTest {

    AemContext aemContext = new AemContext();

    private OLCCAssetUploadTokenService olccAssetUploadTokenService;

    OLCCAssetUploadServiceTokenImpl olccAssetUploadServiceTokenImpl = new OLCCAssetUploadServiceTokenImpl();

    @Mock
    Session session;

    @Mock
    Node node;

    @Mock
    ResourceResolver resourceResolver;

    @Test
    void getAccessToken() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
            OLCCAssetUploadConfig config = mock(OLCCAssetUploadConfig.class);
            olccAssetUploadServiceTokenImpl.activate(config);
            when(config.getAPIKey()).thenReturn("cm-p78402-e955507-integration-0");
            when(config.getSecret()).thenReturn("p8e-v0v2AK-xea9PEw3hR9vcnOe_hlscAOoQ");
            when(config.getTechnicalAccountId()).thenReturn("EF7627226433E3160A495FCA@techacct.adobe.com");
            when(config.getOrgId()).thenReturn("757E34EE62B97AC60A495E3C@AdobeOrg");
            when(config.getMetaScopes()).thenReturn("ent_aem_cloud_api");
            when(config.getImsHost()).thenReturn("ims-na1.adobelogin.com");
            when(config.getImsExchange()).thenReturn("https://ims-na1.adobelogin.com/ims/exchange/jwt");
            when(config.getKeyPath()).thenReturn("com/aem/ie/core/models/secret.key");
            ClassLoader classLoader = this.getClass().getClassLoader();
            File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/secret.key").getFile());
            assertTrue(jsonFile.exists());
            FileInputStream keyfis = new FileInputStream(jsonFile);
            MockSlingHttpServletRequest request = aemContext.request();
            //olccAssetUploadServiceTokenImpl.getAssetUploadJWTToken(request.getResourceResolver());
            String jwtToken = olccAssetUploadServiceTokenImpl.getJWTToken(keyfis);
            olccAssetUploadServiceTokenImpl.getAccessToken(jwtToken);

    }

    @Test
    void getAccessTokenTest() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            OLCCAssetUploadConfig config = mock(OLCCAssetUploadConfig.class);
            olccAssetUploadServiceTokenImpl.activate(config);
            //when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
            //when(session.getNode(Mockito.any())).thenReturn(node);
            when(config.getAPIKey()).thenReturn("cm-p78402-e955507-integration-0");
            when(config.getSecret()).thenReturn("p8e-v0v2AK-xea9PEw3hR9vcnOe_hlscAOoQ");
            when(config.getTechnicalAccountId()).thenReturn("EF7627226433E3160A495FCA@techacct.adobe.com");
            when(config.getOrgId()).thenReturn("757E34EE62B97AC60A495E3C@AdobeOrg");
            when(config.getMetaScopes()).thenReturn("ent_aem_cloud_api");
            when(config.getImsHost()).thenReturn("ims-na1.adobelogin.com");
            when(config.getImsExchange()).thenReturn("https://ims-na1.adobelogin.com/ims/exchange/jwt");
            when(config.getKeyPath()).thenReturn("com/aem/ie/core/models/secret.key");
            ClassLoader classLoader = this.getClass().getClassLoader();
            File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/secret.key").getFile());
            assertTrue(jsonFile.exists());
            FileInputStream keyfis = new FileInputStream(jsonFile);
            MockSlingHttpServletRequest request = aemContext.request();
            olccAssetUploadServiceTokenImpl.getAssetUploadJWTToken(request.getResourceResolver());
            //String jwtToken = olccAssetUploadServiceTokenImpl.getJWTToken(keyfis);
            //olccAssetUploadServiceTokenImpl.getAccessToken("jwtToken");
        });
    }

    @Test
    void getAccessTokenTestTwo() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            OLCCAssetUploadConfig config = mock(OLCCAssetUploadConfig.class);
            olccAssetUploadServiceTokenImpl.activate(config);
            //when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
            //when(session.getNode(Mockito.any())).thenReturn(node);
            when(config.getAPIKey()).thenReturn("cm-p78402-e955507-integration-0");
            when(config.getSecret()).thenReturn("p8e-v0v2AK-xea9PEw3hR9vcnOe_hlscAOoQ");
            when(config.getTechnicalAccountId()).thenReturn("EF7627226433E3160A495FCA@techacct.adobe.com");
            when(config.getOrgId()).thenReturn("757E34EE62B97AC60A495E3C@AdobeOrg");
            when(config.getMetaScopes()).thenReturn("ent_aem_cloud_api");
            when(config.getImsHost()).thenReturn("ims-na1.adobelogin.com");
            when(config.getImsExchange()).thenReturn("https://ims-na1.adobelogin.com/ims/exchange/jwt");
            when(config.getKeyPath()).thenReturn("com/aem/ie/core/models/secret.key");
            ClassLoader classLoader = this.getClass().getClassLoader();
            File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/secret.key").getFile());
            assertTrue(jsonFile.exists());
            FileInputStream keyfis = new FileInputStream(jsonFile);
            MockSlingHttpServletRequest request = aemContext.request();
            //olccAssetUploadServiceTokenImpl.getAssetUploadJWTToken(request.getResourceResolver());
            //String jwtToken = olccAssetUploadServiceTokenImpl.getJWTToken(keyfis);
            olccAssetUploadServiceTokenImpl.getAccessToken("jwtToken");
        });
    }
}
