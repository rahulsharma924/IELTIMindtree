package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE API Direct Call Configurations")
public @interface IEDirectCallConfig {
	@AttributeDefinition(name = "IE Logout API URL", description = "Logout CT Integration URL")
	String getLogoutCTURL() default "";
	@AttributeDefinition(name = "IE Reset Paasword API URL", description = "Reset Password CT Integration URL")
	String getResetPasswordCTURL() default "";
	@AttributeDefinition(name = "IE Email Change Paasword API URL", description = "Email Change Password CT Integration URL")
	String getEmailChangePwdCTURL() default "";
	@AttributeDefinition(name = "IE Active cart API URL", description = "IE Active cart API URL")
	String getUserActiveCart() default "";
	@AttributeDefinition(name = "IE Customer Profile API URL", description = "IE Customer Profile API URL")
	String getCustomerProfile() default "";
	@AttributeDefinition(name = "IE Token Validation API URL", description = "IE CT Token Validation API URL")
	String getTokenValid() default "";
}
