package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CustomerProfileService;
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
import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.CUSTOMER_PROFILE;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Customer Profile servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CUSTOMER_PROFILE })
public class CustomerProfileServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(CustomerProfileServlet.class);
	@Reference
	private transient CustomerProfileService CustomerProfileService;
	private static final long serialVersionUID = 1L;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws IOException {
		String customerToken = slingRequest.getParameter("CTCustomerToken");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = CustomerProfileService.getCustomerProfile(customerToken, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
