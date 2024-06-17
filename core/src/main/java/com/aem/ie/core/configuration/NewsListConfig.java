package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "News List Related Configurations")
public @interface NewsListConfig {
	
	@AttributeDefinition(name = "News Root Path", description = "News Root Path")
	String getNewsRootPath() default "/content/fm/en/news-releases";
	
	@AttributeDefinition(name = "News Detail Path", description = "News Detail Path")
	String getNewsDetailPath() default "/jcr:content/root/container/news_detail";
	
}
