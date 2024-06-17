package com.aem.ie.core.models;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.Service.AlgoliaPLPService;
import com.aem.ie.core.Service.GetPLPFilterAttributeService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.models.datamodels.PLP;
import com.aem.ie.core.services.impl.GetPLPFilterAttributeImpl;
import com.aem.ie.core.utils.SelectorValueUtils;
import com.algolia.search.com.fasterxml.jackson.databind.JsonNode;
import com.algolia.search.com.fasterxml.jackson.databind.ObjectMapper;
import com.algolia.search.models.indexing.FacetStats;
import com.algolia.search.models.indexing.SearchResult;
import com.google.gson.JsonObject;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
public class PLPSSRListTest {
	AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
	@Mock
	GetPLPFilterAttributeService getPLPFilterAttributeService;
	@Mock
	UpdatePersonalInfoService updatePersonalInfoService;
	@Mock
	OLCCModuleService olccModuleService;
	private GetPLPFilterAttributeService mockGetPLPFilterAttributeService;
	private Map<String, String> configProps = new HashMap<String, String>();
	@InjectMocks
	PLPSSRList plpSSRList;
	@Mock
	SearchResult<PLP> result;

	@Mock
	JsonNode jsNode;
	@Mock
	SearchResult<JsonObject> result1;
	@Mock
	SearchResult<JsonObject> pricerange;
	@Mock
	SearchResult<JsonObject> allCategoryVal;
	@Mock
	PLP product;
	@Mock
	JsonNode jsonObject;
	@Mock
	SlingHttpServletRequest request;
	@Mock
	RequestPathInfo path;
	@Mock
	ResourceResolver resourceResolver;
	@Mock
	AssetManager assetManager;
	@Mock
	Asset asset;
	@Mock
	Rendition rendition;
	@Mock
	private InputStream inputStream;
	@Mock
	AlgoliaPLPService algoliaPLPService;
	@Mock
	ObjectMapper mapper;
	SelectorValueUtils selectorValueUtils;
	@Mock
	Iterator<String> itr;
	@Mock
	List<String> categoryseourl1;
	@BeforeEach
	void setUp() throws IOException {
		aemContext.addModelsForClasses(PLPSSRList.class);

	}

	@Test
	void init() throws IOException {
		plpSSRList.getStartingPriceValue(33.0);

	}

	@Test
	void plpssrlistmethodstest() throws IOException {
		plpSSRList.getBestSellerClass();
		plpSSRList.getNewReleasesClass();
		plpSSRList.getAllPageClass();
		plpSSRList.getClearAllClass();
		Map<String, Long> newslist = new HashMap<>();
		Map<String, Map<String, Long>> newsFilters = new HashMap<>();
		long val = 47;
		newslist.put("Antenna Type", val);
		newslist.put("Application Band", val);
		newsFilters.put("hierarchicalCategories.lvl0", newslist);
		when(result.getFacets()).thenReturn(newsFilters);
		plpSSRList.getnewsReleaseFacetFilterValues();
		plpSSRList.getCategoryFilterValueNames();
		Map<String, Long> facetlist = new HashMap<>();
		Map<String, Map<String, Long>> facetvalues = new HashMap<>();
		facetlist.put("Antenna Type", val);
		facetlist.put("Application Band", val);
		facetvalues.put("hierarchicalCategories.lvl0", facetlist);
		when(result1.getFacets()).thenReturn(facetvalues);
		List<String> webatt = new ArrayList();
		List<String> webattrcode = new ArrayList();
		webatt.add("Antenna Type");
		webatt.add("Application Band");
		webattrcode.add("Antenna Type");
		webattrcode.add("Application Band");
		plpSSRList.getFacetListMap();
		plpSSRList.getFacetValueMap("antennas");
		long val1 = 47;
		Map<String, Long> facetsValuestype = null;
		Map<String, Long> facetsValuestype1 = new LinkedHashMap<>();
		facetsValuestype1.put("Antenna Type", val1);
		facetsValuestype1.put("Application Band", val1);
		plpSSRList.getFacetListValueMap();
		plpSSRList.getwaveguideCategoryValues();
		plpSSRList.getSubCategoryLinkMap();
		when(olccModuleService.getBearerTokenUrl()).thenReturn("testasdfgh");
		plpSSRList.getbearerToken();
		plpSSRList.getAttributeCode();
		plpSSRList.getHitsPerPage();
		plpSSRList.getShowResults();
		plpSSRList.getNbPages();
		plpSSRList.getPage();
		plpSSRList.getActivePageDataValue();
		plpSSRList.getPreviousPage();
		plpSSRList.getDoubleArrowLastPageValue();
		plpSSRList.getProductListMap();
		List<LinkedHashMap<String, String>> assetsValue = new ArrayList();
		LinkedHashMap<String, String> test = new LinkedHashMap();
		test.put("test", "antennas");
		assetsValue.add(test);
		String largeimg = "FMANRBD1008.pdf@@DataSheet@@1.8 dBi, VHF Rubber Duck Antenna, 139-149 MHz, BNC-J Connector, Vertical Polarization@@Antennas,Omni-Directional Antennas,Rubber Duck Antennas,Antennas,Omni-Directional Antennas,Rubber Duck Antennas";
		plpSSRList.getViewProductStatusFlag(product);
		plpSSRList.getInventoryValue(1, product, "/antennas");
		plpSSRList.getTableInventoryValue(1, product, "/antennas");
		plpSSRList.getEstimatedShipmentDate();
		plpSSRList.isIEHoliday(27 / 01 / 2024, 27, "Jan");
		plpSSRList.zeroPad(1);
	}

	@Test
	void getNextBusinessDaytest() throws IOException {
		Date timeCST = new Date();
		plpSSRList.getNextBusinessDay(timeCST);

	}

	@Test
	void getCategorytest() throws IOException {
		List<String> category = new ArrayList();
		category.add("antennas");
		when(product.getCategory()).thenReturn(category);
		plpSSRList.getCategory(product);
	}

	@Test
	void getdatasheetnametest() throws IOException {
		LinkedHashMap<String, String> assetmap = new LinkedHashMap<String, String>();
		assetmap.put("image1", "image2");
		List<LinkedHashMap<String, String>> assetsValue = new ArrayList();
		assetsValue.add(assetmap);
		String categoryString = "Antennas";
		String nameValue = "antenna";
		plpSSRList.getDataSheetName(assetsValue, categoryString, nameValue);
	}

	@Test
	void getSeoURLtest() throws IOException {
		List<String> category1 = new ArrayList();
		category1.add("antennas");
		when(product.getCategorySEOURL()).thenReturn(category1);
		when(product.getSeoName()).thenReturn("antennas");
		plpSSRList.getSeoURL(product);
	}

	@Test
	void inittest() throws IOException {
		String selector;
		String categoryValuefinal = null;
		when(request.getQueryString()).thenReturn("all");
		String[] selectors = { "all" };
		when(request.getRequestPathInfo()).thenReturn(path);
		when(path.getSelectors()).thenReturn(selectors);
		SelectorValueUtils.getPLPSSRProductListSelector(new String[] { "all" }, "all");
		// when(SelectorValueUtils.getPLPSSRProductListSelector(selectors,
		// "antennas")).thenReturn("antennas");
		when(resourceResolver.adaptTo(AssetManager.class)).thenReturn(assetManager);
		when(assetManager.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json"))
				.thenReturn(asset);
		when(asset.getRendition("original")).thenReturn(rendition);
		when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
		String json = "[{\n" + " \"category\" : {\n" + " \"categoryId\" : \"9288221d-c70a-431d-9bca-40678357af3c\",\n"
				+ " \"name\" : \"Antennas\",\n" + " \"seoName\" : \"antennas\",\n" + " \"seoTagName\" : \"antennas\",\n"
				+ " \"webDescription\" : \"antennas\",\n" + " \"categoryPath\" : \"Antennas\",\n"
				+ " \"categoryUrl\" : \"antennas\",\n" + " \"thumbnailUrl\" : \"null\",\n"
				+ " \"categorySeoUrl\" : \"antennas\",\n" + " \"childCategories\" : [ {\n"
				+ " \"categoryId\" : \"327a8805-7799-42bb-bfb5-e044884e7656\",\n"
				+ " \"name\" : \"Directional Antennas\",\n" + " \"seoName\" : \"directional-antennas\",\n"
				+ " \"seoTagName\" : \"directional-antennas\", \n" + " \"webDescription\" : \"antennas\",\n"
				+ " \"categoryPath\" : \"Antennas|Directional Antennas\",\n"
				+ " \"categorySeoUrl\" : \"antennas|directional-antennas\", \n" + " \"childCategories\" : [ {\n"
				+ " \"categoryId\" : \"0a49fb7c-60ff-4e65-a25c-f04d31f65d2d\",\n"
				+ " \"name\" : \"Log Periodic Antennas\",\n" + " \"seoName\" : \"log-periodic-antennas\",\n"
				+ " \"seoTagName\" : \"log-periodic-antennas\",\n"
				+ " \"webDescription\" : \"Log Periodic Antennas\",\n"
				+ " \"categorySeoUrl\" : \"antennas|directional-antennas|log-periodic-antennas\" \n" + "}]" + "}]"
				+ "}\n" + "}]";

		InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
		when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
		when(olccModuleService.getBearerTokenUrl()).thenReturn("trewuytres");
		when(algoliaPLPService.getAlgoliaAllList()).thenReturn(result);
		List<String> webattname = new ArrayList();
		webattname.add("Antenna Type");
		plpSSRList.init();
		Map<String, Long> newslist = new HashMap<>();
		Map<String, Map<String, Long>> val1 = new HashMap<>();
		long val = 47;
		newslist.put("Antenna Type", val);
		newslist.put("Application Band", val);
		val1.put("hierarchicalCategories.lvl0", newslist);
		when(result.getFacets()).thenReturn(val1);
		plpSSRList.getAllFacetListValueMap();
		Map<String, Long> facetsValuestype1 = new LinkedHashMap<>();
	}

	@Test
	void getPriceRangeValuestest() throws IOException {
		plpSSRList.getPriceRangeValues();
	}

	@Test
	void getAllFacetListValueMapTest() throws IOException {
		SelectorValueUtils.getPLPSSRProductListSelector(new String[] { "all" }, "all");
		plpSSRList.getAllFacetListValueMap();
	}
	@Test
	void getBreadcrumbValuesTest() throws IOException {
		plpSSRList.getBreadcrumbValues();
	}
}
