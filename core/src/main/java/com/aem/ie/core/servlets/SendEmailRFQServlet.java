package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.SEND_EMAIL_RFQ;
import static com.aem.ie.core.constants.ApplConstants.RFQ_EMAIL_TEMPLATE;
import static com.aem.ie.core.constants.ApplConstants.RFQ_USERLOOP_EMAIL_TEMPLATE;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_TEMPLATE_SENDIE;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_IE_TEMPLATE_LOOP;
import static com.aem.ie.core.constants.ApplConstants.PDP_EMAIL_TEMPLATE_SENDIE;
import static com.aem.ie.core.constants.ApplConstants.PDP_EMAIL_IE_TEMPLATE_LOOP;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_RFQ_USER_SUBLINE;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_RFQ_IE_SUBLINE;
import static com.aem.ie.core.constants.ApplConstants.JCR_CONTENT;
import static com.aem.ie.core.constants.ApplConstants.JCR_DATA;
import static com.aem.ie.core.constants.ApplConstants.UTF_8;
import static com.aem.ie.core.constants.ApplConstants.SALES_IE_EMAIL;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.servlet.Servlet;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.commons.text.StringSubstitutor;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.services.impl.EmailOrderDetail;
import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.google.gson.Gson;

/**
 * Author Anuradha Vunnam
 * 
 * @author M1097457
 *
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Email servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + SEND_EMAIL_RFQ })
public class SendEmailRFQServlet extends SlingAllMethodsServlet {
	private static Logger log = LoggerFactory.getLogger(SendEmailRFQServlet.class);
	@Reference
	private transient MessageGatewayService messageGatewayService;
	private String email = null;
	private String ieemail = null;
	private String mailTemplatemail = null;
	private String mailTemplate1 = null;
	private String name = null;

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		ResourceResolver resolver = request.getResourceResolver();

		try {
			HtmlEmail htmlEmail = new HtmlEmail();
			HtmlEmail htmlIEEmail = new HtmlEmail();
			String pageurl = request.getParameter("linkurl");
			if (!pageurl.contains("/continue-shopping")) {
				Node templateNode = resolver.getResource(RFQ_EMAIL_TEMPLATE).adaptTo(Node.class);
				email = request.getParameter("email");
				ieemail = request.getParameter("ieemailidval");
				String domainname = request.getParameter("domainname");
				String shippingName = request.getParameter("shippingName");
				String shippingAdd = request.getParameter("shippingadd");
				String shippingAdd2 = request.getParameter("shippingadd2");
				String shippingEmail = request.getParameter("shippingemail");
				String shippingPhone = request.getParameter("shippingPhone");
				String billingName = request.getParameter("billingName");
				String billingAdd = request.getParameter("billingadd");
				String billingAdd2 = request.getParameter("billingadd2");
				String billingEmail = request.getParameter("billingemail");
				String billingPhone = request.getParameter("billingPhone");
				String orderDetails = request.getParameter("cartresponse");
				final Map<String, String> parameters = new HashMap<String, String>();
				parameters.put("email", email);
				parameters.put("domainname", domainname);
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
				name = request.getParameter("customername");
				String templateString = loadTemplate(RFQ_EMAIL_TEMPLATE, templateNode, resolver);
				String loopTemplateStringuser = loadDetailTemplate(RFQ_USERLOOP_EMAIL_TEMPLATE, templateNode, resolver);
				String proccessedOrderDetail1 = processOrderDetailsTemplate(parameters, loopTemplateStringuser,
						orderDetails);
				mailTemplatemail = processTemplate(parameters, templateString, proccessedOrderDetail1);
				
				// send email structure impl for IE
				String templateStringie = loadTemplateie(PDP_EMAIL_TEMPLATE_SENDIE, templateNode, resolver);

				String loopTemplateString = loadDetailTemplate(PDP_EMAIL_IE_TEMPLATE_LOOP, templateNode, resolver);
				String proccessedOrderDetail = processOrderDetailsTemplate(parameters, loopTemplateString,
						orderDetails);
				mailTemplate1 = processTemplate(parameters, templateStringie, proccessedOrderDetail);
			} else {
				Node templateNode = resolver.getResource(RFQ_EMAIL_TEMPLATE).adaptTo(Node.class);
				email = request.getParameter("email");
				ieemail = request.getParameter("ieemailidval");
				String domainname = request.getParameter("domainname");
				String orderDetails = request.getParameter("cartresponse");
				String totalPrice = request.getParameter("totalPrice");
				String subTotal = request.getParameter("subTotal");
				String shippingVal = request.getParameter("ShippingAmt");
				String taxpriceVal = request.getParameter("TaxAmt");
				String ordertotal = request.getParameter("totalAmt");
				String shippingName = request.getParameter("shippingName");
				String shippingAdd = request.getParameter("shippingadd");
				String shippingAdd2 = request.getParameter("shippingadd2");
				String shippingEmail = request.getParameter("shippingemail");
				String shippingPhone = request.getParameter("shippingPhone");
				String billingName = request.getParameter("billingName");
				String billingAdd = request.getParameter("billingadd");
				String billingAdd2 = request.getParameter("billingadd2");
				String billingEmail = request.getParameter("billingemail");
				String billingPhone = request.getParameter("billingPhone");
				final Map<String, String> parameters = new HashMap<String, String>();
				parameters.put("email", email);
				parameters.put("domainname", domainname);
				parameters.put("totalPrice", totalPrice);
				parameters.put("subTotal", subTotal);
				parameters.put("ShippingAmt", shippingVal);
				parameters.put("TaxAmt", taxpriceVal);
				parameters.put("totalAmt", ordertotal);
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
				name = request.getParameter("customername");
				String templateString = loadTemplate(RFQ_EMAIL_TEMPLATE, templateNode, resolver);
				String loopTemplateStringuser = loadDetailTemplate(RFQ_USERLOOP_EMAIL_TEMPLATE, templateNode, resolver);
				String proccessedOrderDetail1 = processOrderDetailsTemplate(parameters, loopTemplateStringuser,
						orderDetails);
				mailTemplatemail = processTemplate(parameters, templateString, proccessedOrderDetail1);
				
				// send email structure impl for IE
				String templateStringie = loadTemplateie(EMAIL_TEMPLATE_SENDIE, templateNode, resolver);

				String loopTemplateString = loadDetailTemplate(EMAIL_IE_TEMPLATE_LOOP, templateNode, resolver);
				String proccessedOrderDetail = processOrderDetailsTemplate(parameters, loopTemplateString,
						orderDetails);
				mailTemplate1 = processTemplate(parameters, templateStringie, proccessedOrderDetail);
			}
			String custsubjectLine = null;
			if (name != null) {
				custsubjectLine = EMAIL_RFQ_USER_SUBLINE + " " + name;
			}
			String subjectLine = EMAIL_RFQ_IE_SUBLINE + " " + name;
			if (messageGatewayService != null) {
				MessageGateway<HtmlEmail> gateway = messageGatewayService.getGateway(HtmlEmail.class);
				if (email.equals(email)) {
					htmlEmail.addTo(email);
					if (custsubjectLine != null) {
						htmlEmail.setSubject(custsubjectLine);
					}
					htmlEmail.setHtmlMsg(mailTemplatemail);
					gateway.send(htmlEmail);
				}

				if (ieemail.equals(ieemail)) {
					htmlIEEmail.addTo(ieemail);
					if (subjectLine != null) {
						htmlIEEmail.setSubject(subjectLine);
					}
					htmlIEEmail.setHtmlMsg(mailTemplate1);
					gateway.send(htmlIEEmail);
				}
			}
			response.getWriter().write("SendEmail call");
		} catch (EmailException | RuntimeException e) {
			log.error("Exception is occurred while sending an email : {}" , e.getMessage());

		} finally {
			if (resolver != null && resolver.isLive()) {
				resolver.close();
			}
		}
	}

	// send email structure to the USER
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

	private String processTemplateemail(Map<String, String> paramMap, String template) {
		StringSubstitutor sub = new StringSubstitutor(paramMap);
		template = sub.replace(template);
		Pattern pattern = Pattern.compile("\\$(\\{)(.*?)(\\})", Pattern.DOTALL);
		Matcher matcher = pattern.matcher(template);
		while (matcher.find()) {
			template = matcher.replaceAll("-N/A-");
		}
		return template;
	}

	// Send email structure to the IE sales team
	private String processOrderDetailsTemplate(Map<String, String> paramMap, String template, String orderDetails) {
		String completeOrderDetails = "";
		String template1="";
		StringBuilder allprodAttr = new StringBuilder();
		String productAttribute = "<div style=\"font-weight: normal;\">${attrLabel}:<small style=\"font-weight: bold;\">${attrValue}</small></div>";
		Gson gson = new Gson();
		EmailOrderDetail[] orderDetailVar = gson.fromJson(orderDetails, EmailOrderDetail[].class);
		for (EmailOrderDetail emailOrderDetail : orderDetailVar) {
			// String template1 = template.replace("${sku}", emailOrderDetail.getSku());
			template1 = template.replace("${image}", emailOrderDetail.getImage());
			template1 = template1.replace("${productdesc}", emailOrderDetail.getName());
			template1 = template1.replace("${quantity}", emailOrderDetail.getQuantity());
			template1 = template1.replace("${unitprice}", emailOrderDetail.getUnitPrice());
			template1 = template1.replace("${subtotal}", emailOrderDetail.getSubtotalPrice());
			//template1 = template1.replace("${sku}", emailOrderDetail.getSku());
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
	}


	public String loadTemplateie(final String path, Node templateNode, ResourceResolver resourceResolver) {
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
