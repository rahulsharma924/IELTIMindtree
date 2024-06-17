package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTViewPaymentService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
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

import static com.aem.ie.core.constants.ServletConstants.PROCESS_PAYMENT;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=process payment to Braintee",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + PROCESS_PAYMENT })
public class ProcessPaymentServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(ProcessPaymentServlet.class);

	private String jsonData = StringUtils.EMPTY;
	@Reference
	private transient IECTViewPaymentService viewpaymentservice;

	private static final long serialVersionUID = 1L;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		log.info("servlet class started");
		try {
			String customerToken = slingRequest.getParameter("CTCustomerToken");
			String bearerToken = slingRequest.getParameter("bearerToken");
			jsonData = slingRequest.getParameter("jsonData");
			String responseValue = viewpaymentservice.processPayment(customerToken, bearerToken, jsonData);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException e) {
			log.error("error occurred in doPost{}", e.getMessage());
		}
	}
}
