package com.aem.ie.core.models;

import static com.aem.ie.core.constants.ApplConstants.CFM_PATH_LEVEL_0;
import static com.aem.ie.core.constants.ApplConstants.CFM_PATH_LEVEL_1;
import static com.aem.ie.core.constants.ApplConstants.CFM_PATH_LEVEL_2;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.io.IOUtils;
import com.adobe.cq.dam.cfm.ContentFragment;
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

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PLPModel {
	private static final Logger log = LoggerFactory.getLogger(PLPModel.class);
	@SlingObject
	Resource resouecetag;
	@Inject
	private QueryBuilder builder;
	@Inject
	private ResourceResolver resourceresolver;
	@ValueMapValue
	private String alltitle;
	@ValueMapValue
	private String alldescription;
	@Inject
	SlingHttpServletRequest request;
	private Session session;
	private Map<String, String> myHashMap;
	private Map<String, String> predicateMap;
	private Resource resource;
	private String Title = null;
	private String Description = null;
	private String categoryValuefinal = StringUtils.EMPTY;
	private String selector;
	private String CategoryURLPath = null;
	private String SEOTagName = null;
	Map categoryValues = new HashMap<String, String>();
	private JsonNode Child;

	@PostConstruct
	protected void init() {
		try {
			myHashMap = new HashMap<String, String>();
			String[] selectors = request.getRequestPathInfo().getSelectors();
			categoryValuefinal = SelectorValueUtils.getPLPSSRSelector(selectors, selector, categoryValuefinal);
			if(categoryValuefinal != null && !categoryValuefinal.isEmpty()){
			if (categoryValuefinal.equals("all")) {
				myHashMap.put(alltitle, alldescription);
			} else {
				AssetManager assetManager = resourceresolver.adaptTo(AssetManager.class);
				Asset asset = assetManager
						.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json");
				Rendition rendition = asset.getRendition("original");
				InputStream inputStream = rendition.adaptTo(InputStream.class);
				String renditionData = IOUtils.toString(inputStream, "UTF-8");
				IOUtils.closeQuietly(inputStream);
				ObjectMapper objectMapper = new ObjectMapper();
				categoryValues = SelectorValueUtils.getCategorySeoNameValues(categoryValuefinal, objectMapper,
						renditionData);
				SEOTagName = (String) categoryValues.get("seotagname");
				CategoryURLPath = (String) categoryValues.get("urlpath");
				session = resourceresolver.adaptTo(Session.class);
				String cfmpath = null;
				String[] categoryindex = StringUtils.split(CategoryURLPath, "|");
				List<String> elements = new ArrayList<String>();
				for (String categoryval : categoryindex) {
					elements.add(categoryval);
				}
				String st1 = new String(categoryValuefinal);
				int index = elements.indexOf(st1);
				if (index == 0) {
					cfmpath = CFM_PATH_LEVEL_0;

				} else if (index == 1) {
					cfmpath = CFM_PATH_LEVEL_1;
				} else {
					cfmpath = CFM_PATH_LEVEL_2;
				}
				predicateMap = new HashMap<String, String>();
				predicateMap.put("path", cfmpath);
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
							log.info("PLPModel tagname : {}", tagname);
						}
						if (SEOTagName.equals(tagname)) {
							Title = contfragment.getElement("title").getContent();
							Description = contfragment.getElement("description").getContent();
							if (Title != null && Description != null) {
								myHashMap.put(Title, Description);
							}
						}

					}
				}
			}
			}
		} catch (RepositoryException | IOException e) {
			log.error("Repository and Unsupported encoding Excpetion occured" + e.getLocalizedMessage());
		}
	}

	public Map<String, String> getMyHashMap() {
		String pageTitle = myHashMap.get(Title);
		if (pageTitle != null) {
			return myHashMap;
		} else if (categoryValuefinal != null && (categoryValuefinal.equals("all") || categoryValuefinal.isEmpty())) {
			return myHashMap;
		} else {
			String name = (String) categoryValues.get("name");
			myHashMap.clear();
			myHashMap.put(name, "");
			return myHashMap;
		}

	}

}
