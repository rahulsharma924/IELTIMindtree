package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Product PDF SiteMap Scheduler Configuration")
public @interface ProductPdfSitemapSchedulerConfig {
    @AttributeDefinition(name = "Product PDF SiteMap Generator Scheduler")
    String schedulerName() default "Product PDF SiteMap Scheduler Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default false;

}