package com.aem.ie.core.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LatestNewsDetailTest {
    LatestNewsDetail latestNewsDetail = new LatestNewsDetail("latestNewsTitle","latestNewsLabel",
            "latestNewsDate", "latestNewsPagePath");

    @Test
    void getLatestNewsDetail(){
        assertEquals("latestNewsTitle", latestNewsDetail.getLatestNewsTitle());
        assertEquals("latestNewsLabel", latestNewsDetail.getLatestNewsLabel());
        assertEquals("latestNewsDate", latestNewsDetail.getLatestNewsDate());
        assertEquals("latestNewsPagePath", latestNewsDetail.getLatestNewsPagePath());
    }
}