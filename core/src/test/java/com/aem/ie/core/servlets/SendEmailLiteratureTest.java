package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ApplConstants.JCR_CONTENT;
import static com.aem.ie.core.constants.ApplConstants.JCR_DATA;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.servlet.ServletException;

import org.apache.commons.mail.HtmlEmail;
import org.apache.commons.text.StringSubstitutor;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class SendEmailLiteratureTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
	private String LITERATURE_EMAIL_TEMPLATE="/content/dam/infinite-electronics/Email Templates/Fairview Microwave/literatureemailtemplate.txt";
	private String LITERATURE_IE_TEMPLATE="/content/dam/infinite-electronics/Email Templates/Fairview Microwave/literatureieemailtemplate.txt";
	@Mock
	MessageGatewayService messageGatewayService;
	
	@Mock
	ResourceResolver resolver;
	@Mock
	ResourceResolver resolver1;
	@Mock
	Node templateNode;
	@Mock
	Node templateNode1;
	@Mock
	Resource resource;
	@Mock
	SlingHttpServletRequest request;
	@Mock
	SlingHttpServletResponse response;
	@Mock
	HtmlEmail htmlEmail;
	@Mock
	MessageGateway gateway;
	@Mock
	Node content;
	@Mock
	ResourceResolver resourceResolver;
	@Mock
	Resource resource1;
	@Mock
	Resource resource2;
	@Mock
	InputStream templateStream;
	@Mock
	InputStreamReader streamReader;
	@Mock
	Property property;
	@Mock
	Binary binary;
	@Mock
	Property property1;
	@Mock
	Binary binary1;
	@Mock
	StringSubstitutor sub;
	@Mock
	StringWriter templateStrWriter;
	@Mock
	PrintWriter writer;
	@InjectMocks
	SendEmailLiterature sendEmailLiterature;
	
	@BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
       }
	@Test()
    void doGetTest() throws ServletException, IOException, PathNotFoundException, RepositoryException, NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		ClassLoader classLoader = this.getClass().getClassLoader();
    	File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
    	FileInputStream keyfis = new FileInputStream(jsonFile);
    	FileInputStream keyfis1 = new FileInputStream(jsonFile);
		when(request.getResourceResolver()).thenReturn(resolver);
		when(resolver.getResource(LITERATURE_EMAIL_TEMPLATE)).thenReturn(resource);
		when(resource.adaptTo(Node.class)).thenReturn(templateNode);
		when(request.getParameter("email")).thenReturn("test@gmail.com");
		when(request.getParameter("name")).thenReturn("testuser");
		when(request.getParameter("domainname")).thenReturn("localhost");
		when(request.getParameter("phone")).thenReturn("9848012345");
		when(resolver.getResource(LITERATURE_EMAIL_TEMPLATE + JCR_CONTENT)).thenReturn(resource1);
		when(resource1.adaptTo(Node.class)).thenReturn(content);
		when(content.getProperty(JCR_DATA)).thenReturn(property);
		when(property.getBinary()).thenReturn(binary);
		when(binary.getStream()).thenReturn(keyfis);
		Map<String, String> parameters = new HashMap<String, String>();
		 parameters.put("email", "test@gmail.com");
		parameters.put("name", "testuser");
		parameters.put("domainname", "localhost");
		//when(request.getResourceResolver()).thenReturn(resourceResolver);
		when(resolver.getResource(LITERATURE_IE_TEMPLATE+ JCR_CONTENT)).thenReturn(resource2);
		when(resource2.adaptTo(Node.class)).thenReturn(templateNode1);
		when(templateNode1.getProperty(JCR_DATA)).thenReturn(property1);
		when(property1.getBinary()).thenReturn(binary1);
		when(binary1.getStream()).thenReturn(keyfis1);
		when(messageGatewayService.getGateway(Mockito.any())).thenReturn(gateway);
		when(response.getWriter()).thenReturn(writer);
		sendEmailLiterature.doGet(request, response);
				
	}
	
}

