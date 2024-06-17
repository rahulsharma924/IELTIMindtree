package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "News SiteMap Scheduler Configuration")
public @interface NewsSitemapSchedulerConfig {
    @AttributeDefinition(name = "News SiteMap Scheduler Scheduler")
    String schedulerName() default "News SiteMap Scheduler Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default false;
}
