package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.BusinessSitemapGeneratorService;
import com.aem.ie.core.configuration.BusinessSitemapSchedulerConfig;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component(immediate = true, service = Runnable.class)
@Designate(ocd = BusinessSitemapSchedulerConfig.class)
public class BusinessSitemapScheduler implements Runnable {
	@Reference
	protected Scheduler scheduler;

	@Reference
	protected BusinessSitemapGeneratorService businessSitemapGeneratorService;
	private int schedulerID;
	private String schedulerName;
	private final Logger logger = LoggerFactory.getLogger(BusinessSitemapScheduler.class);

	@Activate
	protected void activate(BusinessSitemapSchedulerConfig config) {
		this.schedulerName = config.schedulerName();
		this.schedulerID = config.schedulerName().hashCode();
		addScheduler(config);
	}

	@Modified
	protected void modified(BusinessSitemapSchedulerConfig config) {
		removeScheduler();
		schedulerID = config.schedulerName().hashCode(); // update schedulerID
		addScheduler(config);
	}

	@Deactivate
	protected void deactivate(BusinessSitemapSchedulerConfig config) {
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
	private void addScheduler(BusinessSitemapSchedulerConfig config) {
		if (config.serviceEnabled()) {
			ScheduleOptions scheduleOptions = scheduler.EXPR(config.schedulerExpression());
			scheduleOptions.name(String.valueOf(schedulerID));
			scheduleOptions.canRunConcurrently(false);
			scheduler.schedule(this, scheduleOptions);
			logger.debug("Business SiteMap Scheduler added succesfully");
		} else {
			logger.debug("Business SiteMap Scheduler is Disabled, no scheduler job created");
		}
	}

	@Override
	public void run() {
		logger.debug("Inside Business SiteMap Scheduler run Method");
		try {
			businessSitemapGeneratorService.generateBusinessSiteMap();
		} catch (IOException ioException) {
			logger.error("IOException Exception Occurred{}", ioException.getMessage());
		}
	}
}
