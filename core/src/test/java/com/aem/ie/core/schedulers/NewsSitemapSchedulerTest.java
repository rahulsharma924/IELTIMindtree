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

import com.aem.ie.core.Service.IESitemapGeneratorService;
import com.aem.ie.core.Service.NewsSitemapGeneratorService;
import com.aem.ie.core.configuration.IESitemapSchedulerConfig;
import com.aem.ie.core.configuration.NewsSitemapSchedulerConfig;

public class NewsSitemapSchedulerTest {
	@Mock
    private Scheduler scheduler;
	@Mock
	protected NewsSitemapGeneratorService newsSitemapGeneratorService;
	private NewsSitemapSchedulerConfig config;
	private NewsSitemapScheduler newsSitemapScheduler;
	@BeforeEach
    void setUp() {
       MockitoAnnotations.initMocks(this);
        // Create a mock configuration
        config = mock(NewsSitemapSchedulerConfig.class);
        when(config.schedulerName()).thenReturn("testScheduler");
        when(config.serviceEnabled()).thenReturn(true);
        when(config.schedulerExpression()).thenReturn("0 0 0 * * ?"); // Example scheduler expression
        newsSitemapScheduler = new NewsSitemapScheduler();
        newsSitemapScheduler.scheduler = scheduler;
        newsSitemapScheduler.newsSitemapGeneratorService=newsSitemapGeneratorService;
    }

    @Test
    void testActivateAndRun() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Activate the scheduler
        newsSitemapScheduler.activate(config);

        // Verify that the scheduler is added with the correct configuration
        verify(scheduler).schedule(newsSitemapScheduler, scheduleOptions);

        // Run the scheduler
        newsSitemapScheduler.run();

        // Verify that the newsSitemapGeneratorService generateNewsSiteMap method is called
        verify(newsSitemapGeneratorService).generateNewsSiteMap();
    }
    @Test
    void testModified() throws IOException, ConfigurationException {
        // Mock the scheduler behavior
        ScheduleOptions scheduleOptions = mock(ScheduleOptions.class);
        when(scheduler.EXPR(config.schedulerExpression())).thenReturn(scheduleOptions);

        // Modify the scheduler configuration
        newsSitemapScheduler.modified(config);

        // Verify that the scheduler is removed and added with the updated configuration
        verify(scheduler).unschedule(anyString());
        verify(scheduler).schedule(newsSitemapScheduler, scheduleOptions);
    }
    @Test
    void testDeactivate() {
        // Deactivate the scheduler
    	newsSitemapScheduler.deactivate(config);

        // Verify that the scheduler is removed
        verify(scheduler).unschedule(anyString());
    }

}


