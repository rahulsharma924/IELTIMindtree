package com.aem.ie.core.servlets;

import java.io.IOException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.aem.ie.core.Service.ClearCartService;
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

import static com.aem.ie.core.constants.ServletConstants.CLEAR_CART;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The idempotent. For write
 * operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CLEAR_CART })
public class ClearCartServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(ClearCartServlet.class);
	@Reference
	private transient ClearCartService clearcartService;
	private static final long serialVersionUID = 1L;
	private String bearerToken = StringUtils.EMPTY;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException, RuntimeException {
		String responseValue = "false";
		String cartId = slingRequest.getParameter("cartID");
		String access_token = slingRequest.getParameter("customer_token");
		String version = slingRequest.getParameter("version");
		bearerToken = slingRequest.getParameter("bearertoken");
		try {
			responseValue = clearcartService.clearCart(slingRequest, cartId, access_token, version, bearerToken);
		} catch (IOException e) {
			log.error("exception occured", e);
		}
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
