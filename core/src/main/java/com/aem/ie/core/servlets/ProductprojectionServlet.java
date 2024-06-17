/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.PRODUCT_PROJECTION;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.ProductProjectionService;

/** Author Anuradha Vunnam
 * 
 * @author M1097457
 *
 */
/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + PRODUCT_PROJECTION})
public class ProductprojectionServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(ProductprojectionServlet.class);
	@Reference
	private transient ProductProjectionService productProjectionService;
	private static final long serialVersionUID = 1L;

	protected void doGet(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String ctToken = slingRequest.getParameter("CTCustomerToken");
		if(ctToken == null) {
			ctToken="";
		}
		String currency = slingRequest.getParameter("Currency");
		String sku = slingRequest.getParameter("SKU");
		String bearerToken = slingRequest.getParameter("bearerToken");
		String responseValue = productProjectionService.getProductProjectionCTUrl(sku,currency,ctToken,bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
