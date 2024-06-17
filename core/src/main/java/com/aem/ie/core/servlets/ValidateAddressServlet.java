package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.ValidateAddressService;
import com.google.gson.JsonObject;
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

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.VALIDATE_ADDRESS;

@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT Validate Address Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + VALIDATE_ADDRESS,
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "= guestUser"

})
public class ValidateAddressServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(ValidateAddressServlet.class);

	@Reference
	private transient ValidateAddressService validateAddressService;
	private static final long serialVersionUID = 1L;

	protected void doGet(final SlingHttpServletResponse response, final SlingHttpServletRequest request)
			throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		try {
			String responseValue = StringUtils.EMPTY;
			String servletPath = slingRequest.getPathInfo();
			if ("/bin/validateAddress".equals(servletPath)) {
				JsonObject jsonObject = new JsonObject();
				JsonObject addressObject = new JsonObject();
				String customerToken = slingRequest.getParameter("CTCustomerToken");
				String bearerToken = slingRequest.getParameter("bearerToken");
				addressObject.addProperty("addressId", slingRequest.getParameter("addressId"));
				jsonObject.add("address", addressObject);
				responseValue = validateAddressService.getValidateAddressUrl(customerToken, bearerToken, jsonObject);
			} else if ("/bin/validateAddress.guestUser".equals(servletPath)) {
				String jsonData = slingRequest.getParameter("jsonData");
				String bearerToken = slingRequest.getParameter("bearerToken");
				responseValue = validateAddressService.getValidateAddressGuestUser(jsonData, bearerToken);
			}
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException e) {
			log.error("error occurred in doPost{}", e.getMessage());
		}
	}
}
