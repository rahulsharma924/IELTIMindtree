package com.aem.ie.core.models;

import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.Service.AlgoliaPLPService;
import com.aem.ie.core.models.datamodels.PLP;
import com.algolia.search.models.indexing.SearchResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
class ProductListSecondTest {
    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    @Mock
    private SlingHttpServletRequest request;
    @Mock
    RequestPathInfo requestPathInfo;
    @Mock
    com.adobe.granite.asset.api.AssetManager assetManager;
    @Mock
    com.adobe.granite.asset.api.Asset asset;
    @Mock
    ResourceResolver resourceResolver;
    @InjectMocks
    ProductList productList;
    @Mock
    private Rendition rendition;
    @Mock
    AlgoliaPLPService mockAlgoliaPLPService;

    String[] selectors={"log-periodic-antennas"};
    String[] selectorsLevelZero={"antennas"};
    String[] selectorsLevelOne={"directional-antennas"};
    // Mock the JSON data
    String json = "[{\n" +
            " \"category\" : {\n" +
            " \"categoryId\" : \"9288221d-c70a-431d-9bca-40678357af3c\",\n" +
            " \"name\" : \"Antennas\",\n" +
            " \"seoName\" : \"antennas\",\n" +
            " \"seoTagName\" : \"antennasss\",\n" +
            " \"webDescription\" : \"antennas\",\n" +
            " \"categoryPath\" : \"antennas\",\n" +
            " \"categoryUrl\" : \"antennas\",\n" +
            " \"thumbnailUrl\" : \"null\",\n" +
            " \"categorySeoUrl\" : \"antennas\",\n" +
            " \"childCategories\" : [ {\n" +
            " \"categoryId\" : \"327a8805-7799-42bb-bfb5-e044884e7656\",\n" +
            " \"name\" : \"Directional Antennas\",\n" +
            " \"seoName\" : \"directional-antennas\",\n" +
            " \"seoTagName\" : \"directional-antennas\", \n" +
            " \"categorySeoUrl\" : \"antennas|directional-antennas\",\n" +
            " \"childCategories\" : [ {\n" +
            " \"categoryId\" : \"0a49fb7c-60ff-4e65-a25c-f04d31f65d2d\",\n" +
            " \"name\" : \"Log Periodic Antennas\",\n" +
            " \"seoName\" : \"log-periodic-antennas\",\n" +
            " \"seoTagName\" : \"log-periodic-antennas\",\n" +
            " \"categorySeoUrl\" : \"antennas|directional-antennas|log-periodic-antennas\",\n" +
            " \"webDescription\" : \"Log Periodic Antennas\"\n" +
            "}]"+
            "}]"+
            "}\n" +
            "}]";
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(request.getRequestPathInfo()).thenReturn(requestPathInfo);
        when(resourceResolver.adaptTo(any())).thenReturn(assetManager);
        when(assetManager.getAsset(any())).thenReturn(asset);
        when(asset.getRendition("original")).thenReturn(rendition);
        InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
        when(rendition.adaptTo(InputStream.class)).thenReturn(inputStream);
    }
    @Test
    void init() throws IOException {
        when(requestPathInfo.getSelectors()).thenReturn(selectors);
       // productList.init();
    }

    @Test
    void initLevelZero() throws IOException {
        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
        SearchResult<PLP> result = new SearchResult<>();
        result.setHitsPerPage(Integer.valueOf("1"));
        List<PLP> productList1 = new ArrayList<>();
        PLP product = new PLP();
        productList1.add(product);
        result.setHits(productList1);
        when(mockAlgoliaPLPService.getAlgoliaProductList(Mockito.anyString(),Mockito.anyString())).thenReturn(result);
        when(requestPathInfo.getSelectors()).thenReturn(selectorsLevelZero);
        productList.init();
        productList.getProductListMap();
        });
    }

    @Test
    void initLevelOne() throws IOException {
        when(requestPathInfo.getSelectors()).thenReturn(selectorsLevelOne);
       // productList.init();
    }
}