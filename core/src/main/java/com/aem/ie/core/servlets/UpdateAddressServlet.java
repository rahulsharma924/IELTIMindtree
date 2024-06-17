package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.UpdateAddressService;
import com.google.gson.JsonObject;
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

import static com.aem.ie.core.constants.ServletConstants.UPDATE_ADDRESS;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Update Shipping information Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + UPDATE_ADDRESS })
public class UpdateAddressServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(UpdateAddressServlet.class);

	@Reference
	private transient UpdateAddressService updateAddressService;
	private static final long serialVersionUID = 1L;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		JsonObject responseValue;
		try {
			String accessToken = slingRequest.getParameter("accessToken");
			String bearerToken = slingRequest.getParameter("bearerToken");
			String jsonData = slingRequest.getParameter("jsonData");
			responseValue = updateAddressService.updateAddress(accessToken, bearerToken, jsonData);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(String.valueOf(responseValue));
		} catch (IOException ioException) {
			log.error("error occurred in doPost{}", ioException.getMessage());
		}
	}
}
