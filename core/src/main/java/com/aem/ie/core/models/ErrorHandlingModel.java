package com.aem.ie.core.models;

import static com.aem.ie.core.constants.ApplConstants.ERROR_CFM_PATH;

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
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ErrorHandlingModel {
	private static final Logger log = LoggerFactory.getLogger(PLPModel.class);
	@SlingObject
	Resource resouecetag;
	@Inject
	private QueryBuilder builder;
	@Inject
	private ResourceResolver resourceresolver;
	@Inject
	SlingHttpServletRequest request;
	private Session session;
	private Map<String, String> myHashMap;
	private Map<String, String> predicateMap;
	private Resource resource;
	private String errorType = null;
	private String errorValue =null;
	private String errorSubTitleValue=null;
	private String errorDescription=null;
	@PostConstruct
	protected void init() {
		try {
			session = resourceresolver.adaptTo(Session.class);
			myHashMap = new HashMap<String, String>();
			predicateMap = new HashMap<String, String>();
			predicateMap.put("path", ERROR_CFM_PATH);
			predicateMap.put("type", DamConstants.NT_DAM_ASSET);
			predicateMap.put("p.limit", "-1");
			Query query = builder.createQuery(PredicateGroup.create(predicateMap), session);
			SearchResult result = query.getResult();
			if (result.getTotalMatches() > 0) {
				for (Hit hit : result.getHits()) {
					resource = hit.getResource();
					ContentFragment contfragment = resource.adaptTo(ContentFragment.class);
					errorType = contfragment.getElement("errortype").getContent();
					errorSubTitleValue = contfragment.getElement("errordescription").getContent();
					errorValue = contfragment.getElement("errordescriptionvalue").getContent();
					if(errorValue.length()>0) {
					    errorDescription=errorSubTitleValue+"#"+errorValue;
					}else {
						errorDescription=errorSubTitleValue;
					}
					if(errorType!=null && errorDescription!=null) {
					myHashMap.put(errorType, errorDescription);
					}
				}
			}
		}catch (RepositoryException exception) {
			log.error("Repository and Unsupported encoding Excpetion occured" + exception.getLocalizedMessage());
		}
		}
	public Map<String, String> getMyHashMap() {
		return myHashMap;
	}
}
