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

import static com.aem.ie.core.constants.ServletConstants.PRODUCT_SEARCH;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + PRODUCT_SEARCH })
public class CustomerOrderedProdSearchServlet extends SlingAllMethodsServlet {
	@Reference
	private transient CTCustomerOrderedProductService ctCustomerOrderedProductService;
	private static final long serialVersionUID = 1L;
	private static final Logger log = LoggerFactory.getLogger(CustomerOrderedProdSearchServlet.class);

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String customer_token = slingRequest.getParameter("customer_token");
		String QueryParam = slingRequest.getParameter("query");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = ctCustomerOrderedProductService.getCustomerOrderedProductSearch(customer_token,
				QueryParam, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}