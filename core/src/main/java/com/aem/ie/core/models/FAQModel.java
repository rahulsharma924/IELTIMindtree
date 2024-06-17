package com.aem.ie.core.models;

import com.adobe.cq.dam.cfm.ContentFragment;
import com.aem.ie.core.constants.ApplConstants;
import static com.aem.ie.core.constants.ApplConstants.FAQ_CF_PATH;
import com.aem.ie.core.models.datamodels.FAQ;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.*;
import java.util.stream.Collectors;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FAQModel {

	private static final Logger log = LoggerFactory.getLogger(FAQModel.class);

	@Inject
	private QueryBuilder builder;

	@Inject
	private ResourceResolver resourceresolver;

	@Inject
	SlingHttpServletRequest request;

	Map<String, String> predicateMap = new HashMap<>();

	private String question = ApplConstants.EMPTY_STRING;
	private String answer = ApplConstants.EMPTY_STRING;
	private String faqTag = ApplConstants.EMPTY_STRING;

	List<FAQ> faqList = new ArrayList<>();
	Map<String, List<FAQ>> viewAllFaqList = new LinkedHashMap<String, List<FAQ>>();
	Map<String, List<FAQ>> faqCategoryList;

	public Map<String, List<FAQ>> getViewAllFaqList() {
		return viewAllFaqList;
	}

	public Map<String, List<FAQ>> getFaqCategoryList() {
		return faqCategoryList;
	}

	@PostConstruct
	protected void init() {
		try {
			String selector = request.getRequestPathInfo().getSelectorString();
			if (selector != null) {
				predicateMap = new HashMap<>();
				predicateMap.put("path", "/content/dam/infinite-electronics/content-fragment/fairview-microwave/faq");
				predicateMap.put("type", DamConstants.NT_DAM_ASSET);
				predicateMap.put("orderby", "path");
				predicateMap.put("p.limit", "-1");
				Session session = resourceresolver.adaptTo(Session.class);
				Query query = builder.createQuery(PredicateGroup.create(predicateMap), session);
				SearchResult result = query.getResult();
				if (result.getTotalMatches() > 0) {
					for (Hit hit : result.getHits()) {
						Resource resource = hit.getResource();
						ContentFragment contfragment = resource.adaptTo(ContentFragment.class);
						String tagCategoryKey = null;
						assert contfragment != null;
						String[] tags = contfragment.getElement("faqTag").getValue().getValue(String[].class);
						if (tags != null) {
							String tagValue = Arrays.toString(tags);
							String[] tagCategoryValue = tagValue.split("/");
							for (int i = 0; i <= tagCategoryValue.length; i++) {
								tagCategoryKey = tagCategoryValue[1];
							}
							if (tagCategoryKey != null) {
								faqTag = tagCategoryKey.replace("]", "");
							}
							if (faqTag != null) {
								faqTag = faqTag.substring(0, 1).toUpperCase() + faqTag.substring(1).toLowerCase();
							}
						}
						question = contfragment.getElement("question").getContent();
						answer = contfragment.getElement("answer").getContent();
						if (question != null && answer != null && faqTag != null && selector.equals("all")) {
							FAQ faq = new FAQ();
							faq.setAnswer(answer);
							faq.setQuestion(question);
							if (faqTag.contains("-")) {
								faq.setFaqTag(faqTag.replace("-", " "));
							} else {
								faq.setFaqTag(faqTag);
							}
							faqList.add(faq);

						} else if (question != null && answer != null && selector.equalsIgnoreCase(faqTag)) {
							if (selector.equalsIgnoreCase(faqTag)) {
								FAQ faq = new FAQ();
								faq.setAnswer(answer);
								faq.setQuestion(question);
								if (faqTag.contains("-")) {
									faq.setFaqTag(faqTag.replace("-", " "));
								} else {
									faq.setFaqTag(faqTag);
								}
								faqList.add(faq);
							}
						}

					}
				}
				if (selector.equals("all")) {
					viewAllFaqList = faqList.stream()
							.collect(Collectors.groupingBy(FAQ::getFaqTag, LinkedHashMap::new, Collectors.toList()));

				} else {
					faqCategoryList = faqList.stream().collect(Collectors.groupingBy(FAQ::getFaqTag));
				}
			}

		} catch (RepositoryException e) {
			log.error("Repository and Unsupported encoding Exception occurred{}", e.getLocalizedMessage());
		}
	}
}
