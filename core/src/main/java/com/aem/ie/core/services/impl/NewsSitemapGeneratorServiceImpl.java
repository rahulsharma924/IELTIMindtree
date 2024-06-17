package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.NewsSitemapGeneratorService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.NewsSitemapGeneratorConfig;
import com.aem.ie.core.utils.SitemapUtils;
import com.day.cq.commons.Externalizer;
import com.day.cq.dam.api.AssetManager;
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
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;
import static com.day.cq.wcm.api.NameConstants.PN_PAGE_LAST_MOD;

@Component(service = NewsSitemapGeneratorService.class, immediate = true)
@Designate(ocd = NewsSitemapGeneratorConfig.class)
public class NewsSitemapGeneratorServiceImpl implements NewsSitemapGeneratorService {
	@Reference
	UpdatePersonalInfoService updatePersonalInfoService;
	@Reference
	private ResourceResolverFactory resourceResolverFactory;
	private NewsSitemapGeneratorConfig newsSitemapGeneratorConfig;
	private static final Logger log = LoggerFactory.getLogger(NewsSitemapGeneratorServiceImpl.class);

	@Activate
	protected void activate(NewsSitemapGeneratorConfig newsSitemapGeneratorConfig) {
		this.newsSitemapGeneratorConfig = newsSitemapGeneratorConfig;
	}

	@Override
	public void generateNewsSiteMap() throws IOException {
		ResourceResolver resourceResolver = null;
		try {
			// creating resource resolver from service user
			Map<String, Object> paramMap = new HashMap<>();
			paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
			resourceResolver = resourceResolverFactory.getServiceResourceResolver(paramMap);
			// Create XML Document
			Document document = createXMLDocument(resourceResolver);
			// Get Binary from document
			Binary binary = SitemapUtils.covertDocumentToBinary(resourceResolver, document);
			// Creating xmfile in aem repository
			AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
			assert assetManager != null;
			assetManager.createOrUpdateAsset(newsSitemapGeneratorConfig.xmlPath(), binary, "application/xml", true);
			resourceResolver.commit();
			resourceResolver.refresh();
		} catch (LoginException loginException) {
			log.error("LoginException Exception Occurred{}", loginException.getMessage());
		} finally {
			if (resourceResolver != null && resourceResolver.isLive()) {
				resourceResolver.close();
			}
		}
	}

	private Document createXMLDocument(ResourceResolver resourceResolver) {
		DocumentBuilderFactory documentFactory = DocumentBuilderFactory.newInstance();
		try {
			DocumentBuilder documentBuilder = documentFactory.newDocumentBuilder();
			Document document = documentBuilder.newDocument();
			Element root = document.createElement("urlset");
			root.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
			root.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
			root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
			document.appendChild(root);
			document.setXmlStandalone(true);

			// Getting news pages with lastModified value
			Map<String, String> newsPageMaps = getNewsPageData(resourceResolver);

			// defining url object to form url from fetched data
			for (Map.Entry<String, String> newsItem : newsPageMaps.entrySet()) {

				// externalizing the url to form seo url
				String finalUrl = newsItem.getKey().concat(".html");
				finalUrl = updatePersonalInfoService.getDomainName() + finalUrl;
				Element urlElement = document.createElement("url");
				root.appendChild(urlElement);
				Element locElement = document.createElement("loc");
				finalUrl = finalUrl.replace("/content/fm/en","");
				locElement.setTextContent(finalUrl);
				// Creating lastmod Element
				Element lastmodElement = document.createElement("lastmod");
				lastmodElement.setTextContent(newsItem.getValue());
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

	private Map<String, String> getNewsPageData(ResourceResolver resourceResolver) {
		Map<String, String> newsPageData = new HashMap<>();
		Resource newsRootPath = resourceResolver.getResource(newsSitemapGeneratorConfig.newsRootPath());
		String jcrContent = JCR_CONTENT;
		// Adding root page to result
		Resource newsRootPageJcrNode = newsRootPath.getChild(jcrContent);
		if (newsRootPageJcrNode.getValueMap().containsKey(PN_PAGE_LAST_MOD)) {
			newsPageData.put(newsRootPath.getPath(),
					newsRootPageJcrNode.getValueMap().get(PN_PAGE_LAST_MOD, String.class));
		}
		// Adding child pages to result
		if (newsRootPath.hasChildren()) {
			for (Resource newsPage : newsRootPath.getChildren()) {
				if (!(newsPage.getName().equals(jcrContent)) && !(newsPage.getPath().contains("archives"))
						&& newsPage.getChild(jcrContent) != null) {
					Resource newsPageJcrNode = newsPage.getChild(jcrContent);
					if (newsPageJcrNode.getValueMap().containsKey(PN_PAGE_LAST_MOD)) {
						newsPageData.put(newsPage.getPath(),
								newsPageJcrNode.getValueMap().get(PN_PAGE_LAST_MOD, String.class));
					}
				}
			}
		}
		return newsPageData;
	}
}
