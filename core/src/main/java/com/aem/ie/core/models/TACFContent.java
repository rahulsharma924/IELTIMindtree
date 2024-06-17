package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;

import static com.aem.ie.core.constants.ApplConstants.CFM_RESOURCES_PATH;
import static com.aem.ie.core.constants.ApplConstants.CF_ARTICLE_PATH;
import static com.aem.ie.core.constants.ApplConstants.PROPERTY;
import static com.aem.ie.core.constants.ApplConstants.REPLICATION_PATH;
import static com.aem.ie.core.constants.ApplConstants.PROPERTY_VALUE;
import static com.aem.ie.core.constants.ApplConstants.PROPERTY_OPERATION;
import static com.aem.ie.core.constants.ApplConstants.ACTIVATE;
import static com.aem.ie.core.constants.ApplConstants.EXISTS;
import static com.aem.ie.core.constants.ApplConstants.ORDER_BY;
import static com.aem.ie.core.constants.ApplConstants.LAST_REPLICATE_PATH;
import static com.aem.ie.core.constants.ApplConstants.ORDER_BY_SORT;
import static com.aem.ie.core.constants.ApplConstants.DESC;
import static com.aem.ie.core.constants.ApplConstants.P_LIMIT;

import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.io.IOException;
import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.Map;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TACFContent {
	private static final Logger log = LoggerFactory.getLogger(TACFContent.class);
	@Inject
	private QueryBuilder builder;
	@Inject
	private ResourceResolver resourceresolver;
	@Self
	SlingHttpServletRequest request;
	private Session session;
	private Resource resource;
	private Map<String, String> myHashMap;
	private Map<String, String> myHashMap1;
	private Map<String, String> predicateMap;
	private String cfTitle = null;
	private String cfDescription = null;
	private String cfPdflink = null;
	InputStream inTitle;
	InputStream inDescription;
	InputStream inPdflink;
	private String Title = null;
	private String Description = null;
	private String pdfImagePath = null;
	@SlingObject
	ResourceResolver resourceResolver;
	@RequestAttribute(name = "cfInput1")
	private String cfInput1;
	@RequestAttribute(name = "cfInput2")
	private String cfInput2;
	@RequestAttribute(name = "cfInput3")
	private String cfInput3;

	@PostConstruct
	protected void init() {
		if (cfInput1 != null && !cfInput1.isEmpty() && cfInput2 != null && !cfInput2.isEmpty() && cfInput3 != null
				&& !cfInput3.isEmpty()) {
			getCFMData(cfInput1, cfInput2, cfInput3);
		} else {
			getCFMPublishedData();
		}
	}

	public Map<String, String> getTechnicalArticlesMyHashMap() {
		return myHashMap;
	}

	public Map<String, String> getTechnicalArticlesImageMyHashMap() {
		return myHashMap1;

	}

	public void getCFMData(String cfInput1, String cfInput2, String cfInput3) {
		cfInput1 = cfInput1 + CFM_RESOURCES_PATH;
		cfInput2 = cfInput2 + CFM_RESOURCES_PATH;
		cfInput3 = cfInput3 + CFM_RESOURCES_PATH;
		String[] CFPaths = { cfInput1, cfInput2, cfInput3 };
		try {
			myHashMap = new LinkedHashMap<String, String>();
			myHashMap1 = new LinkedHashMap<String, String>();
			for (String cfvalues : CFPaths) {
				Node cfNode = resourceResolver.getResource(cfvalues).adaptTo(Node.class);
				if (cfNode != null) {
					if (cfNode.hasProperty("title") && cfNode.hasProperty("description@ContentType")) {
						if (cfNode.getProperty("description@ContentType").getString().equals("text/html")) {
							inTitle = cfNode.getProperty("title").getBinary().getStream();
							cfTitle = IOUtils.toString(inTitle, "UTF-8");
							inDescription = cfNode.getProperty("description").getBinary().getStream();
							cfDescription = IOUtils.toString(inDescription, "UTF-8");
							inPdflink = cfNode.getProperty("articlePageLink").getBinary().getStream();
							cfPdflink = IOUtils.toString(inPdflink, "UTF-8");
							if (cfTitle != null && cfDescription != null) {
								if (cfDescription.contains("<p>")) {
									if (cfDescription.contains("</p>")) {
										cfDescription = cfDescription.substring(cfDescription.indexOf("<p>"),
												cfDescription.lastIndexOf("</p>"));
										if (cfDescription.contains("<p>")) {
											cfDescription = cfDescription.replaceAll("<p>", "");
										}
										if (cfDescription.contains("</p>")) {
											cfDescription = cfDescription.replaceAll("</p>", "<br><br>");
										}
									}
								}
							}
							myHashMap.put(cfTitle, cfDescription);
							myHashMap1.put(cfTitle, cfPdflink);
						}
					} else {
						log.info("Content Fragment is not selected");
					}
				} else {
					log.info("Either jcr:data or mime type property set");
				}
			}
		} catch (RepositoryException | IOException e) {
			log.error("Excpetion occured" + e.getLocalizedMessage());
		} finally {
			try {
				inTitle.close();
				inDescription.close();
				inPdflink.close();
			} catch (IOException e) {
				log.error("Excpetion occured" + e.getLocalizedMessage());
			}
		}
	}

	public void getCFMPublishedData() {
		try {
			session = resourceresolver.adaptTo(Session.class);
			myHashMap = new LinkedHashMap<String, String>();
			myHashMap1 = new LinkedHashMap<String, String>();
			predicateMap = new LinkedHashMap<String, String>();
			predicateMap.put("path", CF_ARTICLE_PATH);
			predicateMap.put("type", DamConstants.NT_DAM_ASSET);
			predicateMap.put(PROPERTY, REPLICATION_PATH);
			predicateMap.put(PROPERTY_VALUE, ACTIVATE);
			predicateMap.put(PROPERTY_OPERATION, EXISTS);
			predicateMap.put(ORDER_BY, LAST_REPLICATE_PATH);
			predicateMap.put(ORDER_BY_SORT, DESC);
			predicateMap.put(P_LIMIT, "3");
			Query query = builder.createQuery(PredicateGroup.create(predicateMap), session);
			SearchResult result = query.getResult();
			log.debug("results" + result.getTotalMatches());
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
					pdfImagePath = contfragment.getElement("articlePageLink").getContent();
					myHashMap.put(Title, Description);
					myHashMap1.put(Title, pdfImagePath);
				}
			}

		} catch (RepositoryException e) {
			log.error("Repository and Unsupported encoding Excpetion occured" + e.getLocalizedMessage());
		}
	}
}
