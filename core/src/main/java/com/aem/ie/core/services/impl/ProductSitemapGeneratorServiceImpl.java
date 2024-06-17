package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.ProductSitemapGeneratorService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.ProductSitemapGeneratorConfig;
import com.aem.ie.core.utils.SitemapUtils;
import com.algolia.search.DefaultSearchClient;
import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.algolia.search.models.indexing.BrowseIndexQuery;
import com.day.cq.commons.Externalizer;
import com.day.cq.dam.api.AssetManager;
import org.apache.sling.api.resource.LoginException;
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
import java.util.*;

@Component(service = ProductSitemapGeneratorService.class, immediate = true)
@Designate(ocd = ProductSitemapGeneratorConfig.class)
public class ProductSitemapGeneratorServiceImpl implements ProductSitemapGeneratorService {
	private static final String SEO_NAME = "seoName";
	private static final String CATEGORYSEOURL = "categorySEOURL";
	private static final String OBJECTID = "objectID";
	private int productItemCount = 1;
	@Reference
	UpdatePersonalInfoService updatePersonalInfoService;
	@Reference
	private ResourceResolverFactory resourceResolverFactory;
	private ProductSitemapGeneratorConfig productSiteMapGeneratorConfig;
	private static final Logger log = LoggerFactory.getLogger(ProductSitemapGeneratorServiceImpl.class);

	@Activate
	protected void activate(ProductSitemapGeneratorConfig productSiteMapGeneratorConfig) {
		this.productSiteMapGeneratorConfig = productSiteMapGeneratorConfig;
	}

	@Override
	public void generateProductSiteMap() throws IOException {
		ResourceResolver resourceResolver = null;
		try {
			// creating resource resolver from service user
			Map<String, Object> paramMap = new HashMap<>();
			paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
			resourceResolver = resourceResolverFactory.getServiceResourceResolver(paramMap);

			// Create XML Document
			List<Document> xmlDocs = createXMLDocument(resourceResolver);
			int fileCount = 1;
			for (Document document : xmlDocs) {
				// Get Binary from document
				Binary binary = SitemapUtils.covertDocumentToBinary(resourceResolver, document);
				// Creating xmfile in aem repository
				AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
				assert assetManager != null;
				String assetPath = productSiteMapGeneratorConfig.xmlPath().replace(".xml",
						"_".concat(String.format("%03d", fileCount)).concat(".xml"));
				assetManager.createOrUpdateAsset(assetPath, binary, "application/xml", true);
				fileCount++;
				resourceResolver.commit();
				resourceResolver.refresh();
			}

		} catch (LoginException loginException) {
			log.error("LoginException Exception Occurred{}", loginException.getMessage());
		} finally {
			if (resourceResolver != null && resourceResolver.isLive()) {
				resourceResolver.close();
			}
		}
	}

	private List<Document> createXMLDocument(ResourceResolver resourceResolver) throws IOException {
		List<Document> xmlDocs = new ArrayList<>();
		SearchClient client = null;
		DocumentBuilderFactory documentFactory = DocumentBuilderFactory.newInstance();
		try {
			// Initializing XMl Document
			DocumentBuilder documentBuilder = documentFactory.newDocumentBuilder();
			Document document = documentBuilder.newDocument();
			// Defining xml root elements
			Element root = document.createElement("urlset");
			root.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
			root.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
			root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
			document.appendChild(root);
			document.setXmlStandalone(true);

			// making algolia connection
			client = DefaultSearchClient.create(productSiteMapGeneratorConfig.applicationId(),
					productSiteMapGeneratorConfig.apiKey());
			SearchIndex<?> index = client.initIndex(productSiteMapGeneratorConfig.indexName());
			// Get all records, retrieve only `title` and `content` attributes
			BrowseIndexQuery query = new BrowseIndexQuery()
					.setAttributesToRetrieve(Arrays.asList(CATEGORYSEOURL, SEO_NAME, OBJECTID));
			// defining url object to form url from fetched data
			StringBuilder url = new StringBuilder();
			for (Object item : index.browseObjects(query)) {
				if (productItemCount % 5000 != 0) {
					createUrl(item, url);
					processDocumentFile(url, resourceResolver, document, root);
				}
				if (productItemCount % 5000 == 0) {
					xmlDocs.add(document);
					// Resetting the document file to write upcoming data
					document = documentBuilder.newDocument();
					// Defining xml root elements
					root = document.createElement("urlset");
					root.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
					root.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
					root.setAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
					document.appendChild(root);
					document.setXmlStandalone(true);

					// adding current data
					createUrl(item, url);
					processDocumentFile(url, resourceResolver, document, root);

				}
			}
			// checking and adding the last document file to list if missed
			if (productItemCount % 5000 != 0) {
				xmlDocs.add(document);
			}
			return xmlDocs;
		} catch (ParserConfigurationException parserConfigurationException) {
			log.error("ParserConfigurationException Exception Occurred{}", parserConfigurationException.getMessage());
		} finally {
			if (client != null) {
				client.close();
			}
		}
		return Collections.emptyList();
	}

	private void processDocumentFile(StringBuilder url, ResourceResolver resourceResolver, Document document,
			Element root) {
		if (url.length() != 0) {
			// inserting "/" to form the correct url
			url.insert(0, "/product");

			// externalizing the url to form seo url
			String finalUrl = String.valueOf(url);
			finalUrl = updatePersonalInfoService.getDomainName() + finalUrl;

			// appending urlElement to root element
			Element urlElement = document.createElement("url");
			root.appendChild(urlElement);
			Element locElement = document.createElement("loc");
			locElement.setTextContent(finalUrl);

			// Creating lastmod Element
			Element lastmodElement = document.createElement("lastmod");
			lastmodElement.setTextContent(productSiteMapGeneratorConfig.lastModifiedDate());

			// Creating changefreq Element
			Element changefreqELement = document.createElement("changefreq");
			changefreqELement.setTextContent("monthly");

			// Creating priority Element
			Element priorityELement = document.createElement("priority");
			priorityELement.setTextContent("0.8");

			urlElement.appendChild(locElement);
			urlElement.appendChild(lastmodElement);
			urlElement.appendChild(changefreqELement);
			urlElement.appendChild(priorityELement);

			// Emptying the url for next iteration
			url.replace(0, url.length(), "");
			productItemCount++;
		}
	}

	// Method to create url from algolia data
	private void createUrl(Object item, StringBuilder url) {
		Set<String> keyValues = ((LinkedHashMap) item).keySet();
		if (keyValues.contains(CATEGORYSEOURL) && keyValues.contains(SEO_NAME) && keyValues.contains(OBJECTID)) {
			if(((LinkedHashMap) item).get(CATEGORYSEOURL) !=null) {
				List<String> categoryValues = (List<String>) ((LinkedHashMap) item).get(CATEGORYSEOURL);
				String seoNameValue = (String) ((LinkedHashMap) item).get(SEO_NAME);
				String objectId = (String) ((LinkedHashMap) item).get(OBJECTID);
				if (!categoryValues.isEmpty() && categoryValues.size() >= 3 && !seoNameValue.isEmpty() && !objectId.isEmpty()) {
					// Processing categorySEOURL Value to form seo URL
					url.append(categoryValues.get(2).toLowerCase().concat("/"));
					// Processing seo Name to form SEO URL
					url.append(seoNameValue.replaceAll("\\s", "").toLowerCase().concat(".html"));
				}
			}
		}
	}
}
