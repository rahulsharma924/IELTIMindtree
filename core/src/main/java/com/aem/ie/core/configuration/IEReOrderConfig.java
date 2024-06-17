package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE Re Order Configurations")
public @interface IEReOrderConfig {
	@AttributeDefinition(name = "IE Reorder API URL", description = "Reorder API URL")
	String getReOrderURL() default "";	
}
