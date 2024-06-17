package com.aem.ie.core.models;

import java.util.Collection;

import javax.annotation.PostConstruct;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ExporterConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)

public class CalAndConvertorSlingModel {

	@ScriptVariable
	private ResourceResolver resolver;
	// Multifield Child Resource for convertersLinksDetails
	@ChildResource(name = "convertersLinksDetails")
	Collection<CalAndConvertersModel> convertersLinksDetails;

	private static final Logger log = LoggerFactory.getLogger(CalAndConvertorSlingModel.class);

	@PostConstruct
	protected void init() {
		convertersLinksDetails = CollectionUtils.emptyIfNull(this.convertersLinksDetails);
		for (CalAndConvertersModel convertersLinksDetails : convertersLinksDetails) {
			String showCustom = convertersLinksDetails.getShowCustom();
			pageInfoUpdate(convertersLinksDetails, showCustom);
		}
	}

	/**
	 * 
	 * @param convertersLinksDetails
	 * @param showCustom
	 */
	private void pageInfoUpdate(CalAndConvertersModel convertersLinksDetails, String showCustom) {
		PageManager pageManager = resolver.adaptTo(PageManager.class);
		Page page = pageManager.getPage(convertersLinksDetails.getResourceLink());
		if ((null != page) && (!StringUtils.equals(showCustom, "true"))) {
			String title = page.getProperties().get(JCR_TITLE, String.class);
			String category = page.getProperties().get("category", String.class);
			convertersLinksDetails.setTitle(title);
			convertersLinksDetails.setCategory(category);
		}
	}

	/**
	 * 
	 * @return convertersLinksDetails
	 */
	public Collection<CalAndConvertersModel> getConvertersLinksDetails() {
		return convertersLinksDetails;
	}

}
