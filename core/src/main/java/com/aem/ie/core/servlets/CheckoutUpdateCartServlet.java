package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.CheckoutUpdateCartService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.CHECKOUT_UPDATE_CART;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Checkout UpdateCart Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=PATCH",
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CHECKOUT_UPDATE_CART })
public class CheckoutUpdateCartServlet extends SlingAllMethodsServlet {
	String customerTokenValue = StringUtils.EMPTY;
	String jsonData = StringUtils.EMPTY;
	private static final Logger log = LoggerFactory.getLogger(CheckoutUpdateCartServlet.class);
	private static final long serialVersionUID = 1L;

	@Reference
	transient CheckoutUpdateCartService checkoutUpdateCartService;

	public void service(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		doPatch(slingRequest, slingResponse);
	}

	protected void doPatch(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
		try {
			customerTokenValue = slingRequest.getParameter("CTCustomerToken");
			jsonData = slingRequest.getParameter("jsonData");
			String bearerToken = slingRequest.getParameter("bearertoken");
			String responseValue = checkoutUpdateCartService.getUpdatedCart(customerTokenValue, jsonData, bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException ioException) {
			log.error("ioException {}", ioException.getMessage());
		}
	}
}
