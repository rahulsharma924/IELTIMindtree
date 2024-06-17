package com.aem.ie.core.services.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.NewsListService;
import com.aem.ie.core.configuration.NewsListConfig;
import com.aem.ie.core.constants.ApplConstants;
import com.aem.ie.core.models.LatestNewsDetail;
import com.aem.ie.core.models.NewsDetail;
import com.aem.ie.core.utils.FMDateUtils;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import static com.day.cq.wcm.api.NameConstants.NT_PAGE;

@Component(service = NewsListService.class, immediate = true)
@Designate(ocd = NewsListConfig.class)
public class NewsListServiceImpl implements NewsListService {

	private static final Logger log = LoggerFactory.getLogger(NewsListServiceImpl.class);
	private static final String DATE_FORMAT = "MM/dd/yyyy";

	@Reference
	QueryBuilder queryBuilder;

	private String newsDetailPath;
	private String newsRootPath;

	@Activate
	protected void activate(NewsListConfig newsListConfig) {
		newsDetailPath = newsListConfig.getNewsDetailPath();
		newsRootPath = newsListConfig.getNewsRootPath();
	}

	@Override
	public List<NewsDetail> getNewsList(String queryPath, ResourceResolver resourceResolver) {
		HashSet<String> resultPaths = getQueryResultPath(queryPath, resourceResolver, NT_PAGE);
		List<NewsDetail> latestNewsList = new ArrayList<>();
		PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
		for (String path : resultPaths) {
			Resource pageRes = resourceResolver.getResource(path);
			Page currentPage = pageManager.getContainingPage(pageRes);
			ValueMap pageResValueMap = currentPage.getProperties();
			String nodePath = path.concat(newsDetailPath);
			Resource resource = resourceResolver.getResource(nodePath);
			assert resource != null;
			// ValueMap pageValueMap = resource.getValueMap();
			String newsTitle = pageResValueMap.get("pageTitle", String.class);
			Date newsDateValue = pageResValueMap.get("publishDate", Date.class);
			String newsDate = new SimpleDateFormat(DATE_FORMAT).format(newsDateValue);
			// setting values
			String newsPagePath = path.concat(".html");
			NewsDetail newsDetail = new NewsDetail(newsTitle, newsDate, newsPagePath);
			latestNewsList.add(newsDetail);
		}
		return latestNewsList;
	}

	@Override
	public List<LatestNewsDetail> getLatestNewsList(String queryPath, ResourceResolver resourceResolver) {
		HashSet<String> resultPaths = getQueryResultPath(queryPath, resourceResolver, NT_PAGE);
		List<LatestNewsDetail> latestNewsList = new ArrayList<>();
		PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
		for (String path : resultPaths) {
			Resource pageRes = resourceResolver.getResource(path);
			Page currentPage = pageManager.getContainingPage(pageRes);
			ValueMap pageResValueMap = currentPage.getProperties();
			String nodePath = path.concat(newsDetailPath);
			Resource resource = resourceResolver.getResource(nodePath);
			assert resource != null;

			String newsTitle = pageResValueMap.get("pageTitle", String.class);
			String newsLabel = pageResValueMap.get("newsLabel", String.class);
			String newsTagTitle = ApplConstants.EMPTY_STRING;
			TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
			if (newsLabel != null && !newsLabel.equals(ApplConstants.EMPTY_STRING) && tagManager != null) {
				Tag tag = tagManager.resolve(newsLabel);
				if (tag != null && !tag.getTitle().equals("")) {
					newsTagTitle = tag.getTitle();
				}
			}
			Date newsDateValue = pageResValueMap.get("publishDate", Date.class);
			String newsDate = FMDateUtils.convertToString(newsDateValue, DATE_FORMAT);
			LatestNewsDetail latestNewsDetail = new LatestNewsDetail(newsTitle, newsTagTitle, newsDate,
					path.concat(".html"));
			latestNewsList.add(latestNewsDetail);
		}
		Comparator<LatestNewsDetail> comparator = (c1,
				c2) -> (FMDateUtils.convertToDate(c2.getLatestNewsDate(), DATE_FORMAT))
						.compareTo(FMDateUtils.convertToDate(c1.getLatestNewsDate(), DATE_FORMAT));

		latestNewsList.sort(comparator);
		return latestNewsList.stream().limit(4).collect(Collectors.toList());
	}

	private HashSet<String> getQueryResultPath(String queryPath, ResourceResolver resourceResolver, String type) {
		Session session = resourceResolver.adaptTo(Session.class);
		HashSet<String> pagePaths = new HashSet<>();
		try {
			Map<String, String> queryMap = new HashMap<>();
			queryMap.put("path", queryPath);
			queryMap.put("type", type);
			queryMap.put("p.limit", "-1");

			Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
			SearchResult searchResult = query.getResult();
			for (Hit hit : searchResult.getHits()) {
				String pagePath = hit.getPath();
				if (pagePath != null && !pagePath.equals(ApplConstants.EMPTY_STRING)) {
					log.info("pagePath-----------", pagePath);
					pagePaths.add(pagePath);
				}
			}
		} catch (RepositoryException repositoryException) {
			log.error("Exception Occurred in query{}", repositoryException.getMessage());
		}
		return pagePaths;
	}

	@Override
	public String getNewsRootPath() {
		return newsRootPath;
	}

	@Override
	public String getNewsDetailPath() {
		return newsDetailPath;
	}

}
