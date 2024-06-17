package com.aem.ie.core.services.impl;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;

public class RootTest {
	@Mock
	List<Files> files;

	@Test
    public void testsetSku() {
		Root root = new Root();
		root.setCompleteURI("uri");
		root.setFiles(files);
        assertTrue(root.getCompleteURI() == "uri");
		assertTrue(root.getFiles()==files);
    }
	@Test
    public void testsetFolderPath() {
		Root root = new Root();
		root.setFolderPath("path");
		assertTrue(root.getFolderPath() == "path");
    }
	
}
