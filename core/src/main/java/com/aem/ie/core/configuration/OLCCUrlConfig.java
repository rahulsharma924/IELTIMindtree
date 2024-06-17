package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "OLCC Module RF Cable Designer Page URLS")
public @interface OLCCUrlConfig {
	@AttributeDefinition(name = "Get All Options URL", description = "Get All Options for RF Cable Designer Page URL")
	String getAllOptions() default "";
	@AttributeDefinition(name = "Get Options URL", description = "Get Options\\Recommendation for RF Cable Designer Page URL")
	String getOption() default "";
	@AttributeDefinition(name = "Get Search Options URL", description = "Get Search Options for RF Cable Designer Page URL")
	String getSearchOptions() default "";
	@AttributeDefinition(name = "Create Cable Assembly URL", description = "Create Cable Assembly for RF Cable Designer Page URL")
	String getCreateUrl() default "";

	@AttributeDefinition(name = "Get Cable Assembly URL", description = "Get Cable Assembly for RF Cable Designer Page URL")
	String getCableAssembly() default "";

	@AttributeDefinition(name = "Get CustomLengthToCart URL", description = "Get CustomLengthToCart URL")
	String getCustomLengthToCartUrl() default "";
	@AttributeDefinition(name = "Bearer Token URL", description = "Get Bearer Token URL for authentication")
	String getBearerTokenUrl() default "";
	@AttributeDefinition(name = "Client Id for Bearer Token URL", description = "Get Client Id for Bearer Token URL")
	String getClientIdBearerTokenUrl() default "";
	@AttributeDefinition(name = "Client Secret for Bearer Token URL", description = "Get Client Secret for Bearer Token URL")
	String getClientSecretBearerTokenUrl() default "";
	@AttributeDefinition(name = "Grant type for Bearer Token URL", description = "Get Grant Type for Bearer Token URL")
	String getGrantTypeBearerTokenUrl() default "";
	@AttributeDefinition(name = "Scope for Bearer Token URL", description = "Get Scope for Bearer Token URL")
	String getScopeBearerTokenUrl() default "";
	@AttributeDefinition(name = "OLCC Login URL", description = "Get OLCCLogin URL")
	String getOLCCLoginUrl() default "";

	@AttributeDefinition(name = "Get Search Cable Assembly URL", description = "Get Search Cable Assembly for RF Cable Designer Page URL")
	String getSearchCableAssembly() default "";
}
