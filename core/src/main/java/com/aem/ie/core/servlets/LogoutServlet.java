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

import com.aem.ie.core.Service.IECTLogoutService;

import static com.aem.ie.core.constants.ServletConstants.LOGOUT;

/**
 * Author Anuradha Vunnam
 * 
 * @author M1097457
 *
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + LOGOUT })
public class LogoutServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(LogoutServlet.class);
	@Reference
	private transient IECTLogoutService logoutService;
	private static final long serialVersionUID = 1L;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String ctToken = slingRequest.getParameter("CTCustomerToken");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = logoutService.getLogoutCTURL(ctToken, bearerToken);
		slingResponse.getWriter().write(responseValue);
	}
}
