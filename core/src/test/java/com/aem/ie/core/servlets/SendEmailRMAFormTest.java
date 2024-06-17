package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ApplConstants.*;
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
public class SendEmailRMAFormTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    private String RMA_EMAIL_TEMPLATE="/content/dam/infinite-electronics/Email Templates/Fairview Microwave/UserTemplateForRMA.txt";
    private String RMA_EMAIL_TEMPLATE_SENDIE = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/SalesTemplateForRMA.txt";
    private  String  RMA_EMAIL_IE_TEMPLATE_LOOP = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/SalesTemplateRMALoop.txt";
    @Mock
    MessageGatewayService messageGatewayService;
    @Mock
    ResourceResolver resolver;
    @Mock
    Node templateNode;
    @Mock
    Node templateNode1;
    @Mock
    Node templateNode2;
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
    Resource resource1;
    @Mock
    Resource resource2;
    @Mock
    Resource resource3;
    @Mock
    Property property;
    @Mock
    Binary binary;
    @Mock
    Property property1;
    @Mock
    Binary binary1;
    @Mock
    Property property2;
    @Mock
    Binary binary2;
    @InjectMocks
    SendEmailRMAForm sendEmailRMAForm;

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
        FileInputStream keyfis2 = new FileInputStream(jsonFile);
        when(request.getResourceResolver()).thenReturn(resolver);
        when(resolver.getResource(RMA_EMAIL_TEMPLATE)).thenReturn(resource);
        when(resource.adaptTo(Node.class)).thenReturn(templateNode);
        when(request.getParameter("salesteamemail")).thenReturn("salestest@gamil.com");
        when(request.getParameter("domainname")).thenReturn("localhost");
        when(request.getParameter("rfname")).thenReturn("testuser");
        when(request.getParameter("rcompany")).thenReturn("test");
        when(request.getParameter("email")).thenReturn("test@gmail.com");
        when(request.getParameter("rjob")).thenReturn("test");
        when(request.getParameter("rphone")).thenReturn("9848012345");
        when(request.getParameter("rcity")).thenReturn("Sterling Heights");
        when(request.getParameter("rstate")).thenReturn("Michigan");
        when(request.getParameter("rzip")).thenReturn("48310");
        when(request.getParameter("rcountry")).thenReturn("USA");
        when(request.getParameter("rinvoice")).thenReturn("test");
        when(request.getParameter("rpo")).thenReturn("1234");
        when(request.getParameter("rsignature")).thenReturn("anchal");
        when(request.getParameter("rdate")).thenReturn("26031993");
        when(request.getParameter("ordertype")).thenReturn("test");
        when(request.getParameter("rskuvalues")).thenReturn(jsonResponseValue());

        when(resolver.getResource(RMA_EMAIL_TEMPLATE + JCR_CONTENT)).thenReturn(resource1);
        when(resource1.adaptTo(Node.class)).thenReturn(content);
        when(content.getProperty(JCR_DATA)).thenReturn(property);
        when(property.getBinary()).thenReturn(binary);
        when(binary.getStream()).thenReturn(keyfis);
        when(resolver.getResource(RMA_EMAIL_TEMPLATE_SENDIE+ JCR_CONTENT)).thenReturn(resource2);
        when(resolver.getResource(RMA_EMAIL_IE_TEMPLATE_LOOP+ JCR_CONTENT)).thenReturn(resource3);
        when(resource2.adaptTo(Node.class)).thenReturn(templateNode1);
        when(templateNode1.getProperty(JCR_DATA)).thenReturn(property1);
        when(property1.getBinary()).thenReturn(binary1);
        when(binary1.getStream()).thenReturn(keyfis1);

        when(resource3.adaptTo(Node.class)).thenReturn(templateNode2);
        when(templateNode2.getProperty(JCR_DATA)).thenReturn(property2);
        when(property2.getBinary()).thenReturn(binary2);
        when(binary2.getStream()).thenReturn(keyfis2);
        when(messageGatewayService.getGateway(Mockito.any())).thenReturn(gateway);
        sendEmailRMAForm.doGet(request, response);

    }

    private String jsonResponseValue(){
        String name="testuser";
        return "[{\n" +
                "    \"sku\": \"SA18S5W-06\",\n" +
                "    \"qty\": \"2\",\n" +
                "    \"ror\": \"reorder\"\n" +
                " }]\n";
    }

}

