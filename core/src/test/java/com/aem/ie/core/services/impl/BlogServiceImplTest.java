package com.aem.ie.core.services.impl;

import com.aem.ie.core.configuration.BlogConfig;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class BlogServiceImplTest {

    private BlogServiceImpl BlogServiceImpl =  new BlogServiceImpl();

    @Test
    void testMethod() {
        BlogConfig config = mock(BlogConfig.class);
        when(config.getBlogRootPath()).thenReturn("rootPath");
        when(config.getBlogtagRootPath()).thenReturn("rootPath");
        when(config.getBlogArchivesRootPath()).thenReturn("rootPath");
        when(config.getArticleLimit()).thenReturn("rootPath");
        BlogServiceImpl.activate(config);
        BlogServiceImpl.getArticleLimit();
        BlogServiceImpl.getBlogRootPath();
        BlogServiceImpl.getBlogtagRootPath();
        BlogServiceImpl.getBlogArchivesRootPath();
    }
}