package com.aem.ie.core.servlets;

import java.io.IOException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.aem.ie.core.Service.CTCustomerOrderedProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.aem.ie.core.constants.ServletConstants.ORDERED_PRODUCT;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + ORDERED_PRODUCT })
public class CustomerOrderedProductServlet extends SlingAllMethodsServlet {
	@Reference
	private transient CTCustomerOrderedProductService ctCustomerOrderedProductService;
	private static final long serialVersionUID = 1L;
	private static final Logger log = LoggerFactory.getLogger(CustomerOrderedProductServlet.class);

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String past30Days = "false";
		String past90Days = "false";
		String past180Days = "false";
		String past270Days = "false";
		String past360Days = "false";
		String past60Days = "false";
		String customer_token = slingRequest.getParameter("customer_token");
		if (slingRequest.getParameter("past30daysProducts") != null) {
			past30Days = slingRequest.getParameter("past30daysProducts");
		} else if (slingRequest.getParameter("past90daysProducts") != null) {
			past90Days = slingRequest.getParameter("past90daysProducts");
		} else if (slingRequest.getParameter("past180daysProducts") != null) {
			past180Days = slingRequest.getParameter("past180daysProducts");
		} else if (slingRequest.getParameter("past270daysProducts") != null) {
			past270Days = slingRequest.getParameter("past270daysProducts");
		} else if (slingRequest.getParameter("past360daysProducts") != null) {
			past360Days = slingRequest.getParameter("past360daysProducts");
		} else if (slingRequest.getParameter("past60daysProducts") != null) {
			past60Days = slingRequest.getParameter("past60daysProducts");
		}
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = ctCustomerOrderedProductService.getCustomerOrderedProduct(customer_token, past30Days,
				past90Days, past180Days, past270Days, past360Days, past60Days, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}