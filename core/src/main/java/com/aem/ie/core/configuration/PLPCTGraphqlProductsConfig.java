package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name="PLP CT Graphql Products Config")
public @interface PLPCTGraphqlProductsConfig {
    @AttributeDefinition(name="Get PLP CT Graphql Products URL",description = "Get PLP Products from CT Graphql Products URL")
    String getPLPCTGraphqlProductsUrl();
}
