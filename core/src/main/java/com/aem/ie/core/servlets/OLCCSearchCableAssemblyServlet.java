package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.constants.ApplConstants;
import com.google.gson.JsonObject;
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

import static com.aem.ie.core.constants.ServletConstants.OLCC_SEARCH_CABLE_ASSEMBLY;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=OLCC Search Cable Assembly",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + OLCC_SEARCH_CABLE_ASSEMBLY,
		ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json" })
public class OLCCSearchCableAssemblyServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(OLCCSearchCableAssemblyServlet.class);

	@Reference
	private transient OLCCModuleService olccModuleService;
	private static final long serialVersionUID = 1L;
	private String jsonData;

	@Override
	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String bearerToken = slingRequest.getParameter("bearerToken");
		jsonData = slingRequest.getParameter("jsonData");
		slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
		String responseValue = olccModuleService.getSearchCableAssembly(jsonData, bearerToken);
		if (responseValue.isEmpty()) {
			JsonObject jsonObject = new JsonObject();
			jsonObject.addProperty("sku", "");
			String JSON_STRING = jsonObject.toString();
			slingResponse.getWriter().write(JSON_STRING);
		} else {
			slingResponse.getWriter().write(responseValue);
		}

	}

}
