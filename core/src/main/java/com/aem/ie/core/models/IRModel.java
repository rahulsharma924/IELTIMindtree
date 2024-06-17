package com.aem.ie.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * 
 * @author M1098572
 *
 */
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class IRModel {
	  @ValueMapValue(name = "labelname")
	  private String labelname;
	  
	  @ValueMapValue(name = "enableHeading")
	  private String enableHeading;

	  @ValueMapValue(name = "title")
	  private String title;
	  
	  @ValueMapValue(name = "description")
	  private String description;
	  
	  @ValueMapValue(name = "image")
	  private String image;
	  
	  @ValueMapValue(name = "pdftitle")
	  private String pdftitle;
	  
	  @ValueMapValue(name = "pdflink")
	  private String pdflink;
	  
	  @ValueMapValue(name = "iconimagepath")
	  private String iconimagepath;

	 @ValueMapValue(name = "enablePdfIcon")
	  private boolean enablePdfIcon;

	public boolean getEnablePdfIcon() {
		return enablePdfIcon;
	}

	public void setEnablePdfIcon(boolean enablePdfIcon) {
		this.enablePdfIcon = enablePdfIcon;
	}

	public String getIconimagepath() {
		return iconimagepath;
	}

	public void setIconimagepath(String iconimagepath) {
		this.iconimagepath = iconimagepath;
	}

	private String listFrom;

	
	public String getListFrom() {
		return listFrom;
	}

	public void setListFrom(String listFrom) {
		this.listFrom = listFrom;
	}

	public String getLabelname() {
		return labelname;
	}

	public void setLabelname(String labelname) {
		this.labelname = labelname;
	}
	
	public String getEnableHeading() {
		return enableHeading;
	}

	public void setEnableHeading(String enableHeading) {
		this.enableHeading = enableHeading;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getPdftitle() {
		return pdftitle;
	}

	public void setPdftitle(String pdftitle) {
		this.pdftitle = pdftitle;
	}
	
	public String getPdflink() {
		return pdflink;
	}

	public void setPdflink(String pdflink) {
		this.pdflink = pdflink;
	}
	

}
