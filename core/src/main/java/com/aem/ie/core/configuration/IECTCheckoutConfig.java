package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE CT Checkout Configurations")
public @interface IECTCheckoutConfig {
    @AttributeDefinition(name = "IE Checkout Update Cart CT URL", description = "IE Checkout Update Cart CT URL")
    String updateCartCTURL() default "";
}
