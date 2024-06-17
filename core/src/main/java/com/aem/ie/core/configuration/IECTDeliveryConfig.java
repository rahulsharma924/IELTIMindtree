package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE Delivery Configurations")
public @interface IECTDeliveryConfig {
    @AttributeDefinition(name = "IE Delivery Option API URL", description = "API URL for IE Delivery Option")
    String deliveryCTURL() default "";
}