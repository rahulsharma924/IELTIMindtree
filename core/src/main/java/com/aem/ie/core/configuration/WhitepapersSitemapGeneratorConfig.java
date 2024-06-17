package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Whitepapers SiteMap Generator Configurations")
public @interface WhitepapersSitemapGeneratorConfig {
    @AttributeDefinition(name = "Whitepapers SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_whitepapers.xml";
    @AttributeDefinition(name ="Whitepapers Root Path")
    String whitepapersRootPath() default "/content/dam/infinite-electronics/white-papers/fairview-microwave/pdfs";
}
