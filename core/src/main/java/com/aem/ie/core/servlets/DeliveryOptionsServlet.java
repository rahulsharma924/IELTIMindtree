package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTDeliveryService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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

import static com.aem.ie.core.constants.ServletConstants.DELIVERY_OPTIONS;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Get Delivery Options Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + DELIVERY_OPTIONS,
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "= guestUser"

})
public class DeliveryOptionsServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(DeliveryOptionsServlet.class);

	@Reference
	private transient IECTDeliveryService deliveryService;
	private static final long serialVersionUID = 1L;
	private String customerToken = StringUtils.EMPTY;
	private String responseValue = StringUtils.EMPTY;
	private String jsonData = StringUtils.EMPTY;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		try {

			String servletPath = slingRequest.getPathInfo();
			JsonObject jsonObject = new JsonObject();
			if ("/bin/getDeliveryOptions".equals(servletPath)) {
				customerToken = slingRequest.getParameter("CTCustomerToken");
				jsonObject.addProperty("transitTimeRequired", slingRequest.getParameter("transitTimeRequired"));
				JsonObject addressObject = new JsonObject();
				addressObject.addProperty("id", slingRequest.getParameter("addressId"));
				jsonObject.add("address", addressObject);
			} else if ("/bin/getDeliveryOptions.guestUser".equals(servletPath)) {
				customerToken = slingRequest.getParameter("CTCustomerToken");
				jsonData = slingRequest.getParameter("jsonData");
				jsonObject = JsonParser.parseString(jsonData).getAsJsonObject();
			}
			String bearerToken = slingRequest.getParameter("bearertoken");
			responseValue = deliveryService.getDeliveryOptions(customerToken, jsonObject, bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException e) {
			log.error("error occurred in doPost{}", e.getMessage());
		}
	}
}