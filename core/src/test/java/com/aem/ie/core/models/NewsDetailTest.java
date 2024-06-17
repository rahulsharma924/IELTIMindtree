package com.aem.ie.core.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NewsDetailTest {

    NewsDetail newsDetail1 = new NewsDetail("newsTitle", "newsLabel", "newsDate",
            "newsPagePath");
    NewsDetail newsDetail2 = new NewsDetail("newsTitle", "newsDate", "newsPagePath");

    @Test
    void getNewsDetailWithLabel(){
        assertEquals("newsTitle", newsDetail1.getNewsTitle());
        assertEquals("newsLabel", newsDetail1.getNewsLabel());
        assertEquals("newsDate", newsDetail1.getNewsDate());
        assertEquals("newsPagePath", newsDetail1.getNewsPagePath());
    }
    @Test
    void getNewsDetailWithoutLabel(){
        assertEquals("newsTitle", newsDetail2.getNewsTitle());
        assertEquals("", newsDetail2.getNewsLabel());
        assertEquals("newsDate", newsDetail2.getNewsDate());
        assertEquals("newsPagePath", newsDetail2.getNewsPagePath());
    }
}