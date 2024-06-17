package com.aem.ie.core.models.datamodels;

import com.day.cq.tagging.InvalidTagFormatException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith({AemContextExtension.class})
class BlogPostTest {

    AemContext aemContext = new AemContext();
    private BlogPost blogPost = new BlogPost();
    BlogPost blogPost1;

    @BeforeEach
    void setUp() {
        aemContext.addModelsForClasses(BlogPost.class);
        aemContext.load().json("/com/aem/ie/core/models/BlopPost.json", "/content");
        aemContext.currentResource("/content");
        blogPost = aemContext.request().getResource().adaptTo(BlogPost.class);
    }

    @Test
    void testBlogPost(){
        blogPost.setBlogAuthor("Blog author");
        blogPost.setBlogDate("25 April 2023");
        blogPost.setBlogDescription("Blog Description");
        blogPost.setBlogTitle("Blog Title");
        blogPost.setBlogLabel(new ArrayList<>(Arrays.asList("Blog Label")));
        blogPost.setBlogText("Blog Text");
        blogPost.setBlogPagePath("/content/fm/en/blog");
        assertEquals("Blog author", blogPost.getBlogAuthor());
        assertEquals("25 April 2023", blogPost.getBlogDate());
        assertEquals("Blog Description", blogPost.getBlogDescription());
        assertEquals("Blog Title", blogPost.getBlogTitle());
        assertEquals("Blog Text", blogPost.getBlogText());
        assertEquals(new ArrayList<>(Arrays.asList("Blog Label")), blogPost.getBlogLabel());
        assertEquals("/content/fm/en/blog", blogPost.getBlogPagePath());
    }

    @Test
    void testBlogPostDialogField() throws ParseException {
        assertEquals("Peter McNeil", blogPost.getAuthor());
        assertEquals("A low noise amplifier", blogPost.getDescription());
        assertEquals("Low Noise Amplifiers Q&A ", blogPost.getTitle());
        assertEquals("true", blogPost.getEnableHeading());
        assertEquals("/content/fm/en/blog/adapters",
                blogPost.getBlog());
        Date blogDate = new SimpleDateFormat("MM dd, yyyy").parse("04 25, 2023");
        assertEquals("Apr 25, 2023", new SimpleDateFormat("MMM dd, yyyy").format(blogDate));
    }

    @Test
    void testBlogPostGetLabel() throws InvalidTagFormatException {
        TagManager tagManager = aemContext.resourceResolver().adaptTo(TagManager.class);
        Tag tag = tagManager.createTag("label","label","first tag");
        aemContext.currentResource(tag.adaptTo(Resource.class));
        blogPost.getLabel();
    }

    @Test
    void testGetFormattedDate(){
        blogPost.getFormattedDate();
    }
}