package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;
import static com.aem.ie.core.constants.ApplConstants.CF_BROUCHERS_PATH;
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
import java.util.TreeMap;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BrochuresModel {
	private static final Logger log = LoggerFactory.getLogger(BrochuresModel.class);
	@Inject
	private QueryBuilder builder;
	@Inject
	private ResourceResolver resourceresolver;
	private Session session;
	private Map<String, String> myHashMap;
	private Map<String, String> myHashMap1;
	private Map<String, String> myHashMap2;
	private Map<String, String> predicateMap;
	private Resource resource;
	private String Title = null;
	private String Description = null;
	private String pdfImagePath = null;
	private String brochureImagePath = null;

	@PostConstruct
	protected void init() {
		try {
			session = resourceresolver.adaptTo(Session.class);
			myHashMap = new LinkedHashMap<String, String>();
			myHashMap1 = new LinkedHashMap<String, String>();
			myHashMap2 = new LinkedHashMap<String, String>();
			predicateMap = new LinkedHashMap<String, String>();
			predicateMap.put("path", CF_BROUCHERS_PATH);
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
					brochureImagePath = contfragment.getElement("brochureImagePath").getContent();
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
					myHashMap2.put(Title, brochureImagePath);
				}
			}

		} catch (RepositoryException e) {
			log.error("Repository and Unsupported encoding Excpetion occured" + e.getLocalizedMessage());
		}
	}

	public TreeMap<String, String> getBrochuresMyHashMap() {
		TreeMap<String, String> sorted = new TreeMap<>(myHashMap);
		return sorted;
	}

	public Map<String, String> getBrochuresImageMyHashMap() {
		return myHashMap1;
	}

	public Map<String, String> getBrochuresImageHashMap() {
		return myHashMap2;
	}
}
