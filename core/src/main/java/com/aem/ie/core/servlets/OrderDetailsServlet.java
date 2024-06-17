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

import com.aem.ie.core.Service.CTOrderDetailService;

import static com.aem.ie.core.constants.ServletConstants.ORDER_DETAILS;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + ORDER_DETAILS })
public class OrderDetailsServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(OrderDetailsServlet.class);
	@Reference
	private transient CTOrderDetailService ctOrderDetailService;
	private static final long serialVersionUID = 1L;

	protected void doGet(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String customer_token = slingRequest.getParameter("customer_token");
		String order_id = slingRequest.getParameter("order_id");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = ctOrderDetailService.getOrderDetails(customer_token, order_id, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
