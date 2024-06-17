package com.aem.ie.core.models;

import com.adobe.cq.export.json.ExporterConstants;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.dam.commons.util.DamUtil;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

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

import static com.day.cq.commons.jcr.JcrConstants.JCR_DESCRIPTION;
import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;

/**
 * 
 * @author M1098572
 *
 */
@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TechnicalArticleModel {

	@ScriptVariable
	private ResourceResolver resolver;

	// Multifield Child Resource for articleadetails
	@ChildResource(name = "resourcesdetails")
	Collection<TAModel> resourcesdetails;

	private static final Logger log = LoggerFactory.getLogger(TechnicalArticleModel.class);

	@PostConstruct
	protected void init() {
		resourcesdetails = CollectionUtils.emptyIfNull(this.resourcesdetails);
		for (TAModel taModel : resourcesdetails) {
			String enableHeader = taModel.getEnableHeading();
			pageInfoUpdate(taModel, enableHeader);
		}
	}

	/**
	 * 
	 * @param blogModel
	 * @param enableHeader
	 */
	private void pageInfoUpdate(TAModel taModel, String enableHeader) {
		PageManager pageManager = resolver.adaptTo(PageManager.class);
		Page page = pageManager.getPage(taModel.getArticlelink());
		if (null != page) {
			String title = page.getProperties().get(JCR_TITLE, String.class);
			String description = page.getProperties().get(JCR_DESCRIPTION, String.class);
			if (StringUtils.equals(enableHeader, "true")) {
				if (StringUtils.isEmpty(taModel.getArticletitle())) {
					taModel.setArticletitle(title);
				}
				if (StringUtils.isEmpty(taModel.getArticledescription())) {
					taModel.setArticledescription(description);
				}
			} else {
				taModel.setArticletitle(title);
				taModel.setArticledescription(description);
			}
		}
	}

	/**
	 * 
	 * @return resourcesdetails
	 */
	public Collection<TAModel> getResourcesdetails() {
		return resourcesdetails;
	}

}
