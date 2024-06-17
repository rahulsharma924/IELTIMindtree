package com.aem.ie.core.servlets;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.StringSubstitutor;
import javax.jcr.RepositoryException;
import javax.servlet.Servlet;
import javax.jcr.Node;

import com.aem.ie.core.services.impl.EmailOrderConfirmationDetail;
import com.google.gson.Gson;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import org.apache.commons.io.IOUtils;

import static com.aem.ie.core.constants.ApplConstants.*;

/**
 * Author Anuradha Vunnam
 *
 * @author M1097457
 *
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Email servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=/bin/sendemailorderconfirmation" })
public class SendEmailOnOrderConfirmation extends SlingAllMethodsServlet {
	private static final long serialVersionUID = 2598426539166789516L;
	private static Logger log = LoggerFactory.getLogger(SendEmailOnOrderConfirmation.class);

	@Reference
	private transient MessageGatewayService messageGatewayService;
	@Reference
	private transient ResourceResolverFactory resourceResolverFactory;

	String subjectLine = null;
	String templateBody = null;
    String shipmethodamnt=null;
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		ResourceResolver resolver = request.getResourceResolver();
		try {
			response.setContentType("text/html");
			Map<String, Object> param = new HashMap<String, Object>();
			Node templateNode = resolver.getResource(EMAIL_TEMPLATE_ORDER_CONFIRMATION).adaptTo(Node.class);
			String[] email = request.getParameter("email").split(",");
			log.debug("emailids : {}" , email);
			HtmlEmail htmlEmail = new HtmlEmail();
			final Map<String, String> parameters = new HashMap<String, String>();
			String shippingName = request.getParameter("shippingName");
			String domainname = request.getParameter("domainname");
			String shippingAdd = request.getParameter("shippingadd");
			String shippingAdd2 = request.getParameter("shippingadd2");
			String shippingEmail = request.getParameter("shippingemail");
			String shippingPhone = request.getParameter("shippingPhone");
			String billingName = request.getParameter("billingName");
			String billingAdd = request.getParameter("billingadd");
			String billingAdd2 = request.getParameter("billingadd2");
			if(billingAdd2 == null || billingAdd2.equals("undefined")) {
				billingAdd2="";
			}
			
			String billingEmail = request.getParameter("billingemail");
			String billingPhone = request.getParameter("billingPhone");
			String shippingMethod = request.getParameter("shippingMethod");
			String paymentMethod = request.getParameter("paymentMethod");
			String subTotal = request.getParameter("subTotal");
			String shippingAmt = request.getParameter("ShippingAmt");
			String taxAmt = request.getParameter("TaxAmt");
			String totalAmt = request.getParameter("totalAmt");
			String lineItems = request.getParameter("lineItems");
			String orderNumber = request.getParameter("orderNumber");
			String orderDate = request.getParameter("orderDate");
			if(shippingMethod !=null && !shippingMethod.isEmpty()) {
				parameters.put("shippingmethod", shippingMethod);
			}else {
				shippingMethod="NO SHIPPING";
				parameters.put("shippingmethod", shippingMethod);
			}
			if(shippingAmt !=null && !shippingAmt.isEmpty()) {
				shipmethodamnt="($"+shippingAmt+")";
				parameters.put("ShipmethodAmnt", shipmethodamnt);
			}else {
				shipmethodamnt=StringUtils.EMPTY;
				parameters.put("ShipmethodAmnt", shipmethodamnt);
			}
			parameters.put("shippingName", shippingName);
			parameters.put("shippingadd", shippingAdd);
			parameters.put("shippingadd2", shippingAdd2);
			parameters.put("shippingemail", shippingEmail);
			parameters.put("shippingPhone", shippingPhone);
			parameters.put("billingName", billingName);
			parameters.put("billingadd", billingAdd);
			parameters.put("billingadd2", billingAdd2);
			parameters.put("billingemail", billingEmail);
			parameters.put("billingPhone", billingPhone);
			parameters.put("paymentmethod", paymentMethod);
			parameters.put("subTotal", subTotal);
			parameters.put("ShippingAmt", shippingAmt);
			parameters.put("TaxAmt", taxAmt);
			parameters.put("totalAmt", totalAmt);
			parameters.put("domainname", domainname);
			parameters.put("orderNumber", orderNumber);
			parameters.put("orderDate", orderDate);
			String templateString = loadTemplate(EMAIL_TEMPLATE_ORDER_CONFIRMATION, templateNode, resolver);
			String loopTemplateString = loadDetailTemplate(EMAIL_TEMPLATE_LOOP, templateNode, resolver);
			String proccessedOrderDetail = processOrderDetailsTemplate(parameters, loopTemplateString, lineItems);
			String mailTemplate1 = processTemplate(parameters, templateString, proccessedOrderDetail);

			subjectLine = EMAIL_ORDERCONFIRMATION_SUBLINE+orderNumber;

			CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
			    // Simulate a long-running Job   
			    try {
			    	if (messageGatewayService != null) {
						MessageGateway<HtmlEmail> gateway = messageGatewayService.getGateway(HtmlEmail.class);
						htmlEmail.addTo(email);
						if (subjectLine != null) {
							htmlEmail.setSubject(subjectLine);
						}
						htmlEmail.setHtmlMsg(mailTemplate1);
						gateway.send(htmlEmail);
					}
			    } catch (EmailException e) {
			       log.error("Email Exception Occured ", e.getMessage());
			    }
			  });
			response.getWriter().write("SendEmail call");
		} catch (RuntimeException e) {
			log.error("exception occured ", e);
		} finally {
			if (resolver != null && resolver.isLive()) {
				resolver.close();
			}
		}
	}

	private String processOrderDetailsTemplate(Map<String, String> paramMap, String template, String lineItems) {
		String completeOrderDetails = "";
		StringBuilder allprodAttr = new StringBuilder();
		String productAttribute = "<div style=\"font-weight: normal;\">${attrLabel} : <small style=\"font-weight: bold;font-size:12px\">${attrValue}</small></div>";
		Gson gson = new Gson();
		EmailOrderConfirmationDetail[] orderDetailVar = gson.fromJson(lineItems, EmailOrderConfirmationDetail[].class);
		for (EmailOrderConfirmationDetail emailOrderDetail : orderDetailVar) {
			String template1 = template.replace("${name}", emailOrderDetail.getName());
			template1 = template1.replace("${quantity}", String.valueOf(emailOrderDetail.getQuantity()));
			template1 = template1.replace("${subtotalPrice}", emailOrderDetail.getSubtotalPrice());
			template1 = template1.replace("${price}", emailOrderDetail.getPrice());
			if (StringUtils.isNotBlank(emailOrderDetail.getImpedence())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.IMPEDENCE);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getImpedence());
				allprodAttr.append(tempAttr);
			}
			if (StringUtils.isNotBlank(emailOrderDetail.getColor())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.COLOR);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getColor());
				allprodAttr.append(tempAttr);
			}
			if (StringUtils.isNotBlank(emailOrderDetail.getAttenuation())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.ATTENEATION);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getAttenuation());
				allprodAttr.append(tempAttr);
			}
			if (StringUtils.isNotBlank(emailOrderDetail.getMaxfrequency())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.MAXFREQUENCY);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getMaxfrequency());
				allprodAttr.append(tempAttr);
			}
			if (StringUtils.isNotBlank(emailOrderDetail.getCoaxType())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.COAXTYPE);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getCoaxType());
				allprodAttr.append(tempAttr);
			}
			if (StringUtils.isNotBlank(emailOrderDetail.getFlexType())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.FLEX_TYPE);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getFlexType());
				allprodAttr.append(tempAttr);
			}
			if (StringUtils.isNotBlank(emailOrderDetail.getNoOfshields())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.NUMBER_OF_SHIELDS);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getNoOfshields());
				allprodAttr.append(tempAttr);
			}
			if (StringUtils.isNotBlank(emailOrderDetail.getSku())) {
				String tempAttr = productAttribute;
				tempAttr = tempAttr.replace("${attrLabel}", emailOrderDetail.S_K_U);
				tempAttr = tempAttr.replace("${attrValue}", emailOrderDetail.getSku());
				allprodAttr.append(tempAttr);
			}

			completeOrderDetails = completeOrderDetails + template1;
			completeOrderDetails = completeOrderDetails.replace("placeholder", allprodAttr);
			allprodAttr.setLength(0);
		}

		return completeOrderDetails;
		// json response loop here
	}

	public String loadTemplate(final String path, Node templateNode, ResourceResolver resourceResolver) {
		InputStream templateStream = null;
		try {
			final Node content = resourceResolver.getResource(path + JCR_CONTENT).adaptTo(Node.class);
			templateStream = content.getProperty(JCR_DATA).getBinary().getStream();
			final InputStreamReader streamReader = new InputStreamReader(templateStream, UTF_8);
			final StringWriter templateStrWriter = new StringWriter();
			IOUtils.copy(streamReader, templateStrWriter);

			return templateStrWriter.toString();
		} catch (final IOException | RepositoryException e) {
			log.error("Error while loading mail template {}:{}", path, e.toString());
		} finally {
			IOUtils.closeQuietly(templateStream);
		}
		return null;
	}

	public String loadDetailTemplate(final String path, Node templateNode, ResourceResolver resourceResolver) {
		InputStream templateStream = null;
		try {
			final Node content = resourceResolver.getResource(path + JCR_CONTENT).adaptTo(Node.class);
			templateStream = content.getProperty(JCR_DATA).getBinary().getStream();
			final InputStreamReader streamReader = new InputStreamReader(templateStream, UTF_8);
			final StringWriter templateStrWriter = new StringWriter();
			IOUtils.copy(streamReader, templateStrWriter);

			return templateStrWriter.toString();
		} catch (final IOException | RepositoryException e) {
			log.error("Error while loading mail template {}:{}", path, e.toString());
		} finally {
			IOUtils.closeQuietly(templateStream);
		}
		return null;
	}

	private String processTemplate(Map<String, String> paramMap, String template, String proccessedOrderDetail) {
		StringSubstitutor sub = new StringSubstitutor(paramMap);
		template = sub.replace(template);
		Pattern pattern = Pattern.compile("\\$(\\{)(.*?)(\\})", Pattern.DOTALL);
		Matcher matcher = pattern.matcher(template);
		while (matcher.find()) {
			template = matcher.replaceAll("-N/A-");
		}
		template = template.replace("startloop", proccessedOrderDetail);
		return template;
	}

}
