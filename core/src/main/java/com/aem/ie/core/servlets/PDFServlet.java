package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.PDF_PATH;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;

import javax.servlet.Servlet;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.aem.ie.core.Service.CompliancePdfService;
import com.day.cq.dam.api.Asset;

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
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=CT Integration servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + PDF_PATH })
public class PDFServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(PDFServlet.class);
	@Reference
	private transient CompliancePdfService compliancepdfservice;
	private static final long serialVersionUID = 1L;

	protected void doGet(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String skuid = slingRequest.getParameter("skuId");
		String datasheet = slingRequest.getParameter("datasheetval");
		String bearerToken = slingRequest.getParameter("bearerToken");
		String responseValue = compliancepdfservice.getpdfpath(bearerToken, skuid, datasheet);
		slingResponse.setContentType("application/text");
		slingResponse.getWriter().write(responseValue);
	}
}
