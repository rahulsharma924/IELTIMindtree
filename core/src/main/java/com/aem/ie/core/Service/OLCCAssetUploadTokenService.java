package com.aem.ie.core.Service;

import org.apache.sling.api.resource.ResourceResolver;

import java.io.IOException;

public interface OLCCAssetUploadTokenService {

    public String getAssetUploadJWTToken(ResourceResolver resolver) throws IOException;
}
