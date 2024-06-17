package com.aem.ie.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.inject.Inject;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class CalAndConvertorSlingModelTest {

    private final AemContext aemContext=new AemContext();

    CalAndConvertorSlingModel calAndConvertorSlingModel;

    @Mock
    CalAndConvertersModel calAndConvertersModel;
    @Inject
    Resource res;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(CalAndConvertorSlingModel.class);
        aemContext.addModelsForClasses(CalAndConvertersModel.class);
        aemContext.load().json("/com/aem/ie/core/models/TechnicalArticleModel.json","/resource");
    }

    @Test
    void init() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/home-page","jcr:title","Test Title","category","service-cards-clientlib");
        res = aemContext.currentResource("/resource");
        aemContext.request().setResource(res);
        CalAndConvertorSlingModel myComponent = new CalAndConvertorSlingModel();
        Class<?> clazz = myComponent.getClass();
        calAndConvertorSlingModel = aemContext.request().adaptTo(CalAndConvertorSlingModel.class);
        calAndConvertorSlingModel.getConvertersLinksDetails();
        Method privateMethod = clazz.getDeclaredMethod("pageInfoUpdate",CalAndConvertersModel.class,String.class);
        privateMethod.setAccessible(true);


    }
}