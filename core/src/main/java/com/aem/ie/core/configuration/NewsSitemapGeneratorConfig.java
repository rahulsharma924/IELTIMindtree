package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "News SiteMap Generator Configurations")
public @interface NewsSitemapGeneratorConfig {
    @AttributeDefinition(name = "News SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_news.xml";
    @AttributeDefinition(name ="News Root Path")
    String newsRootPath() default "/content/fm/en/news-releases";
}
