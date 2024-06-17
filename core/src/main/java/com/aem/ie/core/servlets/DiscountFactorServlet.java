package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.DiscountFactorProductService;
import com.aem.ie.core.Service.IECTViewPaymentService;
import com.aem.ie.core.Service.ValidateAddressService;
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

import static com.aem.ie.core.constants.ServletConstants.CHOOSE_PAYMENT;
import static com.aem.ie.core.constants.ServletConstants.DISCOUNT_FACTOR;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Discount factor for login customer",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + DISCOUNT_FACTOR })
public class DiscountFactorServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(DiscountFactorServlet.class);

	@Reference
	private transient DiscountFactorProductService DiscountFactorProductService;
	private String jsonData = StringUtils.EMPTY;
	private static final long serialVersionUID = 1L;

	protected void doGet(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		try {
			String customerToken = slingRequest.getParameter("CTCustomerToken");
			String bearerToken = slingRequest.getParameter("bearerToken");
			jsonData = slingRequest.getParameter("SKU");
			String responseValue = DiscountFactorProductService.getdiscountFactorProduct(customerToken, bearerToken,
					jsonData);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(responseValue);
		} catch (IOException e) {
			log.error("error occurred in doGet{}", e.getMessage());
		}
	}
}
