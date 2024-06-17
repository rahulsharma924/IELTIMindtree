package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.REFRESH_TOKEN;

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

import com.aem.ie.core.Service.IECTLoginService;
import com.aem.ie.core.Service.RefreshTokenService;
import com.aem.ie.core.services.impl.IECTLoginImpl;

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
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Refresh Token Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + REFRESH_TOKEN })
public class RefreshTokenServlet extends SlingAllMethodsServlet{
	private static final Logger log = LoggerFactory.getLogger(RefreshTokenServlet.class);
	private static final long serialVersionUID = 1L;
	@Reference
	private transient RefreshTokenService refreshTokenService;
	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String refreshToken = slingRequest.getParameter("refreshToken");
		String bearerToken = slingRequest.getParameter("bearerToken");
		String responseValue = refreshTokenService.getRefreshTokenVal(refreshToken, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
