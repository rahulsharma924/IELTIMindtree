package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.IESitemapGeneratorService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.IESitemapGeneratorConfig;
import com.aem.ie.core.utils.SitemapUtils;
import com.day.cq.commons.Externalizer;
import com.day.cq.dam.api.AssetManager;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.jcr.Binary;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(service = IESitemapGeneratorService.class, immediate = true)
@Designate(ocd = IESitemapGeneratorConfig.class)
public class IESitemapGeneratorServiceImpl implements IESitemapGeneratorService {

	@Reference
	UpdatePersonalInfoService updatePersonalInfoService;
	@Reference
	private ResourceResolverFactory resourceResolverFactory;
	@Reference
	QueryBuilder queryBuilder;
	private IESitemapGeneratorConfig ieSitemapGeneratorConfig;
	private static final Logger log = LoggerFactory.getLogger(IESitemapGeneratorServiceImpl.class);
	private String rootPath = "/content/fm/en";

	@Activate
	protected void activate(IESitemapGeneratorConfig ieSitemapGeneratorConfig) {
		this.ieSitemapGeneratorConfig = ieSitemapGeneratorConfig;
	}

	@Override
	public void generateIESiteMap() throws IOException {
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
			assetManager.createOrUpdateAsset(ieSitemapGeneratorConfig.xmlPath(), binary, "application/xml", true);
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
			Element root = document.createElement("sitemapindex");
			root.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
			root.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
			root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
			document.appendChild(root);
			document.setXmlStandalone(true);

			// Getting blog pages with lastModified value
			List<String> sitemapUrls = getSitemapUrls(resourceResolver);

			// defining url object to form url from fetched data
			for (String url : sitemapUrls) {
				if (!url.contains("/content/fm/en/") && !url.equalsIgnoreCase("/content/fm/en/sitemap.xml") && !url.equalsIgnoreCase("/content/fm/sitemap-index.xml") && !url.equalsIgnoreCase("/content/fm/sitemap_index.xml")) {
					// externalizing the url to form seo url
					String sitemapUrl = updatePersonalInfoService.getDomainName() + url;
					Element urlElement = document.createElement("sitemap");
					root.appendChild(urlElement);
					Element locElement = document.createElement("loc");
					sitemapUrl = sitemapUrl.replace("/content/fm","");
					locElement.setTextContent(sitemapUrl);
					urlElement.appendChild(locElement);
				}
			}
			return document;
		} catch (ParserConfigurationException parserConfigurationException) {
			log.error("ParserConfigurationException Exception Occurred{}", parserConfigurationException.getMessage());
		}
		return null;
	}

	private List<String> getSitemapUrls(ResourceResolver resourceResolver) {
		List<String> sitemapUrls = new ArrayList<>();
		Session session = resourceResolver.adaptTo(Session.class);
		Map<String, String> queryMap = new HashMap<>();
		queryMap.put("path", ieSitemapGeneratorConfig.rootPath());
		queryMap.put("nodename", "sitemap*.xml");
		queryMap.put("orderby", "path");
		queryMap.put("p.limit", "-1");
		Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
		SearchResult searchResult = query.getResult();
		for (Hit hit : searchResult.getHits()) {
			String pagePath = StringUtils.EMPTY;
			try {
				pagePath = hit.getPath();
			} catch (RepositoryException repositoryException) {
				log.error("Error in processing Algolia request{}", repositoryException.getMessage());
			}
			if (!pagePath.isEmpty()) {
				sitemapUrls.add(pagePath);
			}
		}
		return sitemapUrls;
	}

}
