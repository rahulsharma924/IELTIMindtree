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
import java.util.regex.Matcher;

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
public class SendEmailTest {
	AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    private String EMAIL_TEMPLATE="/content/dam/infinite-electronics/Email Templates/Fairview Microwave/resetpwdemailtemplate.txt";
	@Mock
	MessageGatewayService messageGatewayService;
	
	@Mock
	ResourceResolver resolver;
	
	@Mock
	Node templateNode;
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
	InputStream templateStream;
	@Mock
	InputStreamReader streamReader;
	@Mock
	Property property;
	@Mock
	Binary binary;
	@Mock
	StringSubstitutor sub;
	@Mock
	StringWriter templateStrWriter;
	@Mock
	PrintWriter writer;
	@InjectMocks
	SendEmail sendEmail;
	
	@BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
       }
	@Test()
    void doGetTest() throws ServletException, IOException, PathNotFoundException, RepositoryException, NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		ClassLoader classLoader = this.getClass().getClassLoader();
    	File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
    	FileInputStream keyfis = new FileInputStream(jsonFile);
		when(request.getResourceResolver()).thenReturn(resolver);
		when(resolver.getResource(EMAIL_TEMPLATE)).thenReturn(resource);
		when(resource.adaptTo(Node.class)).thenReturn(templateNode);
		when(request.getParameter("email")).thenReturn("test@gmail.com");
		when(request.getParameter("CTTokenValue")).thenReturn("qj33jCqoi1rSAzlpScAFrvfo5ZQ47aXC");
		when(request.getParameter("domainname")).thenReturn("localhost");
		//when(request.getParameter("subLine")).thenReturn("email send");
		when(resolver.getResource(EMAIL_TEMPLATE + JCR_CONTENT)).thenReturn(resource1);
		when(resource1.adaptTo(Node.class)).thenReturn(content);
		when(content.getProperty(JCR_DATA)).thenReturn(property);
		when(property.getBinary()).thenReturn(binary);
		when(binary.getStream()).thenReturn(keyfis);
		Map<String, String> parameters = new HashMap<String, String>();
		 parameters.put("email", "test@gmail.com");
		parameters.put("token", "qj33jCqoi1rSAzlpScAFrvfo5ZQ47aXC");
		parameters.put("domainname", "localhost");
		when(messageGatewayService.getGateway(Mockito.any())).thenReturn(gateway);
		when(response.getWriter()).thenReturn(writer);
		sendEmail.doPost(request, response);
				
	}
	
}
