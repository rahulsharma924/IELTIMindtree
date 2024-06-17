package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.OLCCAssetUploadTokenService;
import com.aem.ie.core.Service.OLCCDamAssetUploadService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
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

import static com.aem.ie.core.constants.ServletConstants.OLCC_MERGED_PDF_UPLOAD;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=OLCC Upload Merged Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + OLCC_MERGED_PDF_UPLOAD })
public class OLCCMergedPDFUploadServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(OLCCMergedPDFUploadServlet.class);

	@Reference
	private transient OLCCAssetUploadTokenService olccAssetUploadTokenService;

	@Reference
	private transient OLCCDamAssetUploadService olccDamAssetUploadService;
	private static final long serialVersionUID = 1L;

	@Override
	protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		ResourceResolver resolver = slingRequest.getResourceResolver();
		String accessToken = olccAssetUploadTokenService.getAssetUploadJWTToken(resolver);
		String mergedFileName = slingRequest.getParameter("mergedFileName");
		String connector1 = slingRequest.getParameter("connector1");
		String connector2 = slingRequest.getParameter("connector2");
		String cable = slingRequest.getParameter("cable");
		String responseValue = olccDamAssetUploadService.mergePDF(mergedFileName, connector1, connector2, cable,
				accessToken);
		slingResponse.setContentType("application/json");
		slingResponse.getWriter().write(responseValue);
	}
}
