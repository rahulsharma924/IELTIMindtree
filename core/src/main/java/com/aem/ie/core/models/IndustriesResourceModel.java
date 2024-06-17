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

import static com.day.cq.commons.jcr.JcrConstants.JCR_TITLE;

/**
 * 
 * @author M1098572
 *
 */
@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class IndustriesResourceModel {

	@ScriptVariable
	private ResourceResolver resolver;

	// Multifield Child Resource for resourcesdetails
	@ChildResource(name = "resourcesdetails")
	Collection<IRModel> resourcesdetails;

	private static final Logger log = LoggerFactory.getLogger(IndustriesResourceModel.class);

	@PostConstruct
	protected void init() {
		resourcesdetails = CollectionUtils.emptyIfNull(this.resourcesdetails);
		for (IRModel irModel : resourcesdetails) {
			if (StringUtils.startsWith(irModel.getPdflink(), "/content/")) {
				String enableHeader = irModel.getEnableHeading();
				Resource res = resolver.getResource(irModel.getPdflink());
				if (null != res) {
					boolean isAsset = DamUtil.isAsset(res);
					if (isAsset) {
						assetInfoUpdate(irModel, enableHeader, res);
					} else {
						pageInfoUpdate(irModel, enableHeader);
					}
				}
			}
		}
	}

	/**
	 * 
	 * @param blogModel
	 * @param enableHeader
	 */
	private void pageInfoUpdate(IRModel irModel, String enableHeader) {
		PageManager pageManager = resolver.adaptTo(PageManager.class);
		Page page = pageManager.getPage(irModel.getPdflink());
		irModel.setPdflink(irModel.getPdflink() + ".html");
		String title = page.getProperties().get(JCR_TITLE, String.class);
		if (StringUtils.equals(enableHeader, "true")) {
			if (StringUtils.isEmpty(irModel.getTitle())) {
				irModel.setPdftitle(title);
			}
		} else {
			irModel.setPdftitle(title);
		}
		irModel.setListFrom("viewmore");
	}

	/**
	 * 
	 * @param blogModel
	 * @param enableHeader
	 * @param res
	 */
	private void assetInfoUpdate(IRModel irModel, String enableHeader, Resource res) {
		Asset asset = res.adaptTo(Asset.class);
		String assetTitle = asset.getMetadataValue(DamConstants.DC_TITLE);
		if (StringUtils.equals(enableHeader, "true")) {
			if (StringUtils.isEmpty(irModel.getTitle())) {
				irModel.setPdftitle(assetTitle);
			}
		} else {
			irModel.setPdftitle(assetTitle);
		}
		irModel.setListFrom("pdf");
	}

	/**
	 * 
	 * @return IRModel
	 */
	public Collection<IRModel> getResourcesdetails() {
		return resourcesdetails;
	}
}
