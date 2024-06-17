package com.aem.ie.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

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

import com.aem.ie.core.Service.GetProductDeliveryDateService;
import com.google.gson.JsonObject;

import static com.aem.ie.core.constants.ServletConstants.GET_PRODUCT_DELDATE;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Product Delivery Date Service",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GET_PRODUCT_DELDATE })
public class GetProductDeliveryDateServlet extends SlingAllMethodsServlet {
	private static final Logger logger = LoggerFactory.getLogger(GetProductDeliveryDateServlet.class);

	@Reference
	private transient GetProductDeliveryDateService deliveryDateService;
	private static final long serialVersionUID = 1L;

	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		String servletPath = request.getPathInfo();
		if ("/bin/getproddeldate".equals(servletPath)) {
			String zipcode = request.getParameter("zipcode");
			String skuId = request.getParameter("skuId");
			String countryCode = request.getParameter("countryCode");
			String prodQty = request.getParameter("prodQty");
			String bearerToken = request.getParameter("bearerToken");
			String transitTime = request.getParameter("transitTime");

			JsonObject productJson = new JsonObject();
			productJson.addProperty("sku", skuId);
			productJson.addProperty("quantity", prodQty);

			JsonObject addressJson = new JsonObject();
			addressJson.addProperty("zipcode", zipcode);
			addressJson.addProperty("country", countryCode);

			String responseValue = deliveryDateService.getProductDeliveryDate(bearerToken, transitTime, productJson,
					addressJson);
			response.setContentType("application/json");
			response.getWriter().write(responseValue);
		}
		if ("/bin/getproddeldate.custom".equals(servletPath)) {

			String bearerToken = request.getParameter("bearerToken");
			String transitTimeRequired = request.getParameter("transitTime");
			String countryCode = request.getParameter("countryCode");
			String zipcode = request.getParameter("zipcode");
			String masterSku = request.getParameter("masterSku");
			String prodQty = request.getParameter("prodQty");
			String uom = request.getParameter("uom");
			String length = request.getParameter("length");

			JsonObject customCAProduct = new JsonObject();
			customCAProduct.addProperty("masterSku", masterSku);
			customCAProduct.addProperty("uom", uom);
			customCAProduct.addProperty("length", length);
			customCAProduct.addProperty("quantity", prodQty);

			JsonObject addressJson = new JsonObject();
			addressJson.addProperty("zipcode", zipcode);
			addressJson.addProperty("country", countryCode);

			String responseValue = deliveryDateService.getProductDeliveryDateForCustomSku(bearerToken,
					transitTimeRequired, customCAProduct, addressJson);
			response.setContentType("application/json");
			response.getWriter().write(responseValue);
		}
	}

}
