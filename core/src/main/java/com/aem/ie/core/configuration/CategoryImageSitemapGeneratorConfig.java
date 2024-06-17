package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Category Image SiteMap Generator Configurations")
public @interface CategoryImageSitemapGeneratorConfig {
    @AttributeDefinition(name = "Category Image SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_categoryimage.xml";
    @AttributeDefinition(name ="Category Image Root Path")
    String categoryImageRootPath() default "/content/dam/infinite-electronics/images/fairview-microwave/home-page-category";
}
