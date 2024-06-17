package com.aem.ie.core.models;

import com.google.gson.JsonParser;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.*;
import java.nio.charset.StandardCharsets;

import static com.aem.ie.core.constants.ApplConstants.CATEGORY_JSON_PATH;
import static org.mockito.Mockito.*;

@ExtendWith({AemContextExtension.class})
class MegaMenuSSRModelTest {
    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    @InjectMocks
    MegaMenuSSRModel megaMenuSSRModel;
    @Mock
    ResourceResolver resourceResolver;

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
            "}]" +
            "}]" +
            "}\n" +
            "}]";
    InputStream inputStream = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void initTest() throws IOException {
        NoClassDefFoundError thrown = Assertions.assertThrows(NoClassDefFoundError.class, () -> {
            // Mock the JSON data
            when(resourceResolver.getResource(CATEGORY_JSON_PATH)).thenReturn(aemContext.create().asset(CATEGORY_JSON_PATH, inputStream, "application/json").adaptTo(Resource.class));
            megaMenuSSRModel.init();
        });
    }

    @Test
    void getCategoryJsonObject() throws IOException {
        StringBuilder stringBuilderCachedAsset = new StringBuilder();
        String cachedLine;
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        while ((cachedLine = bufferedReader.readLine()) != null) {
            stringBuilderCachedAsset.append(cachedLine);
        }
        megaMenuSSRModel.jsonArray = JsonParser.parseString(stringBuilderCachedAsset.toString()).getAsJsonArray();
        megaMenuSSRModel.getCategoryJsonObject();
        IOUtils.closeQuietly(inputStream);
    }
}