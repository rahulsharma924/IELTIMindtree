package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Product SiteMap Scheduler Configuration")
public @interface ProductSiteMapSchedulerConfiguration {
    @AttributeDefinition(name = "ProductSiteMap Generator Scheduler")
    String schedulerName() default "ProductSiteMap Generator Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "0 0 0 1/1 * ? *";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default true;

}