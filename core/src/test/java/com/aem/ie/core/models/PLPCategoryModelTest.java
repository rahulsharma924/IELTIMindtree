package com.aem.ie.core.models;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.dam.cfm.ContentElement;
import com.adobe.cq.dam.cfm.ContentFragment;
import com.adobe.cq.dam.cfm.ContentFragmentException;
import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.utils.SelectorValueUtils;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class PLPCategoryModelTest {
	AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);

	@Mock
	private Resource resource;

	@Mock
	private QueryBuilder builder;

	@Mock
	private ResourceResolver resourceResolver;

	@Mock
	private Session session;

	@Mock
	private SearchResult searchResult;

	@Mock
	private TagManager tagManager;

	@Mock
	private SlingHttpServletRequest request;

	@Mock
	private JsonNode jsonNode;
	@Mock
	RequestPathInfo requestPathInfo;
	@InjectMocks
	private PLPCategoryModel plpCategoryModel;
	@Mock
	Resource resouecetag;
	@Mock
	private Hit hit;
	@Mock
	AssetManager assetManager;
	@Mock
    Asset asset;
	@Mock
    private Rendition rendition;
	@Mock
    private InputStream inputStream;
	@Mock
	private Tag tag;
	@Mock
	JsonNode jsSubNode ;
	
	@Mock
	JsonNode jsonObject;
	
	String[] selectors={"antennas"};
	String selector,categoryValueFinal;
    String selec="antennas";
    String[] selectors1={"log-periodic-antennas"};
	String selector1,categoryValueFinal1;
    String selec1="rf-amplifiers";
	@BeforeAll
	public void setUp() throws Exception {
		aemContext.addModelsForClasses(PLPModel.class);
	}
	@Test
	public void testInit() throws RepositoryException, ContentFragmentException {
		Query query = mock(Query.class);
		selec=SelectorValueUtils.getPLPSSRSeoNameTagSearchSelector(selectors,selector,categoryValueFinal);
		TagManager tagManager1=mock(TagManager.class);
		when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
		when(builder.createQuery(any(), any())).thenReturn(query);
		when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
		when(requestPathInfo.getSelectors()).thenReturn(selectors);
		SearchResult searchResult = mock(SearchResult.class);
		when(query.getResult()).thenReturn(searchResult);
		when(searchResult.getTotalMatches()).thenReturn(1L);
		when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
		when(hit.getResource()).thenReturn(resource);
		when(resouecetag.getResourceResolver()).thenReturn(resourceResolver);
		when(resourceResolver.adaptTo(TagManager.class)).thenReturn(tagManager1);
		ContentFragment contentFragment = mock(ContentFragment.class);
		when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
		ContentElement contentElement = mock(ContentElement.class);
		when(contentFragment.getElement("producttag")).thenReturn(contentElement);
		when(contentElement.getContent()).thenReturn("antennas");
		when(tagManager1.resolve("antennas")).thenReturn(tag);
		when(tag.getName()).thenReturn("antennas");
		ContentElement contentElement1 = mock(ContentElement.class);
		when(contentFragment.getElement("title")).thenReturn(contentElement1);
		when(contentFragment.getElement("description")).thenReturn(contentElement1);
		when(contentElement1.getContent()).thenReturn("<p>description</p>");
		plpCategoryModel.init();
		plpCategoryModel.getMyHashMap();


	}
	@Test
	public void testInittagmismatch() throws RepositoryException, ContentFragmentException {
		Query query = mock(Query.class);
		selec1=SelectorValueUtils.getPLPSSRSeoNameTagSearchSelector(selectors1,selector1,categoryValueFinal1);
		TagManager tagManager2=mock(TagManager.class);
		when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
		when(builder.createQuery(any(), any())).thenReturn(query);
		when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
		when(requestPathInfo.getSelectors()).thenReturn(selectors);
		SearchResult searchResult = mock(SearchResult.class);
		when(query.getResult()).thenReturn(searchResult);
		when(searchResult.getTotalMatches()).thenReturn(1L);
		when(searchResult.getHits()).thenReturn(Arrays.asList(new Hit[]{hit}));
		when(hit.getResource()).thenReturn(resource);
		when(resouecetag.getResourceResolver()).thenReturn(resourceResolver);
		when(resourceResolver.adaptTo(TagManager.class)).thenReturn(tagManager2);
		ContentFragment contentFragment = mock(ContentFragment.class);
		when(resource.adaptTo(ContentFragment.class)).thenReturn(contentFragment);
		ContentElement contentElement = mock(ContentElement.class);
		when(contentFragment.getElement("producttag")).thenReturn(contentElement);
		when(contentElement.getContent()).thenReturn("rf-amplifiers");
		when(tagManager2.resolve("rf-amplifiers")).thenReturn(tag);
		when(tag.getName()).thenReturn("rf-amplifiers");
		when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
		when(assetManager.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json")).thenReturn(asset);
        when(asset.getRendition("original")).thenReturn(rendition);
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);

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
        	      " \"childCategories\" : [ {\n" +
        	          " \"categoryId\" : \"0a49fb7c-60ff-4e65-a25c-f04d31f65d2d\",\n" +
        	          " \"name\" : \"Log Periodic Antennas\",\n" +
        	          " \"seoName\" : \"log-periodic-antennas\",\n" +
        	          " \"seoTagName\" : \"log-periodic-antennas\",\n" +
        	          " \"webDescription\" : \"Log Periodic Antennas\"\n" +
        	      "}]"+
        	      "}]"+
        	      "}\n" +
        	      "}]";

        InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
        
        // Mock the behavior of the ObjectMapper to return a mock JsonNode
        ObjectMapper objectMapper = mock(ObjectMapper.class);
        JsonNode jsonNode = mock(JsonNode.class);
        JsonNode Child= mock(JsonNode.class);
        JsonNode subChild= mock(JsonNode.class);
        plpCategoryModel.getPreviousAttribute(jsonObject, "antennas");
        plpCategoryModel.init();
	
	}
}
