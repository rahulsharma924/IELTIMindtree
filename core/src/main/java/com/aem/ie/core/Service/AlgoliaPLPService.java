package com.aem.ie.core.Service;

import java.io.IOException;
import java.util.List;

import com.aem.ie.core.models.datamodels.PLP;
import com.algolia.search.models.indexing.SearchResult;
import com.google.gson.JsonObject;

public interface AlgoliaPLPService {
    SearchResult<PLP> getAlgoliaProductList(String categorySeoUrlValue,String queryFinalValue) throws IOException;
    SearchResult<PLP> getAlgoliaPLPList(String categorySeoUrlValue,String hitsPerPage,String page, String indexName) throws IOException;
    SearchResult<PLP> getAlgoliaNewReleasesList(String queryFinalValue) throws IOException;
    SearchResult<PLP> getAlgoliaNewReleasesPLPList(String hitsPerPage,String page, String indexName) throws IOException;
    SearchResult<PLP> getAlgoliaBestSellersList(String queryFinalValue) throws IOException;
    SearchResult<PLP> getAlgoliaBestSellersPLPList(String hitsPerPage,String page, String indexName) throws IOException;
	SearchResult<PLP> getAlgoliaAllList() throws IOException;
    SearchResult<PLP> getAlgoliaAllPLPList(String hitsPerPage,String page, String indexName) throws IOException;
	SearchResult<JsonObject> getAlgoliaCategoryList(String categorySeoUrlValue,String webattelebearerToken,String categoryName,List<String> webattributeName) throws IOException;
    SearchResult<JsonObject> getPricerangeValues(String heirValues) throws IOException;
    }
