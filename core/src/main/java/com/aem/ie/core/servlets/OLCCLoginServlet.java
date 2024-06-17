package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.constants.ApplConstants;
import org.apache.commons.io.IOUtils;
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
import javax.servlet.http.Cookie;

import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.OLCC_LOGIN;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=OLCC Login Token",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + OLCC_LOGIN })
public class OLCCLoginServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(OLCCLoginServlet.class);

	@Reference
	private transient OLCCModuleService olccModuleService;
	private static final long serialVersionUID = 1L;
	private String accessToken = "token";
	private String bearer = "Bearer";
	Cookie c = new Cookie(bearer, accessToken);
	Cookie[] cookies = null;

	@Override
	protected void doGet(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String value = olccModuleService.getBearerTokenUrl();
		String[] couple = value.split(",");
		for (int i = 0; i < couple.length; i++) {
			String[] items = couple[i].split(":");
			if (items[0].contains("access_token")) {
				accessToken = items[1].replace("}", "");
				log.debug("----OLCCLoginServlet access_token value set----");
			}
		}
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(accessToken);
	}
}
