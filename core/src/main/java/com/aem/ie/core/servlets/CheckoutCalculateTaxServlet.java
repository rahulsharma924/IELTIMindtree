package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.GetCalculatedTaxService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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

import static com.aem.ie.core.constants.ServletConstants.CALCULATE_TAX;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Calculate Tax servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=PATCH",
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CALCULATE_TAX })
public class CheckoutCalculateTaxServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(CheckoutCalculateTaxServlet.class);
	private String customerTokenValue = StringUtils.EMPTY;
	private String responseValue = StringUtils.EMPTY;

	@Reference
	private transient GetCalculatedTaxService getCalculatedTaxService;

	public void service(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		doPatch(slingRequest, slingResponse);
	}

	protected void doPatch(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
		try {
			customerTokenValue = slingRequest.getParameter("CTCustomerToken");
			String jsonData = slingRequest.getParameter("jsonData");
			String bearerToken = slingRequest.getParameter("bearertoken");
			JsonObject jsonObject = JsonParser.parseString(jsonData).getAsJsonObject();
			responseValue = getCalculatedTaxService.getCalculateTax(customerTokenValue, jsonObject, bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException ioException) {
			log.error("error occurred during closing the client call {}", ioException.getMessage());
		}
	}
}
