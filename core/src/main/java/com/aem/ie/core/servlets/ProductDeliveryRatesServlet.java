package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.ProductDeliveryRatesService;
import com.aem.ie.core.constants.ApplConstants;
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

import static com.aem.ie.core.constants.ServletConstants.GET_PRODUCTDELIVERYRATES;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Get Product Delivery Rates",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GET_PRODUCTDELIVERYRATES })
public class ProductDeliveryRatesServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(ProductDeliveryRatesServlet.class);

	@Reference
	private transient ProductDeliveryRatesService productDeliveryRatesService;

	private static final long serialVersionUID = 1L;
	private String jsonData = StringUtils.EMPTY;
	private String bearerToken = StringUtils.EMPTY;

	@Override
	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
		bearerToken = slingRequest.getParameter("bearerToken");
		jsonData = slingRequest.getParameter("jsonData");
		slingResponse.getWriter().write(productDeliveryRatesService.getProductDeliveryRates(jsonData, bearerToken));
	}
}
