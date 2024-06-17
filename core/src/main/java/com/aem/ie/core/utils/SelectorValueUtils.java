package com.aem.ie.core.utils;

import static com.aem.ie.core.constants.ApplConstants.DOT;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class SelectorValueUtils {
	private static final Logger log = LoggerFactory.getLogger(SelectorValueUtils.class);

	private SelectorValueUtils() {
	}

	public static String getPDPSeoNameSelector(String[] selectors, String seoName) {
		if (selectors.length > 1) {
			seoName = selectors[0];
			for (int i = 1; i < selectors.length; i++) {
				seoName = seoName + DOT + selectors[i];
			}
		} else if (selectors.length != 0) {
			seoName = selectors[0];
		}
		return seoName;
	}

	public static String getPLPSeoNameSelector(String[] selectors, String selector, String categoryValuefinal) {
		if (selectors.length != 0) {
			selector = selectors[0];
		}
		int lastIndexValue = selector.lastIndexOf("/");
		if (lastIndexValue > 0) {
			categoryValuefinal = selector.substring(lastIndexValue + 1);
		} else if (lastIndexValue == -1) {
			categoryValuefinal = selector;
		}
		return categoryValuefinal;
	}

	public static String getPLPSSRSeoNameTagSearchSelector(String[] selectors, String selector,
			String categoryValuefinal) {
		String hiphen = "-";
		// for the category url to search for tag when there is a dot in selector
		if (selectors.length == 1) {
			selector = selectors[0];
		} else if (selectors.length > 1) {
			selector = selectors[0];
			for (int i = 1; i < selectors.length; i++) {
				selector = selector + hiphen + selectors[i];
			}
		}
		int lastIndexValue = selector.lastIndexOf("/");
		if (lastIndexValue > 0) {
			categoryValuefinal = selector.substring(lastIndexValue + 1);
		} else if (lastIndexValue == -1) {
			categoryValuefinal = selector;
		}
		return categoryValuefinal;
	}

	public static String getPLPSSRSelector(String[] selectors, String selector, String categoryValuefinal) {
		String dot = ".";
		// for the category url to search for tag when there is a dot in selector
		if (selectors.length == 1) {
			selector = selectors[0];
		} else if (selectors.length > 1) {
			selector = selectors[0];
			for (int i = 1; i < selectors.length; i++) {
				selector = selector + dot + selectors[i];
			}
		}
		categoryValuefinal = selector;
		return categoryValuefinal;
	}

	public static String getPLPSSRProductListSelector(String[] selectors, String selector) {
		// For bot page with category url to search for products when there is a dot in
		// selector
		if (selectors.length != 0 && selectors.length == 1) {
			selector = selectors[0];
		} else if (selectors.length != 0) {
			selector = selectors[0];
			for (int i = 1; i < selectors.length; i++) {
				selector = selector + DOT + selectors[i];
			}
		}
		return selector;
	}

	public static Map<String, String> getCategorySeoNameValues(String categoryValuefinal, ObjectMapper objectMapper,
			String renditionData) {
		String CategoryURLPath = null;
		String SEOTagName = null;
		String Level1seoName = null;
		String Level2seoName = null;
		JsonNode Child;
		Map results = new HashMap<String, String>();
		try {
			String name = null;
			String seoName = null;

			// Read JSON as a JsonNode
			JsonNode jsonNode = objectMapper.readTree(renditionData);
			for (int i = 0; i < jsonNode.size(); i++) {

				JsonNode nodelevel0 = jsonNode.get(i).get("category");

				if (nodelevel0.has("seoName")) {
					seoName = nodelevel0.get("seoName").asText();
				}
				if (categoryValuefinal.equals(seoName)) {
					name = nodelevel0.get("name").asText();
					CategoryURLPath = nodelevel0.get("categorySeoUrl").asText();
					SEOTagName = nodelevel0.get("seoTagName").asText();
					results.put("name", name);
					results.put("urlpath", CategoryURLPath);
					results.put("seotagname", SEOTagName);

					break;
				} else {
					Child = nodelevel0.get("childCategories");
					for (JsonNode jsSubNode : Child) {
						Level1seoName = jsSubNode.get("seoName").asText();
						if (categoryValuefinal.equals(Level1seoName)) {
							name = jsSubNode.get("name").asText();
							// JsonNode CategoryURLPath1=jsonObject.get("categorySeoUrl");
							CategoryURLPath = jsSubNode.get("categorySeoUrl").asText();
							SEOTagName = jsSubNode.get("seoTagName").asText();
							results.put("name", name);
							results.put("urlpath", CategoryURLPath);
							results.put("seotagname", SEOTagName);
							break;
						} else {
							JsonNode subChild = jsSubNode.get("childCategories");
							for (JsonNode jsSubSubNode : subChild) {
								Level2seoName = jsSubSubNode.get("seoName").asText();
								if (categoryValuefinal.equals(Level2seoName)) {
									name = jsSubSubNode.get("name").asText();
									CategoryURLPath = jsSubSubNode.get("categorySeoUrl").asText();
									SEOTagName = jsSubSubNode.get("seoTagName").asText();
									results.put("name", name);
									results.put("urlpath", CategoryURLPath);
									results.put("seotagname", SEOTagName);
									break;
								}
							}
						}

					}

				}
			}
		} catch (IOException e) {
			log.error("Repository and Unsupported encoding Excpetion occured" + e.getLocalizedMessage());
		}
		return results;

	}

}
