package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Blog Related Configurations")
public @interface BlogConfig {
	@AttributeDefinition(name = "Blog Root Path", description = "Blog Root Path")
	String getBlogRootPath() default "/content/fm/en/blog";
	
	@AttributeDefinition(name = "Blog Tag Root Path", description = "Blog Tag Root Path")
	String getBlogtagRootPath() default "/content/cq:tags";

	@AttributeDefinition(name = "Blog Archives Root Path", description = "Blog Archives Root Path")
	String getBlogArchivesRootPath() default "/content/fm/en/blog/archives";

	@AttributeDefinition(name = "Articl Limit", description = "Limit for the related articles")
	String getArticleLimit() default "3";

}
