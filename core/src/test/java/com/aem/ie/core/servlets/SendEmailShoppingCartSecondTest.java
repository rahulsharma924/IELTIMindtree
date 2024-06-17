package com.aem.ie.core.servlets;

import com.day.cq.dam.api.Asset;
import com.google.common.io.Files;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static com.aem.ie.core.constants.ApplConstants.JCR_CONTENT;
import static com.aem.ie.core.constants.ApplConstants.JCR_DATA;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class SendEmailShoppingCartSecondTest {
    AemContext aemContext =  new AemContext();
    String path = "/content/dam/infinite-electronics/Email Templates/Fairview Microwave/cartemailtemplate.txt";

    @Mock
    ResourceResolver resourceResolver;
    @Mock
    ResourceResolver resolver;
    @Mock
    Resource resource;
    @Mock
    Node templateNode;

    @Mock
    SendEmailShoppingCart mockSendEmailShoppingCart;

    @InjectMocks
    SendEmailShoppingCart sendEmailShoppingCart;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doGet() throws IOException, RepositoryException {
        //when(mockSendEmailShoppingCart.loadTemplate(Mockito.anyString(),Mockito.any(),Mockito.any())).thenReturn("templateString");
        //when(mockSendEmailShoppingCart.loadDetailTemplate(Mockito.anyString(),Mockito.any(),Mockito.any())).thenReturn("loopTemplateString");
        when(resolver.getResource(path)).thenReturn(resource);
        when(resource.adaptTo(Node.class)).thenReturn(templateNode);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        Resource resource = aemContext.create().resource("/content/dam/infinite-electronics/Email Templates/Fairview Microwave/cartemailtemplate.txt");
        aemContext.request().setResource(resource);
        //ClassLoader classLoader = this.getClass().getClassLoader();
        //File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
        //byte[] bytes = Files.toByteArray(jsonFile);
        //FileInputStream keyfis = new FileInputStream(jsonFile);
        //resource.adaptTo(Node.class).
        /*ClassLoader classLoader = this.getClass().getClassLoader();
        File jsonFile = new File(classLoader.getResource("com/aem/ie/core/models/ServletResponse.json").getFile());
        FileInputStream keyfis = new FileInputStream(jsonFile);*/
        //Asset asset = aemContext.create().asset("/content/dam/infinite-electronics/Email Templates/Fairview Microwave/cartemailtemplate.txt",1600,900,"text/plain");
        //asset.addRendition("original",keyfis,"text/plain");


        request.addRequestParameter("email","test@gmail.com");
        request.addRequestParameter("shippingName","sandeigo");
        request.addRequestParameter("hostname","localhost");
        request.addRequestParameter("shippingadd","sandeigo1");
        request.addRequestParameter("shippingadd2","sandeigo2");
        request.addRequestParameter("shippingemail","testuser@gmail.com");
        request.addRequestParameter("shippingPhone","9848012345");
        request.addRequestParameter("billingName","userdetail");
        request.addRequestParameter("billingadd","mexico");
        request.addRequestParameter("billingadd2","mexico1");
        request.addRequestParameter("billingemail","testuser@gmail.com");
        request.addRequestParameter("billingPhone","9848012345");
        request.addRequestParameter("totalPrice","128.23");
        request.addRequestParameter("ShippingAmt","234.22");
        request.addRequestParameter("TaxAmt","2.4");
        request.addRequestParameter("totalAmt","55.00");
        request.addRequestParameter("cartresponse","responsevalue");
        sendEmailShoppingCart.doGet(request,response);
    }

    @Test
    void loadTemplate() {
    }

    @Test
    void loadDetailTemplate() {
    }
}