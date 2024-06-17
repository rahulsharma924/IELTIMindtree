package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.BlogService;
import com.aem.ie.core.configuration.BlogConfig;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

@Component(service = BlogService.class, immediate = true)
@Designate(ocd = BlogConfig.class)
public class BlogServiceImpl implements BlogService{

    private String blogRootPath;
    private String blogtagRootPath;
    private String blogArchivesRootPath;
    private String articleLimit;

    @Activate
    protected void activate(BlogConfig blogConfig) {
    	blogRootPath = blogConfig.getBlogRootPath();
    	blogtagRootPath = blogConfig.getBlogtagRootPath();
    	blogArchivesRootPath = blogConfig.getBlogArchivesRootPath();
    	articleLimit = blogConfig.getArticleLimit();
    }
    
	@Override
	public String getBlogRootPath() {
		return blogRootPath;
	}

	@Override
	public String getBlogtagRootPath() {
		return blogtagRootPath;
	}

	@Override
	public String getBlogArchivesRootPath() {
		return blogArchivesRootPath;
	}

	@Override
	public String getArticleLimit() {
		return articleLimit;
	}
}
