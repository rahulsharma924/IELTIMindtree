package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "CT Order Integration API Configurations")
public @interface CTIOrderConfig {
	@AttributeDefinition(name = "Order History URL", description = "Order History CT Integration URL")
	String getOrderHistoryURL() default "";
	@AttributeDefinition(name = "Order Details URL", description = "Order Details CT Integration URL")
	String getOrderDetailsURL() default "";
}

