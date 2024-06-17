package com.aem.ie.core.models;

import java.util.Collection;

import javax.annotation.PostConstruct;

import org.apache.commons.collections4.CollectionUtils;
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
import com.aem.ie.core.constants.ApplConstants;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;

@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)

public class ResourceCardSlingModel {
	@ScriptVariable
	private ResourceResolver resolver;
	// Multifield Child Resource for resourceCards
	@ChildResource(name = "resourceCards")
	Collection<ResourceCardModel> resourceCards;
	private static final Logger log = LoggerFactory.getLogger(ResourceCardSlingModel.class);

	@PostConstruct
	protected void init() {
		resourceCards = CollectionUtils.emptyIfNull(this.resourceCards);
		for (ResourceCardModel resourceCard : resourceCards) {
			Resource res = resolver.getResource(resourceCard.getResourceLink());
			String showCustom = resourceCard.getShowCustom();
			if (null != res) {
				assetInfoUpdate(resourceCard, showCustom, res);
			}
		}
	}

	/**
	 * 
	 * @param resourceCard
	 * @param showCustom
	 * @param res
	 */
	private void assetInfoUpdate(ResourceCardModel resourceCard, String showCustom, Resource res) {
		Asset asset = res.adaptTo(Asset.class);
		if ((null != asset) && (!showCustom.equals("true"))) {
			String title = asset.getMetadataValue(DamConstants.DC_TITLE);
			String description = asset.getMetadataValue(DamConstants.DC_DESCRIPTION);
			if (title != null && !title.equals(ApplConstants.EMPTY_STRING)) {
				resourceCard.setTitle(title);
			}
			if (description != null && !description.equals(ApplConstants.EMPTY_STRING)) {
				resourceCard.setDescription(description);
			}
		}

	}

	/**
	 * 
	 * @return resourceCards
	 */
	public Collection<ResourceCardModel> getResourceCards() {
		return resourceCards;
	}

}
