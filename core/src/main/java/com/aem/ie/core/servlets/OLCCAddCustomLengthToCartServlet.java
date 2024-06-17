package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.constants.ApplConstants;
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

import static com.aem.ie.core.constants.ServletConstants.OLCC_ADD_CUSTOM_LENGTH_CART;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=OLCC add custom length to cart",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_PUT,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + OLCC_ADD_CUSTOM_LENGTH_CART })
public class OLCCAddCustomLengthToCartServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(OLCCAddCustomLengthToCartServlet.class);

	@Reference
	private transient OLCCModuleService olccModuleService;

	private static final long serialVersionUID = 1L;

	@Override
	protected void doPut(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		String token = request.getParameter("CTCustomerToken");
		String currency = request.getParameter("currency");
		String skuValue = request.getParameter("masterSku");
		String quantity = request.getParameter("quantity");
		String unitOfMeasurement = request.getParameter("unitOfMeasurement");
		String length = request.getParameter("length");
		String bearerToken = request.getParameter("bearertoken");
		String cableAssemblyTesting = request.getParameter("cableAssemblyTesting");
		String responseValue = olccModuleService.addCustomLengthToCartUrl(token, currency, skuValue, quantity,
				unitOfMeasurement, length, bearerToken, cableAssemblyTesting);
		response.setContentType(ApplConstants.CONTENT_TYPE_JSON);
		response.getWriter().write(responseValue);
	}
}
