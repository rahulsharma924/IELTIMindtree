package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Product SiteMap Scheduler Configuration")
public @interface ProductSitemapSchedulerConfig {
    @AttributeDefinition(name = "Product SiteMap Scheduler")
    String schedulerName() default "Product SiteMap Scheduler Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default true;

}