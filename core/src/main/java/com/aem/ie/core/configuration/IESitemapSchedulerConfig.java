package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "IE SiteMap Scheduler Configuration")
public @interface IESitemapSchedulerConfig {
    @AttributeDefinition(name = "IE SiteMap Scheduler Scheduler")
    String schedulerName() default "IE SiteMap Scheduler Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default false;
}
