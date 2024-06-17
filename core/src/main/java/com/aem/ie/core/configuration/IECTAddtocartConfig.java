package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
@ObjectClassDefinition(name = "IE CT Add to Cart API Configurations")
public @interface IECTAddtocartConfig {
	@AttributeDefinition(name = "IE Login Add To Cart CT URL", description = "Add To Cart CT Integration URL")
	String getAddToCartCTURL() default "";
}
