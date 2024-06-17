package com.aem.ie.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.aem.ie.core.Service.IEOrderConfirmationDetails;
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

import com.aem.ie.core.Service.IEUserActiveCart;

import static com.aem.ie.core.constants.ServletConstants.GET_ORDER_CONFIRMATION;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Get Active cart servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GET_ORDER_CONFIRMATION })
public class GetOrderConfirmationServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(GetOrderConfirmationServlet.class);
	@Reference
	private transient IEOrderConfirmationDetails orderConfirmationDetails;
	private static final long serialVersionUID = 1L;
	private String bearerToken = StringUtils.EMPTY;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String token = slingRequest.getParameter("CTCustomerToken");
		String orderId = slingRequest.getParameter("orderId");
		bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = orderConfirmationDetails.getOrderConfirmationDetails(token, orderId, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
