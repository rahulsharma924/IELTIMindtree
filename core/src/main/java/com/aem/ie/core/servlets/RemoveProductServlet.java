package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.RemoveProductService;
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

import static com.aem.ie.core.constants.ServletConstants.REMOVE_PRODUCT;

@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT remove product Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=PATCH",
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + REMOVE_PRODUCT })
public class RemoveProductServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(RemoveProductServlet.class);

	@Reference
	private transient RemoveProductService removeProductService;
	private String customerTokenValue = StringUtils.EMPTY;
	private String lineItemId = StringUtils.EMPTY;
	private String unitOfMeasurement = StringUtils.EMPTY;
	private String isCustomLineItem = StringUtils.EMPTY;

	public void service(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		doPatch(slingRequest, slingResponse);
	}

	protected void doPatch(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
		try {
			customerTokenValue = slingRequest.getParameter("CTCustomerToken");
			String bearerToken = slingRequest.getParameter("bearerToken");
			lineItemId = slingRequest.getParameter("id");
			unitOfMeasurement = slingRequest.getParameter("unitOfMeasurement");
			isCustomLineItem = slingRequest.getParameter("isCustomLineItem");
			if (customerTokenValue != null && lineItemId != null) {
				String responseValue = removeProductService.removeProduct(customerTokenValue, bearerToken, lineItemId,
						unitOfMeasurement, isCustomLineItem);
				slingResponse.setContentType("application/json");
				slingResponse.getWriter().write(responseValue);
			}
		} catch (IOException e) {
			log.error("error occurred in doPatch{}", e.getMessage());
		}
	}
}
