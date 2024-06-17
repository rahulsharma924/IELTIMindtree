package com.aem.ie.core.utils;

import java.io.InputStream;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.UnsupportedRepositoryOperationException;
import javax.jcr.ValueFactory;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;

import static org.mockito.Mockito.when;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.w3c.dom.Document;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;
@ExtendWith({AemContextExtension.class,MockitoExtension.class})
public class SitemapUtilsTest {
	@Mock
	ResourceResolver resourceResolver;
	@Mock
	Document document;
	@Mock
	Session session;
	@Mock
	InputStream fileInputStream;
	@Mock
	ValueFactory valueFactory;
	@Mock
	UnsupportedRepositoryOperationException unsupportedRepositoryOperationException;
	@Mock
	RepositoryException repositoryException;
	@Test
    void covertDocumentToBinaryTest() throws UnsupportedRepositoryOperationException, RepositoryException {
	when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
	when(session.getValueFactory()).thenReturn(valueFactory);
	SitemapUtils.covertDocumentToBinary(resourceResolver, document);
	}
	@Test
    void covertDocumentToBinaryTestException() throws RepositoryException {
	when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
	try {
			when(session.getValueFactory()).thenThrow(unsupportedRepositoryOperationException);
		} catch (UnsupportedRepositoryOperationException e) {
			e.printStackTrace();
		}
	SitemapUtils.covertDocumentToBinary(resourceResolver, document);
	}
	@Test
    void covertDocumentToBinaryTestRepoException() {
	when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
		try {
			when(session.getValueFactory()).thenThrow(repositoryException);
		} catch (RepositoryException e) {
			e.printStackTrace();
		}
	SitemapUtils.covertDocumentToBinary(resourceResolver, document);
	}
}
