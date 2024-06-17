package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.TOKEN_VALID;
import java.io.IOException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
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
import com.aem.ie.core.Service.TokenValidService;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Token Validation Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + TOKEN_VALID })
public class TokenValidServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(TokenValidServlet.class);

	@Reference
	private transient TokenValidService tokenService;

	private static final long serialVersionUID = 1L;

	protected void doGet(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		log.debug("servlet class started");
		try {
			String customerToken = slingRequest.getParameter("CTCustomerToken");
			String bearerToken = slingRequest.getParameter("bearertoken");
			if (customerToken != null) {
				String responseValue = tokenService.tokenValidationUrl(customerToken, bearerToken);
				slingResponse.setContentType("application/json");
				slingResponse.getWriter().write(responseValue);
			}
		} catch (IOException ioException) {
			log.error("error occurred in doPost{}", ioException.getMessage());
		}
	}
}
