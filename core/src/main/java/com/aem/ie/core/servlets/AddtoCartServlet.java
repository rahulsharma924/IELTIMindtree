package com.aem.ie.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.aem.ie.core.constants.ApplConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.IECTAddtoCartService;

import static com.aem.ie.core.constants.ServletConstants.ADD_TO_CART;

/** Author Anuradha Vunnam
 * 
 * @author M1097457
 *
 */
/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_PUT,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + ADD_TO_CART })
public class AddtoCartServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(AddtoCartServlet.class);
	@Reference
	private transient IECTAddtoCartService addtocartService;
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPut(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String token = slingRequest.getParameter("CTCustomerToken");
		String currency = slingRequest.getParameter("currency");
		String skuValue = slingRequest.getParameter("sku");
		String quantity = slingRequest.getParameter("quantity");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = addtocartService.getAddToCartoCTUrl(token, currency, skuValue, quantity, bearerToken);
		slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
		slingResponse.getWriter().write(responseValue);
	}

}
