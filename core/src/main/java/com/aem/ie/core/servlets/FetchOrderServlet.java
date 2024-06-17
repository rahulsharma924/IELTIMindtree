package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.ADD_TO_CART;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

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

import com.aem.ie.core.Service.FetchProductService;
import com.aem.ie.core.Service.IECTAddtoCartService;
import com.aem.ie.core.constants.ApplConstants;

import static com.aem.ie.core.constants.ServletConstants.FETCH_PRODUCTS;

import java.io.IOException;

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
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + FETCH_PRODUCTS })
public class FetchOrderServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(FetchOrderServlet.class);
	@Reference
	private transient FetchProductService fetchOrderService;
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String token = slingRequest.getParameter("CTCustomerToken");
		String pastdays = slingRequest.getParameter("pastDays");
		String pagesize = slingRequest.getParameter("pageSize");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = fetchOrderService.getFetchProductAPI(token, pastdays, pagesize, bearerToken);
		slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
		slingResponse.getWriter().write(responseValue);
	}
}
