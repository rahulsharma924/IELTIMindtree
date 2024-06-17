package com.aem.ie.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.aem.ie.core.constants.ApplConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.IECTPasswordchangeService;

import static com.aem.ie.core.constants.ServletConstants.CHANGE_PSD;

@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT change password Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=PATCH",
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + CHANGE_PSD })
public class ChangePasswordServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(ChangePasswordServlet.class);
	@Reference
	private transient IECTPasswordchangeService cpwdService;
	private static final long serialVersionUID = 1L;
	private String customerTokenValue = null;
	private String currentPwd = null;
	private String newPwd = null;

	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		customerTokenValue = slingRequest.getParameter("CTCustomerToken");
		currentPwd = slingRequest.getParameter("currentPassword");
		newPwd = slingRequest.getParameter("newPassword");
		String bearerToken = slingRequest.getParameter("bearertoken");
		if (customerTokenValue != null && currentPwd != null && newPwd != null) {
			String responseValue = cpwdService.getPasswordChangeCTUrl(customerTokenValue, currentPwd, newPwd,
					bearerToken);

			slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
			slingResponse.getWriter().write(responseValue);
		}
	}
}
