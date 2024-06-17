package com.aem.ie.core.utils;

import com.aem.ie.core.constants.ApplConstants;
import com.day.cq.wcm.api.Page;

public final class PageUtils {

    private PageUtils() {
    }

    public static Boolean isPage(final Page currentPage) {
        String pageTemplate = "";
        boolean articlePage;
        if (currentPage.getProperties().containsKey(ApplConstants.TEMPLATE)) {
            pageTemplate = currentPage.getProperties().get(ApplConstants.TEMPLATE, "");
        }
        if (pageTemplate.endsWith(ApplConstants.NEWS_PAGE_TEMPLATE)) {
            return true;
        } else if (pageTemplate.endsWith(ApplConstants.BLOG_PAGE_TEMPLATE)) {
            return true;
        } else if (pageTemplate.endsWith(ApplConstants.ARTICLE_PAGE_TEMPLATE)) {
            articlePage = true;
            return articlePage;
        }
        return false;
    }

    public static Boolean isBlogPage(final Page currentPage) {
        String pageTemplate = "";
        if (currentPage.getProperties().containsKey(ApplConstants.TEMPLATE)) {
            pageTemplate = currentPage.getProperties().get(ApplConstants.TEMPLATE, "");
        }
        return pageTemplate.endsWith(ApplConstants.BLOG_PAGE_TEMPLATE);
    }

    public static Boolean isNewsPage(final Page currentPage) {
        String pageTemplate = "";
        if (currentPage.getProperties().containsKey(ApplConstants.TEMPLATE)) {
            pageTemplate = currentPage.getProperties().get(ApplConstants.TEMPLATE, "");
        }
        return pageTemplate.endsWith(ApplConstants.NEWS_PAGE_TEMPLATE);
    }

    public static Boolean isArticlePage(final Page currentPage) {
        String pageTemplate = "";
        if (currentPage.getProperties().containsKey(ApplConstants.TEMPLATE)) {
            pageTemplate = currentPage.getProperties().get(ApplConstants.TEMPLATE, "");
        }
        return pageTemplate.endsWith(ApplConstants.ARTICLE_PAGE_TEMPLATE);
    }

}
