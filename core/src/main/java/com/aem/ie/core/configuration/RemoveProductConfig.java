package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "CT Remove Product API Configurations")
public @interface RemoveProductConfig {
    @AttributeDefinition(name = "URL for remove product", description = " remove product URL")
    String getRemoveProductURL() default "";
}
