package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
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

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

import static com.aem.ie.core.constants.ApplConstants.SKU;
import static com.aem.ie.core.constants.ServletConstants.OLCC_GET_CABLE_ASSEMBLY;

/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=OLCC Get Cable Assembly",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + OLCC_GET_CABLE_ASSEMBLY,
		ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json"

})
public class OLCCGetCableAssembly extends SlingAllMethodsServlet {

	@Reference
	private transient OLCCModuleService olccModuleService;
	private static final long serialVersionUID = 1L;
	private String bearerToken = StringUtils.EMPTY;

	@Override
	protected void doGet(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
		bearerToken = slingRequest.getParameter("bearertoken");
		slingResponse.getWriter()
				.write(olccModuleService.getCableAssembly(slingRequest.getParameter(SKU), bearerToken));
	}
}
