package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.AddNewAddressService;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import com.google.gson.JsonObject;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.UPDATE_NEW_ADDRESS;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + UPDATE_NEW_ADDRESS,
		ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json"

})
public class AddressbookUpdateServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(AddressbookUpdateServlet.class);

	@Reference
	private transient AddNewAddressService addNewAddressService;

	private static final long serialVersionUID = 1L;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		JsonObject responseValue = new JsonObject();
		try {
			String addressId = slingRequest.getParameter("addressId");
			String addressType = slingRequest.getParameter("addressType");
			String firstName = slingRequest.getParameter("firstName");
			String lastName = slingRequest.getParameter("lastName");
			String company = slingRequest.getParameter("company");
			String country = slingRequest.getParameter("country").substring(0, 2).toUpperCase();
			String addressOne = slingRequest.getParameter("addressOne");
			String addressTwo = slingRequest.getParameter("addressTwo");
			String phoneNumber = slingRequest.getParameter("phone");
			String ZipCode = slingRequest.getParameter("zipcode");
			String state = slingRequest.getParameter("state").substring(0, 2).toUpperCase();
			String cityName = slingRequest.getParameter("city");
			String defaultAddress = slingRequest.getParameter("defaultAddress");
			String bearerToken = slingRequest.getParameter("bearertoken");
			String accessToken = slingRequest.getParameter("accessToken");
			String details = "{\"type\":\"" + addressType + "\",\"address\":{\"name\":\"" + firstName
					+ "\",\"lastName\":\"" + lastName + "\",\"company\":\"" + company + "\",\"country\":\"" + country
					+ "\",\"line1\":\"" + addressOne + "\",\"line2\":\"" + addressTwo + "\",\"phone\":\"" + phoneNumber
					+ "\",\"zipcode\":\"" + ZipCode + "\",\"state\":\"" + state + "\",\"city\":\"" + cityName
					+ "\",\"isDefault\":\"" + defaultAddress + "\"},\"addressId\":\"" + addressId + "\"}";
			if (StringUtils.isNotEmpty(details)) {
				responseValue = addNewAddressService.updateAddress(slingRequest, details, accessToken, bearerToken);
			}
		} catch (IOException | RuntimeException e) {
			log.error("error occurred in doPost", e);
		}
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(String.valueOf(responseValue));
	}
}
