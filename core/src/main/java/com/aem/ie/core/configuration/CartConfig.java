package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "CT clear cart API Configurations")
public @interface CartConfig {
    @AttributeDefinition(name = "URL for clear cart", description = " clear cart URL")
    String getClearCartURL() default "";
	@AttributeDefinition(name = "URL for Update cart API", description = " update cart URL")
    String getUpdateCartURL() default "";
    @AttributeDefinition(name = "URL for Calculate custom length price API", description = " Calculate custom length price URL")
    String getCustomLengthPriceURL() default "";

    @AttributeDefinition(name = "URL for Calculate discounted price for the product", description = " Calculate discount factor price")
    String getDiscountFactorPriceURL() default "";
}

