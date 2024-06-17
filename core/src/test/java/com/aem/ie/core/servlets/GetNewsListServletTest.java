package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.NewsListService;
import com.aem.ie.core.configuration.NewsListConfig;
import com.aem.ie.core.models.NewsDetail;
import com.aem.ie.core.services.impl.NewsListServiceImpl;
import com.aem.ie.core.services.impl.OLCCModuleServiceImpl;
import com.google.gson.Gson;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GetNewsListServletTest {

    AemContext aemContext =  new AemContext();

    @Mock
    NewsListService newsListService;

    @InjectMocks
    GetNewsListServlet getNewsListServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doGet(){
        String newsTitle = "title";
        String newsDate = "date";
        String newsLabel = "label";
        String newsPagePath = "path";
        NewsDetail news = new NewsDetail(newsTitle,newsLabel,newsDate,newsPagePath);
        List<NewsDetail> list=new ArrayList<NewsDetail>();
        list.add(news);
        when(newsListService.getNewsRootPath()).thenReturn("/content/fm/en/newsReleases");
        when(newsListService.getNewsList(Mockito.any(),Mockito.any())).thenReturn(list);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        getNewsListServlet.doGet(request,response);
    }
}