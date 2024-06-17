package com.aem.ie.core.models;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.collections4.ListUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ExporterConstants;
import com.aem.ie.core.Service.BlogService;
import com.aem.ie.core.constants.ApplConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class RelatedArticleModel {

	private static final Logger log = LoggerFactory.getLogger(RelatedArticleModel.class);

	@SlingObject
	private Resource resource;

	@ScriptVariable
	private ResourceResolver resolver;

	private String blogCategory = "blogCategory";
	private String blogtag = "blogtag";

	@Inject
	private BlogService blogService;

	@Inject
	private QueryBuilder queryBuilder;

	private List<BlogPage> relatedArticles;

	public final List<BlogPage> getRelatedArticles() {
		return Collections.unmodifiableList(ListUtils.emptyIfNull(relatedArticles));
	}

	@PostConstruct
	protected void init() {
		PageManager pageManager = resolver.adaptTo(PageManager.class);
		String articleLimit = blogService.getArticleLimit();
		String blogRootPath = blogService.getBlogRootPath();
		int articleLimitInt = Integer.parseInt(articleLimit);
		Page currentPage = pageManager.getContainingPage(resource);
		ValueMap pgValueMap = currentPage.getProperties();
		String[] blogTag = pgValueMap.get(blogtag, String[].class);
		HashSet<String> pagePaths = new HashSet<>();
		if (blogTag != null) {
			if(blogTag.length != 0){
				// query to find matching pages tagged with same tag as current one
				pagePaths = getSameCategoryPages(blogRootPath, blogTag);
			}
		}
		relatedArticles = new ArrayList<>();
		int countofArticles = 0;
		for (String pagePath : pagePaths) {
			if (countofArticles < articleLimitInt) {
				countofArticles++;
				Resource pageResource = resource.getResourceResolver().getResource(pagePath);
				resource = resource.getResourceResolver().getResource(pagePath + "/root/container/blogpage");
				ValueMap pageValueMap = pageResource.getValueMap();
				ValueMap nodeValueMap = resource.getValueMap();
				Page currentPageArticle = pageManager.getContainingPage(resource);
				BlogPage blogPage = getBlogPageItem(pageValueMap, nodeValueMap, currentPageArticle);
				if (!currentPageArticle.getPath().equalsIgnoreCase(currentPage.getPath())) {
					relatedArticles.add(blogPage);
				}
			}
		}
	}

	private HashSet<String> getSameCategoryPages(String blogRootPath, String[] blogTag) {
		Session session = resource.getResourceResolver().adaptTo(Session.class);
		HashSet<String> pagePaths = new HashSet<>();
		Map<String, String> queryMap = new HashMap<>();
		queryMap.put("path", blogRootPath);
		queryMap.put("property", blogtag);
		int count = 1;
		for (String label : blogTag) {
			queryMap.put("property." + count + "_value", label);
			count++;
		}
		queryMap.put("p.limit", "-1");
		Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
		SearchResult searchResult = query.getResult();
		for (Hit hit : searchResult.getHits()) {
			try {
				String pagePath = hit.getPath();
				if (null != pagePath && !pagePath.equals(ApplConstants.EMPTY_STRING)) {
					pagePaths.add(pagePath);
				}
			} catch (RepositoryException repositoryException) {
				log.error("Exception Occurred in query{}", repositoryException.getMessage());
			}
		}
		return pagePaths;
	}

	private BlogPage getBlogPageItem(ValueMap pageValueMap, ValueMap nodeValueMap, Page currentPageArticle) {
		String blogauthor = pageValueMap.get("author", String.class);
		String blogtitle = pageValueMap.get("pagetitle", String.class);
		String blogimage = nodeValueMap.get("blogimage", String.class);
		String blogimgtext = nodeValueMap.get("blogimgtext", String.class);
		String blogtext = nodeValueMap.get("blogtext", String.class);
		//This publishDate is blog date
		Date blogdate = pageValueMap.get("publishDate", Date.class);
		String formattedBlogDate = "";
		if (null != blogdate) {
			formattedBlogDate = new SimpleDateFormat("MMM dd, yyyy").format(blogdate);
		}

		String[] bloglabelValues = pageValueMap.get(blogCategory, String[].class);
		TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);
		List<String> blogTitles = new ArrayList<>();
		if (tagManager != null) {
			if (bloglabelValues != null) {
				for (String tagValue : bloglabelValues) {
					Tag tag = tagManager.resolve(tagValue);
					if (tag != null && !tag.getTitle().equals("")) {
						blogTitles.add(tag.getTitle());
					}
				}
			}
		}
		String bloglink = currentPageArticle.getPath().concat(".html");
		return new BlogPage(blogTitles, blogauthor, blogtitle, blogimage, blogtext, bloglink, formattedBlogDate,
				blogimgtext);
	}
}
