package com.aem.ie.core.Service;

import java.util.HashSet;
import java.util.List;

import org.apache.sling.api.resource.ResourceResolver;

import com.aem.ie.core.models.BlogPage;

public interface BlogListService {
    public List<BlogPage> getBlogList(String blogListPath, ResourceResolver resourceResolver, String year);
    public HashSet<String> getCategories();
    public List<String> getArchives(String blogArchivesRootPath, ResourceResolver resourceResolver);
}
