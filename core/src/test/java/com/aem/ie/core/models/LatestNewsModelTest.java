package com.aem.ie.core.models;

import com.aem.ie.core.Service.NewsListService;
import com.aem.ie.core.services.impl.NewsListServiceImpl;
import com.day.cq.wcm.api.Page;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LatestNewsModelTest {
    private final AemContext aemContext = new AemContext();
    LatestNewsModel latestNewsModel = new LatestNewsModel();

    @Mock
    NewsListService newsListServiceMock;

    @InjectMocks
    LatestNewsModel latestNewsModelMock;

    @BeforeAll
    void setUp() {
        MockitoAnnotations.openMocks(this);
        aemContext.addModelsForClasses(LatestNewsModel.class);
        aemContext.load().json("/com/aem/ie/core/models/LatestNewsList.json","/content");
        aemContext.currentResource("/content/latestNews");
        latestNewsModel = aemContext.request().getResource().adaptTo(LatestNewsModel.class);

    }

    @Test
    void getLatestNewsList() {
        when(newsListServiceMock.getNewsRootPath()).thenReturn("Path");
        latestNewsModelMock.getLatestNewsList();

    }

    @Test
    void getHeading() {
        assertEquals("Latest news", latestNewsModel.getHeading());
    }

    @Test
    void getSubHeading() {
        assertEquals("View our latest press releases", latestNewsModel.getSubHeading());
    }
}