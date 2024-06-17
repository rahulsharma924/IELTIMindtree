package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Google Captcha Configurations")
public @interface GoogleCaptchaConfig {
    @AttributeDefinition(name = "Google Secret Key", description = "Secret Key for Google Captcha Service")
    String secretKey() default "";

}
