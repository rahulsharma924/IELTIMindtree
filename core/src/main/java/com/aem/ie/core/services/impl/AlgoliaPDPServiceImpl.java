package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.AlgoliaPDPService;
import com.aem.ie.core.configuration.AlgoliaConfig;
import com.aem.ie.core.models.datamodels.Product;
import com.algolia.search.DefaultSearchClient;
import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.algolia.search.exceptions.AlgoliaApiException;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = AlgoliaPDPService.class, immediate = true)
@Designate(ocd = AlgoliaConfig.class)
public class AlgoliaPDPServiceImpl implements AlgoliaPDPService {
	private AlgoliaConfig algoliaConfig;
	private static final Logger log = LoggerFactory.getLogger(AlgoliaPDPServiceImpl.class);

	@Activate
	protected void activate(AlgoliaConfig algoliaConfig) {
		this.algoliaConfig = algoliaConfig;
	}

	@Override
	public Product getAlgoliaProductData(String seoName) throws IOException {
		SearchClient client = DefaultSearchClient.create(algoliaConfig.algoliaId(), algoliaConfig.algoliaKey());
		// making algolia connection
		SearchIndex<Product> index = client.initIndex(algoliaConfig.indexInuse(), Product.class);
		Product productItem = new Product();
		SearchResult<Product> searchResult = new SearchResult<>();
		try {
			searchResult = index.search(new Query("").setFilters("seoName:" + seoName));
			log.info("AlgoliaProductData searchResult Hits Size: {}", searchResult.getHits().size());
			if (searchResult.getHits().size() > 0) {
				for (Product product : searchResult.getHits()) {
					productItem = product;
				}
			} else {
				productItem.setSkuIdNotFound(true);
			}
			// Get all attributes of given sku
			return productItem;
		} catch (AlgoliaApiException algoliaApiException) {
			log.error("Error in processing Algolia request{}", algoliaApiException.getMessage());
			productItem.setSkuIdNotFound(true);
			return productItem;
		} finally {
			client.close();
		}
	}
}
