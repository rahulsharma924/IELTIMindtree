package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE PLP Filter Attribute Config")
public @interface PLPFilterAttributeConfig {

    @AttributeDefinition(name = "IE PLP Filter attribute API URL", description = "PLP Filter attribute API URL")
    String getPLPFilterAttrURL() default "";
}
