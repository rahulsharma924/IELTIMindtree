package com.aem.ie.core.servlets;

import java.io.IOException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import com.aem.ie.core.Service.CTOrderHistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.aem.ie.core.constants.ServletConstants.ORDER_HISTORY;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Order Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + ORDER_HISTORY })
public class OrderHistoryServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(OrderHistoryServlet.class);
	@Reference
	private transient CTOrderHistoryService ctiOrderHistoryService;
	private static final long serialVersionUID = 1L;
	private String bearerToken = StringUtils.EMPTY;
	private String responseValue = null;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String customer_token = slingRequest.getParameter("customer_token");
		String pageNo = slingRequest.getParameter("pageNo");
		String pageSize = slingRequest.getParameter("pageSize");
		String sortField = slingRequest.getParameter("sortField");
		String sortingOrder = slingRequest.getParameter("sortingOrder");
		bearerToken = slingRequest.getParameter("bearertoken");
		responseValue = ctiOrderHistoryService.getOrderHistory(customer_token, bearerToken, pageNo, pageSize, sortField,
				sortingOrder);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
