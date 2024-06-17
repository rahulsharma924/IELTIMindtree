package com.aem.ie.core.services.impl;

import com.aem.ie.core.configuration.OLCCAssetUploadConfig;
import com.aem.ie.core.constants.ApplConstants;
import com.day.cq.dam.api.AssetManager;
import com.google.common.io.ByteStreams;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
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

class OLCCDamAssetUploadServiceImplTest {

    AemContext aemContext = new AemContext();
    @InjectMocks
    OLCCDamAssetUploadServiceImpl olccDamAssetUploadServiceImpl;
    @Mock
    ResourceResolverFactory resourceResolverFactoryMock;
    @Mock
    ResourceResolver resourceResolverMock;
    @Mock
    ValueFactory valueFactoryMock;
    @Mock
    Session sessionMock;
    @Mock
    AssetManager assetManagerMock;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void mergePDF() throws IOException, LoginException, RepositoryException {
            OLCCAssetUploadConfig config = mock(OLCCAssetUploadConfig.class);
            olccDamAssetUploadServiceImpl.activate(config);
            when(config.getAemHost()).thenReturn("https://author-p78402-e955507.adobeaemcloud.com");
            when(config.getAemMergedPdfFetchFolder()).thenReturn("/api/assets/fm/product/datasheets/");
            when(config.getAemMergedPdfDownloadFolder()).thenReturn("/api/assets/merged/");
            when(config.getAemMergedPdfUploadFolder()).thenReturn("/content/dam/merged");
            when(config.getAemPdfAssetDownloadFolder()).thenReturn("/api/assets/staticfile-poc/");
            when(config.getAemPdfAssetUploadFolder()).thenReturn("/content/dam/staticfile-poc");
            when(config.getAssetReplicateURL()).thenReturn("https://author-p78402-e955507.adobeaemcloud.com/bin/replicate.json");
            when(config.getAssetReplicateFolderPath()).thenReturn("/content/dam/merged/");
            Map<String,Object> paramMap = new HashMap<>();
            paramMap.put(ResourceResolverFactory.SUBSERVICE,"fm-service-user");
            when(resourceResolverFactoryMock.getServiceResourceResolver(paramMap)).thenReturn(resourceResolverMock);
            when(resourceResolverMock.adaptTo(Session.class)).thenReturn(sessionMock);
            when(sessionMock.getValueFactory()).thenReturn(valueFactoryMock);
            when(resourceResolverMock.adaptTo(AssetManager.class)).thenReturn(assetManagerMock);
            String mergedFileName = "attachment.pdf";
            String connector1 = "";
            String connector2 = "";
            String cable = "LMR-400.pdf";
            String bearerToken = getAssetUploadJWTToken();
            olccDamAssetUploadServiceImpl.mergePDF(mergedFileName, connector1, connector2, cable, bearerToken);
    }

    public String getAssetUploadJWTToken() throws IOException {
        String accessToken = ApplConstants.EMPTY_STRING;
        String jwtToken = "";
        try {
            ClassLoader classLoader = this.getClass().getClassLoader();
            File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/secret.key").getFile());
            assertTrue(jsonFile.exists());
            FileInputStream keyfis = new FileInputStream(jsonFile);
            jwtToken = getJWTToken(keyfis);
            if(jwtToken != null && !jwtToken.equalsIgnoreCase("")) {
                accessToken = getAccessToken(jwtToken);
            }
        } catch(Exception e) {
            e.getMessage();
        }
        return accessToken;
    }

    public String getJWTToken(FileInputStream content)
            throws NoSuchAlgorithmException, InvalidKeySpecException, IOException {
        // Load relevant properties from prop file
        String orgId = "757E34EE62B97AC60A495E3C@AdobeOrg";
        String technicalAccountId = "EF7627226433E3160A495FCA@techacct.adobe.com";
        String apiKey = "cm-p78402-e955507-integration-0";
        String imsHost = "ims-na1.adobelogin.com";
        Long expirationTime = System.currentTimeMillis() / 1000 + 86400L;
        String metascopes = "ent_aem_cloud_api";

        // Secret key as byte array. Secret key file should be in DER encoded format.
        byte[] privateKeyFileContent = ByteStreams.toByteArray(content);

        // Read the private key
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        KeySpec ks = new PKCS8EncodedKeySpec(privateKeyFileContent);
        RSAPrivateKey privateKey = (RSAPrivateKey) keyFactory.generatePrivate(ks);

        // Create JWT payload
        Map<String, Object> jwtClaims = new HashMap<>();
        jwtClaims.put("iss", orgId);
        jwtClaims.put("sub", technicalAccountId);
        jwtClaims.put("exp", expirationTime);
        jwtClaims.put("aud", "https://" + imsHost + "/c/" + apiKey);
        jwtClaims.put("https://" + imsHost + "/s/" + metascopes, true);


        SignatureAlgorithm sa = SignatureAlgorithm.RS256;
        // Create the final JWT token
        return Jwts.builder().setClaims(jwtClaims).signWith(sa, privateKey).compact();
    }

    public String getAccessToken(String jwtToken) throws IOException {
        // Load relevant properties from prop file
        String accessToken = "";
        String imsExchange = "https://ims-na1.adobelogin.com/ims/exchange/jwt";
        String apiKey = "cm-p78402-e955507-integration-0";
        String secret = "p8e-v0v2AK-xea9PEw3hR9vcnOe_hlscAOoQ";
        URL obj = new URL(imsExchange);
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
        // add request header
        con.setRequestMethod("POST");
        con.setConnectTimeout(50000);
        // Add parameters to request
        String urlParameters = "client_id=" + apiKey + "&client_secret=" + secret + "&jwt_token=" + jwtToken;
        // Send post request
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(urlParameters);
        wr.flush();
        wr.close();
        int responseCode = con.getResponseCode();
        boolean responseError = false;
        InputStream is;
        if(responseCode < 400) {
            is = con.getInputStream();
        } else {
            // error from server
            is = con.getErrorStream();
            responseError = true;
        }
        BufferedReader in = new BufferedReader(new InputStreamReader(is));
        String inputLine;
        StringBuilder response = new StringBuilder();
        while((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        JsonObject jObject = JsonParser.parseString(response.toString()).getAsJsonObject();
        accessToken = jObject.get("access_token").getAsString();
        return accessToken;
    }

}