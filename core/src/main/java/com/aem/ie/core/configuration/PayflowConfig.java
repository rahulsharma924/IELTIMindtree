package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE Payflow API Configurations")
public @interface PayflowConfig {
	@AttributeDefinition(name = "IE Payflow secure token url",
			description = "Generate Secure token url from paypal")
	String getSecureTokenUrl() default "";
	@AttributeDefinition(name = "IE Payflow secure token username",
			description = "Generate Secure token username from paypal")
	String getSecureTokenUsername() default "";
	@AttributeDefinition(name = "IE Payflow secure token password",
			description = "Generate Secure token password from paypal")
	String getSecureTokenPassword() default "";
	@AttributeDefinition(name = "IE Payflow secure token vendor",
			description = "Generate Secure token vendor from paypal")
	String getSecureTokenVendor() default "";
	@AttributeDefinition(name = "IE Payflow Update Address URL",
			description = "PayPal Update Address URL")
	String getPaypalUpdateAddressUrl() default "";
	@AttributeDefinition(name = "IE Payflow Place Order Servlet Path",
			description = "PayPal Place Order Servlet Path")
	String getPlaceOrderServelet() default "";
	@AttributeDefinition(name = "IE Payflow Place Order URL",
			description = "PayPal Place Order URL")
	String getPaypalPlaceOrderUrl() default "";

}
