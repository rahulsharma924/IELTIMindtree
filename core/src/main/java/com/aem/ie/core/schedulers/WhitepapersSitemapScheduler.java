package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.WhitepapersSitemapGeneratorService;
import com.aem.ie.core.configuration.WhitepapersSitemapSchedulerConfig;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component(immediate = true, service = Runnable.class)
@Designate(ocd = WhitepapersSitemapSchedulerConfig.class)
public class WhitepapersSitemapScheduler implements Runnable {
    @Reference
    protected Scheduler scheduler;

    @Reference
    protected WhitepapersSitemapGeneratorService whitepapersSitemapGeneratorService;
    private int schedulerID;
    private String schedulerName;
    private final Logger logger = LoggerFactory.getLogger(WhitepapersSitemapScheduler.class);

    @Activate
    protected void activate(WhitepapersSitemapSchedulerConfig config) {
        this.schedulerName = config.schedulerName();
        this.schedulerID = config.schedulerName().hashCode();
        addScheduler(config);
    }

    @Modified
    protected void modified(WhitepapersSitemapSchedulerConfig config) {
        removeScheduler();
        schedulerID = config.schedulerName().hashCode(); // update schedulerID
        addScheduler(config);
    }

    @Deactivate
    protected void deactivate(WhitepapersSitemapSchedulerConfig config) {
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
    private void addScheduler(WhitepapersSitemapSchedulerConfig config) {
        if (config.serviceEnabled()) {
            ScheduleOptions scheduleOptions = scheduler.EXPR(config.schedulerExpression());
            scheduleOptions.name(String.valueOf(schedulerID));
            scheduleOptions.canRunConcurrently(false);
            scheduler.schedule(this, scheduleOptions);
            logger.debug("Whitepapers SiteMap Scheduler added successfully");
        } else {
            logger.debug("Whitepapers SiteMap Scheduler is Disabled, no scheduler job created");
        }
    }

    @Override
    public void run() {
        logger.debug("Inside Whitepapers SiteMap Scheduler run Method");
        try {
            whitepapersSitemapGeneratorService.generateWhitepapersSiteMap();
        } catch (IOException ioException) {
            logger.error("IOException Exception Occurred{}", ioException.getMessage());
        }
    }
}