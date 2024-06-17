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
public class SendEmailOnOrderConfirmationTest {
    AemContext aemContext =  new AemContext(ResourceResolverType.JCR_MOCK);
    private String EMAIL_TEMPLATE = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/OrderConfirmationEmailTemplate.txt";
    private String EMAIL_TEMPLATE_LOOP = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/LoopTemplateforOrderConfirmation.txt";
    @Mock
    MessageGatewayService messageGatewayService;
    @Mock
    ResourceResolver resolver;
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
    Resource resource1;
    @Mock
    Resource resource2;
    @Mock
    Property property;
    @Mock
    Binary binary;
    @Mock
    Property property1;
    @Mock
    Binary binary1;
    @InjectMocks
    SendEmailOnOrderConfirmation sendEmailOnOrderConfirmation;

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
        when(resolver.getResource(EMAIL_TEMPLATE)).thenReturn(resource);
        when(resource.adaptTo(Node.class)).thenReturn(templateNode);
        when(request.getResourceResolver()).thenReturn(resolver);
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
        when(request.getParameter("shippingMethod")).thenReturn("test");
        when(request.getParameter("paymentMethod")).thenReturn("test");
        when(request.getParameter("subTotal")).thenReturn("128.23");
        when(request.getParameter("ShippingAmt")).thenReturn("234.22");
        when(request.getParameter("TaxAmt")).thenReturn("2.4");
        when(request.getParameter("totalAmt")).thenReturn("55.00");
        when(request.getParameter("lineItems")).thenReturn(jsonLineItems());
        when(request.getParameter("domainname")).thenReturn("local");
        when(resolver.getResource(EMAIL_TEMPLATE + JCR_CONTENT)).thenReturn(resource1);
        when(resource1.adaptTo(Node.class)).thenReturn(content);
        when(content.getProperty(JCR_DATA)).thenReturn(property);
        when(property.getBinary()).thenReturn(binary);
        when(binary.getStream()).thenReturn(keyfis);
        when(resolver.getResource(EMAIL_TEMPLATE_LOOP+ JCR_CONTENT)).thenReturn(resource2);
        when(resource2.adaptTo(Node.class)).thenReturn(templateNode1);
        when(templateNode1.getProperty(JCR_DATA)).thenReturn(property1);
        when(property1.getBinary()).thenReturn(binary1);
        when(binary1.getStream()).thenReturn(keyfis1);
        sendEmailOnOrderConfirmation.doGet(request, response);
    }

    private String jsonLineItems(){
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

