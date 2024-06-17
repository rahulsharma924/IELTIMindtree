package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Whitepapers SiteMap Scheduler Configuration")
public @interface WhitepapersSitemapSchedulerConfig {
    @AttributeDefinition(name = "Whitepapers SiteMap Scheduler Scheduler")
    String schedulerName() default "Whitepapers SiteMap Scheduler Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default false;
}
