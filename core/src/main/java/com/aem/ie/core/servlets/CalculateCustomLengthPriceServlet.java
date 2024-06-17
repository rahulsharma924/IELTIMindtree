package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CustomLengthPriceService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.CALCULATE_CUSTOM_LENGTH_PRICE;

@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT Calculate Custom Length Price Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=POST",
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CALCULATE_CUSTOM_LENGTH_PRICE })
public class CalculateCustomLengthPriceServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(CalculateCustomLengthPriceServlet.class);

	@Reference
	private transient CustomLengthPriceService customLengthPriceService;

	private static final long serialVersionUID = 1L;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String responseValue;
		try {
			String customerToken = slingRequest.getParameter("CTCustomerToken");
			String jsonData = slingRequest.getParameter("jsonData");
			String bearerToken = slingRequest.getParameter("bearertoken");
			responseValue = customLengthPriceService.getCustomLengthPrice(customerToken, jsonData, bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException ioException) {
			log.error("error occurred in doPost{}", ioException.getMessage());
		}
	}
}
