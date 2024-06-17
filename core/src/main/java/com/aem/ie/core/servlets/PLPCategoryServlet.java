/*package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.PLP_CATEGORY;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import static com.aem.ie.core.constants.ApplConstants.CFM_PATH;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import org.apache.sling.api.resource.Resource;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.google.gson.JsonObject;
/**
 * Servlet that writes some sample content into the response. It is mounted for
 * all resources of a specific Sling resource type. The
 * {@link SlingSafeMethodsServlet} shall be used for HTTP methods that are
 * idempotent. For write operations use the {@link SlingAllMethodsServlet}.
 */
/*
@Component(service = Servlet.class,
property = {
	      Constants.SERVICE_DESCRIPTION + "=PLPModel servlet",
	      ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		  ServletResolverConstants.SLING_SERVLET_PATHS + "=" + PLP_CATEGORY
	      })
public class PLPCategoryServlet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(PLPCategoryServlet.class);
	private Map<String, String> predicateMap;
	private Resource resource;
	private String Title=null;
	private String Description =null;
	private String results=null;
	private String mismatchresults=null;
	protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
	  	      throws ServletException, IOException {
		final QueryBuilder queryBuilder = request.getResourceResolver().adaptTo(QueryBuilder.class);
		JsonObject jobject=new JsonObject();
		JsonObject tagmisobj=new JsonObject();
		String categoryValuefinal=request.getParameter("categoryName");
		predicateMap = new HashMap<String, String>();
		predicateMap.put("path", CFM_PATH);
		predicateMap.put("type", DamConstants.NT_DAM_ASSET);
		predicateMap.put("p.limit", "-1");
		 final Query query = queryBuilder.createQuery(PredicateGroup.create(predicateMap), request.getResourceResolver().adaptTo(Session.class));
		SearchResult result = query.getResult();
		log.debug("results"+result.getTotalMatches());
		TagManager tagMgr = request.getResourceResolver().adaptTo(TagManager.class);
		if(result.getTotalMatches() > 0) {
			for(Hit hit:result.getHits()) {
				String tagname=null;
				try {
					resource = hit.getResource();
				ContentFragment contfragment =resource.adaptTo(ContentFragment.class);
				String tag1 = contfragment.getElement("producttag").getContent();
				Tag taga = tagMgr.resolve(tag1);
				if(taga != null) {
				tagname =taga.getName();
				}
				if(categoryValuefinal!=null && tagname!=null) {
				if(categoryValuefinal.toLowerCase().equals(tagname.toLowerCase())) {
				Title= contfragment.getElement("title").getContent();
				Description = contfragment.getElement("description").getContent();
				if(Title!=null && Description!=null) {
				    if(Description.contains("<p>")) {
					if(Description.contains("</p>")) {
					Description = Description.substring(Description.indexOf("<p>"), Description.lastIndexOf("</p>"));
					log.debug("Description After Substring******************* "+Description);
					if(Description.contains("<p>")) {
						Description=Description.replaceAll("<p>","");
					}
					if(Description.contains("</p>")) {
						Description=Description.replaceAll("</p>","<br><br>");
						log.debug("FINAL DESCRIPTION VALUE******************* "+Description);
					}
					}
				}
				log.debug("Description******************* "+Description);
				jobject.addProperty("title", Title);
				jobject.addProperty("description", Description);
				results=jobject.toString();
				}
				}else {
					tagmisobj.addProperty("tagmismatch", "Page Under Construction");
					mismatchresults=tagmisobj.toString();
				}
				}
				} catch (RepositoryException e) {
					log.error("Repository Excpetion Occured"+e.getMessage());
				}
				}
			}
		response.setContentType("application/json");
		if(results!=null) {
		response.getWriter().write(results);
		results=null;
		}else {
			response.getWriter().write(mismatchresults);
			
		}
}
}*/
