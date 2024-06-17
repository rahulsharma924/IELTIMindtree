package com.aem.ie.core.schedulers;

import static org.mockito.Mockito.*;

import java.io.IOException;

import com.aem.ie.core.Service.BlogSitemapGeneratorService;
import com.aem.ie.core.Service.BusinessSitemapGeneratorService;
import com.aem.ie.core.Service.ProductSitemapGeneratorService;
import com.aem.ie.core.configuration.BlogSitemapSchedulerConfig;
import com.aem.ie.core.configuration.BusinessSitemapSchedulerConfig;
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
public class BusinessSitemapSchedulerTest {

    @Mock
    private Scheduler scheduler;

    @Mock
    private BusinessSitemapGeneratorService businessSitemapGeneratorService;

    private BusinessSitemapSchedulerConfig config;

    private BusinessSitemapScheduler schedulerComponent;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(BusinessSitemapSchedulerConfig.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?"); // Example scheduler expression
        schedulerComponent = new BusinessSitemapScheduler();
        schedulerComponent.scheduler = scheduler;
        schedulerComponent.businessSitemapGeneratorService = businessSitemapGeneratorService;
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
        verify(businessSitemapGeneratorService).generateBusinessSiteMap();
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

