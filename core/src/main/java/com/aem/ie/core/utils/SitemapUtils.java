package com.aem.ie.core.utils;

import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

import javax.jcr.*;
import javax.xml.XMLConstants;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class SitemapUtils {
	private SitemapUtils() {
	}

	private static final Logger log = LoggerFactory.getLogger(SitemapUtils.class);

	public static Binary covertDocumentToBinary(ResourceResolver resourceResolver, Document document) {
		try {
			Session session = resourceResolver.adaptTo(Session.class);
			InputStream fileInputStream;
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			// to be compliant, prohibit the use of all protocols by external entities:
			transformerFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
			transformerFactory.setAttribute(XMLConstants.ACCESS_EXTERNAL_STYLESHEET, "");
			Transformer transformer = transformerFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			DOMSource domSource = new DOMSource(document);
			StreamResult streamResult = new StreamResult(byteArrayOutputStream);
			// Transform document -->StreamResult
			transformer.transform(domSource, streamResult);
			// covert byteArrayOutputStream -->byte array
			byte[] bytes = byteArrayOutputStream.toByteArray();
			// convert byte array to inputStream
			fileInputStream = new ByteArrayInputStream(bytes);
			// converting to Binary
			final ValueFactory valueFactory = session.getValueFactory();
			return valueFactory.createBinary(fileInputStream);
		} catch (TransformerConfigurationException tconfigurationException) {
			log.error("TransformerConfigurationException Exception Occurred{}", tconfigurationException.getMessage());
		} catch (TransformerException transformerException) {
			log.error("TransformerException Exception Occurred{}", transformerException.getMessage());
		} catch (UnsupportedRepositoryOperationException unsupportedRepositoryOperationException) {
			log.error("UnsupportedRepositoryOperationException Exception Occurred{}",
					unsupportedRepositoryOperationException.getMessage());
		} catch (RepositoryException repositoryException) {
			log.error("RepositoryException Exception Occurred{}", repositoryException.getMessage());
		}
		return null;
	}
}
