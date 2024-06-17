package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.IESitemapGeneratorService;
import com.aem.ie.core.configuration.IESitemapSchedulerConfig;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;


@Component(immediate = true, service = Runnable.class)
@Designate(ocd = IESitemapSchedulerConfig.class)
public class IESitemapScheduler implements Runnable {
    @Reference
    protected Scheduler scheduler;

    @Reference
    protected IESitemapGeneratorService ieSitemapGeneratorService;
    private int schedulerID;
    private String schedulerName;
    private final Logger logger = LoggerFactory.getLogger(IESitemapScheduler.class);

    @Activate
    protected void activate(IESitemapSchedulerConfig config) {
        this.schedulerName = config.schedulerName();
        this.schedulerID = config.schedulerName().hashCode();
        addScheduler(config);
    }

    @Modified
    protected void modified(IESitemapSchedulerConfig config) {
        removeScheduler();
        schedulerID = config.schedulerName().hashCode(); // update schedulerID
        addScheduler(config);
    }

    @Deactivate
    protected void deactivate(IESitemapSchedulerConfig config) {
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
    private void addScheduler(IESitemapSchedulerConfig config) {
        if (config.serviceEnabled()) {
            ScheduleOptions scheduleOptions = scheduler.EXPR(config.schedulerExpression());
            scheduleOptions.name(String.valueOf(schedulerID));
            scheduleOptions.canRunConcurrently(false);
            scheduler.schedule(this, scheduleOptions);
            logger.debug("IE SiteMap Scheduler added succesfully");
        } else {
            logger.debug("IE SiteMap Scheduler is Disabled, no scheduler job created");
        }
    }

    @Override
    public void run() {
        logger.debug("Inside IE SiteMap Scheduler run Method");
        try {
            ieSitemapGeneratorService.generateIESiteMap();
        } catch (IOException ioException) {
            logger.error("IOException Exception Occurred{}", ioException.getMessage());
        }
    }
}

