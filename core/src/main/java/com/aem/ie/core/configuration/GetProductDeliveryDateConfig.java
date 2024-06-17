package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE Product Delivery Date")
public @interface GetProductDeliveryDateConfig {
    @AttributeDefinition(name = "IE Product Delivery Date API URL", description = "API URL for IE Product Delivery Date")
    String getProductDeliveryDateApiUrl() default "";  
}