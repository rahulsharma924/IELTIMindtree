package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Brochures SiteMap Generator Configurations")
public @interface BrochuresSitemapGeneratorConfig {
    @AttributeDefinition(name = "Brochures SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_brochures.xml";
    @AttributeDefinition(name ="Brochures Root Path")
    String brochuresRootPath() default "/content/dam/infinite-electronics/brochures/fairview-microwave/pdfs";
}
