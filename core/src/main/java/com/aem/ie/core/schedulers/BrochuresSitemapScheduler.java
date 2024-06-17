package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.BrochuresSitemapGeneratorService;
import com.aem.ie.core.configuration.BrochuresSitemapSchedulerConfig;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component(immediate = true, service = Runnable.class)
@Designate(ocd = BrochuresSitemapSchedulerConfig.class)
public class BrochuresSitemapScheduler implements Runnable {
    @Reference
    protected Scheduler scheduler;

    @Reference
    protected BrochuresSitemapGeneratorService brochuresSitemapGeneratorService;
    private int schedulerID;
    private String schedulerName;
    private final Logger logger = LoggerFactory.getLogger(BrochuresSitemapScheduler.class);

    @Activate
    protected void activate(BrochuresSitemapSchedulerConfig config) {
        this.schedulerName = config.schedulerName();
        this.schedulerID = config.schedulerName().hashCode();
        addScheduler(config);
    }

    @Modified
    protected void modified(BrochuresSitemapSchedulerConfig config) {
        removeScheduler();
        schedulerID = config.schedulerName().hashCode(); // update schedulerID
        addScheduler(config);
    }

    @Deactivate
    protected void deactivate(BrochuresSitemapSchedulerConfig config) {
        removeScheduler();
    }

    /**
     * Remove a scheduler based on the scheduler ID
     */
    private void removeScheduler() {
        scheduler.unschedule(String.valueOf(schedulerID));
    }

    /**
     * Add a scheduler based on the scheduler ID
     */
    private void addScheduler(BrochuresSitemapSchedulerConfig config) {
        if (config.serviceEnabled()) {
            ScheduleOptions scheduleOptions = scheduler.EXPR(config.schedulerExpression());
            scheduleOptions.name(String.valueOf(schedulerID));
            scheduleOptions.canRunConcurrently(false);
            scheduler.schedule(this, scheduleOptions);
            logger.debug("Brochures SiteMap Scheduler added successfully");
        } else {
            logger.debug("Brochures SiteMap Scheduler is Disabled, no scheduler job created");
        }
    }

    @Override
    public void run() {
        logger.debug("Inside Brochures SiteMap Scheduler run Method");
        try {
            brochuresSitemapGeneratorService.generateBrochuresSiteMap();
        } catch (IOException ioException) {
            logger.error("IOException Exception Occurred{}", ioException.getMessage());
        }
    }
}