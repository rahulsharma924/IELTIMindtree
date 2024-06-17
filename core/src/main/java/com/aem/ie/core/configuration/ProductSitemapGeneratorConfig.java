//This configuration will be used for Product, ProductImage and ProductPdf sitemap generation
package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Product SiteMap Generator Configurations")
public @interface ProductSitemapGeneratorConfig {
    @AttributeDefinition(name = "ProductSiteMap Generator XML Path")
    String xmlPath() default "/content/fm/sitemap_product.xml";
    @AttributeDefinition(name = "Product Image SiteMap Generator XML Path")
    String productImageXmlPath() default "/content/fm/sitemap_productimage.xml";
    @AttributeDefinition(name = "Product Datasheet PDF SiteMap Generator XML Path")
    String productDatasheetPdfXmlPath() default "/content/fm/sitemap_datasheet_pdf.xml";
    @AttributeDefinition(name = "Product 2DImage PDF SiteMap Generator XML Path")
    String product2DImagePdfXmlPath() default "/content/fm/sitemap_2Dimage_pdf.xml";
    @AttributeDefinition(name = "Algolia Application ID")
    String applicationId() default "testing20MRCI4146";
    @AttributeDefinition(name = "Algolia API KEY")
    String apiKey() default "9c0405dc100de0831e5d1186ccd36fe4";
    @AttributeDefinition(name = "Algolia Index Name")
    String indexName() default "fm_product_en_qa";
    @AttributeDefinition(name ="Last modified Date for Pages", description = "Please enter date in format of YYYY-MM-DD")
    String lastModifiedDate() default "2023-07-11";
    @AttributeDefinition(name ="Product Image root path")
    String productImageRootPath() default "/content/dam/infinite-electronics/product-assets/fairview-microwave/images/";
    @AttributeDefinition(name ="Product Datasheet root path")
    String productDatasheetRootPath() default "/content/dam/infinite-electronics/product-assets/fairview-microwave/product-datasheets/";
    @AttributeDefinition(name ="Product Datasheet root path")
    String product2DdrawingRootPath() default "/content/dam/infinite-electronics/product-assets/fairview-microwave/2d-drawings/";
}
