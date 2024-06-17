package com.aem.ie.core.services.impl;

import java.text.SimpleDateFormat;
import java.util.*;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.Service.BlogListService;
import com.aem.ie.core.constants.ApplConstants;
import com.aem.ie.core.models.BlogPage;
import com.day.cq.commons.jcr.JcrConstants;
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

@Component(service = BlogListService.class, immediate = true)
public class BlogListServiceImpl implements BlogListService {
    @Reference
    QueryBuilder queryBuilder;

    private static final Logger log = LoggerFactory.getLogger(BlogListServiceImpl.class);
    private static final String ARCHIVES = "ARCHIVES";
    private static final String CQ_PAGE = NT_PAGE;
    private static final String P_LIMIT = "p.limit";

    private HashSet<String> categoriesTag = new HashSet<>();

    @Override
    public List<BlogPage> getBlogList(String blogListPath, ResourceResolver resourceResolver, String year) {
        List<BlogPage> pageData = new ArrayList<>();
		categoriesTag.clear();
        HashSet<String> pagePaths = getQueryResultPath(blogListPath, resourceResolver, CQ_PAGE, year);
        PageManager pageManager= resourceResolver.adaptTo(PageManager.class);
        for (String path : pagePaths) {
            Resource pageRes =  resourceResolver.getResource(path);
            assert pageManager != null;
            Page currentPage = pageManager.getContainingPage(pageRes);
            ValueMap pageResValueMap = currentPage.getProperties();
            if(pageResValueMap != null){
                String blogtitle = pageResValueMap.get("pageTitle", String.class);
                String[] bloglabels = pageResValueMap.get("blogCategory", String[].class);
                List<String> bloglabelTitle = new ArrayList<>();
                TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
                if(tagManager!=null){
                    assert bloglabels != null;
                    if(bloglabels != null && bloglabels.length != 0){
                        for(String tagValue : bloglabels){
                            Tag tag = tagManager.resolve(tagValue);
                            if(tag!=null && !tag.getTitle().equals("")) {
                                bloglabelTitle.add(tag.getTitle());
                                categoriesTag.add(tag.getTitle());
                            }
                        }
                    }
                }
                String blogauthor = pageResValueMap.get("author", String.class);
                Date blogdateValue = pageResValueMap.get("publishDate", Date.class);
                String blogdate = blogdateValue!=null ? new SimpleDateFormat("MMM dd, yyyy")
                        .format(blogdateValue) : "";
                String blogLink = path.concat(".html");
                BlogPage blogPage = new BlogPage(bloglabelTitle, blogauthor, blogtitle, blogLink, blogdate);
                pageData.add(blogPage);
            }
        }
        return pageData;
    }


    //Reading all tags from given cq:tag path to fetch all categories value
    @Override
    public HashSet<String> getCategories() {
        return new HashSet<>(categoriesTag);
    }

    @Override
    public List<String> getArchives(String blogArchivesRootPath, ResourceResolver resourceResolver) {
        List<String> archives = new ArrayList<>();
        try {
            HashSet<String> resultPaths = getQueryResultPath(blogArchivesRootPath, resourceResolver,
                    CQ_PAGE, ARCHIVES);
            for (String path : resultPaths) {
                Node node = resourceResolver.resolve(path).adaptTo(Node.class);
                assert node != null;
                String name = node.getName();
                archives.add(name);
            }
        } catch (RepositoryException repositoryException) {
            log.error("Exception Occurred in fetching Categories{}", repositoryException.getMessage());
        }
        return archives;
    }

    private HashSet<String> getQueryResultPath(String queryPath, ResourceResolver resourceResolver, String type,
                                               String year){
        Session session = resourceResolver.adaptTo(Session.class);
        HashSet<String> pagePaths = new HashSet<>();
        try {
            Map<String, String> queryMap = new HashMap<>();
            if (year == null || year.equals(ApplConstants.EMPTY_STRING)) {
                queryMap.put("path", queryPath);
                queryMap.put("type", type);
                queryMap.put(P_LIMIT, "-1");
                queryMap.put("group.1_group.p.not", "true");
                queryMap.put("group.1_group.path.self", "true");
                queryMap.put("group.1_group.path", queryPath + "/archives");
            } else if(year.equals("category")) {
                queryMap.put("path", queryPath);
                queryMap.put("type", type);
                queryMap.put(P_LIMIT, "-1");
            } else if(year.equals(ARCHIVES)) {
                queryMap.put("path", queryPath);
                queryMap.put("type", type);
                queryMap.put("path.flat", "true");
                queryMap.put(P_LIMIT, "-1");
            } else {
                queryMap.put("path", queryPath+"/archives/"+year);
                queryMap.put("type", CQ_PAGE);
                queryMap.put(P_LIMIT, "-1");
            }

            Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
            SearchResult searchResult = query.getResult();
            Map<String, String> queryMapAchivesYear = new HashMap<>();
            ArrayList<String> arrayListAchivesYear = new ArrayList<String>();
			if(year != null) {
            if (year.equals("category")) {
                queryMapAchivesYear.put("path", "/content/fm/en/blog/archives");
                queryMapAchivesYear.put("type", type);
                queryMapAchivesYear.put("path.flat", "true");
                queryMapAchivesYear.put(P_LIMIT, "-1");
                Query queryAchivesYear = queryBuilder.createQuery(PredicateGroup.create(queryMapAchivesYear), session);
                SearchResult searchResultAchivesYear = queryAchivesYear.getResult();
                for (Hit hitAchivesYear : searchResultAchivesYear.getHits()) {
                    String pagePathAchivesYear = hitAchivesYear.getPath();
                    if (pagePathAchivesYear != null && !pagePathAchivesYear.equals(ApplConstants.EMPTY_STRING)) {
                        arrayListAchivesYear.add(pagePathAchivesYear);
                    }
                }
            }
            for (Hit hit : searchResult.getHits()) {
                String pagePath = hit.getPath();
                if (pagePath != null && !pagePath.equals(ApplConstants.EMPTY_STRING)) {
                    if(year.equals("category")){
                        if(!pagePath.equals("/content/fm/en/blog/archives") && !arrayListAchivesYear.contains(pagePath)){
                            pagePaths.add(pagePath);
                        }
                    } else{
                        pagePaths.add(pagePath);
                    }
                }
            }
        } }catch (RepositoryException repositoryException){
            log.error("Exception Occurred in query{}", repositoryException.getMessage());
        }
        return pagePaths;
    }

}