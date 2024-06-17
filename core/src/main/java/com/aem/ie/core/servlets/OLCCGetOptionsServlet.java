package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.constants.ApplConstants;
import org.apache.commons.io.IOUtils;
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
import java.util.Scanner;

import static com.aem.ie.core.constants.ServletConstants.OLCC_GET_OPTIONS;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The {@link } shall be used
 * for HTTP methods that are idempotent. For write operations use the
 * {@link SlingAllMethodsServlet}.
 */

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=OLCC Get Search Options",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + OLCC_GET_OPTIONS,
		ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json"

})
public class OLCCGetOptionsServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(OLCCGetOptionsServlet.class);
	@Reference
	private transient OLCCModuleService olccModuleService;
	private static final long serialVersionUID = 1L;
	private String jsonData = StringUtils.EMPTY;
	private String bearerToken = StringUtils.EMPTY;

	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
		bearerToken = slingRequest.getParameter("bearertoken");
		jsonData = slingRequest.getParameter("jsonData");
		slingResponse.getWriter().write(olccModuleService.getOption(jsonData, bearerToken));
	}
}
