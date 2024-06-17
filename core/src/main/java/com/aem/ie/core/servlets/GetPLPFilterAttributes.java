package com.aem.ie.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.aem.ie.core.Service.GetPLPFilterAttributeService;
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

import static com.aem.ie.core.constants.ServletConstants.GET_PLP_FILTERATTRIBUTE;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Get PLP Filter Attributes servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GET_PLP_FILTERATTRIBUTE })
public class GetPLPFilterAttributes extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(GetPLPFilterAttributes.class);
	@Reference
	private transient GetPLPFilterAttributeService GetPLPFilterAttributeService;
	private static final long serialVersionUID = 1L;
	private String bearerToken = StringUtils.EMPTY;
	private String brandName = StringUtils.EMPTY;
	private String categoryName = StringUtils.EMPTY;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		bearerToken = slingRequest.getParameter("bearertoken");
		brandName = slingRequest.getParameter("brandName");
		categoryName = slingRequest.getParameter("categoryName");
		String responseValue = GetPLPFilterAttributeService.getPLPFilterAttributes(bearerToken, brandName,
				categoryName);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
