package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE Calculated Tax Configurations")
public @interface IECTGetTaxConfig {
    @AttributeDefinition(name = "IE Get Calculated Tax API URL", description = "API URL for IE Get Calculated Tax")
    String calculatedTaxCTURL() default "";

    @AttributeDefinition(name = "IE Get Calculated Tax For Reg/Guest User API URL", description = "Get Calculated Tax For Reg/Guest User API URL")
    String calculateTaxCTURL() default "";

    @AttributeDefinition(name = "IE Validate Address URL", description = "Validate Address URL")
    String getValidateAddressCTURL() default "";

    @AttributeDefinition(name = "IE reCalculate Address URL", description = "recalculate Address URL")
    String reCalculateTaxURL() default "";
}