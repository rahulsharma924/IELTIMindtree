package com.aem.ie.core.servlets;

import com.aem.ie.core.Service.PayflowTokenService;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.lang3.StringUtils;
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

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

import static com.aem.ie.core.constants.ApplConstants.*;
import static com.aem.ie.core.constants.ServletConstants.GENERATE_TRANSACTION_ID;

@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "= Generate Transaction id servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + GENERATE_TRANSACTION_ID })
public class PayflowTransactionResponseServelet extends SlingAllMethodsServlet {
	private static final Logger log = LoggerFactory.getLogger(PayflowTransactionResponseServelet.class);
	@Reference
	private transient PayflowTokenService paypalTokenService;

	@Override
	protected void doPost(SlingHttpServletRequest slingRequest, SlingHttpServletResponse slingResponse)
			throws ServletException, IOException {
		String transactionId = slingRequest.getParameter("PNREF");
		String customerToken = slingRequest.getParameter("USER1");
		String bearerToken = slingRequest.getParameter("USER2");
		String ponumber = slingRequest.getParameter("USER3");
		log.info("PayflowTransactionResponseServelet transactionId : {}",transactionId);
		log.info("PayflowTransactionResponseServelet customerToken : {}",customerToken);
		log.info("PayflowTransactionResponseServelet ponumber : {}",ponumber);
		String responseValue = paypalTokenService.placeOrder(customerToken, bearerToken, transactionId, ponumber);
		JsonObject responseJson = null;
		// Start of new logic
		slingResponse.setContentType("application/json");
		if(StringUtils.isNotEmpty(responseValue)){
			responseJson = JsonParser.parseString(responseValue).getAsJsonObject();
			if(responseJson.has("id") && StringUtils.isNotEmpty(responseJson.get("id").getAsString())){
				String orderId = responseJson.get("id").getAsString();
				log.info("PayflowTransactionResponseServelet orderId : {}",orderId);
				slingResponse.sendRedirect(PAY_FLOW_TRANSACTION_SUCCESS_HTML + orderId);
			} else{
				log.info("PayflowTransactionResponseServelet with out Id");
				log.info("PayflowTransactionResponseServelet PAY_FLOW_TRANSACTION_FAILURE_HTML Path : {}",PAY_FLOW_TRANSACTION_FAILURE_HTML);
				slingResponse.sendRedirect(PAY_FLOW_TRANSACTION_FAILURE_HTML);
			}
		} else{
			log.info("PayflowTransactionResponseServelet TRANSACTION FAILURE");
			log.info("PayflowTransactionResponseServelet PAY_FLOW_TRANSACTION_FAILURE_HTML Path : {}",PAY_FLOW_TRANSACTION_FAILURE_HTML);
			slingResponse.sendRedirect(PAY_FLOW_TRANSACTION_FAILURE_HTML);
		}
		// End of new logic
	}
}