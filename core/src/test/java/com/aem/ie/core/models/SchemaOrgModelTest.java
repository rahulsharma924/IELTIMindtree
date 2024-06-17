package com.aem.ie.core.models;

import com.adobe.aem.wcm.seo.SeoTags;
import com.adobe.granite.asset.api.Rendition;
import com.adobe.xfa.ModelFactory;
import com.aem.ie.core.Service.AlgoliaPDPService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.constants.ApplConstants;
import com.aem.ie.core.models.datamodels.Product;
import com.aem.ie.core.models.datamodels.SchemaOrg;
import com.aem.ie.core.services.impl.AlgoliaPDPServiceImpl;
import com.aem.ie.core.utils.PageUtils;
import com.algolia.search.com.fasterxml.jackson.databind.JsonNode;
import com.algolia.search.com.fasterxml.jackson.databind.ObjectMapper;
import com.day.cq.commons.Externalizer;
import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.common.collect.ImmutableMap;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import javax.servlet.http.Cookie;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.osgi.service.component.annotations.Reference;


import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import javax.inject.Inject;
import javax.jcr.RepositoryException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class SchemaOrgModelTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

    SchemaOrgModel schemaOrgModel;
    @Mock
    Tag tag;
    @Mock
    TagManager tagManager;
    @Mock
    private Page currentPage;
    @Mock
    private ResourceResolver resourceResolver;
    @Mock
    private ModelFactory modelFactory;
    @Mock
    private Resource resource;
    @Mock
    Product product;
    @Mock
    private SlingHttpServletRequest request;

    @Mock
    private UpdatePersonalInfoService mockupdatePersonalInfoService;
    @Mock
    private AlgoliaPDPService algoliaPDPService;
    @Mock
    private PageManager pageManager;

    @Mock
    private AssetManager assetManager;
    @Mock
    private SeoTags seoTags;
    @Mock
    private ValueMap valueMap;
    @Mock
    RequestPathInfo requestPathInfo;

    @Mock
    Asset asset;
    private Rendition rendition;
    private InputStream inputStream;
    @Reference
    Externalizer externalizer;
    private Page page;
    private Cookie[] cookies;
    String[] selectors = {"antennas"};
    String[] selectorsLevelOne={"directional-antennas"};
    String[] selectorsLevelTwo={"log-periodic-antennas"};
    String[] selectors2 = {"18-26.5-ghz-low-noise-broadband-amplifier-fmam3260"};
    List<String> categorySEOURL = new ArrayList<>();
    Map<String, String> configProps = new HashMap<String, String>();

    // Mock the JSON data
    String json = "[{\n" +
            " \"category\" : {\n" +
            " \"categoryId\" : \"9288221d-c70a-431d-9bca-40678357af3c\",\n" +
            " \"name\" : \"Antennas\",\n" +
            " \"seoName\" : \"antennas\",\n" +
            " \"seoTagName\" : \"antennasss\",\n" +
            " \"webDescription\" : \"antennas\",\n" +
            " \"categoryPath\" : \"antennas\",\n" +
            " \"categoryUrl\" : \"antennas\",\n" +
            " \"thumbnailUrl\" : \"null\",\n" +
            " \"categorySeoUrl\" : \"antennas\",\n" +
            " \"childCategories\" : [ {\n" +
            " \"categoryId\" : \"327a8805-7799-42bb-bfb5-e044884e7656\",\n" +
            " \"name\" : \"Directional Antennas\",\n" +
            " \"seoName\" : \"directional-antennas\",\n" +
            " \"seoTagName\" : \"directional-antennas\", \n" +
            " \"categorySeoUrl\" : \"antennas|directional-antennas\",\n" +
            " \"childCategories\" : [ {\n" +
            " \"categoryId\" : \"0a49fb7c-60ff-4e65-a25c-f04d31f65d2d\",\n" +
            " \"name\" : \"Log Periodic Antennas\",\n" +
            " \"seoName\" : \"log-periodic-antennas\",\n" +
            " \"seoTagName\" : \"log-periodic-antennas\",\n" +
            " \"categorySeoUrl\" : \"antennas|directional-antennas|log-periodic-antennas\",\n" +
            " \"webDescription\" : \"Log Periodic Antennas\"\n" +
            "}]"+
            "}]"+
            "}\n" +
            "}]";

    @BeforeEach
    void setUp() {
        configProps.put("algoliaId","testing20MRCI4146");
        configProps.put("algoliaKey","8f92b91fdf51d9543748d38e6df813b8");
        configProps.put("indexInuse","fm_product_en_dev");
        algoliaPDPService = aemContext.registerInjectActivateService(new AlgoliaPDPServiceImpl(),configProps);
        aemContext.addModelsForClasses(SchemaOrgModel.class);
        aemContext.addModelsForClasses(Product.class);
        aemContext.load().json("/com/aem/ie/core/models/SchemaOrgModel.json", "/page");
        aemContext.load().json("/com/aem/ie/core/models/Categories.json", "/resource1");
        rendition = mock(Rendition.class);
        inputStream = mock(InputStream.class);
        product = mock(Product.class);
    }

    @Test
    void init() {
        aemContext.create().page("/content/fm/en/testpage", "/conf/fm/settings/wcm/templates/news-template", "title");
        aemContext.currentPage("/page/PageUtils");
        aemContext.assetManager();
        externalizer = aemContext.resourceResolver().adaptTo(Externalizer.class);
        schemaOrgModel = aemContext.request().adaptTo(SchemaOrgModel.class);
        mockupdatePersonalInfoService = aemContext.resourceResolver().adaptTo(UpdatePersonalInfoService.class);
        aemContext.addModelsForClasses(Product.class);
    }


    @Test
    public void testSchemaOrgModel() throws RepositoryException, IOException {
        // Set up the necessary mocks
        when(currentPage.getDescription()).thenReturn("{Main Category} and {Product Name}");
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getDescription()).thenReturn("page description");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        when(resource.adaptTo(SeoTags.class)).thenReturn(mock(SeoTags.class));
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectors);
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("/conf/fm/settings/wcm/templates/content-page1");
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn(null);
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json", 1600, 900, "application/json");
        Resource res = aemContext.currentResource("/resource1");
        InputStream content = res.adaptTo(InputStream.class);
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json", content, "application/json");
        aemContext.request().setResource(res);
        when(assetManager.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json")).thenReturn(asset);
        when(asset.getRendition("original")).thenReturn(rendition);
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        // Mock the behavior of the ObjectMapper to return a mock JsonNode
        ObjectMapper objectMapper = mock(ObjectMapper.class);
        JsonNode jsonNode = mock(JsonNode.class);
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;

        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
        schemaOrgModel.getCanonicalLink();
        schemaOrgModel.getTemplateCheck();

        // Verify the expected values
        assertEquals("Antennas", schemaOrgModel.getPageTitle());
        assertEquals("website", schemaOrgModel.getOgType());
        assertEquals(null, schemaOrgModel.getImage());
        assertEquals(0, schemaOrgModel.getSchemaOrgList().size());

        // Verify that the necessary methods were called
    }

    @Test
    public void testSchemaOrgModelWithPDPTemplate() throws RepositoryException, IOException {
        // Set up the necessary mocks
        categorySEOURL.add("antennas");
        categorySEOURL.add("test");
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getDescription()).thenReturn("page description");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        when(resource.adaptTo(SeoTags.class)).thenReturn(mock(SeoTags.class));
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectors2);
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("/conf/fm/settings/wcm/templates/pdp-template");
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn(null);
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;
        schemaOrgModel.algoliaPDPService = algoliaPDPService;
        schemaOrgModel.product = product;
        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
        schemaOrgModel.getPageUrl();
        schemaOrgModel.getPageDescription();

        // Verify the expected values
        assertEquals("website", schemaOrgModel.getOgType());
        assertEquals(null, schemaOrgModel.getImage());
        assertEquals(0, schemaOrgModel.getSchemaOrgList().size());

        // Verify that the necessary methods were called
    }

    @Test
    public void testSchemaOrgModelWithBlogTemplate() throws RepositoryException, IOException {
        // Set up the necessary mocks
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getDescription()).thenReturn("page description");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        when(resource.adaptTo(SeoTags.class)).thenReturn(seoTags);
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectors);
        when(request.getRequestURI()).thenReturn("/content/fm/en/homepage.html");
        when(mockupdatePersonalInfoService.getDomainName()).thenReturn("https://qa-dt.fairviewmicrowave.com");
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("test");
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn("/content/dam/fm/icon3.png");
        when(currentPage.getProperties().get(ApplConstants.TEMPLATE, "")).thenReturn(String.valueOf("/settings/wcm/templates/blog-template"));
        when(PageUtils.isBlogPage(currentPage)).thenReturn(true);
        when(resourceResolver.getResource(any() + "/jcr:content/root/container")).thenReturn(resource);
        when(resource.listChildren()).thenReturn(aemContext.currentPage("/page/PageUtils2").adaptTo(Resource.class).listChildren());
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;
        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
        schemaOrgModel.getBlogPage();
        schemaOrgModel.getNewsPage();
        // Verify the expected values
        assertEquals("title", schemaOrgModel.getPageTitle());
    }

    @Test
    public void testSchemaOrgModelWithNewsTemplate() throws RepositoryException, IOException {
        // Set up the necessary mocks
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getDescription()).thenReturn("page description");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        //Asset asset = aemContext.create().asset("/content/dam/fm/icon3.png",1600,900,"image/png");
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("test");
        when(resource.adaptTo(SeoTags.class)).thenReturn(seoTags);
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectors);
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn("/content/dam/fm/icon3.png");
        when(currentPage.getProperties().get(ApplConstants.TEMPLATE, "")).thenReturn(String.valueOf("/settings/wcm/templates/news-template"));
        when(PageUtils.isBlogPage(currentPage)).thenReturn(true);
        when(resourceResolver.getResource(any() + "/jcr:content/root/container")).thenReturn(resource);
        when(resource.listChildren()).thenReturn(aemContext.currentPage("/page/PageUtils").adaptTo(Resource.class).listChildren());
        when(resource.getResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(TagManager.class)).thenReturn(tagManager);
        when(tagManager.resolve(any())).thenReturn(tag);
        when(tag.getTitle()).thenReturn("News Releases");
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;
        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
    }


    @Test
    public void testSchemaOrgModelWithArticleTemplate() throws RepositoryException, IOException {
        // Set up the necessary mocks
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getDescription()).thenReturn("page description");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        //Asset asset = aemContext.create().asset("/content/dam/fm/icon3.png",1600,900,"image/png");
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("test");
        when(resource.adaptTo(SeoTags.class)).thenReturn(seoTags);
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn("/content/dam/fm/icon3.png");
        when(currentPage.getProperties().get(ApplConstants.TEMPLATE, "")).thenReturn(String.valueOf("/settings/wcm/templates/article-page"));
        when(PageUtils.isBlogPage(currentPage)).thenReturn(true);
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectors);
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;
        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
    }

    @Test
    public void testSchemaOrgModelLevelOne() throws RepositoryException, IOException {
        // Set up the necessary mocks
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getDescription()).thenReturn("page description");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        when(resource.adaptTo(SeoTags.class)).thenReturn(mock(SeoTags.class));
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectorsLevelOne);
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("/conf/fm/settings/wcm/templates/content-page1");
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn(null);
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json", 1600, 900, "application/json");
        Resource res = aemContext.currentResource("/resource1");
        InputStream content = res.adaptTo(InputStream.class);
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json", content, "application/json");
        aemContext.request().setResource(res);
        when(assetManager.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json")).thenReturn(asset);
        when(asset.getRendition("original")).thenReturn(rendition);
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        // Mock the behavior of the ObjectMapper to return a mock JsonNode
        ObjectMapper objectMapper = mock(ObjectMapper.class);
        JsonNode jsonNode = mock(JsonNode.class);
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;

        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
        schemaOrgModel.getCanonicalLink();
        schemaOrgModel.getTemplateCheck();

        // Verify the expected values
        assertEquals("Directional Antennas", schemaOrgModel.getPageTitle());
        assertEquals("website", schemaOrgModel.getOgType());
        assertEquals(null, schemaOrgModel.getImage());
        assertEquals(0, schemaOrgModel.getSchemaOrgList().size());

        // Verify that the necessary methods were called
    }

    @Test
    public void testSchemaOrgModelLevelTwo() throws RepositoryException, IOException {
        // Set up the necessary mocks
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getDescription()).thenReturn("page description");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        when(resource.adaptTo(SeoTags.class)).thenReturn(mock(SeoTags.class));
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectorsLevelTwo);
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("/conf/fm/settings/wcm/templates/content-page1");
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn(null);
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json", 1600, 900, "application/json");
        Resource res = aemContext.currentResource("/resource1");
        InputStream content = res.adaptTo(InputStream.class);
        aemContext.create().asset("/com/aem/ie/core/models/Categories.json", content, "application/json");
        aemContext.request().setResource(res);
        when(assetManager.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json")).thenReturn(asset);
        when(asset.getRendition("original")).thenReturn(rendition);
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        // Mock the behavior of the ObjectMapper to return a mock JsonNode
        ObjectMapper objectMapper = mock(ObjectMapper.class);
        JsonNode jsonNode = mock(JsonNode.class);
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;

        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
        schemaOrgModel.getCanonicalLink();
        schemaOrgModel.getTemplateCheck();

        // Verify the expected values
        assertEquals("Log Periodic Antennas", schemaOrgModel.getPageTitle());
        assertEquals("website", schemaOrgModel.getOgType());
        assertEquals(null, schemaOrgModel.getImage());
        assertEquals(0, schemaOrgModel.getSchemaOrgList().size());

        // Verify that the necessary methods were called
    }

    @Test
    public void testSchemaOrgModelWithPDPTemplateTwoSelector() throws RepositoryException, IOException {
        // Set up the necessary mocks
        String[] selectorsPDP = {"18-26","5-ghz-low-noise-broadband-amplifier-fmam3260"};
        categorySEOURL.add("antennas");
        categorySEOURL.add("test");
        when(currentPage.getTitle()).thenReturn("title");
        when(currentPage.getPath()).thenReturn("/content/fm/en/testpage");
        when(currentPage.getProperties()).thenReturn(valueMap);
        when(currentPage.getDescription()).thenReturn("page description");
        when(resourceResolver.adaptTo(Externalizer.class)).thenReturn(mock(Externalizer.class));
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getPage(currentPage.getPath())).thenReturn(currentPage);
        when(resource.adaptTo(SeoTags.class)).thenReturn(mock(SeoTags.class));
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(requestPathInfo.getSelectors()).thenReturn(selectorsPDP);
        when(valueMap.get(eq("cq:template"), eq(String.class))).thenReturn("/conf/fm/settings/wcm/templates/pdp-template");
        when(valueMap.get(eq("cq:featuredimage/fileReference"), eq(String.class))).thenReturn(null);
        SchemaOrgModel schemaOrgModel = new SchemaOrgModel();
        schemaOrgModel.currentPage = currentPage;
        schemaOrgModel.resourceResolver = resourceResolver;
        schemaOrgModel.resource = resource;
        schemaOrgModel.request = request;
        schemaOrgModel.updatePersonalInfoService = mockupdatePersonalInfoService;
        schemaOrgModel.algoliaPDPService = algoliaPDPService;
        schemaOrgModel.product = product;
        // Test the SchemaOrgModel logic
        schemaOrgModel.init();
        schemaOrgModel.getPageUrl();
        schemaOrgModel.getPageDescription();
        schemaOrgModel.getTemplateCheck();

        // Verify the expected values
        assertEquals("website", schemaOrgModel.getOgType());
        assertEquals(null, schemaOrgModel.getImage());
        assertEquals(0, schemaOrgModel.getSchemaOrgList().size());

        // Verify that the necessary methods were called
    }
}
