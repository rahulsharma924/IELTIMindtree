package com.aem.ie.core.models;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;


class BlogPageTest {
    BlogPage blogPage = new BlogPage(new ArrayList<>(Arrays.asList("bloglabel")), "blogauthor",
            "blogtitle", "blogimage", "blogtext","bloglink",
            "formattedDate","blogimgtext");

    BlogPage blogPage2 = new BlogPage(new ArrayList<>(Arrays.asList("bloglabel")), "blogauthor",
            "blogtitle", "bloglink","formattedDate");

    @Test
    void getBlogPage(){
        assertEquals("bloglabel", blogPage.getBloglabel().get(0));
        assertEquals("blogauthor", blogPage.getBlogauthor());
        assertEquals("blogtitle", blogPage.getBlogtitle());
        assertEquals("blogtitle", blogPage.getBlogtitle());
        assertEquals("blogimage", blogPage.getBlogimage());
        assertEquals("blogtext", blogPage.getBlogtext());
        assertEquals("bloglink", blogPage.getBloglink());
        assertEquals("formattedDate", blogPage.getFormattedDate());
    }
    @Test
    void getBlogPageWithNoImageNoText(){
        assertEquals("bloglabel", blogPage2.getBloglabel().get(0));
        assertEquals("blogauthor", blogPage2.getBlogauthor());
        assertEquals("blogtitle", blogPage2.getBlogtitle());
        assertEquals("blogtitle", blogPage2.getBlogtitle());
        assertEquals("", blogPage2.getBlogimage());
        assertEquals("", blogPage2.getBlogtext());
        assertEquals("bloglink", blogPage2.getBloglink());
        assertEquals("formattedDate", blogPage2.getFormattedDate());
    }
}