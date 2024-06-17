package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Blog SiteMap Generator Configurations")
public @interface BlogSitemapGeneratorConfig {
    @AttributeDefinition(name = "Blog SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_blog.xml";
    @AttributeDefinition(name ="Blog Root Path")
    String blogRootPath() default "/content/fm/en/meganavigation/tools-resources/technical-resources/blog";
}
