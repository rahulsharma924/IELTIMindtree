package com.aem.ie.core.models;

import com.day.cq.dam.api.Asset;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.inject.Inject;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class ResourceCardSlingModelTest {

    AemContext aemContext = new AemContext();

    ResourceCardSlingModel resourceCardSlingModel;

    @Mock
    ResourceCardModel resourceCardModel;
    @Inject
    Resource res;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(ResourceCardSlingModel.class);
        aemContext.addModelsForClasses(ResourceCardModel.class);
        aemContext.load().json("/com/aem/ie/core/models/TechnicalArticleModel.json","/resource");
    }

    @Test
    void init() throws NoSuchMethodException {
        Asset asset = aemContext.create().asset("/content/dam/fm/product/datasheets/test.pdf",1600,900,"application/pdf");
        Resource metadataRes = asset.adaptTo(Resource.class).getChild("jcr:content/metadata");
        ModifiableValueMap map = metadataRes.adaptTo(ModifiableValueMap.class);
        map.put("dc:title", "test dc title");
        map.put("dc:description", "test dc description");
        res = aemContext.currentResource("/resource");
        aemContext.request().setResource(res);
        ResourceCardSlingModel myComponent = new ResourceCardSlingModel();
        Class<?> clazz = myComponent.getClass();
        resourceCardSlingModel = aemContext.request().adaptTo(ResourceCardSlingModel.class);
        resourceCardSlingModel.getResourceCards();
        Method privateMethod = clazz.getDeclaredMethod("assetInfoUpdate",ResourceCardModel.class,String.class,Resource.class);
        privateMethod.setAccessible(true);

    }
}