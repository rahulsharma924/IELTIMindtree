package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.BlogListService;
import com.aem.ie.core.Service.BlogService;
import com.aem.ie.core.models.BlogPage;
import com.aem.ie.core.services.impl.BlogServiceImpl;
import io.wcm.testing.mock.aem.junit5.AemContext;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class GetBlogListServletTest {

    AemContext aemContext = new AemContext();

    @Mock
    BlogListService blogListService;

    @Mock
    BlogService blogService;

    @InjectMocks
    GetBlogListServlet getBlogListServlet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void doGet() {
        List<String> bloglabel = new ArrayList(Arrays.asList("bloglabel"));
        String blogauthor = "blogauthor";
        String blogtitle = "blogtitle";
        String blogimage = "blogimage";
        String blogtext = "blogtext";
        String bloglink = "bloglink";
        String blogimgtext="blogimgtext";
        String formattedDate = "formattedDate";
        BlogPage blogPage = new BlogPage(bloglabel,blogauthor,blogtitle,blogimage,blogtext,bloglink,formattedDate,blogimgtext);
        List<BlogPage> list = new ArrayList<>();
        list.add(blogPage);
        String archivesList1 = "Limiters";
        String archivesList2 = "Mixers";
        List<String> archivesList = new ArrayList<>();
        archivesList.add(archivesList1);
        archivesList.add(archivesList2);
        String getCategories1 = "RF Converter and Calculator";
        String getCategories2 = "Cable Phase Matching";
        HashSet<String> getCategoriesList = new HashSet<>();
        getCategoriesList.add(getCategories1);
        getCategoriesList.add(getCategories2);
        when(blogService.getBlogRootPath()).thenReturn("/content/fm/en/blog");
        when(blogService.getBlogtagRootPath()).thenReturn("/content/cq:tags");
        when(blogService.getBlogArchivesRootPath()).thenReturn("/content/fm/en/blog/archives");
        when(blogListService.getBlogList(Mockito.any(),Mockito.any(),Mockito.any())).thenReturn(list);
        when(blogListService.getArchives(Mockito.any(),Mockito.any())).thenReturn(archivesList);
        when(blogListService.getCategories()).thenReturn(getCategoriesList);
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("year","year");
        getBlogListServlet.doGet(request,response);
    }
}