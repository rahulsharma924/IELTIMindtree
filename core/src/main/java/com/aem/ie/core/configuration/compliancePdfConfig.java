package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Compliance pdf Configurations")
public @interface compliancePdfConfig {
	@AttributeDefinition(name = "Compliance Pdf Configuration", description = "Compliance Pdf Configuration")
	String getPdfPath() default "";
}
