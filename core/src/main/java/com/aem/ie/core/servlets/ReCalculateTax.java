package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.GetCalculatedTaxService;
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
import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.RECALCULATE_TAX;

@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT Calculated Tax For Registered User servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + RECALCULATE_TAX })
public class ReCalculateTax extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(ReCalculateTax.class);

	@Reference
	private transient GetCalculatedTaxService getCalculatedTaxService;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
		try {
			String customerTokenValue = slingRequest.getParameter("CTCustomerToken");
			String bearerToken = slingRequest.getParameter("bearertoken");
			String responseValue = getCalculatedTaxService.getReCalculateTaxUser(customerTokenValue, bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException ioException) {
			log.error("error occured during closing the client call", ioException.getMessage());
		}
	}
}
