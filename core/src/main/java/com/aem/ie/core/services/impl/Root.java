package com.aem.ie.core.services.impl;

import java.util.List;

public class Root {

    protected String folderPath;
    protected List<Files> files;
    protected String completeURI;

    public String getFolderPath() {
        return folderPath;
    }

    public void setFolderPath(String folderPath) {
        this.folderPath = folderPath;
    }

    public List<Files> getFiles() {
        return files;
    }

    public void setFiles(List<Files> files) {
        this.files = files;
    }

    public String getCompleteURI() {
        return completeURI;
    }

    public void setCompleteURI(String completeURI) {
        this.completeURI = completeURI;
    }

}
