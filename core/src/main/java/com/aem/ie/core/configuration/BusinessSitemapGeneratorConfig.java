package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Blog SiteMap Generator Configurations")
public @interface BusinessSitemapGeneratorConfig {
    @AttributeDefinition(name = "Business SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_business.xml";
    @AttributeDefinition(name ="Business Pages Root Paths")
    String[] businessPagesRootPaths() default "";
}
