package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Product Delivery Rates Url Config")
public @interface ProductDeliveryRatesUrlConfig {
	@AttributeDefinition(name = "Get Product Delivery Rates", description = "Get Product Delivery Rates URL")
    String getProductDeliveryRates() default "";
}
