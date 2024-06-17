package com.aem.ie.core.models;

import static com.aem.ie.core.constants.ApplConstants.CFM_PATH_LEVEL_0;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class NewsReleasesModel {
	private static final Logger log = LoggerFactory.getLogger(NewsReleasesModel.class);
	@SlingObject
	Resource resouecetag;
	@Inject
	private QueryBuilder builder;
	@Inject
	private ResourceResolver resourceresolver;
	@Inject
	@Via("resource")
	protected boolean newsreleasetitle;
	@Inject
	@Via("resource")
	protected boolean bestsellertitle;
	@Inject
	SlingHttpServletRequest request;
	private Session session;
	private Map<String, String> myHashMap;
	private Map<String, String> predicateMap;
	private Resource resource;
	private String Title = null;
	private String Description = null;

	@PostConstruct
	protected void init() {
		try {
			myHashMap = new HashMap<String, String>();
			session = resourceresolver.adaptTo(Session.class);
			if (newsreleasetitle != false || bestsellertitle != false) {
				predicateMap = new HashMap<String, String>();
				predicateMap.put("path", CFM_PATH_LEVEL_0);
				predicateMap.put("type", DamConstants.NT_DAM_ASSET);
				predicateMap.put("p.limit", "-1");
				Query query = builder.createQuery(PredicateGroup.create(predicateMap), session);
				SearchResult result = query.getResult();
				log.info("PLPModel results" + result.getTotalMatches());
				TagManager tagManager = resouecetag.getResourceResolver().adaptTo(TagManager.class);
				if (result.getTotalMatches() > 0) {
					for (Hit hit : result.getHits()) {
						String tagname = null;
						resource = hit.getResource();
						ContentFragment contfragment = resource.adaptTo(ContentFragment.class);
						String tag1 = contfragment.getElement("producttag").getContent();
						Tag taga = tagManager.resolve(tag1);
						if (taga != null) {
							tagname = taga.getName();
						}
						if (newsreleasetitle == true) {
							if(tagname != null){
								if (tagname.equals("news-releases")) {
									Title = contfragment.getElement("title").getContent();
									Description = contfragment.getElement("description").getContent();
									myHashMap.put(Title, Description);
								}
							}
						} else if (bestsellertitle == true) {
							if(tagname != null){
								if (tagname.equals("best-seller")) {
									Title = contfragment.getElement("title").getContent();
									Description = contfragment.getElement("description").getContent();
									myHashMap.put(Title, Description);
								}
							}
						}
					}
				}
			}
		} catch (RepositoryException e) {
			log.error("Repository and Unsupported encoding Excpetion occured" + e.getLocalizedMessage());
		}
	}

	public Map<String, String> getMyHashMap() {
		String pageTitle = myHashMap.get(Title);
		if (pageTitle != null) {
			return myHashMap;
		}
		return myHashMap;

	}

}
