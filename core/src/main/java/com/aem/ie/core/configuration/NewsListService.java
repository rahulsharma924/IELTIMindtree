package com.aem.ie.core.configuration;

import com.aem.ie.core.models.LatestNewsDetail;
import com.aem.ie.core.models.NewsDetail;
import org.apache.sling.api.resource.ResourceResolver;

import java.util.List;

public interface NewsListService {
    public List<NewsDetail> getNewsList(String queryPath, ResourceResolver resourceResolver);
    public List<LatestNewsDetail> getLatestNewsList(String queryPath, ResourceResolver resourceResolver);
    public String getNewsRootPath();
    public String getNewsDetailPath();
}
