package com.aem.ie.core.models;

import com.aem.ie.core.Service.AlgoliaPDPService;
import com.aem.ie.core.Service.CustomLengthPriceService;
import com.aem.ie.core.Service.DiscountFactorProductService;
import com.aem.ie.core.Service.OLCCModuleService;
import com.aem.ie.core.models.datamodels.PricingTier;
import com.aem.ie.core.models.datamodels.Product;
import com.aem.ie.core.utils.SelectorValueUtils;
import com.day.cq.commons.Externalizer;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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
import org.apache.sling.models.annotations.Via;
import javax.inject.Inject;
import javax.annotation.PostConstruct;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;

import static com.aem.ie.core.constants.ApplConstants.*;
import static com.aem.ie.core.constants.ApplConstants.FEET;

@Model(adaptables = { Resource.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ProductDetail {

	private static final Logger log = LoggerFactory.getLogger(ProductDetail.class);

	@OSGiService
	CustomLengthPriceService customLengthPriceService;
	@OSGiService
	OLCCModuleService olccModuleService;
	@SlingObject
	SlingHttpServletRequest request;
	@OSGiService
	AlgoliaPDPService algoliaPDPService;
	@OSGiService
	DiscountFactorProductService discountFactorProductService;
	@SlingObject
	ResourceResolver resourceResolver;
	@ValueMapValue
	@Default(values = IMAGES_ROOTPATH)
	String productimagerootpath;

	@ValueMapValue
	@Default(values = OLCC_IMAGES_ROOTPATH)
	String olccimagerootpath;

	@ValueMapValue
	@Default(values = PDP_OLCC_CUSTOMIZED_PRODUCTS_IMAGE)
	String olcccustomizedimage;

	@ValueMapValue
	@Default(values = OLCC_DATASHEET_ROOTPATH)
	String olccdatasheetrootpath;

	@ValueMapValue
	@Default(values = DATASHEET_ROOTPATH)
	String datasheetrootpath;
	@ValueMapValue
	@Default(values = TWOD_DRAWING_ROOTPATH)
	String twodrootpath;
	@ValueMapValue
	@Default(values = THREED_DRAWING_ROOTPATH)
	String threedrootpath;
	@ValueMapValue
	@Default(values = FAIRVIEW_MICROWAVE)
	String brandname;
	@ValueMapValue
	@Default(values = COAXIAL_CABLE_NAME)
	String coaxialcablename;
	@ValueMapValue
	@Default(values = FEET)
	String tablequantityforfeet;
	String productImageUrl;
	String productImageAltText;
	String skuName;
	private String reachStatusValue;
	private String rohsStatusValue;
	private String tscaStatusValue;
	private String brandSKUValue;
	private boolean hasNewValue;
	private boolean hasDiscontinuedValue;
	private int inventoryValue;
	private String baseItemSKUValue;
	private List<LinkedHashMap<String, String>> assetsValue = new ArrayList<>();
	private List<LinkedHashMap<String, String>> keySpecsValue = new ArrayList<>();
	private String nameValue;
	private String webDescValue;
	private String currencyCodeValue;
	private double unitPriceValue;
	private double startingPriceValue;
	private List<LinkedHashMap<String, Double>> pricingTiersValue = new ArrayList<>();
	private String eccnValue;
	private boolean hasOversizedValue;
	private boolean hasSellableValue;
	private String defaultColorValue;
	private List<String> colorVariationsValue = new ArrayList<>();
	private int bestSellerRankValue;
	private List<Integer> lengthVariationsValue = new ArrayList<>();
	private int lengthValue;
	private String colorValue;
	private List<String> categoryValue = new ArrayList<>();
	private String objectIDValue;
	private String productIdValue;
	private List<LinkedHashMap<String, ArrayList<String>>> hierarchicalCategories = new ArrayList<>();
	private String catName = "";
	private boolean statusDiscontinue = false;
	private String assetLargeImage = "";
	ArrayList<PricingTier> priceChart = new ArrayList<>();
	private LinkedHashMap<String, String> keySpecificationValues = new LinkedHashMap<>();
	private String displayOrder = "displayOrder";
	private String algoliaErrorResponse = SKU_NOTFOUND_MSG;
	private boolean skuNotValid;
	private boolean prop65Value;
	private String replacementSKUValue;
	NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("en", "US"));
	String seoName;
	private boolean masterCAValue;
	private String pdpLengthValue;
	private List<LinkedHashMap<String, String>> pdpLengthVariationsValue = new ArrayList<>();
	private boolean customLengthAllowedValue;
	private boolean dataSheetFlag = false;
	private boolean hasSoftwareDownload;
	LinkedHashMap<String, String> mapPDPSkuIdLength = new LinkedHashMap<>();
	boolean customStatusFlag = false;
	String customResponseValue = StringUtils.EMPTY;
	JsonObject jsonCustomResponseObject;
	private static final List<String> uomTextList = new ArrayList<>(Arrays.asList("in", "cm", "ft", "m"));
	LinkedHashMap<String, String> mapUomValueList = new LinkedHashMap<>();
	LinkedHashMap<String, String> mapUomTextList = new LinkedHashMap<>();
	private boolean blockedForSaleValue;
	private double weightValue;
	@PostConstruct
	void init() throws IOException {
		String[] selectors = request.getRequestPathInfo().getSelectors();
		seoName = SelectorValueUtils.getPDPSeoNameSelector(selectors, seoName);
		Product product = algoliaPDPService.getAlgoliaProductData(seoName);
		if (!product.isSkuIdNotFound()) {
			// Setting product variables fetched from algolia
			inventoryValue = product.getInventory();
			String notAvailable = "Not Available";
			reachStatusValue = product.getReachStatus().equals(StringUtils.EMPTY) ? notAvailable
					: product.getReachStatus();
			rohsStatusValue = product.getRoHSStatus().equals(StringUtils.EMPTY) ? notAvailable
					: product.getRoHSStatus();
			tscaStatusValue = product.gettSCAStatus().equals(StringUtils.EMPTY) ? notAvailable
					: product.gettSCAStatus();
			brandSKUValue = product.getBrandSKU();
			hasNewValue = product.isIsNew();
			hasDiscontinuedValue = product.isIsDiscontinued();
			hasOversizedValue = product.isIsOversized();
			hasSellableValue = product.isIsSellable();
			baseItemSKUValue = product.getBaseItemSKU();
			nameValue = product.getName();
			webDescValue = product.getWebDesc();
			currencyCodeValue = product.getCurrencyCode();
			unitPriceValue = product.getUnitPrice();
			startingPriceValue = product.getStartingPrice();
			eccnValue = product.geteCCN().equals(StringUtils.EMPTY) ? notAvailable : product.geteCCN();
			defaultColorValue = product.getDefaultColor();
			bestSellerRankValue = product.getBestSellerRank();
			lengthValue = product.getLength();
			colorValue = product.getColor();
			objectIDValue = product.getObjectID();
			productIdValue = product.getProductId();
			categoryValue = product.getCategory();
			assetsValue = product.getAssets();
			keySpecsValue = product.getKeySpecs();
			pricingTiersValue = product.getPricingTiers();
			colorVariationsValue = product.getColorVariations();
			lengthVariationsValue = product.getLengthVariations();
			hierarchicalCategories = product.getHierarchicalCategories();
			prop65Value = product.isIsProp65();
			replacementSKUValue = product.getReplacementSKU();
			masterCAValue = product.isIsMasterCA();
			pdpLengthValue = product.getPdpLength();
			pdpLengthVariationsValue = product.getPdpLengthVariations();
			customLengthAllowedValue = product.isIsCustomLengthAllowed();
			blockedForSaleValue = product.isIsBlockedForSale();
			weightValue = product.getWeight();
			hasSoftwareDownload=product.isHasSoftwareDownload();
			String customlength = request.getParameter("customlength");
			String uom=request.getParameter("uom");
			if(customlength!= null && uom!=null){
				String customerToken = request.getParameter("CTCustomerToken");
				String bearerToken=bearerTokenURLResponse();
				JsonObject jsonObject = new JsonObject();
				jsonObject.addProperty("currency", "USD");
				jsonObject.addProperty("masterSku", objectIDValue);
				jsonObject.addProperty("quantity", 1);
				jsonObject.addProperty("length", customlength);
				jsonObject.addProperty("unitOfMeasurement", uom);
				customResponseValue = customLengthPriceService.getCustomLengthPrice(customerToken, jsonObject.toString(),bearerToken);
				if(!JsonParser.parseString(customResponseValue).isJsonNull() && !customResponseValue.isEmpty()) {
					jsonCustomResponseObject = JsonParser.parseString(customResponseValue).getAsJsonObject();
				}
			}
		} else {
			skuNotValid = true;
		}

	}

	public boolean getStatusDiscontinue() {
		if (hasDiscontinuedValue && inventoryValue > 0) {
			statusDiscontinue = true;
		}
		return statusDiscontinue;
	}

	public String getAssetLargeImage() {
		if (assetsValue != null) {
			for (LinkedHashMap<String, String> assetMap : assetsValue) {
				if (assetMap.get("type").equalsIgnoreCase("LargeImage")) {
					assetLargeImage = assetMap.get("name");
				}
			}
		}
		return assetLargeImage;
	}

	public String getDataSheet() {
		String dataSheet = StringUtils.EMPTY;
		String dataSheetURL = StringUtils.EMPTY;
		if (assetsValue != null) {
			for (LinkedHashMap<String, String> assetMap : assetsValue) {
				if (assetMap.get("type").equalsIgnoreCase(DATASHEET)) {
					dataSheet = assetMap.get("name");
					dataSheetURL = assetMap.get("url");
				}
			}
		}
		return getOLCCDatasheetCheck() ? dataSheetURL.concat(dataSheet) : datasheetrootpath.concat(dataSheet);
	}

	public List<Map<String, String>> getViewAllWithMap() {
		List<Map<String, String>> viewAllDetailsMap = new ArrayList<>();

		Externalizer externalizer = resourceResolver.adaptTo(Externalizer.class);
		if (assetsValue != null) {
			for (LinkedHashMap<String, String> assetMap : assetsValue) {
				if (assetMap.get("type").equalsIgnoreCase("3DCAD")) {
					Map<String, String> map = new HashMap<>();
					map.put("type", THREED_DRAWINGS);
					String threedAbsolutePath = externalizer.absoluteLink(request, request.getScheme(),
							threedrootpath.concat(assetMap.get("name")));
					map.put("name", threedAbsolutePath);
					viewAllDetailsMap.add(map);
				}
				if (assetMap.get("type").equalsIgnoreCase("2DCAD")) {
					Map<String, String> map = new HashMap<>();
					map.put("type", TWOD_DRAWINGS);
					String twodAbsolutePath = externalizer.absoluteLink(request, request.getScheme(),
							twodrootpath.concat(assetMap.get("name")));
					map.put("name", twodAbsolutePath);
					viewAllDetailsMap.add(map);
				}
				if (assetMap.get("type").equalsIgnoreCase(DATASHEET)) {
					Map<String, String> map = new HashMap<>();
					map.put("type", DATASHEETSMALL);
					String datasheetAbsolutePath = externalizer.absoluteLink(request, request.getScheme(),
							getOLCCDatasheetCheck() ? assetMap.get("url").concat(assetMap.get("name")) : datasheetrootpath.concat(assetMap.get("name")));
					map.put("name", datasheetAbsolutePath);
					viewAllDetailsMap.add(map);
				}
			}
			if (hasSoftwareDownload == true) {
				Map<String, String> map = new HashMap<>();
				map.put("type", SOFTWARE_DOWNLOAD_TAG);
				map.put("name", SOFTWARE_DOWNLOAD_PATH);
				viewAllDetailsMap.add(map);
			  }
		}
		Collections.sort(viewAllDetailsMap, new Comparator<Map<String, String>>() {
			public int compare(final Map<String, String> o1, final Map<String, String> o2) {
				return o1.get("type").compareTo(o2.get("type"));
			}
		});
		return viewAllDetailsMap;
	}

	public String getCatName() {
		ArrayList<String> catNameList;
		if (hierarchicalCategories != null) {
			for (LinkedHashMap<String, ArrayList<String>> map : hierarchicalCategories) {
				for (Map.Entry<String, ArrayList<String>> map1 : map.entrySet()) {
					boolean condition1 = (map.entrySet().size() == 3) && map1.getKey().equals("lvl2");
					boolean condition2 = (map.entrySet().size() == 2) && map1.getKey().equals("lvl1");
					boolean condition3 = (map.entrySet().size() == 1) && map1.getKey().equals("lvl0");
					if (condition1 || condition2 || condition3) {
						catNameList = map1.getValue();
						if (!catNameList.isEmpty()) {
							catName = catNameList.get(0);
						}
					}
				}
			}
		}
		return catName;
	}

	public String getSkuName() {
		return skuName;
	}

	public String getReachStatusValue() {
		return reachStatusValue;
	}

	public String getRohsStatusValue() {
		return rohsStatusValue;
	}

	public String getTscaStatusValue() {
		return tscaStatusValue;
	}

	public String getBrandSKUValue() {
		return brandSKUValue;
	}

	public boolean isHasNewValue() {
		return hasNewValue;
	}

	public boolean isHasDiscontinuedValue() {
		return hasDiscontinuedValue;
	}

	public int getInventoryValue() {
		return inventoryValue;
	}

	public String getBaseItemSKUValue() {
		return baseItemSKUValue;
	}

	public List<LinkedHashMap<String, String>> getAssetsValue() {
		return new ArrayList<>(assetsValue);
	}

	public List<LinkedHashMap<String, String>> getKeySpecsValue() {
		return new ArrayList<>(keySpecsValue);
	}

	public String getNameValue() {
		return nameValue;
	}

	public String getWebDescValue() {
		return webDescValue;
	}

	public String getCurrencyCodeValue() {
		return currencyCodeValue;
	}

	public double getUnitPriceValue() {
		return unitPriceValue;
	}

	public String getStartingPriceValue() {
		currencyFormatter.setMaximumFractionDigits(2);
		currencyFormatter.setMinimumFractionDigits(2);
		return String.valueOf(currencyFormatter.format(startingPriceValue));
	}

	public List<LinkedHashMap<String, Double>> getPricingTiersValue() {
		return new ArrayList<>(pricingTiersValue);
	}

	public String getEccnValue() {
		return eccnValue;
	}

	public boolean isHasOversizedValue() {
		return hasOversizedValue;
	}

	public boolean isHasSellableValue() {
		return hasSellableValue;
	}

	public String getDefaultColorValue() {
		return defaultColorValue;
	}

	public List<String> getColorVariationsValue() {
		return new ArrayList<>(colorVariationsValue);
	}

	public int getBestSellerRankValue() {
		return bestSellerRankValue;
	}

	public List<Integer> getLengthVariationsValue() {
		return new ArrayList<>(lengthVariationsValue);
	}

	public int getLengthValue() {
		return lengthValue;
	}

	public String getColorValue() {
		return colorValue;
	}

	public List<String> getCategoryValue() {
		return new ArrayList<>(categoryValue);
	}

	public String getObjectIDValue() {
		return objectIDValue;
	}

	public String getProductIdValue() {
		return productIdValue;
	}

	public boolean getOLCCImageCheck(){
		boolean OLCCImageCheck = false;
		if (assetsValue != null) {
			for (LinkedHashMap<String, String> assetMap : assetsValue) {
				if (assetMap.get("type").equalsIgnoreCase("LargeImage")) {
					OLCCImageCheck = assetMap.get("url").equalsIgnoreCase(olccimagerootpath);
				}
			}
		}
		return OLCCImageCheck;
	}

	public boolean getOLCCDatasheetCheck(){
		boolean OLCCDatasheetCheck = false;
		if (assetsValue != null) {
			for (LinkedHashMap<String, String> assetMap : assetsValue) {
				if (assetMap.get("type").equalsIgnoreCase("DataSheet")) {
					OLCCDatasheetCheck = assetMap.get("url").equalsIgnoreCase(olccdatasheetrootpath);
				}
			}
		}
		return OLCCDatasheetCheck;
	}

	public String getProductImageUrl() {
		if(getOLCCImageCheck()){
			log.info("OLCC Asset Image: {}",olccimagerootpath.concat(olcccustomizedimage));
			return olccimagerootpath.concat(olcccustomizedimage);
		} else {
			if(assetLargeImage!=null && assetLargeImage.isEmpty()){
				assetLargeImage = getAssetLargeImage();
			}
			log.info("assetLargeImage: {}",assetLargeImage);
			return productimagerootpath.concat(assetLargeImage);
		}
	}

	public String getProductImageAltText() {
		return nameValue.concat(brandname).concat(brandSKUValue);
	}

	public boolean hasSellebleflagCheck() {
		boolean hasSellableFlag = false;
		if (hasSellableValue) {
			return hasSellableFlag;
		} else {
			return !hasSellableFlag;
		}
	}

	public boolean getRequestAQuoteLabelButton() {
		boolean requestAQuoteLabelButton = false;
		if ((inventoryValue < 1 && hasDiscontinuedValue) || (isBlockedForSaleValue())) {
			requestAQuoteLabelButton = true;
		}
		return requestAQuoteLabelButton;
	}

	public boolean getROHSLabelFlag() {
		boolean rohslabelflag = false;
		if (rohsStatusValue.equalsIgnoreCase("Compliant")) {
			rohslabelflag = true;
		}
		return rohslabelflag;
	}

	public Map<String, String> getKeySpecificationValues() {
		keySpecsValue = keySpecsValue.stream()
				.sorted(Comparator.comparing(map -> Integer.parseInt(map.get("displayOrder"))))
				.collect(Collectors.toList());
		for (LinkedHashMap<String, String> map : keySpecsValue) {
			if (!map.get("value").isEmpty()) {
				String key = map.get("name");
				String value = map.get("value");
				keySpecificationValues.put(key, value);
			}
		}
		return keySpecificationValues;
	}

	public List<PricingTier> getPriceChart() {
		currencyFormatter.setMaximumFractionDigits(2);
		currencyFormatter.setMinimumFractionDigits(2);
		if (!pricingTiersValue.isEmpty()) {
			for (LinkedHashMap<String, Double> priceItem : pricingTiersValue) {
				PricingTier pricingTierItem = new PricingTier();
				pricingTierItem.setDisplayOrder(priceItem.get(displayOrder).intValue());

				// Setting price value
				String highQuantity = "highQuantity";
				if (priceItem.get(highQuantity) != 0) {
					pricingTierItem.setPrice(String.valueOf(currencyFormatter.format(priceItem.get("price"))));
				} else {
					pricingTierItem.setHighQuantityPrice(String.valueOf(currencyFormatter.format(priceItem.get("price"))));
					pricingTierItem.setPrice("Please call for quote");
				}

				// Setting quantity range
				String range;
				if (priceItem.get(highQuantity) != 0) {
					range = String.valueOf(priceItem.get("lowQuantity").intValue()).concat("-")
							.concat(String.valueOf((priceItem.get(highQuantity).intValue())));
					pricingTierItem.setQuantityRange(range);
				} else {
					range = String.valueOf(priceItem.get("lowQuantity").intValue()).concat("+");
					pricingTierItem.setQuantityRange(range);
				}
				priceChart.add(pricingTierItem);
			}
		} else {
			PricingTier pricingTierItem = new PricingTier();
			pricingTierItem.setPrice("NA");
			pricingTierItem.setQuantityRange("NA");
			priceChart.add(pricingTierItem);
		}
		return priceChart;
	}

	public Map<String, String> getCurrentColorMatchMap() {
		LinkedHashMap<String, String> mapList = new LinkedHashMap<>();
		for (String colorItem : colorVariationsValue) {
			if (colorItem.equalsIgnoreCase(colorValue)) {
				mapList.put(colorItem, SELECTED);
			} else {
				mapList.put(colorItem, StringUtils.EMPTY);
			}
		}
		return mapList;
	}

	public Boolean getColorVariationCheckFlag() {
		Boolean colorVariationsPresent = false;
		if (!colorVariationsValue.isEmpty()) {
			colorVariationsPresent = true;
		}
		return colorVariationsPresent;
	}

	public Map<String, String> getCurrentLengthMatchMap() {
		LinkedHashMap<String, String> mapList = new LinkedHashMap<>();
		for (Integer lengthItem : lengthVariationsValue) {
			if (lengthItem.equals(lengthValue)) {
				mapList.put(String.valueOf(lengthItem), SELECTED);
			} else {
				mapList.put(String.valueOf(lengthItem), StringUtils.EMPTY);
			}
		}
		return mapList;
	}

	public Boolean getLengthVariationCheckFlag() {
		Boolean lengthVariationsPresent = false;
		if (!lengthVariationsValue.isEmpty()) {
			lengthVariationsPresent = true;
		}
		return lengthVariationsPresent;
	}

	public String getAlgoliaErrorResponse() {
		return algoliaErrorResponse;
	}

	public boolean isSkuNotValid() {
		return skuNotValid;
	}

	public boolean isProp65Value() {
		return prop65Value;
	}

	public String getReplacementSKUValue() {
		return replacementSKUValue;
	}

	public boolean isMasterCAValue() {
		return masterCAValue;
	}

	public String getPdpLengthValue() {
		return pdpLengthValue;
	}

	public boolean isCustomLengthAllowedValue() {
		return customLengthAllowedValue;
	}

	public Map<String, String> getPDPLengthValueMatchMap() {
		boolean pdpLengthValueSelected = false;
		LinkedHashMap<String, String> mapList = new LinkedHashMap<>();
		if (!pdpLengthVariationsValue.isEmpty()) {
			for (LinkedHashMap<String, String> pdpLengthVariationMapItem : pdpLengthVariationsValue) {
				if (pdpLengthVariationMapItem.get("skuLength").equals(pdpLengthValue)) {
					mapList.put(String.valueOf(pdpLengthVariationMapItem.get("skuLength")), SELECTED);
					mapPDPSkuIdLength.put(String.valueOf(pdpLengthVariationMapItem.get("skuLength")),
							String.valueOf(pdpLengthVariationMapItem.get("skuId")));
					pdpLengthValueSelected = true;
				} else {
					mapList.put(String.valueOf(pdpLengthVariationMapItem.get("skuLength")), StringUtils.EMPTY);
					mapPDPSkuIdLength.put(String.valueOf(pdpLengthVariationMapItem.get("skuLength")),
							String.valueOf(pdpLengthVariationMapItem.get("skuId")));
				}
			}
			if (!pdpLengthValueSelected) {
				mapList.put("Select length", SELECTED);
				mapPDPSkuIdLength.put("Select length", "Select length");
			}
		}
		return mapList;
	}

	public Map<String, String> getPDPSkuIdLengthMap() {
		return mapPDPSkuIdLength;
	}

	public boolean getPDPLengthVariationCheckFlag() {
		boolean lengthVariationsPresent = false;
		if (!pdpLengthVariationsValue.isEmpty()) {
			lengthVariationsPresent = true;
		}
		return lengthVariationsPresent;
	}

	public boolean isDataSheetFlag() {
		String dataSheet;
		if (assetsValue != null) {
			for (LinkedHashMap<String, String> assetMap : assetsValue) {
				if (assetMap.get("type").equalsIgnoreCase(DATASHEET)) {
					dataSheet = assetMap.get("name");
					if (!dataSheet.isEmpty()) {
						dataSheetFlag = true;
						log.info("dataSheetFlag : {}", dataSheetFlag);
					}
				}
			}
		}
		return dataSheetFlag;
	}

	public String getCoaxialCableCheck() {
		if (!categoryValue.isEmpty()) {
			for (String category : categoryValue) {
				if (category.equalsIgnoreCase(coaxialcablename)) {
					return tablequantityforfeet;
				}
			}
		}
		return StringUtils.EMPTY;
	}

	public List<PricingTier> getCalculatedCustomLengthPrice() throws IOException {
		ArrayList<PricingTier> customLengthPriceChart = new ArrayList<>();
		JsonArray jsonArray = jsonCustomResponseObject.getAsJsonArray("priceTiers");
		if(!jsonArray.isEmpty()){
			for (int counter = 0; counter < jsonArray.size(); counter++) {
				JsonObject priceTiersObject = jsonArray.get(counter).getAsJsonObject();
				PricingTier customLengthPriceTier = new PricingTier();
				if((counter + 1) != jsonArray.size()){
					String priceValue = "$"+priceTiersObject.get("price").getAsString();
					customLengthPriceTier.setPrice(priceValue);
					String minQuantity = priceTiersObject.get("minimumQuantity").getAsString() + "-";
					String maxQuantity = Integer.toString(Integer.parseInt(jsonArray.get(counter + 1).getAsJsonObject().get("minimumQuantity").getAsString())-1);
					String quantityValue = minQuantity+maxQuantity;
					customLengthPriceTier.setQuantityRange(quantityValue);
				}else{
					customLengthPriceTier.setPrice("Please call for quote");
					String minQuantity = priceTiersObject.get("minimumQuantity").getAsString();
					String quantityValue = minQuantity+"+";
					customLengthPriceTier.setQuantityRange(quantityValue);
				}
				customLengthPriceChart.add(customLengthPriceTier);
			}
		}else {
			PricingTier customLengthPriceItem = new PricingTier();
			customLengthPriceItem.setPrice("NA");
			customLengthPriceItem.setQuantityRange("NA");
			customLengthPriceChart.add(customLengthPriceItem);
		}
		return customLengthPriceChart;
	}
	public String bearerTokenURLResponse() throws IOException {
		String bearerAccessToken = "bearerToken";
		String bearerTokenURLResponse = olccModuleService.getBearerTokenUrl();
		String[] couple = bearerTokenURLResponse.split(",");
		for(int i =0; i < couple.length ; i++) {
			String[] items =couple[i].split(":");
			if(items[0].contains("access_token")) {
				bearerAccessToken = items[1].replace("\"","");
				bearerAccessToken = bearerAccessToken.replace("}","");
			}
		}
		return bearerAccessToken;
	}

	public Boolean isCustomStatusFlag(){
		String customlength = request.getParameter("customlength");
		String uom=request.getParameter("uom");
		if(customlength!= null && uom!=null){
			customStatusFlag = true;
		}
		return customStatusFlag;
	}

	public String getCustomSku(){
		String customSku = StringUtils.EMPTY;
		if(jsonCustomResponseObject != null && jsonCustomResponseObject.isJsonObject()) {
			customSku = jsonCustomResponseObject.get("sku").getAsString();
		}
		return customSku;
	}

	public String getCustomLengthUnitPrice(){
		String customPrice = StringUtils.EMPTY;
		if(jsonCustomResponseObject != null && jsonCustomResponseObject.isJsonObject()) {
			customPrice = "$"+jsonCustomResponseObject.get("customLengthUnitPrice").getAsString();
		}
		return customPrice;
	}

	public String getCustomlengthRequestParam(){
		String customlength = request.getParameter("customlength");
		return customlength;
	}
	public Map<String, String> getCustomUOMTextList(){
		String uom=request.getParameter("uom");
		for(String uomText : uomTextList){
			mapUomTextList.put(uomText,uomText.toUpperCase());
			if(uomText.equalsIgnoreCase(uom)){
				mapUomValueList.put(uomText,SELECTED);
			}else{
				mapUomValueList.put(uomText,StringUtils.EMPTY);
			}
		}
		return mapUomTextList;
	}

	public Map<String, String> getCustomValueTextList(){
		return mapUomValueList;
	}

	public boolean isBlockedForSaleValue() {
		return blockedForSaleValue;
	}

	public boolean getNoWeightOverpweightValue(){
		boolean noWeightOverpweightValue = false;
			if(weightValue == 0 || hasOversizedValue){
				noWeightOverpweightValue = true;
			}
		return noWeightOverpweightValue;
	}

}
