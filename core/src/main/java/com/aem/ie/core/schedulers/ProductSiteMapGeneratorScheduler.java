package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.ProductSitemapGeneratorService;
import com.aem.ie.core.configuration.ProductSiteMapSchedulerConfiguration;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Modified;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component(immediate = true, service = Runnable.class)
@Designate(ocd = ProductSiteMapSchedulerConfiguration.class)
public class ProductSiteMapGeneratorScheduler implements Runnable {
	@Reference
	protected Scheduler scheduler;

	@Reference
	protected ProductSitemapGeneratorService productSitemapGeneratorService;
	private int schedulerID;
	private String schedulerName;
	private final Logger logger = LoggerFactory.getLogger(ProductSiteMapGeneratorScheduler.class);

	@Activate
	protected void activate(ProductSiteMapSchedulerConfiguration config) {
		this.schedulerName = config.schedulerName();
		this.schedulerID = config.schedulerName().hashCode();
		addScheduler(config);
	}

	@Modified
	protected void modified(ProductSiteMapSchedulerConfiguration config) {
		removeScheduler();
		schedulerID = config.schedulerName().hashCode(); // update schedulerID
		addScheduler(config);
	}

	@Deactivate
	protected void deactivate(ProductSiteMapSchedulerConfiguration config) {
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
	private void addScheduler(ProductSiteMapSchedulerConfiguration config) {
		if (config.serviceEnabled()) {
			ScheduleOptions scheduleOptions = scheduler.EXPR(config.schedulerExpression());
			scheduleOptions.name(String.valueOf(schedulerID));
			scheduleOptions.canRunConcurrently(false);
			scheduler.schedule(this, scheduleOptions);
			logger.debug("Scheduler added succesfully");
		} else {
			logger.debug("ProductSiteMapGeneratorScheduler is Disabled, no scheduler job created");
		}
	}

	@Override
	public void run() {
		logger.debug("Inside ProductSiteMapGeneratorScheduler run Method");
		try {
			productSitemapGeneratorService.generateProductSiteMap();
		} catch (IOException ioException) {
			logger.error("IOException Exception Occurred{}", ioException.getMessage());
		}
	}
}
