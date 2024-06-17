package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTLoginService;
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

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.CHECKOUT_LOGIN;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Checkout Login servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CHECKOUT_LOGIN })
public class CheckoutLoginServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(CheckoutLoginServlet.class);
	@Reference
	private transient IECTLoginService loginService;
	private static final long serialVersionUID = 1L;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		try {
			String customerToken = slingRequest.getParameter("CTCustomerToken");
			String email = slingRequest.getParameter("email");
			String password = slingRequest.getParameter("password");
			String bearerToken = slingRequest.getParameter("bearertoken");
			String responseValue = loginService.getCheckoutLogin(customerToken, email, password, bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException ioException) {
			log.error("error occurred in doPost{}", ioException.getMessage());
		}
	}
}
