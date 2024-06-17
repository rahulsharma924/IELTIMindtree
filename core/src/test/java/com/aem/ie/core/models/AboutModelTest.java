package com.aem.ie.core.models;

import static org.mockito.Mockito.when;

import java.util.Iterator;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
@ExtendWith({AemContextExtension.class, MockitoExtension.class})
public class AboutModelTest {
	AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
	@Mock
	Resource res;
	@Mock
	Resource resource;
	@Mock
	Iterable<Resource> res1;
	@Mock
	Iterator<Resource> itr;
	@Mock
	Resource resVal;
	@Mock
	ValueMap valmap;
	@InjectMocks
    AboutModel aboutModel;
	
	@BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(AboutModel.class);
    }

    @Test
    void getAccDetailsTest() {
    	when(resource.getChild("strengthdetails")).thenReturn(res);
    	when(res.getChildren()).thenReturn(res1);
    	when(res1.iterator()).thenReturn(itr);
    	when(itr.hasNext()).thenReturn(false);
    	aboutModel.getAccDetails();
    }
   
}
