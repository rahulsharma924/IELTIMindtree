package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.CategorySitemapGeneratorService;
import com.aem.ie.core.Service.ProductImageSitemapGeneratorService;
import com.aem.ie.core.configuration.CategorySitemapSchedulerConfig;
import com.aem.ie.core.configuration.ProductImageSitemapSchedulerConfig;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.osgi.service.cm.ConfigurationException;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

class ProductImageSitemapSchedulerTest {
    @Mock
    private Scheduler scheduler;
    @Mock
    protected ProductImageSitemapGeneratorService productImageSitemapGeneratorService;
    ProductImageSitemapSchedulerConfig config;
    ProductImagesSitemapScheduler productImageSitemapScheduler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(ProductImageSitemapSchedulerConfig.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?");
        productImageSitemapScheduler = new ProductImagesSitemapScheduler();
        productImageSitemapScheduler.scheduler = scheduler;
        productImageSitemapScheduler.productImageSitemapGeneratorService=productImageSitemapGeneratorService;
    }

    @Test
    void testActivateAndRun() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Activate the scheduler
        productImageSitemapScheduler.activate(config);

        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(productImageSitemapScheduler, scheduleOptions);

        // Run the scheduler
        productImageSitemapScheduler.run();

        // Verify that the productImageSitemapGeneratorService generateProductImageSiteMap method is called
        verify(productImageSitemapGeneratorService).generateProductImageSiteMap();
    }

    @Test
    void testModified() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Modify the scheduler configuration
        productImageSitemapScheduler.modified(config);

        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(productImageSitemapScheduler, scheduleOptions);
    }
    @Test
    void testDeactivate() {
        // Deactivate the scheduler
        productImageSitemapScheduler.deactivate(config);

        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }
}