package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTRegisterService;
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

import static com.aem.ie.core.constants.ServletConstants.CHECKOUT_GUEST_REGISTRATION;

@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT Checkout Guest Registration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CHECKOUT_GUEST_REGISTRATION })
public class CheckoutGuestRegistrationServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(CheckoutGuestRegistrationServlet.class);

	@Reference
	private transient IECTRegisterService registerService;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		try {
			String customerToken = slingRequest.getParameter("CTCustomerToken");
			String registrationData = slingRequest.getParameter("registration");
			String bearerToken = slingRequest.getParameter("bearertoken");
			String responseValue = registerService.getCheckoutGuestRegistration(customerToken, registrationData,
					bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException ioException) {
			log.error("error occurred in doPost{}", ioException.getMessage());
		}
	}
}
