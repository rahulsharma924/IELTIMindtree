package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.ProductImageSitemapGeneratorService;
import com.aem.ie.core.configuration.ProductImageSitemapSchedulerConfig;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.service.component.annotations.*;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component(immediate = true, service = Runnable.class)
@Designate(ocd = ProductImageSitemapSchedulerConfig.class)
public class ProductImagesSitemapScheduler implements Runnable {
	@Reference
	protected Scheduler scheduler;

	@Reference
	protected ProductImageSitemapGeneratorService productImageSitemapGeneratorService;
	private int schedulerID;
	private String schedulerName;
	private final Logger logger = LoggerFactory.getLogger(ProductImagesSitemapScheduler.class);

	@Activate
	protected void activate(ProductImageSitemapSchedulerConfig config) {
		this.schedulerName = config.schedulerName();
		this.schedulerID = config.schedulerName().hashCode();
		addScheduler(config);
	}

	@Modified
	protected void modified(ProductImageSitemapSchedulerConfig config) {
		removeScheduler();
		schedulerID = config.schedulerName().hashCode(); // update schedulerID
		addScheduler(config);
	}

	@Deactivate
	protected void deactivate(ProductImageSitemapSchedulerConfig config) {
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
	private void addScheduler(ProductImageSitemapSchedulerConfig config) {
		if (config.serviceEnabled()) {
			ScheduleOptions scheduleOptions = scheduler.EXPR(config.schedulerExpression());
			scheduleOptions.name(String.valueOf(schedulerID));
			scheduleOptions.canRunConcurrently(false);
			scheduler.schedule(this, scheduleOptions);
			logger.debug("Product Image SiteMap Scheduler added succesfully");
		} else {
			logger.debug("Product Image SiteMap Scheduler is Disabled, no scheduler job created");
		}
	}

	@Override
	public void run() {
		logger.debug("Inside Product Image SiteMap Scheduler run Method");
		try {
			productImageSitemapGeneratorService.generateProductImageSiteMap();
		} catch (IOException ioException) {
			logger.error("IOException Exception Occurred{}", ioException.getMessage());
		}
	}
}
