package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Category Image SiteMap Scheduler Configuration")
public @interface CategoryImageSitemapSchedulerConfig {
    @AttributeDefinition(name = "Category Image SiteMap Generator Scheduler")
    String schedulerName() default "Category Image SiteMap Generator Configuration";

    @AttributeDefinition(name = "Cron-job expression")
    String schedulerExpression() default "";

    @AttributeDefinition(name = "Service Enabled",
            description = "Service Enabled or Disabled")
    boolean serviceEnabled() default false;

}