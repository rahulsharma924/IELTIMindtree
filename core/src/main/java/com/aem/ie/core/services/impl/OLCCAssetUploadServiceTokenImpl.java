package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.OLCCAssetUploadTokenService;
import com.aem.ie.core.configuration.OLCCAssetUploadConfig;
import com.aem.ie.core.constants.ApplConstants;
import com.google.common.io.ByteStreams;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
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

import static com.day.cq.commons.jcr.JcrConstants.JCR_DATA;

@Component(service = OLCCAssetUploadTokenService.class, immediate = true)
@Designate(ocd = OLCCAssetUploadConfig.class)
public class OLCCAssetUploadServiceTokenImpl implements OLCCAssetUploadTokenService {

	private static final Logger LOGGER = LoggerFactory.getLogger(OLCCAssetUploadServiceTokenImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private OLCCAssetUploadConfig configuration;

	@Activate
	protected void activate(OLCCAssetUploadConfig configuration) {
		this.configuration = configuration;
	}

	@Override
	public String getAssetUploadJWTToken(ResourceResolver resolver) throws IOException {
		String accessToken = ApplConstants.EMPTY_STRING;
		Session session = resolver.adaptTo(Session.class);
		try {
			Node assetNode = session.getNode(configuration.getKeyPath());
			InputStream content = assetNode.getProperty(JCR_DATA).getBinary().getStream();
			String jwtToken = getJWTToken(content);
			session.logout();
			resolver.close();
			if (jwtToken != null && !jwtToken.equalsIgnoreCase("")) {
				accessToken = getAccessToken(jwtToken);
			}
		} catch (RepositoryException | NoSuchAlgorithmException | InvalidKeySpecException e) {
			LOGGER.error("Error Occurred: {}", e.getMessage());
		}

		return accessToken;
	}

	public String getJWTToken(InputStream content)
			throws NoSuchAlgorithmException, InvalidKeySpecException, IOException {
		// Load relevant properties from prop file
		String orgId = configuration.getOrgId();
		String technicalAccountId = configuration.getTechnicalAccountId();
		String apiKey = configuration.getAPIKey();
		String imsHost = configuration.getImsHost();
		// Expiration time in seconds
		Long expirationTime = System.currentTimeMillis() / 1000 + 86400L;
		// Metascopes associated to key
		String metascopes = configuration.getMetaScopes();
		// # create the certificate and private key using openssl
		// $ openssl req -nodes -text -x509 -newkey rsa:2048 -keyout secret.pem -out
		// certificate.pem -days 356
		//
		// Upload the certificate.pem in Adobe IO Console-> Your Integration-> Public
		// keys
		//
		// # convert private key to DER format
		// $ openssl pkcs8 -topk8 -inform PEM -outform DER -in secret.pem -nocrypt >
		// secret.key

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
		BufferedReader in = null;
		boolean responseError = false;
		try {
			String imsExchange = configuration.getImsExchange();
			String apiKey = configuration.getAPIKey();
			String secret = configuration.getSecret();
			URL obj = new URL(imsExchange);
			HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
			// add request header
			con.setRequestMethod("POST");
			con.setConnectTimeout(50000);
			con.setReadTimeout(50000);
			// Add parameters to request
			String urlParameters = "client_id=" + apiKey + "&client_secret=" + secret + "&jwt_token=" + jwtToken;

			// Send post request
			con.setDoOutput(true);
			try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
				wr.writeBytes(urlParameters);
				wr.flush();
				int responseCode = con.getResponseCode();
				InputStream is;
				if (responseCode < 400) {
					is = con.getInputStream();
				} else {
					// error from server
					is = con.getErrorStream();
					responseError = true;
				}
				in = new BufferedReader(new InputStreamReader(is));
			}
			String inputLine;
			StringBuilder response = new StringBuilder();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}

			if (responseError) {
				LOGGER.error("Response error : {}", responseError);
			}

			JsonObject jObject = JsonParser.parseString(response.toString()).getAsJsonObject();
			accessToken = jObject.get("access_token").getAsString();
		} catch (IOException e) {
			e.getMessage();
		} finally {
			if (in != null) {
				in.close();
			}
		}
		return accessToken;
	}
}
