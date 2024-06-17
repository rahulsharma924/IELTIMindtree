package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;
import static com.aem.ie.core.constants.ApplConstants.CF_WHITEPAPER_PATH;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.LinkedHashMap;
import java.util.Map;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class WhitePaperModel {
	private static final Logger log = LoggerFactory.getLogger(WhitePaperModel.class);
	@Inject
	QueryBuilder builder;
	@Inject
	ResourceResolver resourceresolver;
	private Session session;
	private Map<String, String> myHashMap;
	private Map<String, String> myHashMap1;
	private Map<String, String> predicateMap;
	private Resource resource;
	private String Title = null;
	private String Description = null;
	private String pdfImagePath = null;
	private String pdfName = null;

	@PostConstruct
	protected void init() {
		try {
			session = resourceresolver.adaptTo(Session.class);
			myHashMap = new LinkedHashMap<String, String>();
			myHashMap1 = new LinkedHashMap<String, String>();
			predicateMap = new LinkedHashMap<String, String>();
			predicateMap.put("path", CF_WHITEPAPER_PATH);
			predicateMap.put("type", DamConstants.NT_DAM_ASSET);
			predicateMap.put("p.limit", "-1");
			Query query = builder.createQuery(PredicateGroup.create(predicateMap), session);
			SearchResult result = query.getResult();
			if (result.getTotalMatches() > 0) {
				for (Hit hit : result.getHits()) {
					resource = hit.getResource();
					ContentFragment contfragment = resource.adaptTo(ContentFragment.class);
					Title = contfragment.getElement("title").getContent();
					Description = contfragment.getElement("description").getContent();
					if (Title != null && Description != null) {
						if (Description.contains("<p>")) {
							if (Description.contains("</p>")) {
								Description = Description.substring(Description.indexOf("<p>"),
										Description.lastIndexOf("</p>"));
								if (Description.contains("<p>")) {
									Description = Description.replaceAll("<p>", "");
								}
								if (Description.contains("</p>")) {
									Description = Description.replaceAll("</p>", "<br><br>");
								}
							}
						}
					}
					pdfImagePath = contfragment.getElement("pdfimagepath").getContent();
					myHashMap.put(Title, Description);
					myHashMap1.put(Title, pdfImagePath);
				}
			}

		} catch (RepositoryException e) {
			log.error("Repository and Unsupported encoding Excpetion occured" + e.getLocalizedMessage());
		}
	}

	public Map<String, String> getWhitePaperMyHashMap() {
		return myHashMap;
	}

	public Map<String, String> getWhitePaperImageMyHashMap() {
		return myHashMap1;
	}
}
