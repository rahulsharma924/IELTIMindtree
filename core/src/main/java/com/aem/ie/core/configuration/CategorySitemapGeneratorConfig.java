package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Category SiteMap Generator Configurations")
public @interface CategorySitemapGeneratorConfig {
    @AttributeDefinition(name = "Product Category SiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_category.xml";
    @AttributeDefinition(name = "Category Json Path")
    String categoryJsonPath() default "/content/dam/infinite-electronics/json/fairview-microwave/Categories.json";
    @AttributeDefinition(name ="Last modified Date for Pages", description = "Please enter date in format of YYYY-MM-DD")
    String lastModifiedDate() default "2023-07-11";
}
