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
import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

import com.aem.ie.core.services.impl.EmailOrderDetail;
import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.google.gson.Gson;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class SendEmailRFQServletTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    private String RFQ_EMAIL_TEMPLATE = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/rfqemailtemplate.txt";
    private String EMAIL_TEMPLATE_SENDIE = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/IErfqemailtemplate.txt";
    private String EMAIL_IE_TEMPLATE_LOOP = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/RFQLoopTemplate.txt";
    private  String PDP_EMAIL_TEMPLATE_SENDIE = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/IErfqpdpemailtemplate.txt";
    private String PDP_EMAIL_IE_TEMPLATE_LOOP = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/rfquserlooptemplate.txt";
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
    Node content2;
    @Mock
    Node content3;
    @Mock
    Resource resource1;
    @Mock
    Resource resource4;
    @Mock
    Resource resource5;

    @Mock
    Node content11;

    @Mock
    Node content22;

    @Mock
    Node content33;

    @Mock
    Resource resource11;

    @Mock
    Resource resource44;

    @Mock
    Resource resource55;

    @Mock
    Property property11;
    @Mock
    Property property22;
    @Mock
    Property property33;

    @Mock
    Binary binary11;
    @Mock
    Binary binary22;
    @Mock
    Binary binary33;
    @Mock
    Property property;
    @Mock
    Binary binary;
    @Mock
    Property property2;
    @Mock
    Binary binary2;

    @InjectMocks
    SendEmailRFQServlet sendEmailRFQServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test()
    void doGetTest() throws ServletException, IOException, PathNotFoundException, RepositoryException, NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        ClassLoader classLoader = this.getClass().getClassLoader();
        ClassLoader classLoader1 = this.getClass().getClassLoader();
        File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
        FileInputStream keyfis = new FileInputStream(jsonFile);
        File jsonFile1 = new File(classLoader1.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
        FileInputStream keyfis1 = new FileInputStream(jsonFile);
        FileInputStream keyfis2 = new FileInputStream(jsonFile1);
        String name="testuser";
        List<String> listofvalues=new ArrayList<String>();
        listofvalues.add(name);
        listofvalues.add("image");
        when(request.getResourceResolver()).thenReturn(resolver);
        when(resolver.getResource(RFQ_EMAIL_TEMPLATE)).thenReturn(resource);
        when(resource.adaptTo(Node.class)).thenReturn(templateNode);
        when(request.getParameter("linkurl")).thenReturn("/continue-shoppin");
        when(request.getParameter("email")).thenReturn("test@gmail.com");
		when(request.getParameter("shippingName")).thenReturn("sandeigo");
		when(request.getParameter("shippingadd")).thenReturn("sandeigo1");
		when(request.getParameter("shippingadd2")).thenReturn("sandeigo2");
		when(request.getParameter("shippingemail")).thenReturn("testuser@gmail.com");
		when(request.getParameter("shippingPhone")).thenReturn("9848012345");
		when(request.getParameter("billingName")).thenReturn("userdetail");
		when(request.getParameter("billingadd")).thenReturn("mexico");
		when(request.getParameter("billingadd2")).thenReturn("mexico1");
		when(request.getParameter("billingemail")).thenReturn("testuser@gmail.com");
		when(request.getParameter("billingPhone")).thenReturn("9848012345");
        when(request.getParameter("domainname")).thenReturn("localhost");
        when(request.getParameter("cartresponse")).thenReturn(jsonStringRFQ());
        when(request.getParameter("customername")).thenReturn("test");
        when(request.getParameter("ieemailidval")).thenReturn("test@gmail.com");

        when(resolver.getResource(RFQ_EMAIL_TEMPLATE + JCR_CONTENT)).thenReturn(resource1);
        when(resource1.adaptTo(Node.class)).thenReturn(content);
        when(content.getProperty(JCR_DATA)).thenReturn(property);
        when(property.getBinary()).thenReturn(binary);
        when(binary.getStream()).thenReturn(keyfis);
        when(resolver.getResource(PDP_EMAIL_TEMPLATE_SENDIE + JCR_CONTENT)).thenReturn(resource4);
        when(resource4.adaptTo(Node.class)).thenReturn(content2);
        when(content2.getProperty(JCR_DATA)).thenReturn(property);
        when(property.getBinary()).thenReturn(binary);
        when(binary.getStream()).thenReturn(keyfis1);
        when(resolver.getResource(PDP_EMAIL_IE_TEMPLATE_LOOP + JCR_CONTENT)).thenReturn(resource5);
        when(resource5.adaptTo(Node.class)).thenReturn(content3);
        when(content3.getProperty(JCR_DATA)).thenReturn(property2);
        when(property2.getBinary()).thenReturn(binary2);
        when(binary2.getStream()).thenReturn(keyfis2);
        sendEmailRFQServlet.doGet(request, response);

    }

    @Test()
    void doGetElseTest() throws ServletException, IOException, PathNotFoundException, RepositoryException, NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        ClassLoader classLoader = this.getClass().getClassLoader();
        ClassLoader classLoader1 = this.getClass().getClassLoader();
        File jsonFile00 = new File(classLoader.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
        FileInputStream keyfis00 = new FileInputStream(jsonFile00);
        File jsonFile11 = new File(classLoader1.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
        FileInputStream keyfis11 = new FileInputStream(jsonFile00);
        FileInputStream keyfis22 = new FileInputStream(jsonFile11);
        String name="testuser";
        List<String> listofvalues=new ArrayList<String>();
        listofvalues.add(name);
        listofvalues.add("image");
        when(request.getResourceResolver()).thenReturn(resolver);
        when(resolver.getResource(RFQ_EMAIL_TEMPLATE)).thenReturn(resource);
        when(resource.adaptTo(Node.class)).thenReturn(templateNode);
        when(request.getParameter("linkurl")).thenReturn("/continue-shopping");
        when(request.getParameter("email")).thenReturn("test@gmail.com");
		
        when(request.getParameter("domainname")).thenReturn("localhost");
        when(request.getParameter("cartresponse")).thenReturn(jsonStringRFQ());
        when(request.getParameter("totalPrice")).thenReturn("120.3");
		when(request.getParameter("subTotal")).thenReturn("1290.3");
		when(request.getParameter("ShippingAmt")).thenReturn("110.3");
        when(request.getParameter("TaxAmt")).thenReturn("100.3");
        when(request.getParameter("totalAmt")).thenReturn("120.3");
        when(request.getParameter("shippingName")).thenReturn("sandeigo");
		when(request.getParameter("shippingadd")).thenReturn("sandeigo1");
		when(request.getParameter("shippingadd2")).thenReturn("sandeigo2");
		when(request.getParameter("shippingemail")).thenReturn("testuser@gmail.com");
		when(request.getParameter("shippingPhone")).thenReturn("9848012345");
		when(request.getParameter("billingName")).thenReturn("userdetail");
		when(request.getParameter("billingadd")).thenReturn("mexico");
		when(request.getParameter("billingadd2")).thenReturn("mexico1");
		when(request.getParameter("billingemail")).thenReturn("testuser@gmail.com");
		when(request.getParameter("billingPhone")).thenReturn("9848012345");
        when(request.getParameter("customername")).thenReturn("test");
        when(request.getParameter("ieemailidval")).thenReturn("test@gmail.com");

        when(resolver.getResource(RFQ_EMAIL_TEMPLATE + JCR_CONTENT)).thenReturn(resource11);
        when(resource11.adaptTo(Node.class)).thenReturn(content11);
        when(content11.getProperty(JCR_DATA)).thenReturn(property11);
        when(property11.getBinary()).thenReturn(binary11);
        when(binary11.getStream()).thenReturn(keyfis00);
        when(resolver.getResource(PDP_EMAIL_IE_TEMPLATE_LOOP + JCR_CONTENT)).thenReturn(resource55);
        when(resource55.adaptTo(Node.class)).thenReturn(content33);
        when(content33.getProperty(JCR_DATA)).thenReturn(property33);
        when(property33.getBinary()).thenReturn(binary33);
        when(binary33.getStream()).thenReturn(keyfis22);
        when(resolver.getResource(EMAIL_TEMPLATE_SENDIE + JCR_CONTENT)).thenReturn(resource44);
        when(resource44.adaptTo(Node.class)).thenReturn(content22);
        when(content22.getProperty(JCR_DATA)).thenReturn(property22);
        when(property22.getBinary()).thenReturn(binary22);
        when(binary22.getStream()).thenReturn(keyfis11);
        when(resolver.getResource(EMAIL_IE_TEMPLATE_LOOP + JCR_CONTENT)).thenReturn(resource55);
        when(resource55.adaptTo(Node.class)).thenReturn(content33);
        when(content33.getProperty(JCR_DATA)).thenReturn(property33);
        when(property33.getBinary()).thenReturn(binary33);
        when(binary33.getStream()).thenReturn(keyfis22);
        //when(messageGatewayService.getGateway(Mockito.any())).thenReturn(gateway);
        sendEmailRFQServlet.doGet(request, response);

    }
    private String jsonStringRFQ(){
        String name="testuser";
        return "[{\n" +
                "    \"name\": \"6 dB Fixed Attenuator SMA Male (Plug) to SMA Female (Jack) Up to 18 GHz Rated to 5 Watts, Heatsink Body, 1.35 VSWR\",\n" +
                "    \"sku\": \"SA18S5W-06\",\n" +
                "    \"image\": \"image\",\n" +
                "    \"quantity\": 2,\n" +
                "    \"unitprice\": \"155.99\",\n" +
                "    \"subtotalPrice\": \"311.98\",\n" +
                "    \"price\": \"311.98\",\n" +
                "    \"color\": \"Cable color\",\n" +
                "    \"coaxType\": \"Coax Type\",\n" +
                "    \"flexType\": \"Flex type\",\n" +
                "    \"impedence\": \"Impedence\",\n" +
                "    \"attenuation\": \"IL (db/100)\",\n" +
                "    \"maxfrequency\": \"Max frequency\",\n" +
                "    \"noOfshields\": \"Number of sheilds\"\n" +
                " }]\n";
    }
}

