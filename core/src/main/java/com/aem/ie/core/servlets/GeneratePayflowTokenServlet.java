package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.PayflowTokenService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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

import static com.aem.ie.core.constants.ServletConstants.GENERATE_SECURE_TOKEN;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Secure Token Generate servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GENERATE_SECURE_TOKEN })
public class GeneratePayflowTokenServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(GeneratePayflowTokenServlet.class);
	@Reference
	private transient PayflowTokenService paypalTokenService;
	private static final long serialVersionUID = 1L;
	private String jsonData = StringUtils.EMPTY;
	private String jsonSecureData = StringUtils.EMPTY;

	@Override
	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		jsonData = slingRequest.getParameter("jsonData");
		jsonSecureData = slingRequest.getParameter("jsonSecureTokenData");
		JsonObject jsonObject = JsonParser.parseString(jsonSecureData).getAsJsonObject();
		String bearerToken = slingRequest.getParameter("bearerToken");
		String customerToken = slingRequest.getParameter("CTCustomerToken");
		//String ponumberval = slingRequest.getParameter("POnumber");
		String responseValue = paypalTokenService.getSecureToken(slingRequest, jsonData, jsonObject, customerToken,
				bearerToken);
		slingResponse.getWriter().write(responseValue);
	}
}
