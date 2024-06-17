package com.aem.ie.core.servlets;

import javax.servlet.Servlet;

import com.aem.ie.core.Service.PLPCTGraphqlProductsService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

import static com.aem.ie.core.constants.ServletConstants.PLP_CT_GRAPHQL_PRODUCTS;

@Component(service=Servlet.class,
        property={Constants.SERVICE_DESCRIPTION+"=PLP CT Graphql Products",
                ServletResolverConstants.SLING_SERVLET_METHODS+"="+ HttpConstants.METHOD_POST,
                ServletResolverConstants.SLING_SERVLET_PATHS+"="+ PLP_CT_GRAPHQL_PRODUCTS
        })
public class PLPCTGraphqlProductsServlet extends SlingAllMethodsServlet {
        private static final Logger log = LoggerFactory.getLogger(PLPCTGraphqlProductsServlet.class);

        @Reference
        private transient PLPCTGraphqlProductsService plpctGraphqlProductsService;

        protected void doPost(final SlingHttpServletRequest slingRequest, final SlingHttpServletResponse slingResponse) throws IOException {
                String bearerToken = slingRequest.getParameter("bearerToken");
                String jsonData = slingRequest.getParameter("jsonData");
                String responseValue = plpctGraphqlProductsService.getPLPCTGraphqlProducts(bearerToken,jsonData);
                slingResponse.setContentType("application/json");
                slingResponse.getWriter().write(responseValue);
        }
}
