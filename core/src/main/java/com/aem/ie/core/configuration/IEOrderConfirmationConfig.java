package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE Order Confirmation API")
public @interface IEOrderConfirmationConfig {

    @AttributeDefinition(name = "IE Order Confirmation API URL", description = "Order Confirmation API URL")
    String getOrderConfirmationURL() default "";
}
