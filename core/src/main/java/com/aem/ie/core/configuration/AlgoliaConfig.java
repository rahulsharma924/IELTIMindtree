package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Algolia Configurations")
public @interface AlgoliaConfig {
    @AttributeDefinition(name = "Algolia ID")
    String algoliaId() default "";
    @AttributeDefinition(name = "Algolia Key")
    String algoliaKey() default "";
    @AttributeDefinition(name = "Algolia Index in use")
    String indexInuse() default "";
    @AttributeDefinition(name = "Algolia Index Nm ASC")
    String indexNmAsc() default "";
    @AttributeDefinition(name = "Algolia Index Nm DSC")
    String indexNmDsc() default "";
    @AttributeDefinition(name = "Algolia Index Pr ASC")
    String indexPrAsc() default "";
    @AttributeDefinition(name = "Algolia Index Pr DSC")
    String indexPrDsc() default "";
    @AttributeDefinition(name = "Algolia Index BestSeller")
    String indexBs() default "";
    @AttributeDefinition(name = "Algolia IndexContent")
    String indexContent() default "";
    @AttributeDefinition(name = "Algolia IndexContent ASC")
    String indexContentAsc() default "";
    @AttributeDefinition(name = "Algolia IndexContent DSC")
    String indexContentDsc() default "";
    @AttributeDefinition(name = "Algolia IndexQuerySuggest")
    String indexQuerySuggest() default "";
}
