package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.AlgoliaPLPService;
import com.aem.ie.core.Service.GetPLPFilterAttributeService;
import com.aem.ie.core.configuration.AlgoliaConfig;
import com.aem.ie.core.models.datamodels.PLP;
import com.algolia.search.DefaultSearchClient;
import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.algolia.search.exceptions.AlgoliaApiException;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component(service = AlgoliaPLPService.class, immediate = true)
@Designate(ocd = AlgoliaConfig.class)
public class AlgoliaPLPServiceImpl implements AlgoliaPLPService {
	private AlgoliaConfig algoliaConfig;
	@Reference
	GetPLPFilterAttributeService getPLPFilterAttributeService;
	private static final Logger log = LoggerFactory.getLogger(AlgoliaPLPServiceImpl.class);
	List<String> webattrcode = new ArrayList<>();
	/*
	 * @Reference private transient GetPLPFilterAttributeService
	 * getPLPFilterAttributeService;
	 */
	@Activate
	protected void activate(AlgoliaConfig algoliaConfig) {
		this.algoliaConfig = algoliaConfig;
	}

	@Override
	public SearchResult<PLP> getAlgoliaProductList(String categorySeoUrlValue,String queryFinalValue) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(algoliaConfig.indexInuse(), PLP.class);
		String filters = new String(
				"isSellable:true AND hasCategory:true AND isInPlp:true AND categorySEOURL:" + categorySeoUrlValue);
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaProductList  categorySeoUrlValue: {}",categorySeoUrlValue);
			log.info("AlgoliaProductList  queryFinalValue: {}",queryFinalValue);
			log.info("AlgoliaProductList  filters: {}",filters);
			if (!categorySeoUrlValue.equalsIgnoreCase("/null") && !categorySeoUrlValue.isEmpty()) {
				if(queryFinalValue!=null) {
					searchResult = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList(queryFinalValue))).setFilters(filters).setHitsPerPage(12));
				}else {
				searchResult = index.search(new Query("").setFilters(filters).setHitsPerPage(12));
				}
			} else {
				searchResult = index.search(new Query("")
						.setFilters("isSellable:true AND hasCategory:true AND isInPlp:true").setHitsPerPage(12));
			}
			log.info("AlgoliaProductList searchResult NbHits: {}",searchResult.getNbHits());
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}
		return searchResult;
	}

	public SearchResult<PLP> getAlgoliaPLPList(String categorySeoUrlValue,String hitsPerPage,String page, String indexName) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(indexName, PLP.class);
		String filters = new String(
				"isSellable:true AND hasCategory:true AND isInPlp:true AND categorySEOURL:" + categorySeoUrlValue);
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaPLPList  indexName: {}",indexName);
			log.info("AlgoliaPLPList  categorySeoUrlValue: {}",categorySeoUrlValue);
			log.info("AlgoliaPLPList  hitsPerPage: {}",hitsPerPage);
			log.info("AlgoliaPLPList  page: {}",page);
			log.info("AlgoliaPLPList  filters: {}",filters);
			if (!categorySeoUrlValue.isEmpty() && !hitsPerPage.isEmpty() && !indexName.isEmpty()) {
				if(page!=null){
					searchResult = index.search(new Query("").setFilters(filters).setPage(Integer.valueOf(page)).setHitsPerPage(Integer.valueOf(hitsPerPage)));
				} else{
					searchResult = index.search(new Query("").setFilters(filters).setHitsPerPage(Integer.valueOf(hitsPerPage)));
				}
			} else {
				index = client.initIndex(algoliaConfig.indexInuse(), PLP.class);
				searchResult = index.search(new Query("")
						.setFilters("isSellable:true AND hasCategory:true AND isInPlp:true").setHitsPerPage(Integer.valueOf(hitsPerPage)));
			}
			log.info("AlgoliaPLPList searchResult NbHits: {}",searchResult.getNbHits());
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}

		return searchResult;
	}
	@Override
	public SearchResult<PLP> getAlgoliaNewReleasesList(String queryFinalValue) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(algoliaConfig.indexInuse(), PLP.class);
		String filters = new String("isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaNewReleasesList  queryFinalValue: {}",queryFinalValue);
			log.info("AlgoliaNewReleasesList  filters: {}",filters);
			if(queryFinalValue!=null) {
				searchResult = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList("isNew:true"),Collections.singletonList("categorySEOURL:-/customized-products"),Collections.singletonList(queryFinalValue))).setFilters(filters).setPage(Integer.valueOf("0")).setHitsPerPage(12));
			}else {
			searchResult = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList("isNew:true"),Collections.singletonList("categorySEOURL:-/customized-products"))).setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters).setPage(Integer.valueOf("0")).setHitsPerPage(12));
			}
			log.info("AlgoliaNewReleasesList searchResult NbHits: {}",searchResult.getNbHits());
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}

		return searchResult;
	}
	@Override
	public SearchResult<PLP> getAlgoliaNewReleasesPLPList(String hitsPerPage,String page, String indexName) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(indexName, PLP.class);
		String filters = new String("isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaNewReleasesPLPList  indexName: {}",indexName);
			log.info("AlgoliaNewReleasesPLPList  hitsPerPage: {}",hitsPerPage);
			log.info("AlgoliaNewReleasesPLPList  page: {}",page);
			log.info("AlgoliaNewReleasesPLPList  filters: {}",filters);
			if(page!=null){
				searchResult = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList("isNew:true"),Collections.singletonList("categorySEOURL:-/customized-products"))).setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters).setPage(Integer.valueOf(page)).setHitsPerPage(Integer.valueOf(hitsPerPage)));
			} else{
				searchResult = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList("isNew:true"),Collections.singletonList("categorySEOURL:-/customized-products"))).setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters).setHitsPerPage(Integer.valueOf(hitsPerPage)));
			}
			log.info("AlgoliaNewReleasesPLPList searchResult NbHits: {}",searchResult.getNbHits());
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}

		return searchResult;
	}

	@Override
	public SearchResult<PLP> getAlgoliaBestSellersList(String queryFinalValue) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(algoliaConfig.indexBs(), PLP.class);
		String filters = new String("bestSellerRank:1 TO 50 AND isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaBestSellersList  queryFinalValue: {}",queryFinalValue);
			log.info("AlgoliaBestSellersList  filters: {}",filters);
			if(queryFinalValue!=null) {
				searchResult = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList(queryFinalValue))).setFilters(filters).setPage(Integer.valueOf("0")).setHitsPerPage(12));
			}else {
			searchResult = index.search(new Query("").setFacets(Arrays.asList("hierarchicalCategories.lvl0", "startingPrice")).setFilters(filters).setPage(Integer.valueOf("0")).setHitsPerPage(12));
			}
			log.info("AlgoliaBestSellersList searchResult NbHits: {}",searchResult.getNbHits());
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}

		return searchResult;
	}

	@Override
	public SearchResult<PLP> getAlgoliaBestSellersPLPList(String hitsPerPage,String page, String indexName) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(indexName, PLP.class);
		String filters = new String("bestSellerRank:1 TO 50 AND isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaBestSellersPLPList  indexName: {}",indexName);
			log.info("AlgoliaBestSellersPLPList  hitsPerPage: {}",hitsPerPage);
			log.info("AlgoliaBestSellersPLPList  page: {}",page);
			log.info("AlgoliaBestSellersPLPList  filters: {}",filters);
			if(page!=null){
				searchResult = index.search(new Query("").setFacets(Arrays.asList("hierarchicalCategories.lvl0", "startingPrice")).setFilters(filters).setPage(Integer.valueOf(page)).setHitsPerPage(Integer.valueOf(hitsPerPage)));
			} else{
				searchResult = index.search(new Query("").setFacets(Arrays.asList("hierarchicalCategories.lvl0", "startingPrice")).setFilters(filters).setHitsPerPage(Integer.valueOf(hitsPerPage)));
			}
			log.info("AlgoliaBestSellersPLPList searchResult NbHits: {}",searchResult.getNbHits());
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}

		return searchResult;
	}
	@Override
	public SearchResult<PLP> getAlgoliaAllList() throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(algoliaConfig.indexInuse(), PLP.class);
		String filters = new String("isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaAllList  filters: {}",filters);
			searchResult = index.search(new Query("").setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters).setHitsPerPage(12));
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}
		return searchResult;
	}

	@Override
	public SearchResult<PLP> getAlgoliaAllPLPList(String hitsPerPage,String page, String indexName) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<PLP> index = client.initIndex(indexName, PLP.class);
		String filters = new String("isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<PLP> searchResult = new SearchResult<>();
		try {
			log.info("AlgoliaAllPLPList  hitsPerPage: {}",hitsPerPage);
			log.info("AlgoliaAllPLPList  page: {}",page);
			log.info("AlgoliaAllPLPList  indexName: {}",indexName);
			log.info("AlgoliaAllPLPList  filters: {}",filters);
			if (!hitsPerPage.isEmpty() && !indexName.isEmpty()) {
				if(page!=null){
					searchResult = index.search(new Query("").setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters).setPage(Integer.valueOf(page)).setHitsPerPage(Integer.valueOf(hitsPerPage)));
				} else{
					searchResult = index.search(new Query("").setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters).setHitsPerPage(Integer.valueOf(hitsPerPage)));
				}
			}
			return searchResult;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}
		return searchResult;
	}

	@Override
	public SearchResult<JsonObject> getAlgoliaCategoryList(String categorySeoUrlValue, String bearertoken,String categoryName,List<String> webattributeName)
			throws IOException {
		//List<String> webattname = getWebattributeName(bearertoken, categorySeoUrlValue,categoryName);
		
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<JsonObject> index = client.initIndex(algoliaConfig.indexInuse(), JsonObject.class);
		String filters = new String("isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<JsonObject> searchResult1 = new SearchResult<>();
		try {
			log.info("AlgoliaCategoryList  categorySeoUrlValue: {}",categorySeoUrlValue);
			log.info("AlgoliaCategoryList  categoryName: {}",categoryName);
			log.info("AlgoliaCategoryList  webattributeName: {}",webattributeName);
			log.info("AlgoliaCategoryList  filters: {}",filters);
			if (!categorySeoUrlValue.isEmpty()) {
				if(!webattributeName.contains("false")) {
				searchResult1 = index.search(new Query("")
						.setFacetFilters(Arrays.asList(Collections.singletonList("categorySEOURL:"+categorySeoUrlValue))).setFacets(webattributeName));
						
			}else
			{
				searchResult1 = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList("categorySEOURL:"+categorySeoUrlValue))).setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters));
			}}

			return searchResult1;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}
		return searchResult1;
	}

	@Override
	public SearchResult<JsonObject> getPricerangeValues(String heirValues) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<JsonObject> index = client.initIndex(algoliaConfig.indexInuse(), JsonObject.class);
		String filters = new String("isSellable:true AND hasCategory:true AND isInPlp:true");
		SearchResult<JsonObject> pricerangeval = new SearchResult<>();
		try {
			log.info("PricerangeValues heirValues: {}",heirValues);
			log.info("PricerangeValues filters: {}",filters);
			pricerangeval = index.search(new Query("").setFacetFilters(Arrays.asList(Collections.singletonList(heirValues))).setFacets(Arrays.asList("categorySEOURL", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "hierarchicalCategories.lvl0", "hierarchicalCategories.lvl1", "hierarchicalCategories.lvl2", "startingPrice")).setFilters(filters));
			return pricerangeval;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
		} finally {
			client.close();
		}
		return pricerangeval;
	}
}
