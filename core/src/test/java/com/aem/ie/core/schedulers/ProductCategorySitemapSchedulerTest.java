/*
package com.aem.ie.core.schedulers;

import com.aem.ie.core.Service.ProductCategorySitemapGeneratorService;
import com.aem.ie.core.configuration.CategorySiteMapSchedulerConfiguration;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.commons.scheduler.ScheduleOptions;
import org.apache.sling.commons.scheduler.Scheduler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;

import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

@ExtendWith({AemContextExtension.class})
class ProductCategorySitemapSchedulerTest {
    @Mock
    private Scheduler scheduler;

    @Mock
    ProductCategorySitemapGeneratorService productSiteMapGeneratorService;

    private CategorySiteMapSchedulerConfiguration config;
    private ProductCategorySitemapScheduler productCategorySitemapScheduler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        config = mock(CategorySiteMapSchedulerConfiguration.class);
        when(config.schedulerName()).thenReturn("ProductSiteMap Generator Configuration");
        when(config.schedulerExpression()).thenReturn("0 0 0 1/1 * ? *");
        when(config.serviceEnabled()).thenReturn(true);
        productCategorySitemapScheduler = new ProductCategorySitemapScheduler();
        productCategorySitemapScheduler.scheduler = scheduler;
        productCategorySitemapScheduler.productSiteMapGeneratorService = productSiteMapGeneratorService;
    }
    @Test
    void activate() throws IOException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);
        // Activate the scheduler
        productCategorySitemapScheduler.activate(config);
        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(productCategorySitemapScheduler, scheduleOptions);
        // Run the scheduler
        productCategorySitemapScheduler.run();
        // Verify that the productSiteMapGeneratorService's generateProductSiteMap method is called
        verify(productSiteMapGeneratorService).generateProductCategorySiteMap();
    }

    @Test
    void modified() {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);
        // Modify the scheduler configuration
        productCategorySitemapScheduler.modified(config);
        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(productCategorySitemapScheduler, scheduleOptions);
    }

    @Test
    void deactivate() {
        // Deactivate the scheduler
        productCategorySitemapScheduler.deactivate(config);
        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }

    @Test
    void activateTestAddSchedulerElseBlock() throws IOException {
        when(config.serviceEnabled()).thenReturn(false);
        // Activate the scheduler
        productCategorySitemapScheduler.activate(config);
    }
}*/
