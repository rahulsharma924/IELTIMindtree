package com.aem.ie.core.services.impl;

import java.util.List;

public class Files {

    protected String fileName;
    protected List<String> uploadURIs;
    protected String uploadToken;
    protected String mimeType;
    protected int minPartSize;
    protected int maxPartSize;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public List<String> getUploadURIs() {
        return uploadURIs;
    }

    public void setUploadURIs(List<String> uploadURIs) {
        this.uploadURIs = uploadURIs;
    }

    public String getUploadToken() {
        return uploadToken;
    }

    public void setUploadToken(String uploadToken) {
        this.uploadToken = uploadToken;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public int getMinPartSize() {
        return minPartSize;
    }

    public void setMinPartSize(int minPartSize) {
        this.minPartSize = minPartSize;
    }

    public int getMaxPartSize() {
        return maxPartSize;
    }

    public void setMaxPartSize(int maxPartSize) {
        this.maxPartSize = maxPartSize;
    }

}

