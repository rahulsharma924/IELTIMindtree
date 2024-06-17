package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.utils.SelectorValueUtils;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import static com.aem.ie.core.constants.ApplConstants.CFM_PATH;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PLPCategoryModel {
	private static final Logger log = LoggerFactory.getLogger(PLPCategoryModel.class);
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
	private String Title = null;
	private String Description = null;
	private String uriname1 = null;
	private String categoryValuefinal = StringUtils.EMPTY;
	private String selector;
	JsonNode Child;

	@PostConstruct
	protected void init() {
		try {
			String[] selectors = request.getRequestPathInfo().getSelectors();
			if (selectors.length != 0) {
				categoryValuefinal = SelectorValueUtils.getPLPSSRSeoNameTagSearchSelector(selectors, selector,
						categoryValuefinal);
				session = resourceresolver.adaptTo(Session.class);
				myHashMap = new HashMap<String, String>();
				predicateMap = new HashMap<String, String>();
				predicateMap.put("path", CFM_PATH);
				predicateMap.put("type", DamConstants.NT_DAM_ASSET);
				predicateMap.put("p.limit", "-1");
				Query query = builder.createQuery(PredicateGroup.create(predicateMap), session);
				SearchResult result = query.getResult();
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
						if (categoryValuefinal != null && tagname != null) {
							if (categoryValuefinal.toLowerCase().equals(tagname.toLowerCase())) {
								Title = contfragment.getElement("title").getContent();
								log.info("PLPCategoryModel Title : {}", Title);
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
									myHashMap.put(Title, Description);
								}
							} else {
								AssetManager assetManager = resourceresolver.adaptTo(AssetManager.class);
								Asset asset = assetManager.getAsset(
										"/content/dam/infinite-electronics/json/fairview-microwave/Categories.json");
								Rendition rendition = asset.getRendition("original");
								InputStream inputStream = rendition.adaptTo(InputStream.class);
								try {
									String renditionData = IOUtils.toString(inputStream, "UTF-8");
									IOUtils.closeQuietly(inputStream);
									ObjectMapper objectMapper = new ObjectMapper();
									String name = null;
									// Read JSON as a JsonNode
									JsonNode jsonNode = objectMapper.readTree(renditionData);
									for (int i = 0; i < jsonNode.size(); i++) {
										JsonNode jsonObject = jsonNode.get(i).get("category");
										String seoName = null;
										if (jsonObject.has("seoTagName")) {
											seoName = jsonObject.get("seoTagName").asText();
										}
										String category = categoryValuefinal;
										if (category != null) {
											if (category.equals(seoName)) {
												name = getPreviousAttribute(jsonObject, "name");
												myHashMap.put(name, "");
												break;
											} else {
												Child = jsonObject.get("childCategories");
												for (JsonNode jsSubNode : Child) {
													String childSubCategorName = jsSubNode.get("seoTagName").asText();
													if (category.equals(childSubCategorName)) {
														name = getPreviousAttribute(jsSubNode, "name");
														myHashMap.put(name, "");
														break;
													} else {
														JsonNode subChild = jsSubNode.get("childCategories");
														for (JsonNode jsSubSubNode : subChild) {
															String childSubSubCategorName = jsSubSubNode
																	.get("seoTagName").asText();
															if (category.equals(childSubSubCategorName)) {
																name = getPreviousAttribute(jsSubSubNode, "name");
																myHashMap.put(name, "");
																break;
															}
														}
													}
												}
											}
										}
									}
								} catch (IOException e) {
									log.error("IO Excpetion occured" + e.getLocalizedMessage());
								}
							}
						}
					}
				}

			} else {
				myHashMap = new HashMap<String, String>();
			}
		} catch (RepositoryException e) {
			log.error("Repository and Unsupported encoding Excpetion occured : {}", e.getLocalizedMessage());
		}
	}

	public Map<String, String> getMyHashMap() {
		String pageTitle = myHashMap.get(Title);
		if (pageTitle != null) {
			return myHashMap;
		} else {
			return myHashMap;
		}
	}

	public String getPreviousAttribute(JsonNode jsonObject, String attributeName) {
		String previousAttribute = null;
		if (jsonObject.has(attributeName)) {
			previousAttribute = jsonObject.get("name").asText();
		}
		return previousAttribute;
	}
}
