package com.aem.ie.core.utils;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import javax.inject.Inject;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({AemContextExtension.class})
class PageUtilsTest {
    AemContext aemContext = new AemContext();

    @BeforeEach
    void setUp() {
        aemContext.load().json("/com/aem/ie/core/models/PageUtils.json","/page");
    }

    @Test
    void isPage() {
        Page page = aemContext.currentPage("/page/PageUtils");
        PageUtils.isPage(page);
    }
    @Test
    void isPageOne() {
        Page page = aemContext.currentPage("/page/PageUtils1");
        PageUtils.isPage(page);
    }
    @Test
    void isPageTwo() {
        Page page = aemContext.currentPage("/page/PageUtils2");
        PageUtils.isPage(page);
    }
    @Test
    void isPageThree() {
        Page page = aemContext.currentPage("/page/PageUtils3");
        PageUtils.isPage(page);
    }

    @Test
    void isBlogPage() {
        Page page = aemContext.currentPage("/page/PageUtils2");
        PageUtils.isBlogPage(page);
    }

    @Test
    void isNewsPage() {
        Page page = aemContext.currentPage("/page/PageUtils1");
        PageUtils.isNewsPage(page);
    }

    @Test
    void isArticlePage() {
        Page page = aemContext.currentPage("/page/PageUtils3");
        PageUtils.isArticlePage(page);
    }
}