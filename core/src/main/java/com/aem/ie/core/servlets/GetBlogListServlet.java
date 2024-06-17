package com.aem.ie.core.servlets;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.BlogListService;
import com.aem.ie.core.Service.BlogService;
import com.aem.ie.core.constants.ServletConstants;
import com.aem.ie.core.models.BlogPage;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Blog List servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + ServletConstants.BLOG_LIST })
public class GetBlogListServlet extends SlingSafeMethodsServlet {
	@Reference
	private transient BlogListService blogListService;

	private static final long serialVersionUID = 1L;
	private static final Logger log = LoggerFactory.getLogger(GetBlogListServlet.class);

	@Reference
	private transient BlogService blogService;

	@Override
	public void doGet(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
		try {
			JsonObject response = new JsonObject();
			String blogRootPath = blogService.getBlogRootPath();
			String blogArchivesRootPath = blogService.getBlogArchivesRootPath();
			ResourceResolver resourceResolver = slingRequest.getResourceResolver();
			String year = slingRequest.getParameter("year");
			List<BlogPage> responseValue = blogListService.getBlogList(blogRootPath, resourceResolver, year);
			List<String> archivesYearResponse = blogListService.getArchives(blogArchivesRootPath, resourceResolver);
			HashSet<String> categoriesResponse = blogListService.getCategories();
			Gson gson = new Gson();
			JsonArray responseData = JsonParser.parseString(gson.toJson(responseValue)).getAsJsonArray();
			JsonArray categoryData = JsonParser.parseString(gson.toJson(categoriesResponse)).getAsJsonArray();
			JsonArray archivesData = JsonParser.parseString(gson.toJson(archivesYearResponse)).getAsJsonArray();
			response.add("data", responseData);
			response.add("categories", categoryData);
			response.add("archivesYear", archivesData);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(String.valueOf(response));
		} catch (IOException ioException) {
			log.error("Exception Occurred in Blog List{}", ioException.getMessage());
		}
	}
}
