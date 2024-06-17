package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE CT Change pwd API Configurations")
public @interface IECTChangePwdConfig {
	@AttributeDefinition(name = "IE Change PWD CT URL", description = "Change pwd CT Integration URL")
	String getChangepwdCTURL() default "";

}
