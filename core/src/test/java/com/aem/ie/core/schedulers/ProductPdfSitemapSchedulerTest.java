package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.ProductImageSitemapGeneratorService;
import com.aem.ie.core.Service.ProductPdfSitemapGeneratorService;
import com.aem.ie.core.configuration.ProductImageSitemapSchedulerConfig;
import com.aem.ie.core.configuration.ProductPdfSitemapSchedulerConfig;
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

class ProductPdfSitemapSchedulerTest {
    @Mock
    private Scheduler scheduler;
    @Mock
    protected ProductPdfSitemapGeneratorService productPdfSitemapGeneratorService;
    ProductPdfSitemapSchedulerConfig config;
    ProductPdfSitemapScheduler productPdfSitemapScheduler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(ProductPdfSitemapSchedulerConfig.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?");
        productPdfSitemapScheduler = new ProductPdfSitemapScheduler();
        productPdfSitemapScheduler.scheduler = scheduler;
        productPdfSitemapScheduler.productPdfSitemapGeneratorService=productPdfSitemapGeneratorService;
    }

    @Test
    void testActivateAndRun() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Activate the scheduler
        productPdfSitemapScheduler.activate(config);

        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(productPdfSitemapScheduler, scheduleOptions);

        // Run the scheduler
        productPdfSitemapScheduler.run();

        // Verify that the productPdfSitemapGeneratorService generateProducDatasheetPdfSitemap method is called
        verify(productPdfSitemapGeneratorService).generateProducDatasheetPdfSitemap();
        verify(productPdfSitemapGeneratorService).generateProduct2DImagePdfSiteMap();
    }

    @Test
    void testModified() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Modify the scheduler configuration
        productPdfSitemapScheduler.modified(config);

        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(productPdfSitemapScheduler, scheduleOptions);
    }
    @Test
    void testDeactivate() {
        // Deactivate the scheduler
        productPdfSitemapScheduler.deactivate(config);

        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }
}