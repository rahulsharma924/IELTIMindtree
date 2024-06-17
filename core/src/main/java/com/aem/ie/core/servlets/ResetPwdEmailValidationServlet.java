package com.aem.ie.core.servlets;

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
import com.aem.ie.core.Service.IECTResetPasswordEmailValidation;

import static com.aem.ie.core.constants.ServletConstants.EMAIL_VALIDATION;

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
@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT Integration for Email Validation servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + EMAIL_VALIDATION })
public class ResetPwdEmailValidationServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(ResetPwdEmailValidationServlet.class);
	@Reference
	private transient IECTResetPasswordEmailValidation emailvalidateService;
	private static final long serialVersionUID = 1L;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String email = slingRequest.getParameter("email");
		String bearerToken = slingRequest.getParameter("bearerToken");
		String responseValue = emailvalidateService.getResetPasswordEmailCTUrl(email, bearerToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
