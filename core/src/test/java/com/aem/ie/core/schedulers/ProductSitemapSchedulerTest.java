package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.ProductSitemapGeneratorService;
import com.aem.ie.core.configuration.ProductSitemapSchedulerConfig;
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

class ProductSitemapSchedulerTest {

    @Mock
    private Scheduler scheduler;

    @Mock
    private ProductSitemapGeneratorService productSiteMapGeneratorService;

    private ProductSitemapSchedulerConfig config;

    private ProductSitemapScheduler schedulerComponent;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(ProductSitemapSchedulerConfig.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?"); // Example scheduler expression
        schedulerComponent = new ProductSitemapScheduler();
        schedulerComponent.scheduler = scheduler;
        schedulerComponent.productSiteMapGeneratorService = productSiteMapGeneratorService;
    }

    @Test
    public void testActivateAndRun() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Activate the scheduler
        schedulerComponent.activate(config);

        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(schedulerComponent, scheduleOptions);

        // Run the scheduler
        schedulerComponent.run();

        // Verify that the productSiteMapGeneratorService's generateProductSiteMap method is called
        verify(productSiteMapGeneratorService).generateProductSiteMap();
    }

    @Test
    public void testModified() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Modify the scheduler configuration
        schedulerComponent.modified(config);

        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(schedulerComponent, scheduleOptions);
    }

    @Test
    public void testDeactivate() {
        // Deactivate the scheduler
        schedulerComponent.deactivate(config);

        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }
}