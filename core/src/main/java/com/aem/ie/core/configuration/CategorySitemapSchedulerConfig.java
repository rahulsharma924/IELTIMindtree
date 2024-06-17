package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Product Category SiteMap Scheduler Configuration")
public @interface CategorySitemapSchedulerConfig {
    @AttributeDefinition(name = "Product Category SiteMap Generator Scheduler")
    String schedulerName() default "Product Category SiteMap Generator Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default false;

}