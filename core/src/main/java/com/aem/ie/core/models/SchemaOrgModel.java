package com.aem.ie.core.models;

import com.adobe.aem.wcm.seo.SeoTags;
import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.Service.AlgoliaPDPService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.constants.ApplConstants;
import com.aem.ie.core.models.datamodels.Product;
import com.aem.ie.core.models.datamodels.SchemaOrg;
import com.aem.ie.core.utils.SelectorValueUtils;
import com.algolia.search.com.fasterxml.jackson.databind.JsonNode;
import com.algolia.search.com.fasterxml.jackson.databind.ObjectMapper;
import com.aem.ie.core.utils.PageUtils;
import com.day.cq.commons.Externalizer;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.aem.ie.core.constants.ApplConstants.*;
import static com.day.cq.wcm.api.NameConstants.NN_TEMPLATE;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)

public class SchemaOrgModel {
	private static final Logger log = LoggerFactory.getLogger(SchemaOrgModel.class);
	private static final String JCR_ROOT_CONTAINER = "/jcr:content/root/container";
	private static final String NEWS_RESOURCE = "ie/fm/components/content/news-detail";
	private static final String BLOG_RESOURCE = "ie/fm/components/content/blogpage";
	private static final String ARTICLE = "article";
	private static final String DATE_FORMAT = "MMM dd, yyyy";

	@Inject
	protected Page currentPage;

	@SlingObject
	protected ResourceResolver resourceResolver;

	@SlingObject
	protected SlingHttpServletRequest request;
	@SlingObject
	protected Resource resource;
	@Reference
	Externalizer externalizer;
	List<SchemaOrg> schemaOrgList = new ArrayList<>();
	private String pageTitle;
	private String pageDescription;
	private String pageUrl;
	private String categorySEOUrl;
	Product product;
	private Boolean blogPage = false;
	private Boolean newsPage = false;
	private String ogType = "website";
	private String finalPath;
	private String canonicalUrl;
	private String image;

	public String getPageTitle() {
		return pageTitle;
	}

	public String getPageDescription() {
		return pageDescription;
	}

	public String getPageUrl() {
		return pageUrl;
	}

	public Boolean getBlogPage() {
		return blogPage;
	}

	public Boolean getNewsPage() {
		return newsPage;
	}

	public String getOgType() {
		return ogType;
	}

	public String getImage() {
		return image;
	}

	private String selector;
	private String categoryValuefinal;

	Boolean templateCheck;
	JsonNode Child;
	String templateName;
	String appendedUrl;

	public List<SchemaOrg> getSchemaOrgList() {
		return schemaOrgList;
	}

	@OSGiService
	AlgoliaPDPService algoliaPDPService;

	@OSGiService
	UpdatePersonalInfoService updatePersonalInfoService;

	List<String> categorySEOURL = new ArrayList<>();
	String pdpTitleName;

	private String categoryvalue = null;

	@PostConstruct
	protected void init() throws RepositoryException, IOException {
		if (currentPage != null) {
			pageTitle = currentPage.getTitle();
			pageDescription = currentPage.getDescription();
			String[] selectors = request.getRequestPathInfo().getSelectors();
			externalizer = resourceResolver.adaptTo(Externalizer.class);
			assert externalizer != null;
			PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
			assert pageManager != null;
			Page page = pageManager.getPage(currentPage.getPath());
			ValueMap pageProperties = page.getProperties();
			templateName = pageProperties.get(NN_TEMPLATE, String.class);
			if (this.canonicalUrl == null) {
				try {
					SeoTags seoTags = resource.adaptTo(SeoTags.class);
					canonicalUrl = seoTags != null ? seoTags.getCanonicalUrl() : null;
				} catch (NoClassDefFoundError ex) {
					canonicalUrl = null;
				}

			}

			if (selectors != null && selectors.length!=0 && (templateName.equals(CONF_CONTENT_PAGE_TEMPLATE)
					|| templateName.equals(CONF_PLP_BOT_PAGE_TEMPLATE) || templateName.equals(CONF_PLP_SSR_PAGE_TEMPLATE))) {
				String category = null;
				categoryvalue = SelectorValueUtils.getPDPSeoNameSelector(selectors, categoryvalue);
				categoryValuefinal = categoryvalue;
				pageUrl = "/category/";
				category = categoryValuefinal;
				// Get the DAM file by path to read categories json
				AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
				Asset asset = assetManager.getAsset(CATEGORY_JSON_PATH);
				Rendition rendition = asset.getRendition("original");
				InputStream inputStream = rendition.adaptTo(InputStream.class);
				String renditionData = IOUtils.toString(inputStream, "UTF-8");
				IOUtils.closeQuietly(inputStream);
				ObjectMapper objectMapper = new ObjectMapper();
				String name = null;
				// Read JSON as a JsonNode
				JsonNode jsonNode = objectMapper.readTree(renditionData);
				if(category != null && !category.equalsIgnoreCase("all")){
					for (int i = 0; i < jsonNode.size(); i++) {
						JsonNode jsonObject = jsonNode.get(i).get("category");
						String seoName = null;
						if (jsonObject.has("seoName")) {
							seoName = jsonObject.get("seoName").asText();
						}
						if (category != null) {
							if (category.equals(seoName)) {
								name = getPreviousAttribute(jsonObject, "name");
								categorySEOUrl = categorySEOUrl.replace("|", "/");
								if (categorySEOUrl != null) {
									appendedUrl = pageUrl + categorySEOUrl;
								}
								pageTitle = name;
								if (pageDescription != null) {
									pageDescription = pageDescription.replace("{Main Category}", name);
								}
								break;
							} else {
								Child = jsonObject.get("childCategories");
								for (JsonNode jsSubNode : Child) {
									String childSubCategorName = jsSubNode.get("seoName").asText();
									if (category.equals(childSubCategorName)) {
										name = getPreviousAttribute(jsSubNode, "name");
										pageTitle = name;
										categorySEOUrl = categorySEOUrl.replace("|", "/");
										if (categorySEOUrl != null) {
											appendedUrl = pageUrl + categorySEOUrl;
										}
										if (pageDescription != null) {
											pageDescription = pageDescription.replace("{Main Category}", name);
											break;
										}

									} else {
										JsonNode subChild = jsSubNode.get("childCategories");
										for (JsonNode jsSubSubNode : subChild) {
											String childSubSubCategorName = jsSubSubNode.get("seoName").asText();
											if (category.equals(childSubSubCategorName)) {
												name = getPreviousAttribute(jsSubSubNode, "name");
												pageTitle = name;
												categorySEOUrl = categorySEOUrl.replace("|", "/");
												if (categorySEOUrl != null) {
													appendedUrl = pageUrl + categorySEOUrl;
												}
												if (pageDescription != null) {
													pageDescription = pageDescription.replace("{Main Category}", name);
													break;
												}

											}
										}
									}
								}
							}

						}
						if (name != null) {
							break;
						}
					}
				} else {
					if(category.equalsIgnoreCase("all")){
						appendedUrl = pageUrl + "all";
						pageTitle = PLP_SSR_CATEGORY_ALL_PAGE_TITLE;
						pageDescription = PLP_SSR_CATEGORY_ALL_PAGE_DESC;

					}
				}
			} else if (selectors != null  && selectors.length!=0 && templateName.equals(CONF_PDP_SSR_PAGE_TEMPLATE)) {
				if (selectors != null) {
					if (selectors.length > 1) {
						selector = selectors[0];
						for (int i = 1; i < selectors.length; i++) {
							selector = selector + DOT + selectors[i];
						}
					} else if (selectors.length != 0) {
						selector = selectors[0];
					}
				}
				categoryValuefinal = selector;
				pageUrl = "/product";
				String seoUrlPath = getPDPCanonicalPathFromSeoURL(selector);
				pageUrl = pageUrl.concat(seoUrlPath);
				appendedUrl = pageUrl;
				pageTitle = pdpTitleName;
				if (pageDescription != null && pdpTitleName != null) {
					pageDescription = pageDescription.replace("{Main Category}", pdpTitleName);
					pageDescription = pageDescription.replace(" {Product Name}", pdpTitleName);
				}
				pageUrl = appendedUrl;

			} else {
				pageUrl = request.getRequestURI();
				if (pageUrl != null) {
					pageUrl = pageUrl.replace("/content/fm/en", "");
				}
				canonicalUrl = updatePersonalInfoService.getDomainName() + pageUrl;
				if (canonicalUrl.contains("homepage.html")) {
					canonicalUrl = canonicalUrl.replace("/homepage.html", "");
				}
			}
			if (appendedUrl != null) {
				canonicalUrl = updatePersonalInfoService.getDomainName() + appendedUrl + HTML;
			}
			if (pageUrl != null) {
				pageUrl = externalizer.publishLink(resourceResolver, pageUrl) + ApplConstants.HTML;
			}
			image = page.getProperties().get("cq:featuredimage/fileReference", String.class);
			if (image != null) {
				image = externalizer.publishLink(resourceResolver, image);
			}
			if (Boolean.TRUE.equals(PageUtils.isBlogPage(currentPage))) {
				ogType = ARTICLE;
				blogPage = true;
				Resource resource = resourceResolver.getResource(currentPage.getPath() + JCR_ROOT_CONTAINER);
				if (resource != null) {
					Iterator<Resource> children = resource.listChildren();
					while (children.hasNext()) {
						Resource childresource = children.next();
						if (childresource.isResourceType(BLOG_RESOURCE)) {
							ValueMap valueMap = childresource.getValueMap();
							SchemaOrg schemaOrg = new SchemaOrg();
							String blogText = valueMap.get("blogtext", String.class);
							Date date = valueMap.get("blogdate", Date.class);
							String formattedDate = "";
							if (null != date) {
								formattedDate = new SimpleDateFormat(DATE_FORMAT).format(date);
							}
							String blogImg = valueMap.get("blogimg", String.class);
							String blogImgText = valueMap.get("blogimgtext", String.class);
							String blogAuthor = valueMap.get("blogauthor", String.class);

							schemaOrg.setBlogPost(blogText);
							schemaOrg.setDatePublished(formattedDate);
							schemaOrg.setImage(blogImg);
							schemaOrg.setImageAltText(blogImgText);
							schemaOrg.setBlogAuthor(blogAuthor);
							schemaOrgList.add(schemaOrg);
						}
					}
				}

			} else if (Boolean.TRUE.equals(PageUtils.isNewsPage(currentPage))) {
				ogType = ARTICLE;
				newsPage = true;
				Resource resource = resourceResolver.getResource(currentPage.getPath() + JCR_ROOT_CONTAINER);
				if (resource != null) {
					Iterator<Resource> children = resource.listChildren();
					while (children.hasNext()) {
						Resource childresource = children.next();
						if (childresource.isResourceType(NEWS_RESOURCE)) {
							ValueMap valueMap = childresource.getValueMap();
							SchemaOrg schemaOrg = new SchemaOrg();
							String newsTitle = valueMap.get("newsTitle", String.class);
							String newsContent = valueMap.get("newsContent", String.class);
							String newsLabel = valueMap.get("newsLabel", String.class);

							String newsTagTitle = ApplConstants.EMPTY_STRING;
							TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
							if (newsLabel != null && !newsLabel.equals(ApplConstants.EMPTY_STRING)
									&& tagManager != null) {
								Tag tag = tagManager.resolve(newsLabel);
								if (tag != null && !tag.getTitle().equals("")) {
									newsTagTitle = tag.getTitle();
								}
							}
							schemaOrg.setNewsArticleTitle(newsTitle);
							schemaOrg.setNewsArticleBody(newsContent);
							schemaOrg.setNewsArticleSection(newsTagTitle);
							schemaOrgList.add(schemaOrg);
						}
					}
				}
			} else if (Boolean.TRUE.equals(PageUtils.isArticlePage(currentPage))) {
				ogType = ARTICLE;
			}
		}
	}

	public String getCanonicalLink() {
		return canonicalUrl;
	}

	private String getPreviousAttribute(JsonNode jsonObject, String attributeName) {
		String previousAttribute = null;
		if (jsonObject.has(attributeName)) {
			previousAttribute = jsonObject.get("name").asText();
		}
		if (jsonObject.has("categorySeoUrl")) {
			categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
		}

		return previousAttribute;
	}

	public Boolean getTemplateCheck() {
		if (templateName.equals(CONF_CONTENT_PAGE_TEMPLATE)
				|| templateName.equals(CONF_PDP_SSR_PAGE_TEMPLATE)
				|| templateName.equals(CONF_PLP_BOT_PAGE_TEMPLATE)
		        || templateName.equals(CONF_PLP_SSR_PAGE_TEMPLATE)) {
			templateCheck = true;
		}
		log.info("SchemaOrgModel templateCheck : {}", templateCheck);
		return templateCheck;
	}

	public String getPDPCanonicalPathFromSeoURL(String seoName) throws IOException {
		String categorySeoUrlValue = StringUtils.EMPTY;
		product = algoliaPDPService.getAlgoliaProductData(seoName);
		categorySEOURL = product.getCategorySEOURL();
		pdpTitleName = product.getName();
		int size = categorySEOURL.size();
		if (size > 0) {
			   if (size >= 3) {
			      categorySeoUrlValue = categorySEOURL.get(2);
			   } else if (size == 2) {
			      categorySeoUrlValue = categorySEOURL.get(1);
			   } else {
			      categorySeoUrlValue = categorySEOURL.get(0);
			   }
		}
		finalPath = categorySeoUrlValue + "/" + seoName;
		return finalPath;
	}

}