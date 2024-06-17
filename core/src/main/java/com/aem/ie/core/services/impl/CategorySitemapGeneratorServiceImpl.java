package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.CategorySitemapGeneratorService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.CategorySitemapGeneratorConfig;
import com.aem.ie.core.utils.SitemapUtils;
import com.day.cq.commons.Externalizer;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.jcr.Binary;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(service = CategorySitemapGeneratorService.class, immediate = true)
@Designate(ocd = CategorySitemapGeneratorConfig.class)
public class CategorySitemapGeneratorServiceImpl implements CategorySitemapGeneratorService {
	private static final String CATEGORY = "category";
	private static final String SEO_NAME_SEO_URL = "categorySeoUrl";
	private static final String HTML_EXTENSION = ".html";
	private static final String CHILD_CATEGORIES = "childCategories";
	@Reference
	UpdatePersonalInfoService updatePersonalInfoService;
	@Reference
	private ResourceResolverFactory resourceResolverFactory;

	private CategorySitemapGeneratorConfig categorySiteMapGeneratorConfig;

	private static final Logger log = LoggerFactory.getLogger(CategorySitemapGeneratorServiceImpl.class);

	@Activate
	protected void activate(CategorySitemapGeneratorConfig categorySiteMapGeneratorConfig) {
		this.categorySiteMapGeneratorConfig = categorySiteMapGeneratorConfig;
	}

	@Override
	public void generateCategorySiteMap() throws IOException {
		ResourceResolver resourceResolver = null;
		List<String> seoUrls;
		try {
			// creating resource resolver from service user
			Map<String, Object> paramMap = new HashMap<>();
			paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
			resourceResolver = resourceResolverFactory.getServiceResourceResolver(paramMap);

			Resource resource = resourceResolver.getResource(categorySiteMapGeneratorConfig.categoryJsonPath());
			if (resource != null) {
				Asset asset = resource.adaptTo(Asset.class);
				assert asset != null;
				Resource original = asset.getOriginal();
				InputStream content = original.adaptTo(InputStream.class);

				StringBuilder stringBuilder = new StringBuilder();
				String line;
				assert content != null;
				BufferedReader bufferedReader = new BufferedReader(
						new InputStreamReader(content, StandardCharsets.UTF_8));

				while ((line = bufferedReader.readLine()) != null) {
					stringBuilder.append(line);
				}
				JsonArray jsonArray = JsonParser.parseString(stringBuilder.toString()).getAsJsonArray();
				// fetch all seourls
				seoUrls = generateSeoUrls(resourceResolver, jsonArray);
				// Create XML Document
				Document document = createXMLDocument(seoUrls);
				// Get Binary from document
				Binary binary = SitemapUtils.covertDocumentToBinary(resourceResolver, document);
				// Creating xmfile in aem repository
				AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
				assert assetManager != null;
				assetManager.createOrUpdateAsset(categorySiteMapGeneratorConfig.xmlPath(), binary, "application/xml",
						true);
			} else {
				log.error("Categories.json not found");
			}
		} catch (LoginException loginException) {
			log.error("LoginException Occurred{}", loginException.getMessage());
		} finally {
			assert resourceResolver != null;
			if (resourceResolver.isLive()) {
				resourceResolver.close();
			}
		}
	}

	private List<String> generateSeoUrls(ResourceResolver resourceResolver, JsonArray jsonArray) {
		List<String> seoUrls = new ArrayList<>();
		String url = "/category/";
		for (int counter = 0; counter < jsonArray.size(); counter++) {
			JsonObject categoryObject = jsonArray.get(counter).getAsJsonObject();
			// logic to fetch sub-category seourl
			if (categoryObject.has(CATEGORY)) {
				JsonObject categoryJson = categoryObject.get(CATEGORY).getAsJsonObject();
				String categorySeoUrl = StringUtils.EMPTY;
				if (categoryJson.has(SEO_NAME_SEO_URL)) {
					categorySeoUrl = url.concat(categoryJson.get(SEO_NAME_SEO_URL).getAsString().replace("|", "/"))
							.trim();
					seoUrls.add(updatePersonalInfoService.getDomainName() + categorySeoUrl.concat(HTML_EXTENSION));
				}
				if (categoryJson.has(CHILD_CATEGORIES)) {
					fetch2ndlevelUrls(categoryJson, resourceResolver, categorySeoUrl, seoUrls);
				}
			}
		}
		return seoUrls;
	}

	private void fetch2ndlevelUrls(JsonObject categoryJson, ResourceResolver resourceResolver,
			String categorySeoUrl, List<String> seoUrls) {
		String url = "/category/";
		if (categoryJson.get(CHILD_CATEGORIES).isJsonArray()) {
			JsonArray subcategoriesJsonArray = categoryJson.get(CHILD_CATEGORIES).getAsJsonArray();
			for (int firstCounter = 0; firstCounter < subcategoriesJsonArray.size(); firstCounter++) {
				JsonObject categoryObject2ndlevel = subcategoriesJsonArray.get(firstCounter).getAsJsonObject();
				// logic to fetch sub-category seourl and sub-sub-category urls and form full
				// url
				String subCategorySeoUrl = StringUtils.EMPTY;
				if (categoryObject2ndlevel.has(SEO_NAME_SEO_URL)) {
					subCategorySeoUrl = url
							.concat(categoryObject2ndlevel.get(SEO_NAME_SEO_URL).getAsString().replace("|", "/"))
							.trim();
					seoUrls.add(updatePersonalInfoService.getDomainName() + subCategorySeoUrl.concat(HTML_EXTENSION));
				}
				if (categoryObject2ndlevel.has(CHILD_CATEGORIES)) {
					fetch3rdlevelUrls(categoryObject2ndlevel, resourceResolver, subCategorySeoUrl,
							seoUrls);
				}
			}
		}
	}

	private void fetch3rdlevelUrls(JsonObject categoryJson2ndlevel, ResourceResolver resourceResolver,
			String subcategoryUrl, List<String> seoUrls) {
		String url = "/category/";
		if (categoryJson2ndlevel.get(CHILD_CATEGORIES).isJsonArray()) {
			JsonArray subSubcategoriesJsonArray = categoryJson2ndlevel.get(CHILD_CATEGORIES).getAsJsonArray();
			for (int secondCounter = 0; secondCounter < subSubcategoriesJsonArray.size(); secondCounter++) {
				JsonObject categoryObject3rdlevel = subSubcategoriesJsonArray.get(secondCounter).getAsJsonObject();
				// logic to fetch sub-category seourl and sub-sub-category urls and form full
				// url
				String subSubCategorySeoUrl;
				if (categoryObject3rdlevel.has(SEO_NAME_SEO_URL)) {
					subSubCategorySeoUrl = url
							.concat(categoryObject3rdlevel.get(SEO_NAME_SEO_URL).getAsString().replace("|", "/"))
							.trim();
					seoUrls.add(updatePersonalInfoService.getDomainName() + subSubCategorySeoUrl.concat(HTML_EXTENSION));
				}
			}
		}
	}

	private Document createXMLDocument(List<String> seoUrls) {
		DocumentBuilderFactory documentFactory = DocumentBuilderFactory.newInstance();
		try {
			DocumentBuilder documentBuilder = documentFactory.newDocumentBuilder();
			Document document = documentBuilder.newDocument();
			Element root = document.createElement("urlset");
			root.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
			root.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
			root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
			document.appendChild(root);
			for (String url : seoUrls) {
				// Creating url Element
				Element urlElement = document.createElement("url");
				root.appendChild(urlElement);
				// Creating loc Element
				Element locElement = document.createElement("loc");
				locElement.setTextContent(url);
				// Creating lastmod Element
				Element lastmodElement = document.createElement("lastmod");
				lastmodElement.setTextContent(categorySiteMapGeneratorConfig.lastModifiedDate());
				// Creating changefreq Element
				Element changefreqELement = document.createElement("changefreq");
				changefreqELement.setTextContent("monthly");
				// Creating priority Element
				Element priorityELement = document.createElement("priority");
				priorityELement.setTextContent("0.9");
				urlElement.appendChild(locElement);
				urlElement.appendChild(lastmodElement);
				urlElement.appendChild(changefreqELement);
				urlElement.appendChild(priorityELement);
			}
			return document;
		} catch (ParserConfigurationException parserConfigurationException) {
			log.error("ParserConfigurationException Exception Occurred{}", parserConfigurationException.getMessage());
		}
		return null;
	}
}