package com.aem.ie.core.schedulers;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.osgi.service.cm.ConfigurationException;
import com.aem.ie.core.Service.CategoryImageSitemapGeneratorService;
import com.aem.ie.core.configuration.CategoryImageSitemapSchedulerConfig;

public class CategoryImageSitemapSchedulerTest {
	@Mock
    private Scheduler scheduler;
	@Mock
	protected CategoryImageSitemapGeneratorService categoryImageSitemapGeneratorService;
	private CategoryImageSitemapSchedulerConfig config;
	private CategoryImageSitemapScheduler categoryImageSitemapScheduler;
	@BeforeEach
    void setUp() {
       MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(CategoryImageSitemapSchedulerConfig.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?"); // Example scheduler expression
        categoryImageSitemapScheduler = new CategoryImageSitemapScheduler();
        categoryImageSitemapScheduler.scheduler = scheduler;
        categoryImageSitemapScheduler.categoryImageSitemapGeneratorService=categoryImageSitemapGeneratorService;
    }

    @Test
    void testActivateAndRun() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Activate the scheduler
        categoryImageSitemapScheduler.activate(config);

        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(categoryImageSitemapScheduler, scheduleOptions);

        // Run the scheduler
        categoryImageSitemapScheduler.run();

        // Verify that the categoryImageSitemapGeneratorService generateCategoryImageSiteMap method is called
        verify(categoryImageSitemapGeneratorService).generateCategoryImageSiteMap();
    }
    @Test
    void testModified() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Modify the scheduler configuration
        categoryImageSitemapScheduler.modified(config);

        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(categoryImageSitemapScheduler, scheduleOptions);
    }
    @Test
    void testDeactivate() {
        // Deactivate the scheduler
    	categoryImageSitemapScheduler.deactivate(config);

        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }

}

