package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.CategoryImageSitemapGeneratorService;
import com.aem.ie.core.Service.CategorySitemapGeneratorService;
import com.aem.ie.core.configuration.CategoryImageSitemapSchedulerConfig;
import com.aem.ie.core.configuration.CategorySitemapSchedulerConfig;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.osgi.service.cm.ConfigurationException;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

class CategorySitemapSchedulerTest {
    @Mock
    private Scheduler scheduler;
    @Mock
    protected CategorySitemapGeneratorService categorySiteMapGeneratorService;
    CategorySitemapSchedulerConfig config;
    CategorySitemapScheduler categorySitemapScheduler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(CategorySitemapSchedulerConfig.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?");
        categorySitemapScheduler = new CategorySitemapScheduler();
        categorySitemapScheduler.scheduler = scheduler;
        categorySitemapScheduler.productSiteMapGeneratorService=categorySiteMapGeneratorService;
    }

    @Test
    void testActivateAndRun() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Activate the scheduler
        categorySitemapScheduler.activate(config);

        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(categorySitemapScheduler, scheduleOptions);

        // Run the scheduler
        categorySitemapScheduler.run();

        // Verify that the categorySiteMapGeneratorService generateCategorySiteMap method is called
        verify(categorySiteMapGeneratorService).generateCategorySiteMap();
    }

    @Test
    void testModified() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Modify the scheduler configuration
        categorySitemapScheduler.modified(config);

        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(categorySitemapScheduler, scheduleOptions);
    }
    @Test
    void testDeactivate() {
        // Deactivate the scheduler
        categorySitemapScheduler.deactivate(config);

        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }
}