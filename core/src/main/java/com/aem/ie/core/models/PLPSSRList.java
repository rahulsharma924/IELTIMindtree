package com.aem.ie.core.models;

import static com.aem.ie.core.constants.ApplConstants.CALL_US;
import static com.aem.ie.core.constants.ApplConstants.CATEGORY;
import static com.aem.ie.core.constants.ApplConstants.DATASHEET_ROOTPATH;
import static com.aem.ie.core.constants.ApplConstants.IMAGES_ROOTPATH;

import java.io.IOException;
import java.io.InputStream;
import java.text.NumberFormat;
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
import javax.inject.Inject;
import java.nio.charset.StandardCharsets;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.aem.ie.core.models.datamodels.SubCategory;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
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
import com.algolia.search.models.indexing.FacetStats;
import com.algolia.search.models.indexing.SearchResult;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Model(adaptables = { Resource.class,
        SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PLPSSRList {
    private static final Logger log = LoggerFactory.getLogger(PLPSSRList.class);
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
	SearchResult<JsonObject> result1;
    SearchResult<JsonObject> pricerange;
	SearchResult<JsonObject> allCategoryVal;
    String requiredPath = StringUtils.EMPTY;
    private String categoryValuefinal = StringUtils.EMPTY;
	Map<String, Map<String, Long>> facetValues=new TreeMap<>();
    private static final List<String> holidays = new ArrayList<>(
            Arrays.asList("01-02", "05-29", "06-19", "07-04", "09-04", "11-23", "12-25"));
    String selector;
    String categorySEOUrl;
	String categoryName;
	String categoryPath;
	String categoryChildPath;
	String categorySubChildPath;
	String queryCatValue=null;
    JsonNode node;
    JsonNode Child;
	Map<String,String> categoryFilterValues=new LinkedHashMap<>();
    String linkurlcat=null;
	String bearerAccessToken=null;
	private String webattcodeval;
	List<String> webattrcode = new ArrayList<>();
	List<String> webattrcodeValues = new ArrayList<>();
	List<String> webattributeName = new ArrayList<>();
	Map<String, Map<String, Long>> facetkeyvalue= new LinkedHashMap<>();
	Map<String,String> heirachialCategories=new LinkedHashMap<>();
	String levelval=StringUtils.EMPTY;
    @SlingObject
    protected ResourceResolver resourceResolver;
	@Inject
	@Via("resource")
	protected boolean newsreleasetitle;
	@Inject
	@Via("resource")
	protected boolean bestsellertitle;
	@OSGiService
	UpdatePersonalInfoService updatePersonalInfoService;
	String heirValues=null;
	JsonNode jsonNode = null;
	Map<String, String> subCategoryLinkMap =new HashMap<>();
	String queryFinalValue=null;
	NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("en", "US"));

    @PostConstruct
    void init() throws IOException {
		String finalVal=null;
	    String queryCatgeoryName=request.getQueryString();
		if(queryCatgeoryName!=null && queryCatgeoryName.contains("refinementList")) {
		int lastIndexVal=queryCatgeoryName.lastIndexOf("=");
		if(lastIndexVal>0) {
			finalVal=queryCatgeoryName.substring(queryCatgeoryName.indexOf("%5D%5B")+6, queryCatgeoryName.indexOf("%5B0%5D")-3);
			finalVal=finalVal.replace("%20", " ");
			queryCatValue=queryCatgeoryName.substring(queryCatgeoryName.lastIndexOf("=")+1);
			queryCatValue=java.net.URLDecoder.decode(queryCatValue, StandardCharsets.UTF_8.name()); 
		}
		queryFinalValue=finalVal+":"+queryCatValue;
		}
        String slash = "/";
        String[] selectors = request.getRequestPathInfo().getSelectors();
        if(queryFinalValue!=null){
			//categorySEOUrl=	queryCatValue;
			String SelVal=queryCatValue.toLowerCase();
			selector=SelVal.replace(" ","-");
		}else {
			selector = SelectorValueUtils.getPLPSSRProductListSelector(selectors, selector);
		}
        String hitsPerPage = request.getParameter("hitsPerPage");
        String page = request.getParameter("page");
        String indexName = request.getParameter("indexName");
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
        jsonNode = objectMapper.readTree(renditionData);
        for (JsonNode jsNode : jsonNode) {
            node = jsNode.get("category");
            String seoName = StringUtils.EMPTY;
            if (node.has("seoName")) {
                seoName = node.get("seoName").asText();
            }
            if (selector != null) {
                // level0
                if (selector.equals(seoName)) {
                    categorySEOUrl = getPreviousAttribute(node, "categorySeoUrl");
                    categorySEOUrl = categorySEOUrl.replace("|", "/");
					categoryPath = node.get("categoryPath").asText();
    				categoryName = node.get("name").asText();
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
							categoryName = jsSubNode.get("name").asText();
							categoryChildPath = jsSubNode.get("categoryPath").asText();
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
									categoryName = jsSubSubNode.get("name").asText();
									categorySubChildPath = jsSubSubNode.get("categoryPath").asText();
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
		heirValues=getHierarchicalNames();
		bearerAccessToken= getbearerToken();
		if(categorySEOUrl != null || queryFinalValue !=null) {
			webattributeName = getWebattrName();
		}
        // Fetch result from algolia based on categorySeoUrl
		if(newsreleasetitle != false){
			if(hitsPerPage !=null && page != null && indexName != null){
				result = algoliaPLPService.getAlgoliaNewReleasesPLPList(hitsPerPage,page, indexName);
			} else if(hitsPerPage !=null && indexName != null){
				result = algoliaPLPService.getAlgoliaNewReleasesPLPList(hitsPerPage,page, indexName);
			} else{
				result = algoliaPLPService.getAlgoliaNewReleasesList(queryFinalValue);
				if(queryFinalValue!=null) {
					result1 = algoliaPLPService.getAlgoliaCategoryList(slash + categorySEOUrl,bearerAccessToken,categoryName,webattributeName);
				}
			}
		} else if(bestsellertitle != false){
			if(hitsPerPage !=null && page != null && indexName != null){
				result = algoliaPLPService.getAlgoliaBestSellersPLPList(hitsPerPage,page, indexName);
			} else if(hitsPerPage !=null && indexName != null){
				result = algoliaPLPService.getAlgoliaBestSellersPLPList(hitsPerPage,page, indexName);
			} else{
				result = algoliaPLPService.getAlgoliaBestSellersList(queryFinalValue);
				if(queryFinalValue!=null) {
					result1 = algoliaPLPService.getAlgoliaCategoryList(slash + categorySEOUrl,bearerAccessToken,categoryName,webattributeName);
				}
			}
		} else if(categorySEOUrl == null){
			if(hitsPerPage !=null && page != null && indexName != null){
				result = algoliaPLPService.getAlgoliaAllPLPList(hitsPerPage,page, indexName);
				log.info("AlgoliaAllPLPList result Facets size value : {}",result.getFacets().size());
				log.info("AlgoliaAllPLPList result NbHits: {}",result.getNbHits());
			} else{
				result = algoliaPLPService.getAlgoliaAllList();
				log.info("AlgoliaAllList result Facets size value : {}",result.getFacets().size());
				log.info("AlgoliaAllList result NbHits: {}",result.getNbHits());
			}
		} else if(hitsPerPage !=null && page != null && indexName != null){
			result = algoliaPLPService.getAlgoliaPLPList(slash + categorySEOUrl,hitsPerPage,page, indexName);
		} else if(hitsPerPage !=null && indexName != null){
			result = algoliaPLPService.getAlgoliaPLPList(slash + categorySEOUrl,hitsPerPage,page, indexName);
		} else{
			result = algoliaPLPService.getAlgoliaProductList(slash + categorySEOUrl,queryFinalValue);
		}
		
        categoryValuefinal = SelectorValueUtils.getPLPSSRSelector(selectors, selector, categoryValuefinal);
		if(categoryValuefinal != null && !categoryValuefinal.isEmpty()) {
        if (!categoryValuefinal.equals("all")) {
			result1 = algoliaPLPService.getAlgoliaCategoryList(slash + categorySEOUrl,bearerAccessToken,categoryName,webattributeName);
			log.info("AlgoliaCategoryList result1 Facets size value : {}",result1.getFacets().size());
			log.info("AlgoliaCategoryList result1 NbHits: {}",result1.getNbHits());
			if(heirValues!=null) {
		        pricerange=algoliaPLPService.getPricerangeValues(heirValues);
		    } 
		 }
	    
	   }
    }

	public String getBestSellerClass(){
		String bestseller = bestsellertitle == true ? "fm-bs-data" : StringUtils.EMPTY;
		return bestseller;
	}

	public String getNewReleasesClass(){
		String newRelease = newsreleasetitle == true ? "fm-nr-data" : StringUtils.EMPTY;
		return newRelease;
	}

	public String getAllPageClass(){
		String allPageClass = StringUtils.EMPTY;
		if(selector != null && selector.equals("all")){
			allPageClass = "fm-all-data";
		}
		return allPageClass;
	}

	public String getClearAllClass(){
		String clearAllClass = StringUtils.EMPTY;
		if((selector != null && selector.equals("all")) || newsreleasetitle || bestsellertitle){
			clearAllClass = "d-none";
		}
		return clearAllClass;
	}


	public Map<String,Long> getnewsReleaseFacetFilterValues(){
    	String facetKey=null;
		Map<String, Long> facetallmap=null;
    	Map<String, Long> facetallmapval=new HashMap<>();
		Map<String, Map<String, Long>> newsFilters=result.getFacets();
		if(newsFilters!=null && !newsFilters.isEmpty()) {
		Set<String> allkeys=newsFilters.keySet();
		Iterator<String> itr=allkeys.iterator();
		while(itr.hasNext()) {
			facetKey=itr.next();
			if(facetKey.equals("hierarchicalCategories.lvl0")) {
				facetallmap=newsFilters.get(facetKey);
				Set<String> allkeyValues=facetallmap.keySet();
				Iterator<String> itr1=allkeyValues.iterator();
				while(itr1.hasNext()) {
					String facetallKey=itr1.next();
					Long facetmapvalues=facetallmap.get(facetallKey);
					facetallmapval.put(facetallKey, facetmapvalues);
				}
			}
		  }
		}
		return facetallmapval;
    }
	 public Map<Float,Float> getPriceRangeValues(){
		Map<Float,Float> facetstausvalues=new LinkedHashMap<>();
		Map<String,FacetStats> facetstaus=null;
		if(heirValues != null && !heirValues.isEmpty()) {
			facetstaus=new LinkedHashMap<>();
    		facetstaus=pricerange.getFacets_stats();
		}
		else if(newsreleasetitle != false){
			facetstaus=new LinkedHashMap<>();
			facetstaus= result.getFacets_stats();
		}else if(bestsellertitle != false) {
			facetstaus=new LinkedHashMap<>();
			facetstaus= result.getFacets_stats();
		}else {
			facetstaus=result.getFacets_stats();	
		}
    	if(facetstaus!=null && !facetstaus.isEmpty()) {
    	if(facetstaus.containsKey("startingPrice")) {
    		FacetStats faceVal=facetstaus.get("startingPrice");
    		Float minval=faceVal.getMin();
    		Float maxval=faceVal.getMax();
    		facetstausvalues.put(minval, maxval);
    	  }
    	}
    	return facetstausvalues;
    }
    public String getHierarchicalNames(){
    	if(categoryPath != null) {
    		levelval="hierarchicalCategories.lvl0:" + categoryPath;
    	}
    	if(categoryChildPath !=null) {
    		String categoryChildPath1=categoryChildPath.replace("|",">");
    		String[] pathtoken=categoryChildPath1.split(">");
    		if(pathtoken.length > 0) {
    			levelval="hierarchicalCategories.lvl1:"+ pathtoken[0] +" > " + pathtoken[1];
    		}
    	}
    	if(categorySubChildPath !=null) {
    		String categorysubChildPath1=categorySubChildPath.replace("|",">");
			String[] pathtoken=categorysubChildPath1.split(">");
			if(pathtoken.length > 0) {
				levelval="hierarchicalCategories.lvl2:" + pathtoken[0] +" > " + pathtoken[1]+" > " + pathtoken[2];
			}
    	}
    	return levelval;
    }
	public Map<String,String> getBreadcrumbValues(){
		Map<String,String> categoryPathValues=new LinkedHashMap<>();
        	String allHtmlLink= "/category/all.html";
    		String linkurlsubcat=StringUtils.EMPTY;
       		List<String> categoryname=new ArrayList<>();
    		List<String> categoryseourl=new ArrayList<>();
    		if (categoryValuefinal != null && !categoryValuefinal.equals("all")) {
    		if (result.getHitsPerPage() > 0) {
                for (PLP product : result.getHits()) {
                 categoryname=product.getCategory();
                 categoryseourl=product.getCategorySEOURL();
                }
            
    		String catvall1=categoryseourl.get(1).replace("/",">");
    		String[] pathtoken=catvall1.split(">");
    		if(categoryseourl.get(0).replace("/","").equals(categoryValuefinal)) {
                	categoryPathValues.put(categoryname.get(0), "");
    				categoryFilterValues.put(categoryname.get(0), allHtmlLink);
               	}
    		if(!pathtoken[2].isEmpty() && pathtoken[2] != null && pathtoken[2].equals(categoryValuefinal)) {
    			if(categoryseourl.size()>0) {
    			linkurlcat= CATEGORY +categoryseourl.get(0)+".html";
            	categoryPathValues.put(categoryname.get(0), linkurlcat);
				categoryFilterValues.put(categoryname.get(0), allHtmlLink);
    			}
    			categoryPathValues.put(categoryname.get(1), "");
    			categoryFilterValues.put(categoryname.get(0)+" > "+categoryname.get(1), linkurlcat);
           	}
    		String catvall2=categoryseourl.get(2).replace("/",">");
    		String[] pathtokenl2=catvall2.split(">");
    		if(pathtokenl2.length>3 && pathtokenl2[3]!=null && pathtokenl2[3].equals(categoryValuefinal)) {
    			for(int i=0;i<categoryseourl.size()-1;i++) {
    				if(i==0) {
    			    linkurlcat= CATEGORY+categoryseourl.get(0)+".html";
    				categoryPathValues.put(categoryname.get(0), linkurlcat);
    				categoryFilterValues.put(categoryname.get(0), allHtmlLink);
    				}else {
    					linkurlsubcat= CATEGORY+categoryseourl.get(1)+".html";
    					categoryPathValues.put(categoryname.get(1), linkurlsubcat);
    					categoryFilterValues.put(categoryname.get(0)+" > "+categoryname.get(1), linkurlcat);
    				}
    			}
    			categoryPathValues.put(categoryname.get(2), "");
    			categoryFilterValues.put(categoryname.get(0)+" > "+categoryname.get(1)+" > "+categoryname.get(2), linkurlsubcat);
    		  }
			 }
    		}
			return categoryPathValues;
    }
    public Map<String,String> getCategoryFilterValueNames(){
    	    if(categoryFilterValues.isEmpty())   { 
			getBreadcrumbValues();
			}
			if(queryCatValue!=null) {
			queryCatValue=queryCatValue.replace("%20", " ");
			if(categoryPath != null) {
				linkurlcat=	CATEGORY+categorySEOUrl+".html";
			}
			if(categoryChildPath !=null) {
				String[] tokens=categorySEOUrl.split("/");
				if(tokens.length>0) {
					linkurlcat=	CATEGORY+tokens[1]+".html";	
				}
			}
			if(categorySubChildPath !=null) {
				String[] tokens=categorySEOUrl.split("/");
				if(tokens.length>0) {
					linkurlcat=	CATEGORY+tokens[2]+".html";	
				}
					
			}
			categoryFilterValues.put(queryCatValue,linkurlcat);
			}
		return categoryFilterValues;
	}

    public Map<String, Map<String, Long>> getFacetListMap() {
		//webattrcodeVal.clear();
		List<String> webelestore = new ArrayList<>();
		Map<String, Long> facetsValuestype2=null;
		String webelekey=null;
		String webattval=null;
		//webelestore=getWebattrName();
		if(result1 != null && !result1.getFacets().isEmpty() && !result1.getFacets().containsKey("startingPrice")) {
			facetValues=result1.getFacets();
			ListIterator<String> itr=webattributeName.listIterator();
			ListIterator<String> itr1=webattrcode.listIterator();
			while(itr.hasNext() && itr1.hasNext()) {
				webelekey=itr.next();
				webattval=itr1.next();
				facetsValuestype2=getFacetValueMap(webelekey);
				if(facetsValuestype2!=null && !facetsValuestype2.isEmpty()) {
					webelestore.add(webattval);	
					facetkeyvalue.put(webelekey, facetsValuestype2);
				}
				
			}
			}
		webattrcodeValues=webelestore;
		return facetkeyvalue;
	}
	public Map<String, Long> getFacetValueMap(String webelekey) {
			Map<String, Long> facetsValuestype1=new LinkedHashMap<>();
			Map<String, Long> facetsValuestype=facetValues.get(webelekey);
			if(facetsValuestype!=null) {
			Set<String> keyValues1=facetsValuestype.keySet();
			Iterator<String> itr1=keyValues1.iterator();
			while(itr1.hasNext()) {
				String facetKey1=itr1.next();
				Long facetmapvalues=facetsValuestype.get(facetKey1);
				facetsValuestype1.put(facetKey1, facetmapvalues);
			}}
		return facetsValuestype1;
	}
	public Map<String, Long> getFacetListValueMap() {
		Map<String, Long> facetsValuestype=null;
		Map<String, Long> facetsValuestype1=new LinkedHashMap<>();
		Set<String> keyValues=facetkeyvalue.keySet();
		Iterator<String> itr=keyValues.iterator();
		while(itr.hasNext()) {
			String facetKey=itr.next();
			facetsValuestype=facetkeyvalue.get(facetKey);
			Set<String> keyValues1=facetsValuestype.keySet();
			Iterator<String> itr1=keyValues1.iterator();
			while(itr1.hasNext()) {
				String facetKey1=itr1.next();
				Long facetmapvalues=facetsValuestype.get(facetKey1);
				facetsValuestype1.put(facetKey1, facetmapvalues);
			}
		}
		return facetsValuestype1;
	}
	public List<SubCategory> getwaveguideCategoryValues(){
		String facetKey=null;
		Map<String, Map<String, Long>> val1=(result1  !=null && !result1.getFacets().isEmpty()) ? result1.getFacets() : new HashMap<>();
		Map<String, Long> facetallmapval=new HashMap<>();
		List<SubCategory> subCategoryList = new ArrayList<>();
		if(val1 != null && !val1.isEmpty()) {
		Set<String> allkeys=val1.keySet();
		Iterator<String> itr=allkeys.iterator();
		while(itr.hasNext()) {
			facetKey=itr.next();
			
			if(facetKey.equals("hierarchicalCategories.lvl1")) {
				Map<String, Long> facetallmap=val1.get(facetKey);
				Set<String> allkeyValues=facetallmap.keySet();
				Iterator<String> itr1=allkeyValues.iterator();
				while(itr1.hasNext()) {
					String facetallKey=itr1.next();
					if(categoryName != null && facetallKey.contains(categoryName)) {
						Long facetmapvalues=facetallmap.get(facetallKey);
						//get jsonArray of categoryName and then filter it with facetallKey(categoryPath) to get categoryUrl
						JsonNode categoryNameNode = getCategoryNameArray(categoryName);
						if(categoryNameNode != null && categoryNameNode.size() != 0){
							SubCategory subCategory = new SubCategory();
							for(JsonNode node1 : categoryNameNode){
								Boolean node1Boolean = node1.get("categoryPath").asText().equalsIgnoreCase(facetallKey.replace(" > ","|"));
								if(node1Boolean){
									subCategoryLinkMap.put(facetallKey,node1.get("categoryUrl").asText().toString());
									subCategory.setFacetAllKeyValue(facetallKey);
									subCategory.setFacetAllCountValue(facetallmap.get(facetallKey).toString());
									subCategory.setCategoryUrlValue(node1.get("categoryUrl").asText().toString());
								} else{
									if(node1.get("childCategories") !=null){
										JsonNode node1childCategories = node1.get("childCategories");
										for(JsonNode node2 : node1childCategories){
											Boolean node2Boolean = node2.get("categoryPath").asText().equalsIgnoreCase(facetallKey.replace(">","|"));
											if(node2Boolean){
												subCategoryLinkMap.put(facetallKey,node2.get("categoryUrl").asText().toString());
												subCategory.setFacetAllKeyValue(facetallKey.toString());
												subCategory.setFacetAllCountValue(facetallmap.get(facetallKey).toString());
												subCategory.setCategoryUrlValue(node2.get("categoryUrl").asText().toString());
											}
										}
									}

								}
							}
							subCategoryList.add(subCategory);
						}
					facetallmapval.put(facetallKey, facetmapvalues);
					}
				}
			}
		  }
		}
		return subCategoryList;
	}

	public Map<String, String> getSubCategoryLinkMap(){
		return subCategoryLinkMap;
	}

	public JsonNode getCategoryNameArray(String categoryName){
		JsonNode childCategoriesNode = null;
		for (JsonNode jsNode : jsonNode) {
			JsonNode node0 = jsNode.get("category");
			Boolean categoryBoolean0 = node0.get("name").asText().equalsIgnoreCase(categoryName);
			if(categoryBoolean0){
				childCategoriesNode = node0.get("childCategories");
			} 
		}
		return childCategoriesNode;
	}

		public List<SubCategory> getAllFacetListValueMap() {
			List<SubCategory> listAllCategory = new ArrayList<>();
			String facetKey=null;
			log.info("getAllFacetListValueMap method categoryValuefinal value : {}",categoryValuefinal);
			if (categoryValuefinal!=null && categoryValuefinal.equals("all")) {
			log.info("getAllFacetListValueMap method Facets result size value : {}",result.getFacets().size());
			Map<String, Map<String, Long>> val1= (result  !=null && !result.getFacets().isEmpty()) ? result.getFacets() : new HashMap<>();
			Map<String, Long> facetallmap=new LinkedHashMap<>();
			Map<String, Long> facetallmapval=new LinkedHashMap<>();
			if(val1 != null && !val1.isEmpty()) {
			Set<String> allkeys=val1.keySet();
			Iterator<String> itr=allkeys.iterator();
			while(itr.hasNext()) {
				facetKey=itr.next();
				if(facetKey.equals("hierarchicalCategories.lvl0")) {
					facetallmap=val1.get(facetKey);
				}
			}	
			Set<String> allkeyValues=facetallmap.keySet();
			Iterator<String> itr1=allkeyValues.iterator();
			while(itr1.hasNext()) {
				//category
				String facetallKey=itr1.next();
				//number
				Long facetmapvalues=facetallmap.get(facetallKey);
				SubCategory subCategory = new SubCategory();
				if((facetallKey != null) && !facetallKey.isEmpty()){
					JsonNode childCategoriesNode = null;
					for (JsonNode jsNode : jsonNode) {
						JsonNode node0 = jsNode.get("category");
						Boolean categoryBoolean0 = node0.get("categoryPath").asText().equalsIgnoreCase(facetallKey);
						if (categoryBoolean0) {
							String allCategoryUrlValue = node0.get("categoryUrl").asText().toString();
							subCategory.setCategoryUrlValue(allCategoryUrlValue);
						}
					}
				}
				subCategory.setFacetAllKeyValue(facetallKey);
				subCategory.setFacetAllCountValue(facetmapvalues.toString());
				facetallmapval.put(facetallKey, facetmapvalues);
				listAllCategory.add(subCategory);

			  }
			}
			}
			return listAllCategory;
		}
		public String getbearerToken() throws IOException {
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
		  public Map<String,String> getAttributeCode() {
			  Map<String,String> webelestore = new LinkedHashMap<>();
			  Map<String, Long> facetsValuestype2=null;
				String webelekey=null;
				String webattval=null;
				if(!result1.getFacets().containsKey("startingPrice")) {
					facetValues=result1.getFacets();
					ListIterator<String> itr=webattributeName.listIterator();
					ListIterator<String> itr1=webattrcode.listIterator();
					while(itr.hasNext() && itr1.hasNext()) {
						webelekey=itr.next();
						webattval=itr1.next();
						facetsValuestype2=getFacetValueMap(webelekey);
						if(!facetsValuestype2.isEmpty()) {
							webelestore.put(webelekey, webattval);	
						}
					}
					}
				return webelestore;
			}
		       public List<String> getWebattrName() {
		    	 List<String> webelestore = new ArrayList<>();
		 		String response = null;
		 		String webelements = null;
		 		String categoryNameVal=null;
				if(queryFinalValue!=null){
			     categoryNameVal= queryCatValue.replaceAll(" ", "%20");
		       }else{
		 		if(categoryPath != null) {
		 		categoryNameVal=categoryName.replaceAll(" ", "%20");
		 		}else if(categoryChildPath != null) {
		 			String categoryChildPath1=categoryChildPath.replace("|",">");
					String[] pathtoken=categoryChildPath1.split(">");
					if(pathtoken.length > 0) {
						String name=pathtoken[0];
		 			    categoryNameVal=name.replaceAll(" ", "%20");
					}
		 		}else if(categorySubChildPath != null) {
		 			String categorysubChildPath1=categorySubChildPath.replace("|",">");
					String[] pathtoken=categorysubChildPath1.split(">");
					if(pathtoken.length > 0) {
						String name=pathtoken[0];
		 			    categoryNameVal=name.replaceAll(" ", "%20");
					}
				  }
		 		}
		 		try {
		 			
					response = getPLPFilterAttributeService.getPLPFilterAttributes(bearerAccessToken, "FM", categoryNameVal);
					
					JsonObject jsonObject = JsonParser.parseString(response).getAsJsonObject();
					boolean hasFacetattrValue=jsonObject.get("hasFacetAttribute").getAsBoolean();
					if(hasFacetattrValue!= false) {
					JsonArray atrrVal = jsonObject.get("attributes").getAsJsonArray();
					Iterator<JsonElement> jitr = atrrVal.iterator();
					while (jitr.hasNext()) {
						JsonElement jelement = jitr.next();
						JsonObject jobj = jelement.getAsJsonObject();
						webelements = jobj.get("webAttributeName").getAsString();
						webattcodeval=jobj.get("attributeCode").getAsString();
						webattrcode.add(webattcodeval);
						webelestore.add(webelements);
					}
				}else {
					String categoryNameValue =null;
				  if(queryFinalValue!=null){
					categoryNameValue = queryCatValue.replaceAll(" ", "%20");
				  }else {
					categoryNameValue = categoryName.replaceAll(" ", "%20");
				  }
					//2nd micro service call when hasFacetAttribute is false
					response = getPLPFilterAttributeService.getPLPFilterAttributes(bearerAccessToken, "FM", categoryNameValue);
					jsonObject = JsonParser.parseString(response).getAsJsonObject();
					boolean hasFacetattrValuel0=jsonObject.get("hasFacetAttribute").getAsBoolean();
					if(hasFacetattrValuel0!= false) {
					JsonArray atrrVal = jsonObject.get("attributes").getAsJsonArray();
					Iterator<JsonElement> jitr = atrrVal.iterator();
					while (jitr.hasNext()) {
						JsonElement jelement = jitr.next();
						JsonObject jobj = jelement.getAsJsonObject();
						webelements = jobj.get("webAttributeName").getAsString();
						webattcodeval=jobj.get("attributeCode").getAsString();
						webattrcode.add(webattcodeval);
						webelestore.add(webelements);
					}
					}else {
						webelestore.add("false");
					}
				  }
		 		}catch (IOException e) {
					log.error("IO Exception occured while getting the results from entity {}" , e.getMessage());
				} 
				return webelestore;
			}

    public String getHitsPerPage(){
        String hitsPerPageValue = StringUtils.EMPTY;
        if(result.getHitsPerPage() !=null){
            hitsPerPageValue = String.valueOf(result.getHitsPerPage());
        }
        return hitsPerPageValue;
    }

    public String getShowResults(){
        String nbHitsValue = StringUtils.EMPTY;
        if(result.getNbHits() !=null){
            nbHitsValue = String.valueOf(result.getNbHits());
        }
        return nbHitsValue;
    }

    public String getNbPages(){
        String nbPagesValue = StringUtils.EMPTY;
        if(result.getNbPages() !=null){
            nbPagesValue = String.valueOf(result.getNbPages());
        }
        return nbPagesValue;
    }

    public String getPage(){
        String pageValue = StringUtils.EMPTY;
        if(result.getPage() !=null){
            pageValue = String.valueOf(result.getPage()+1);
        }
        return pageValue;
    }

    public String getActivePageDataValue(){
        String activePageDataValue = StringUtils.EMPTY;
        if(result.getPage() !=null){
            activePageDataValue = String.valueOf(result.getPage());
        }
        return activePageDataValue;
    }

    public String getPreviousPage(){
        String previousPageValue = StringUtils.EMPTY;
        if(result.getPage() !=null){
            previousPageValue = String.valueOf(result.getPage()-1);
        }
        return previousPageValue;
    }

    public String getDoubleArrowLastPageValue(){
        String nbPagesValue = StringUtils.EMPTY;
        if(result.getNbPages() !=null){
            nbPagesValue = String.valueOf(result.getNbPages()-1);
        }
        return nbPagesValue;
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
                        startingPriceValue, assetsValue, assetLargeImage, dataSheet,product);
                plpDetailsList.add(plpDetailsMap);
            }
        }
        return plpDetailsList;
    }

    public Map<String, String> getProductListMapValues(int inventoryValue, String nameValue, String brandSKUValue,
                                                       double startingPriceValue, List<LinkedHashMap<String, String>> assetsValue, String assetLargeImage,
                                                       String dataSheet,PLP product) {
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
        plpDetailsMap.put("inventory", getInventoryValue(inventoryValue,product,categorySEOUrl));
        plpDetailsMap.put("tableInventoryValue", getTableInventoryValue(inventoryValue,product,categorySEOUrl));
        plpDetailsMap.put("LargeImage", productimagerootpath.concat(assetLargeImage));
        plpDetailsMap.put("name", nameValue);
        plpDetailsMap.put("DataSheet", datasheetrootpath.concat(dataSheet));
        plpDetailsMap.put("analyticPLPDatasheetName", getDataSheetName(assetsValue,getCategory(product),nameValue));
        plpDetailsMap.put("dataSheetItemHidden", dataSheet.equalsIgnoreCase(StringUtils.EMPTY)? "item-hidden" : "");
        plpDetailsMap.put("startingPrice", getStartingPriceValue(startingPriceValue));
        plpDetailsMap.put("estimatedShipmentDate", getEstimatedShipmentDate());
        plpDetailsMap.put("SKUSlashCheck", product.getBrandSKU().replace("/","-"));
        plpDetailsMap.put("seoName", product.getSeoName());
        plpDetailsMap.put("brandName", "Fairview Microwave");
        plpDetailsMap.put("category", getCategory(product));
        plpDetailsMap.put("isMasterCA", product.isIsMasterCA() == true ? "d-none" : StringUtils.EMPTY);
        plpDetailsMap.put("brandSKU", product.getBrandSKU());
        plpDetailsMap.put("viewProductStatusFlag", getViewProductStatusFlag(product));
        plpDetailsMap.put("seoUrl", getSeoURL(product));
        plpDetailsMap.put("productId", product.getProductId());
        plpDetailsMap.put("unitPrice", Double.toString(product.getUnitPrice()));
        plpDetailsMap.put("length", Integer.toString(product.getLength()));
        plpDetailsMap.put("color", product.getColor());
        plpDetailsMap.put("bestSellerRank", Integer.toString(product.getBestSellerRank()));
        plpDetailsMap.put("currencyCode", product.getCurrencyCode());
        plpDetailsMap.put("inventoryActualCount", Integer.toString(product.getInventory()));
        plpDetailsMap.put("isOversized", Boolean.toString(product.isIsOversized()));
        plpDetailsMap.put("isNew", Boolean.toString(product.isIsNew()));
        return plpDetailsMap;
    }

    public String getSeoURL(PLP product){
        String seoUrl = StringUtils.EMPTY;
		int size = product.getCategorySEOURL().size();
        if(!product.getCategorySEOURL().isEmpty() && !product.getSeoName().isEmpty() && size >0){
			String categorySeoUrlValue = null;
			if (size >= 3) {
				categorySeoUrlValue = product.getCategorySEOURL().get(2);
			} else if (size == 2) {
				categorySeoUrlValue = product.getCategorySEOURL().get(1);
			} else {
				categorySeoUrlValue = product.getCategorySEOURL().get(0);
			}
            seoUrl = "/product"+ (!categorySeoUrlValue.equalsIgnoreCase("null") ? categorySeoUrlValue : StringUtils.EMPTY) +"/"+product.getSeoName()+".html";
        }
        return seoUrl;
    }

    public String getDataSheetName(List<LinkedHashMap<String, String>> assetsValue,String categoryString,String nameValue){
        String analyticplpdatasheetValue = null;
        if(assetsValue!=null && !assetsValue.isEmpty()){
            analyticplpdatasheetValue = assetsValue.get(0).get("name")+"@@"+assetsValue.get(0).get("type")+"@@"+nameValue+"@@"+categoryString;
        }else{
            analyticplpdatasheetValue = "@@@@" + nameValue + "@@" + categoryString;
        }
        return (!analyticplpdatasheetValue.equalsIgnoreCase("null")) ? analyticplpdatasheetValue : StringUtils.EMPTY;
    }

    public String getViewProductStatusFlag(PLP product){
        if((product.getInventory() > 0 && product.isIsSellable() == false) || (product.getInventory() <= 0 && product.isIsDiscontinued() == true) || (product.isIsMasterCA() == true || product.isIsBlockedForSale() == true)){
            return "true";
        } else {
            return "false";
        }
    }

    public String getInventoryValue(int inventoryValue,PLP product,String categorySEOUrl) {
        if (product.isIsMasterCA() == true || product.isIsBlockedForSale() == true) {
            return "";
        } else {
            if(inventoryValue > 0){
                return String.valueOf(inventoryValue).concat(" available");
            } else {
                return categorySEOUrl == null ? CALL_US : (categorySEOUrl.equalsIgnoreCase("rf-cable-assemblies") ? "" : CALL_US);
            }
        }
    }
    public String getTableInventoryValue(int inventoryValue,PLP product,String categorySEOUrl) {
        if (product.isIsMasterCA() == true || product.isIsBlockedForSale() == true) {
            return "";
        } else {
            if(inventoryValue > 0){
                return String.valueOf(inventoryValue);
            } else {
                return categorySEOUrl == null ? CALL_US : (categorySEOUrl.equalsIgnoreCase("rf-cable-assemblies") ? "" : CALL_US);
            }
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
        if (!isIEHoliday(date, day, monthStringPadded) && hour < 18) {
            return "Today";
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
		//Here it will chek for future or next day is holiday or working day.
        if (!isIEHoliday(Integer.parseInt(zeroPad(calendar.get(Calendar.DAY_OF_MONTH))),
                calendar.get(Calendar.DAY_OF_WEEK), zeroPad(calendar.get(Calendar.MONTH) + 1))) {
            return "Tomorrow";
        }
        return "Next Business Day";
    }

    private String getPreviousAttribute(JsonNode jsonObject, String attributeName) {
        String previousAttributeCategorySEOUrl = StringUtils.EMPTY;
        if (jsonObject.has("categorySeoUrl")) {
			previousAttributeCategorySEOUrl = jsonObject.get("categorySeoUrl").asText();
        }

        return previousAttributeCategorySEOUrl;
    }

    public String getCategory(PLP product){
        String category = StringUtils.EMPTY;
        if(product.getCategory() != null && !product.getCategory().isEmpty()){
            List<String> categoryList = product.getCategory();
            StringBuilder commaSeparatedCategory = new StringBuilder();
            for(String str : categoryList){
                commaSeparatedCategory.append(str).append(",");
            }
            if(commaSeparatedCategory.length() > 0){
                commaSeparatedCategory.setLength(commaSeparatedCategory.length()-1);
            }
            category = commaSeparatedCategory.toString();
        }
        return category;
    }

	public String getStartingPriceValue(double startingPriceValue) {
		currencyFormatter.setMaximumFractionDigits(2);
		currencyFormatter.setMinimumFractionDigits(2);
	return String.valueOf(currencyFormatter.format(startingPriceValue));
	}

}
