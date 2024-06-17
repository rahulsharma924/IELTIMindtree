package com.aem.ie.core.schedulers;

import static org.mockito.Mockito.*;

import java.io.IOException;

import com.aem.ie.core.Service.ProductSitemapGeneratorService;
import com.aem.ie.core.configuration.ProductSiteMapSchedulerConfiguration;
import com.aem.ie.core.configuration.ProductSitemapSchedulerConfig;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.commons.scheduler.Scheduler;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.osgi.service.cm.ConfigurationException;

@ExtendWith(AemContextExtension.class)
public class ProductSiteMapGeneratorSchedulerTest {

    @Mock
    private Scheduler scheduler;

    @Mock
    private ProductSitemapGeneratorService productSitemapGeneratorService;

    private ProductSiteMapSchedulerConfiguration config;

    private ProductSiteMapGeneratorScheduler productSiteMapGeneratorScheduler;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(ProductSiteMapSchedulerConfiguration.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?"); // Example scheduler expression
        productSiteMapGeneratorScheduler = new ProductSiteMapGeneratorScheduler();
        productSiteMapGeneratorScheduler.scheduler = scheduler;
        productSiteMapGeneratorScheduler.productSitemapGeneratorService = productSitemapGeneratorService;
    }

    @Test
    public void testActivateAndRun() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Activate the scheduler
        productSiteMapGeneratorScheduler.activate(config);

        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(productSiteMapGeneratorScheduler, scheduleOptions);

        // Run the scheduler
        productSiteMapGeneratorScheduler.run();

        // Verify that the productSitemapGeneratorService's generateProductSiteMap method is called
        verify(productSitemapGeneratorService).generateProductSiteMap();
    }

    @Test
    public void testModified() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Modify the scheduler configuration
        productSiteMapGeneratorScheduler.modified(config);

        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(productSiteMapGeneratorScheduler, scheduleOptions);
    }

    @Test
    public void testDeactivate() {
        // Deactivate the scheduler
        productSiteMapGeneratorScheduler.deactivate(config);

        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }
}

