package com.aem.ie.core.servlets;

import java.io.IOException;

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

import com.aem.ie.core.Service.IECTDefaultPaymentService;

import static com.aem.ie.core.constants.ServletConstants.DEFAULT_PAYMENT_METHOD;

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
		Constants.SERVICE_DESCRIPTION + "=CT Default Payment Method Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_PUT,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + DEFAULT_PAYMENT_METHOD })
public class defaultPaymentMethodServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(defaultPaymentMethodServlet.class);
	@Reference
	private transient IECTDefaultPaymentService defaultpaymentservice;
	private static final long serialVersionUID = 1L;

	protected void doPut(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String customerToken = slingRequest.getParameter("CTCustomerToken");
		String paymentToken = slingRequest.getParameter("paymentToken");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = defaultpaymentservice.getdefaultPaymentCTUrl(customerToken, paymentToken, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
