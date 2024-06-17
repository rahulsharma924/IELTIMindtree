package com.aem.ie.core.Service;

import java.io.IOException;
import org.apache.http.client.ClientProtocolException;
import org.apache.sling.api.SlingHttpServletRequest;

public interface RefreshTokenService {

    public String getRefreshTokenVal(String refreshToken, String bearerToken) throws IOException;
}