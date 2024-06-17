package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.IECTDeliveryService;
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

import static com.aem.ie.core.constants.ServletConstants.GET_DELIVERY_RATE;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Get Delivery Rate Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GET_DELIVERY_RATE })
public class GetDeliveryRateServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(GetDeliveryRateServlet.class);
	@Reference
	private transient IECTDeliveryService deliveryService;
	private static final long serialVersionUID = 1L;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String customerTokenValue = slingRequest.getParameter("CTCustomerToken");
		String transitTimeRequired = slingRequest.getParameter("transitTimeRequired");
		String zipcode = slingRequest.getParameter("zipcode");
		String country = slingRequest.getParameter("country");
		String bearerToken = slingRequest.getParameter("bearertoken");
		String responseValue = deliveryService.getdeliveryRates(customerTokenValue, transitTimeRequired, zipcode,
				country, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
