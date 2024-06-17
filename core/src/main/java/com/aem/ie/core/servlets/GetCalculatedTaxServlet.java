package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.GetCalculatedTaxService;
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

import static com.aem.ie.core.constants.ServletConstants.GET_CALCULATED_TAX;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Get Calculated Tax servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=PATCH",
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GET_CALCULATED_TAX })
public class GetCalculatedTaxServlet extends SlingAllMethodsServlet {
	private String customerTokenValue = StringUtils.EMPTY;
	private String country = StringUtils.EMPTY;
	private String postalCode = StringUtils.EMPTY;
	@Reference
	transient GetCalculatedTaxService getCalculatedTaxService;
	private static final Logger log = LoggerFactory.getLogger(GetCalculatedTaxServlet.class);
	private static final long serialVersionUID = 1L;

	public void service(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		doPatch(slingRequest, slingResponse);
	}

	protected void doPatch(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
		try {
			customerTokenValue = slingRequest.getParameter("CTCustomerToken");
			country = slingRequest.getParameter("countryCode");
			postalCode = slingRequest.getParameter("postalCode");
			String bearerToken = slingRequest.getParameter("bearertoken");
			String responseValue = getCalculatedTaxService.getCalculatedTax(customerTokenValue, country, postalCode,
					bearerToken);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException e) {
			log.error("error occurred in doPatch{}", e.getMessage());
		}
	}
}
