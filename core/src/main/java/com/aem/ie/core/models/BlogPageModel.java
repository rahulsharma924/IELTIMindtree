package com.aem.ie.core.models;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import static com.aem.ie.core.constants.ApplConstants.CATEGORY_JSON_PATH;
import javax.annotation.PostConstruct;

import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.algolia.search.com.fasterxml.jackson.databind.JsonNode;
import com.algolia.search.com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.constants.ApplConstants;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import static com.aem.ie.core.constants.ApplConstants.HTML;
import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BlogPageModel {
	
	private static final Logger log = LoggerFactory.getLogger(BlogPageModel.class);
	
	@SlingObject
	private Resource resource;

	@ScriptVariable
	private ResourceResolver resolver;
	
	private String[] bloglabel;

	private String blogauthor;

	private String blogtitle;
	HashMap<String, String> blogLink;
	@ValueMapValue
	private String blogimage;
	
	@ValueMapValue
	private String blogimgtext;

	@ValueMapValue
	private String blogtext;

	private String bloglink;

	private Date blogdate;
	private  String categorySEOUrl;
	@OSGiService
	UpdatePersonalInfoService updatePersonalInfoService;
	JsonNode Child;
	String templateName;
	String appendedUrl;

	public final String getBlogauthor() {
		return blogauthor;
	}

	public final String getBlogtitle() {
		return blogtitle;
	}

	public final String getBlogimage() {
		return blogimage;
	}
	public final String getBlogimagetext() {
		return blogimgtext;
	}

	public final String getBlogtext() {
		return blogtext;
	}

	public final String getBloglink() {
		return bloglink.concat(".html");
	}

	List<String> pageTags = new ArrayList<>();
	
	@PostConstruct
	protected void init() throws IOException {
		PageManager pageManager= resolver.adaptTo(PageManager.class);
		Page currentPage = pageManager.getContainingPage(resource);
		ValueMap pageResValueMap = currentPage.getProperties();
		//setting blog title from page properties(Basic tab)
		blogtitle = pageResValueMap.get(JCR_TITLE, String.class);
		log.debug(blogtitle);

		//Setting blogCategory/bloglabel, author, publishDate values from page properties(blog tab)
		bloglabel = pageResValueMap.get("blogCategory", String[].class);
		blogauthor = pageResValueMap.get("author", String.class);
		blogdate = pageResValueMap.get("publishDate", new Date());
        blogLink=getTagLink(bloglabel);

	}

	public final List<String> getBloglabel() {
		TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
		if (tagManager != null) {
			for(String tagValue : bloglabel){
				Tag tag = tagManager.resolve(tagValue);
				if (tag != null && !tag.getTitle().equals(ApplConstants.EMPTY_STRING)) {
					pageTags.add(tag.getTitle());
				}
			}
		}
		return pageTags;
	}
	private HashMap<String,String> getTagLink(String[] blogLabels) throws IOException {
		HashMap myHashMap = new HashMap<String, String>();
		TagManager tagManager = resolver.adaptTo(TagManager.class);
		if (tagManager != null) {
			for(String tagValue : blogLabels){
				Tag tag = tagManager.resolve(tagValue);
				if (tag != null && tag.getTitle() != null && !tag.getTitle().equals(ApplConstants.EMPTY_STRING)) {
					myHashMap.put(tag.getTitle(), ApplConstants.EMPTY_STRING);
					/*AssetManager assetManager = resolver.adaptTo(AssetManager.class);
					if (assetManager != null) {
						Asset asset = assetManager
								.getAsset(CATEGORY_JSON_PATH);
						Rendition rendition = asset.getRendition("original");
						InputStream inputStream = rendition.adaptTo(InputStream.class);
						String renditionData = IOUtils.toString(inputStream, "UTF-8");
						IOUtils.closeQuietly(inputStream);
						ObjectMapper objectMapper = new ObjectMapper();
						// Read JSON as a JsonNode
						JsonNode jsonNode = objectMapper.readTree(renditionData);
						for (int i = 0; i < jsonNode.size(); i++) {
							JsonNode jsonObject = jsonNode.get(i).get("category");
							String seoName = null;
							if (jsonObject.has("name")) {
								seoName = jsonObject.get("name").asText();
							}
							if (tag.getTitle() != null) {
								if (tag.getTitle().equals(seoName)) {
									if (jsonObject.has("categorySeoUrl")) {
										categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
										categorySEOUrl = categorySEOUrl.replace("|", "/");
									}
									if (categorySEOUrl != null) {
										appendedUrl = "/category/" + categorySEOUrl;
									}
									if (appendedUrl != null) {
										appendedUrl = updatePersonalInfoService.getDomainName() + appendedUrl + HTML;
										myHashMap.put(tag.getTitle(), appendedUrl);
									}
									break;
								} else {
									Child = jsonObject.get("childCategories");
									for (JsonNode jsSubNode : Child) {
										String childSubCategorName = jsSubNode.get("name").asText();
										if (tag.getTitle().equals(childSubCategorName)) {
											if (jsSubNode.has("categorySeoUrl")) {
												categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
												categorySEOUrl = categorySEOUrl.replace("|", "/");
											}
											if (categorySEOUrl != null) {
												appendedUrl = "/category/" + categorySEOUrl;
											}
											if (appendedUrl != null) {
												appendedUrl = updatePersonalInfoService.getDomainName() + appendedUrl + HTML;
												myHashMap.put(tag.getTitle(), appendedUrl);
											}


										} else {
											JsonNode subChild = jsSubNode.get("childCategories");
											for (JsonNode jsSubSubNode : subChild) {
												String childSubSubCategorName = jsSubSubNode.get("seoName").asText();
												if (tag.getTitle().equals(childSubSubCategorName)) {
													if (jsSubSubNode.has("categorySeoUrl")) {
														categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
														categorySEOUrl = categorySEOUrl.replace("|", "/");
													}
													if (categorySEOUrl != null) {
														appendedUrl = "/category/" + categorySEOUrl;
													}
													if (appendedUrl != null) {
														appendedUrl = updatePersonalInfoService.getDomainName() + appendedUrl + HTML;
														myHashMap.put(tag.getTitle(), appendedUrl);
													}

												}
											}
										}
									}
								}

							}
						}

					}*/
				}
			}
		}
		return myHashMap;
	}

	public HashMap<String,String> getBlogLink() {
		return blogLink;
	}
	/*private String getPreviousAttribute(JsonNode jsonObject, String attributeName) {
		String previousAttribute = null;
		if (jsonObject.has(attributeName)) {
			previousAttribute = jsonObject.get("name").asText();
		}
		if (jsonObject.has("categorySeoUrl")) {
			categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
		}

		return previousAttribute;
	}*/
	public final String getFormattedDate() {
		return blogdate == null ? ApplConstants.EMPTY_STRING : new SimpleDateFormat("MMM dd, yyyy")
				.format(blogdate);
	}

}
