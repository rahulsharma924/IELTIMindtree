package com.aem.ie.core.models;

import static com.aem.ie.core.constants.ApplConstants.CALL_US;
import static com.aem.ie.core.constants.ApplConstants.DATASHEET_ROOTPATH;
import static com.aem.ie.core.constants.ApplConstants.IMAGES_ROOTPATH;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeMap;

import javax.annotation.PostConstruct;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.Service.AlgoliaPLPService;
import com.aem.ie.core.Service.GetPLPFilterAttributeService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.models.datamodels.PLP;
import com.aem.ie.core.utils.SelectorValueUtils;
import com.algolia.search.com.fasterxml.jackson.databind.JsonNode;
import com.algolia.search.com.fasterxml.jackson.databind.ObjectMapper;
import com.algolia.search.models.indexing.SearchResult;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Model(adaptables = { Resource.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ProductList {
	private static final Logger log = LoggerFactory.getLogger(ProductList.class);
	@SlingObject
	SlingHttpServletRequest request;
	@OSGiService
	AlgoliaPLPService algoliaPLPService;
	@OSGiService
	OLCCModuleService olccModuleService;
	@OSGiService
	GetPLPFilterAttributeService getPLPFilterAttributeService;
	@ValueMapValue
	@Default(values = IMAGES_ROOTPATH)
	String productimagerootpath;
	@ValueMapValue
	@Default(values = DATASHEET_ROOTPATH)
	String datasheetrootpath;
	SearchResult<PLP> result;
	List<String> categoryFilterNames = new ArrayList<>();
	List<String> webAttrCode = new ArrayList<>();
	String requiredPath = StringUtils.EMPTY;
	private static final List<String> holidays = new ArrayList<>(
			Arrays.asList("01-02", "05-29", "06-19", "07-04", "09-04", "11-23", "12-25"));
	String selector;
	String categorySEOUrl;
	String categoryName;
	String categoryPath;
	String categoryChildPath;
	String categorySubChildPath;
	JsonNode node;
	JsonNode Child;
		
	@SlingObject
	protected ResourceResolver resourceResolver;

	@PostConstruct
	void init() throws IOException {
		String slash = "/";
		String[] selectors = request.getRequestPathInfo().getSelectors();
		selector = SelectorValueUtils.getPLPSSRProductListSelector(selectors, selector);
		// Get the DAM file by path to read categories json
		AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
		Asset asset = assetManager
				.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json");
		Rendition rendition = asset.getRendition("original");
		InputStream inputStream = rendition.adaptTo(InputStream.class);
		String renditionData = IOUtils.toString(inputStream, "UTF-8");
		IOUtils.closeQuietly(inputStream);
		ObjectMapper objectMapper = new ObjectMapper();
		// Read JSON as a JsonNode
		JsonNode jsonNode = objectMapper.readTree(renditionData);
		for (JsonNode jsNode : jsonNode) {
			node = jsNode.get("category");
			String seoName = StringUtils.EMPTY;
			if (node.has("seoName")) {
				seoName = node.get("seoName").asText();
				categoryPath=node.get("categoryPath").asText();
				categoryName=node.get("name").asText();
			}
			if (selector != null) {
				// level0
				if (selector.equals(seoName)) {
					categorySEOUrl = getPreviousAttribute(node, "categorySeoUrl");
					categorySEOUrl = categorySEOUrl.replace("|", "/");
					break;
				} else {
					Child = node.get("childCategories");
					for (JsonNode jsSubNode : Child) {
						String childSubCategorName = StringUtils.EMPTY;
						if (jsSubNode.has("seoName")) {
							childSubCategorName = jsSubNode.get("seoName").asText();
							}
						// level1
						if (selector.equals(childSubCategorName)) {
							categorySEOUrl = getPreviousAttribute(jsSubNode, "categorySeoUrl");
							categorySEOUrl = categorySEOUrl.replace("|", "/");
							categoryName=node.get("name").asText();
							categoryChildPath=jsSubNode.get("categoryPath").asText();
							break;
						} else {
							JsonNode subChild = jsSubNode.get("childCategories");
							for (JsonNode jsSubSubNode : subChild) {
								String childSubSubCategorName = StringUtils.EMPTY;
								if (jsSubSubNode.has("seoName")) {
									childSubSubCategorName = jsSubSubNode.get("seoName").asText();
								}
								// level2
								if (selector.equals(childSubSubCategorName)) {
									categorySEOUrl = getPreviousAttribute(jsSubSubNode, "categorySeoUrl");
									categorySEOUrl = categorySEOUrl.replace("|", "/");
									categoryName=node.get("name").asText();
									categorySubChildPath=jsSubSubNode.get("categoryPath").asText();
									break;
								}
							}
						}
					}
				}

			}
			if (categorySEOUrl != null) {
				break;
			}
		}
		 String queryFinalValue=null;
		 result = algoliaPLPService.getAlgoliaProductList(slash + categorySEOUrl,queryFinalValue);
		 
		}
	
		public List<Map<String, String>> getProductListMap() {
		String brandSKUValue;
		int inventoryValue;
		String nameValue;
		double startingPriceValue;
		List<LinkedHashMap<String, String>> assetsValue;
		String assetLargeImage = StringUtils.EMPTY;
		String dataSheet = StringUtils.EMPTY;
		List<Map<String, String>> plpDetailsList = new ArrayList<>();
		if (result.getHitsPerPage() > 0) {
			for (PLP product : result.getHits()) {
				inventoryValue = product.getInventory();
				nameValue = product.getName();
				brandSKUValue = product.getBrandSKU();
				startingPriceValue = product.getStartingPrice();
				assetsValue = product.getAssets();
				Map<String, String> plpDetailsMap = getProductListMapValues(inventoryValue, nameValue, brandSKUValue,
						startingPriceValue, assetsValue, assetLargeImage, dataSheet);
				plpDetailsList.add(plpDetailsMap);
			}
		}
		return plpDetailsList;
	}

	public Map<String, String> getProductListMapValues(int inventoryValue, String nameValue, String brandSKUValue,
													   double startingPriceValue, List<LinkedHashMap<String, String>> assetsValue, String assetLargeImage,
													   String dataSheet) {
		if (assetsValue != null) {
			for (LinkedHashMap<String, String> assetMap : assetsValue) {
				if (assetMap.get("type").equalsIgnoreCase("LargeImage")) {
					assetLargeImage = assetMap.get("name");
				}
				if (assetMap.get("type").equalsIgnoreCase("DataSheet")) {
					dataSheet = assetMap.get("name");
				}
			}
		}
		Map<String, String> plpDetailsMap = new HashMap<>();
		plpDetailsMap.put("inventory", getInventoryValue(inventoryValue));
		plpDetailsMap.put("LargeImage", productimagerootpath.concat(assetLargeImage));
		plpDetailsMap.put("name", nameValue);
		plpDetailsMap.put("DataSheet", datasheetrootpath.concat(dataSheet));
		plpDetailsMap.put("brandSKU", brandSKUValue);
		plpDetailsMap.put("startingPrice", String.valueOf(startingPriceValue));
		plpDetailsMap.put("estimatedShipmentDate", getEstimatedShipmentDate());
		return plpDetailsMap;
	}

	public String getInventoryValue(int inventoryValue) {
		if (inventoryValue == 0) {
			return CALL_US;
		} else {
			return String.valueOf(inventoryValue).concat(" available");
		}
	}

	public String getEstimatedShipmentDate() {
		TimeZone cstTimeZone = TimeZone.getTimeZone("CST");
		Calendar calendar = Calendar.getInstance(cstTimeZone, Locale.US);
		int date = calendar.get(Calendar.DAY_OF_MONTH);
		int month = calendar.get(Calendar.MONTH) + 1;
		int hour = calendar.get(Calendar.HOUR_OF_DAY);
		int day = calendar.get(Calendar.DAY_OF_WEEK);
		String monthStringPadded = zeroPad(month);
		if (!isIEHoliday(date, day, monthStringPadded)) {
			if (hour < 18) {
				return "Today";
			}
		}
		return getNextBusinessDay(calendar.getTime());
	}

	public boolean isIEHoliday(int date, int day, String month) {
		//1 = sunday and 7 = Saturday
		if (day == 1 || day == 7) {
			return true;
		}
		String dateToCheck = month + "-" + Integer.toString(date);
		for (String holiday : holidays) {
			if (holiday.equals(dateToCheck)) {
				return true;
			}
		}
		return false;
	}

	public String zeroPad(int month) {
		String num = Integer.toString(month);
		while (num.length() < 2) {
			num = "0" + num;
		}
		return num;
	}

	public String getNextBusinessDay(Date timeCST) {
		TimeZone cstTimeZone = TimeZone.getTimeZone("CST");
		Calendar calendar = Calendar.getInstance(cstTimeZone, Locale.US);

		calendar.setTime(timeCST);
		calendar.add(Calendar.DATE, 1);
		if (!isIEHoliday(Integer.parseInt(zeroPad(calendar.get(Calendar.DAY_OF_MONTH))),
				calendar.get(Calendar.DAY_OF_WEEK), zeroPad(calendar.get(Calendar.MONTH) + 1))) {
			return "Tomorrow";
		}
		return "Next Business Day";
	}

	private String getPreviousAttribute(JsonNode jsonObject, String attributeName) {
		String categorySEOUrl = StringUtils.EMPTY;
		if (jsonObject.has("categorySeoUrl")) {
			categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
		}

		return categorySEOUrl;
	}
 	
}
