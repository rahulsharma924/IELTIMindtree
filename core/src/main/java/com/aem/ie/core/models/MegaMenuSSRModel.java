package com.aem.ie.core.models;

import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.day.cq.dam.api.Rendition;
import com.day.cq.dam.commons.util.DamUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.jcr.RepositoryException;
import java.io.*;
import java.nio.charset.StandardCharsets;
import com.day.cq.dam.commons.util.*;

import static com.aem.ie.core.constants.ApplConstants.CATEGORY_JSON_PATH;

@Model(adaptables = { Resource.class,
        SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MegaMenuSSRModel {
    private static final Logger log = LoggerFactory.getLogger(MegaMenuSSRModel.class);
    @SlingObject
    SlingHttpServletRequest request;
    @SlingObject
    protected ResourceResolver resourceResolver;
    JsonArray jsonArray = null;
    private static final String CHILD_CATEGORIES = "childCategories";
    private static final String CATEGORY = "category";
    @PostConstruct
    void init() throws IOException {
        try{
            Resource resource = resourceResolver.getResource(CATEGORY_JSON_PATH);
            // Get the Asset object from the resource
            com.day.cq.dam.api.Asset asset = DamUtil.resolveToAsset(resource);
            // Check if the asset exists
            if (asset != null) {
                // Get the cached asset
                InputStream cachedAssetInputStream = DamUtil.getAssetCache().getOriginalStream(asset, true);
                log.debug("MegaMenuSSRModel Cached cachedAssetInputStream : {}", cachedAssetInputStream);
                if (cachedAssetInputStream != null) {
                    // logic to handle the cached asset
                    StringBuilder stringBuilderCachedAsset = new StringBuilder();
                    String cachedLine;
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(DamUtil.getAssetCache().getOriginalStream(asset, true), StandardCharsets.UTF_8));
                    while ((cachedLine = bufferedReader.readLine()) != null) {
                        stringBuilderCachedAsset.append(cachedLine);
                    }
                    jsonArray = JsonParser.parseString(stringBuilderCachedAsset.toString()).getAsJsonArray();
                }
                IOUtils.closeQuietly(cachedAssetInputStream);
            }
        } catch (IOException | RuntimeException e){
            log.error("Exception Occurred : {}", e.getMessage());
        } finally {
            DamUtil.getAssetCache().release();
        }
    }

    public String getCategoryJsonObject() {
        for (JsonElement element : jsonArray) {
            JsonObject categoryObject = element.getAsJsonObject();
            if (categoryObject.has(CATEGORY)) {
                JsonObject categoryJson = categoryObject.get(CATEGORY).getAsJsonObject();
                // Remove Categories property(thumbnailUrl,webDescription,categoryUrl,seoTagName)
                categoryJson = getModifiedJsonObject(categoryJson);
                if (categoryJson.has(CHILD_CATEGORIES) && categoryJson.get(CHILD_CATEGORIES) != null && categoryJson.get(CHILD_CATEGORIES).isJsonArray()) {
                    for(JsonElement childCategoriesElement : categoryJson.get(CHILD_CATEGORIES).getAsJsonArray()){
                        JsonObject childCategoriesObject = childCategoriesElement.getAsJsonObject();
                        // Remove child Categories property (thumbnailUrl,webDescription,categoryUrl,seoTagName)
                        childCategoriesObject = getModifiedJsonObject(childCategoriesObject);
                        if(childCategoriesObject.has(CHILD_CATEGORIES) && childCategoriesObject.get(CHILD_CATEGORIES) !=null && childCategoriesObject.get(CHILD_CATEGORIES).isJsonArray()){
                            for(JsonElement subChildCategoriesElement : childCategoriesObject.get(CHILD_CATEGORIES).getAsJsonArray()){
                                JsonObject subChildCategoriesObject = subChildCategoriesElement.getAsJsonObject();
                                // Remove sub child Categories property (thumbnailUrl,webDescription,categoryUrl,seoTagName)
                                subChildCategoriesObject = getModifiedJsonObject(subChildCategoriesObject);
                            }
                        }
                    }
                }
            }
        }
        return jsonArray.toString();
    }

    public JsonObject getModifiedJsonObject(JsonObject jsonObject){
        jsonObject.remove("thumbnailUrl");
        jsonObject.remove("webDescription");
        jsonObject.remove("categoryUrl");
        jsonObject.remove("seoTagName");
        return jsonObject;
    }

}
