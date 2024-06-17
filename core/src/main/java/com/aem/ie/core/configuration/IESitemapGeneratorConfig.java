package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE SiteMap Generator Configurations")
public @interface IESitemapGeneratorConfig {
    @AttributeDefinition(name = "IE SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_index.xml";
    @AttributeDefinition(name = "Category Json Path")
    String rootPath() default "/content/fm";
}
