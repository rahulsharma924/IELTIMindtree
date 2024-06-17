package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.UPDATE_PERSONAL_INFO;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.constants.ApplConstants;

@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=CT change password Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=PATCH",
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + UPDATE_PERSONAL_INFO })
public class UpdatePersonalInfoServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(UpdatePersonalInfoServlet.class);
	@Reference
	private transient UpdatePersonalInfoService updateinfoService;
	private static final long serialVersionUID = 1L;
	private String customerTokenValue = null;
	private String contact = null;
	private String lastname = null;
	private String email = null;
	private String firstname = null;
	private String company = null;
	private String bearerToken = null;
	private String contactByEmail = null;

	public void service(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		doPatch(slingRequest, slingResponse);
	}

	protected void doPatch(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		customerTokenValue = slingRequest.getParameter("CTCustomerToken");
		contact = slingRequest.getParameter("contact");
		lastname = slingRequest.getParameter("lastName");
		email = slingRequest.getParameter("email");
		firstname = slingRequest.getParameter("firstName");
		company = slingRequest.getParameter("company");
		bearerToken = slingRequest.getParameter("bearerToken");
		contactByEmail = slingRequest.getParameter("contactByEmail");

		if (customerTokenValue != null && contact != null && lastname != null && email != null && firstname != null
				&& company != null && bearerToken != null) {
			String responseValue = updateinfoService.UpdatePersonalInfo(customerTokenValue, contact, lastname, email,
					firstname, company, bearerToken,Boolean.parseBoolean(contactByEmail));
			log.info("UpdatePersonalInfoServlet responseValue : {}",responseValue);
			slingResponse.setContentType(ApplConstants.CONTENT_TYPE_JSON);
			slingResponse.getWriter().write(responseValue);
		}
	}
}
