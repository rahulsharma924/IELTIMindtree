package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.CategoryImageSitemapGeneratorService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.configuration.CategoryImageSitemapGeneratorConfig;
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
import static com.day.cq.commons.jcr.JcrConstants.JCR_LASTMODIFIED;
import static com.day.cq.wcm.api.NameConstants.PN_PAGE_LAST_MOD;

@Component(service = CategoryImageSitemapGeneratorService.class, immediate = true)
@Designate(ocd = CategoryImageSitemapGeneratorConfig.class)
public class CategoryImageSitemapGeneratorServiceImpl implements CategoryImageSitemapGeneratorService {
    @Reference
    UpdatePersonalInfoService updatePersonalInfoService;
    @Reference
    protected ResourceResolverFactory resourceResolverFactory;
    protected CategoryImageSitemapGeneratorConfig categoryImageSitemapGeneratorConfig;
    private static final Logger log = LoggerFactory.getLogger(CategoryImageSitemapGeneratorServiceImpl.class);
    @Activate
    protected void activate(CategoryImageSitemapGeneratorConfig categoryImageSitemapGeneratorConfig) {
         this.categoryImageSitemapGeneratorConfig = categoryImageSitemapGeneratorConfig;
    }

    @Override
    public void generateCategoryImageSiteMap() throws IOException {
        ResourceResolver resourceResolver = null;
        try {
            //creating resource resolver from service user
            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
            resourceResolver = resourceResolverFactory.getServiceResourceResolver(paramMap);
            //Create XML Document
            Document document = createXMLDocument(resourceResolver);
            // Get Binary from document
            Binary binary = SitemapUtils.covertDocumentToBinary(resourceResolver, document);
            //Creating xmfile in aem repository
            AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
            assert assetManager != null;
            assetManager.createOrUpdateAsset(categoryImageSitemapGeneratorConfig.xmlPath(), binary,
                    "application/xml", true);
            resourceResolver.commit();
            resourceResolver.refresh();
        } catch (LoginException loginException) {
            log.error("LoginException Exception Occurred{}", loginException.getMessage());
        } finally {
            if (resourceResolver!=null && resourceResolver.isLive()) {
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

            //Getting blog pages with lastModified value
            Map<String, String> categoryImagePageMaps = getCategoryImagesData(resourceResolver);

            //defining url object to form url from fetched data
            for (Map.Entry<String, String> blogItem : categoryImagePageMaps.entrySet()) {

                //externalizing the url to form seo url
                String finalUrl = blogItem.getKey();
                finalUrl = updatePersonalInfoService.getDomainName() + finalUrl;
                Element urlElement = document.createElement("url");
                root.appendChild(urlElement);
                Element locElement = document.createElement("loc");
                locElement.setTextContent(finalUrl);
                //Creating lastmod Element
                Element lastmodElement = document.createElement("lastmod");
                lastmodElement.setTextContent(blogItem.getValue());
                //Creating changefreq Element
                Element changefreqELement = document.createElement("changefreq");
                changefreqELement.setTextContent("monthly");
                //Creating priority Element
                Element priorityELement = document.createElement("priority");
                priorityELement.setTextContent("0.6");
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

    protected Map<String, String> getCategoryImagesData(ResourceResolver resourceResolver) {
        Map<String, String> imageData = new HashMap<>();
        Resource categoryImageRootFolder = resourceResolver.getResource(categoryImageSitemapGeneratorConfig.categoryImageRootPath());
        if(categoryImageRootFolder.hasChildren()) {
            for (Resource imageItem : categoryImageRootFolder.getChildren()) {
                String jcrContent = JCR_CONTENT;
                if(!(imageItem.getName().equals(jcrContent)) && imageItem.getChild(jcrContent)!=null){
                    Resource imageItemJcrNode = imageItem.getChild(jcrContent);
                    if (imageItemJcrNode.getValueMap().containsKey(JCR_LASTMODIFIED)) {
                        imageData.put(imageItem.getPath(), imageItemJcrNode.getValueMap()
                                .get(PN_PAGE_LAST_MOD, String.class));
                    }
                }
            }
        }
        return imageData;
    }
}

