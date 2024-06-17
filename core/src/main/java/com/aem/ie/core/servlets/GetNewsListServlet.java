package com.aem.ie.core.servlets;

import java.io.IOException;
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

import com.aem.ie.core.Service.NewsListService;
import com.aem.ie.core.constants.ServletConstants;
import com.aem.ie.core.models.NewsDetail;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=News List servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + ServletConstants.NEWS_LIST })
public class GetNewsListServlet extends SlingSafeMethodsServlet {
	@Reference
	private transient NewsListService newsListService;

	private static final long serialVersionUID = 1L;
	private static final Logger log = LoggerFactory.getLogger(GetNewsListServlet.class);

	@Override
	public void doGet(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse) {
		try {
			String newsRootPath = newsListService.getNewsRootPath();
			JsonObject response = new JsonObject();
			ResourceResolver resourceResolver = slingRequest.getResourceResolver();
			List<NewsDetail> responseValue = newsListService.getNewsList(newsRootPath, resourceResolver);
			Gson gson = new Gson();
			JsonArray responseData = JsonParser.parseString(gson.toJson(responseValue)).getAsJsonArray();
			response.add("data", responseData);
			slingResponse.setContentType("application/json");
			slingResponse.getWriter().write(String.valueOf(response));
		} catch (IOException ioException) {
			log.error("Exception Occurred in Blog List{}", ioException.getMessage());
		}
	}
}
