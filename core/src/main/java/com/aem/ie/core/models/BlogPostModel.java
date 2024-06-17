package com.aem.ie.core.models;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.adobe.granite.asset.api.Asset;
import com.adobe.granite.asset.api.AssetManager;
import com.adobe.granite.asset.api.Rendition;
import com.aem.ie.core.Service.UpdatePersonalInfoService;
import com.algolia.search.com.fasterxml.jackson.databind.JsonNode;
import com.algolia.search.com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.constants.ApplConstants;
import com.aem.ie.core.models.datamodels.BlogPost;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;

import static com.aem.ie.core.constants.ApplConstants.HTML;
import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;
import static com.day.cq.wcm.api.NameConstants.NT_PAGE;

@Model(adaptables = { SlingHttpServletRequest.class,
		Resource.class }, resourceType = "ie/fm/components/content/blog-post", defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)

public class BlogPostModel {

	private static final Logger log = LoggerFactory.getLogger(BlogPostModel.class);
	private static final String BLOG_PAGE = "/content/fm/en/blog";
	private static final String JCR_CONTENT = "/jcr:content";
	private final String blogtext = "blogtext";
	@Inject
	QueryBuilder queryBuilder;

	@SlingObject
	protected ResourceResolver resourceResolver;

	@ValueMapValue
	private String heading;

	@ValueMapValue
	@Default(booleanValues = false)
	private boolean latestBlog;

	@ValueMapValue
	private String subHeading;

	@ValueMapValue
	private String[] blogPostList;

	private String categorySEOUrl;
	@OSGiService
	UpdatePersonalInfoService updatePersonalInfoService;

	private List<BlogPost> blogPosts;
	JsonNode Child;
	String templateName;
	String appendedUrl;

	public String getHeading() {
		return heading;
	}

	public String getSubHeading() {
		return subHeading;
	}

	public String[] getBlogPostList() {
		return Arrays.copyOf(blogPostList, blogPostList.length);
	}

	public List<BlogPost> getBlogPosts() {
		return Collections.unmodifiableList(ListUtils.emptyIfNull(blogPosts));
	}

	@PostConstruct
	protected void init() throws IOException {
		// if latest checkbox is checked, it will fetch items based on publish date,
		// else it will fetch authored items
		if (latestBlog) {
			blogPosts = listLatestBlog();
		} else {
			blogPosts = processBlogPostList();
		}
	}

	// fetching all blog pages from blog path to fetch first 4 latest blog items,
	// sorted based on publish dates
	private List<BlogPost> listLatestBlog() throws IOException {
		LinkedHashSet<String> resultPaths = getQueryResultPath(BLOG_PAGE, resourceResolver, NT_PAGE);
		List<BlogPost> blogPostItems = new ArrayList<>();
		if (!resultPaths.isEmpty()) {
			blogPostItems = getLatestPublishedBlog(resultPaths);
		}
		return blogPostItems;
	}

	// Processing first 4 blog items
	private List<BlogPost> getLatestPublishedBlog(LinkedHashSet<String> resultPaths) throws IOException {
		List<BlogPost> latestItems = new ArrayList<>();
		int counter = 0;
		for (String resultPath : resultPaths) {
			// Breaking the loop after 4 times as need to get only 4 latest items
			if (counter == 4)
				break;
			latestItems.add(setBlogItem(resultPath));
			counter++;
		}
		return latestItems;
	}

	// Processing blog items based on 4 blog path provided in multifield dialog
	private List<BlogPost> processBlogPostList() throws IOException {
		List<BlogPost> blogPostItems = new ArrayList<>();
		if (blogPostList != null) {
			blogPostItems = getBlogPostItems();
		}
		return blogPostItems;
	}

	// Method to get Blog Post Items
	private List<BlogPost> getBlogPostItems() throws IOException {
		List<BlogPost> blogItems = new ArrayList<>();
		for (String blogPostPath : blogPostList) {
			blogItems.add(setBlogItem(blogPostPath));
		}
		return blogItems;
	}

	// Setting BlogPost Item values based on given blogpath
	private BlogPost setBlogItem(String blogPostPath) throws IOException {
		BlogPost blogPostItem = new BlogPost();
		if (!blogPostPath.isEmpty()) {
			Resource blogPageResource = resourceResolver.getResource(blogPostPath.concat(JCR_CONTENT));
			assert blogPageResource != null;
			ValueMap blogPageValueMap = blogPageResource.getValueMap();

			// Setting Title of each item by fetching jcr:title value from page
			// property(blog tab)
			String titleValue = blogPageValueMap.get(JCR_TITLE, String.class);
			assert titleValue != null;
			if (!titleValue.isEmpty()) {
				blogPostItem.setBlogTitle(blogPageValueMap.get(JCR_TITLE, String.class));
			}

			// Setting Tag Values of each item by fetching blogCategory value from page
			// property(blog tab)
			String[] blogLabels = blogPageValueMap.get("blogCategory", String[].class);
			assert blogLabels != null;
			if (blogLabels.length != 0) {
				blogPostItem.setBlogLabel(getTagTitles(blogLabels));
				blogPostItem.setBlogLink(getTagLink(blogLabels));
			}

			// Setting blogAuthor by fetching blogAuthor field value from page property(blog
			// tab)
			String authorValue = blogPageValueMap.get("author", String.class);
			assert authorValue != null;
			if (!authorValue.isEmpty()) {
				blogPostItem.setBlogAuthor(authorValue);
			}

			// Setting blogDate by fetching blog date field value from page property(blog
			// tab)
			Date blogdate = blogPageValueMap.get("publishDate", new Date());
			blogPostItem.setBlogDate(new SimpleDateFormat("MMM dd, yyyy").format(blogdate));

			// Setting description of each item by fetching blogtext property from component
			// node
			Node blogPageNode = Objects
					.requireNonNull(
							resourceResolver.getResource(blogPostPath.concat("/jcr:content/root/container/blogpage")))
					.adaptTo(Node.class);
			try {
				assert blogPageNode != null;
				if (blogPageNode.hasProperty(blogtext)) {
					String blogtextValue = blogPageNode.getProperty(blogtext).getString();
					blogPostItem.setBlogDescription(blogtextValue);
				}
			} catch (RepositoryException repositoryException) {
				log.error("error occurred during setting blog text value{}", repositoryException.getMessage());
			}
			// Setting blogPath
			blogPostItem.setBlogPagePath(blogPostPath);
		}
		return blogPostItem;
	}

	// Method to resolve tags and get titles
	private List<String> getTagTitles(String[] blogLabels) throws IOException {
		List<String> pageTags = new ArrayList<>();
		TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
		if (tagManager != null) {
			for (String tagValue : blogLabels) {
				Tag tag = tagManager.resolve(tagValue);
				if (tag != null && !tag.getTitle().equals(ApplConstants.EMPTY_STRING)) {
					pageTags.add(tag.getTitle());
				}
			}
		}
		return pageTags;
	}

	private HashMap<String, String> getTagLink(String[] blogLabels) throws IOException {
		HashMap myHashMap = new HashMap<String, String>();
		TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
		if (tagManager != null) {
			for (String tagValue : blogLabels) {
				Tag tag = tagManager.resolve(tagValue);
				if (tag != null && tag.getTitle() != null && !tag.getTitle().equals(ApplConstants.EMPTY_STRING)) {
					myHashMap.put(tag.getTitle(), ApplConstants.EMPTY_STRING);
					/*AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
					if (assetManager != null) {
						Asset asset = assetManager
								.getAsset("/content/dam/infinite-electronics/json/fairview-microwave/Categories.json");
						Rendition rendition = asset.getRendition("original");
						InputStream inputStream = rendition.adaptTo(InputStream.class);
						String renditionData = IOUtils.toString(inputStream, "UTF-8");
						IOUtils.closeQuietly(inputStream);
						ObjectMapper objectMapper = new ObjectMapper();
						// Read JSON as a JsonNode
						JsonNode jsonNode = objectMapper.readTree(renditionData);
						for (int i = 0; i < jsonNode.size(); i++) {
							JsonNode jsonObject = jsonNode.get(i).get("category");
							String seoName = null;
							if (jsonObject.has("name")) {
								seoName = jsonObject.get("name").asText();
							}
							if (tag.getTitle() != null) {
								if (tag.getTitle().equals(seoName)) {
									if (jsonObject.has("categorySeoUrl")) {
										categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
										categorySEOUrl = categorySEOUrl.replace("|", "/");
									}
									if (categorySEOUrl != null) {
										appendedUrl = "/category/" + categorySEOUrl;
									}
									if (appendedUrl != null) {
										appendedUrl = updatePersonalInfoService.getDomainName() + appendedUrl + HTML;
										myHashMap.put(tag.getTitle(), appendedUrl);
									}
									break;
								} else {
									Child = jsonObject.get("childCategories");
									for (JsonNode jsSubNode : Child) {
										String childSubCategorName = jsSubNode.get("name").asText();
										if (tag.getTitle().equals(childSubCategorName)) {
											if (jsSubNode.has("categorySeoUrl")) {
												categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
												categorySEOUrl = categorySEOUrl.replace("|", "/");
											}
											if (categorySEOUrl != null) {
												appendedUrl = "/category/" + categorySEOUrl;
											}
											if (appendedUrl != null) {
												appendedUrl = updatePersonalInfoService.getDomainName() + appendedUrl
														+ HTML;
												myHashMap.put(tag.getTitle(), appendedUrl);
											}

										} else {
											JsonNode subChild = jsSubNode.get("childCategories");
											for (JsonNode jsSubSubNode : subChild) {
												String childSubSubCategorName = jsSubSubNode.get("seoName").asText();
												if (tag.getTitle().equals(childSubSubCategorName)) {
													if (jsSubSubNode.has("categorySeoUrl")) {
														categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
														categorySEOUrl = categorySEOUrl.replace("|", "/");
													}
													if (categorySEOUrl != null) {
														appendedUrl = "/category/" + categorySEOUrl;
													}
													if (appendedUrl != null) {
														appendedUrl = updatePersonalInfoService.getDomainName()
																+ appendedUrl + HTML;
														myHashMap.put(tag.getTitle(), appendedUrl);
													}

												}
											}
										}
									}
								}

							}
						}

					}*/
				}
			}
		}
		return myHashMap;
	}

	// fetching all blog pages from blog path, sorted based on publish dates,
	// excluding path /archives
	private LinkedHashSet<String> getQueryResultPath(String queryPath, ResourceResolver resourceResolver, String type) {
		Session session = resourceResolver.adaptTo(Session.class);
		LinkedHashSet<String> pagePaths = new LinkedHashSet<>();
		try {
			Map<String, String> queryMap = new HashMap<>();
			queryMap.put("path", queryPath);
			queryMap.put("type", type);
			queryMap.put("orderby", "@jcr:content/publishDate");
			queryMap.put("orderby.sort", "desc");
			queryMap.put("p.limit", "-1");
			queryMap.put("group.1_group.p.not", "true");
			queryMap.put("group.1_group.path.self", "true");
			queryMap.put("group.1_group.path", queryPath + "/archives");

			Query query = queryBuilder.createQuery(PredicateGroup.create(queryMap), session);
			SearchResult searchResult = query.getResult();
			for (Hit hit : searchResult.getHits()) {
				String pagePath = hit.getPath();
				if (pagePath != null && !pagePath.equals(ApplConstants.EMPTY_STRING)) {
					pagePaths.add(pagePath);
				}
			}
		} catch (RepositoryException repositoryException) {
			log.error("Exception Occurred in query{}", repositoryException.getMessage());
		}
		return pagePaths;
	}

	/*private String getPreviousAttribute(JsonNode jsonObject, String attributeName) {
		String previousAttribute = null;
		if (jsonObject.has(attributeName)) {
			previousAttribute = jsonObject.get("name").asText();
		}
		if (jsonObject.has("categorySeoUrl")) {
			categorySEOUrl = jsonObject.get("categorySeoUrl").asText();
		}

		return previousAttribute;
	}*/
}
