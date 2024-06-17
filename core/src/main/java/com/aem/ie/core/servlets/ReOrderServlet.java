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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.ReOrderService;

import static com.aem.ie.core.constants.ServletConstants.REORDER;

/**
 * 
 * @author M1098572 Servlet for re order functionality
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Re Order Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + REORDER })
public class ReOrderServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(ReOrderServlet.class);
	@Reference
	private transient ReOrderService reOrderService;
	private static final long serialVersionUID = 1L;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String tokenIdValue = slingRequest.getParameter("customer_token");
		String bearerToken = slingRequest.getParameter("bearerToken");
		String orderIdValue = slingRequest.getParameter("order_id");
		String responseValue = reOrderService.getReOrderCTUrl(tokenIdValue, bearerToken, orderIdValue);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
