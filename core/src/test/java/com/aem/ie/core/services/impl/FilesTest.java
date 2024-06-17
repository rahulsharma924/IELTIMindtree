package com.aem.ie.core.services.impl;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FilesTest {

    Files files =  new Files();

    @Test
    public void testSetFileName(){
        files.setFileName("merged.pdf");
        assertTrue(files.getFileName() == "merged.pdf");
    }

    @Test
    public void setUploadToken(){
        files.setUploadToken("WVROak1TMDNZVEpoTFdZNVl");
        assertTrue(files.getUploadToken() == "WVROak1TMDNZVEpoTFdZNVl");
    }

    @Test
    public void setMimeType(){
        files.setMimeType("application/pdf");
        assertTrue(files.getMimeType() == "application/pdf");
    }

    @Test
    public void setMinPartSize(){
        files.setMinPartSize(10485760);
        assertTrue(files.getMinPartSize() == 10485760);
    }

    @Test
    public void setMaxPartSize(){
        files.setMaxPartSize(104857600);
        assertTrue(files.getMaxPartSize() == 104857600);
    }

    @Test
    public void setUploadURIs(){
        List<String> list=new ArrayList<String>();
        files.setUploadURIs(list);
        assertTrue(files.getUploadURIs() == list);
    }

}