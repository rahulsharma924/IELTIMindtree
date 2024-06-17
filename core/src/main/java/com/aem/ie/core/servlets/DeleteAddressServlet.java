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

import static com.aem.ie.core.constants.ServletConstants.DELETE_ADDRESS;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + DELETE_ADDRESS,
		ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json"

})
public class DeleteAddressServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(DeleteAddressServlet.class);

	@Reference
	transient AddNewAddressService addNewAddressService;

	private static final long serialVersionUID = 1L;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		JsonObject responseValue = new JsonObject();
		try {
			String addressId = slingRequest.getParameter("addressId");
			String accessToken = slingRequest.getParameter("accessToken");
			String details = addressId;
			String bearerToken = slingRequest.getParameter("bearertoken");
			if (StringUtils.isNotEmpty(details)) {
				responseValue = addNewAddressService.deleteAddress(details, accessToken, bearerToken);
			}
		} catch (IOException | RuntimeException e) {
			log.error("error occurred in doPost", e);
		}
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(String.valueOf(responseValue));
	}
}
