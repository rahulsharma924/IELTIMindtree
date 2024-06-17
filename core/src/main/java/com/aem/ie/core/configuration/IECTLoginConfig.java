package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE CT Login API Configurations")
public @interface IECTLoginConfig {
	@AttributeDefinition(name = "IE Login CT URL", description = "Login CT Integration URL")
	String getLoginCTURL() default "";

	@AttributeDefinition(name = "IE Registration CT URL", description = "Registration CT Integration URL")
	String getRegistrationCTURL() default "";

	@AttributeDefinition(name = "IE Checkout Login CT URL", description = "Checkout Login CT Integration URL")
	String getCheckoutLoginCTURL() default "";

	@AttributeDefinition(name = "IE Checkout Guest Registration CT URL", description = "Checkout Guest Registration CT Integration URL")
	String getCheckoutGuestRegCTURL() default "";
}
