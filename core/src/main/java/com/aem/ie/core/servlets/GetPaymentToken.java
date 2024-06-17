package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTViewPaymentService;
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

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.GET_PAYMENT_TOKEN;

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
@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=Get Client Token For Braintee Integration",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GET_PAYMENT_TOKEN })
public class GetPaymentToken extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(GetPaymentToken.class);
	@Reference
	private transient IECTViewPaymentService viewpaymentservice;
	private static final long serialVersionUID = 1L;

	protected void doGet(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String customerToken = slingRequest.getParameter("CTCustomerToken");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = viewpaymentservice.getPaymentToken(customerToken, bearerToken);
		slingResponse.getWriter().write(responseValue);
	}
}
