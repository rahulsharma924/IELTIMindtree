package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE Product Projection")
public @interface getproductprojectionconfig {
    @AttributeDefinition(name = "IE Product Projection Price API URL", description = "API URL for IE Product Delivery Date")
    String getProductProjectionApiUrl() default "";  
}