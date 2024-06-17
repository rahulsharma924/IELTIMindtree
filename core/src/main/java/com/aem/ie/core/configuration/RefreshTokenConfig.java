package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
@ObjectClassDefinition(name = "Refresh Token API Configurations")
public @interface RefreshTokenConfig {
	@AttributeDefinition(name = "Refresh Token CT URL", description = "Refresh Token CT Integration URL")
	String getRefreshTokenCTURL() default "";
}
