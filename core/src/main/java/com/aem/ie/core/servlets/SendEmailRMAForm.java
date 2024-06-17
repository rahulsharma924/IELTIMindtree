package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ApplConstants.JCR_CONTENT;
import static com.aem.ie.core.constants.ApplConstants.JCR_DATA;
import static com.aem.ie.core.constants.ApplConstants.RMA_EMAIL_IE_TEMPLATE_LOOP;
import static com.aem.ie.core.constants.ApplConstants.RMA_EMAIL_TEMPLATE;
import static com.aem.ie.core.constants.ApplConstants.RMA_EMAIL_TEMPLATE_SENDIE;
import static com.aem.ie.core.constants.ApplConstants.UTF_8;
import static com.aem.ie.core.constants.ServletConstants.SEND_EMAIL_RMA;
import static com.aem.ie.core.constants.ApplConstants.SALES_IE_EMAIL;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_RMA_SUBLINE;

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
import com.aem.ie.core.services.impl.RMAFormSkuDetails;
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
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + SEND_EMAIL_RMA })
public class SendEmailRMAForm extends SlingAllMethodsServlet {
	private static Logger log = LoggerFactory.getLogger(SendEmailRMAForm.class);
	@Reference
	private transient MessageGatewayService messageGatewayService;

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		ResourceResolver resolver = request.getResourceResolver();
		try {
			Node templateNode = resolver.getResource(RMA_EMAIL_TEMPLATE).adaptTo(Node.class);
			String ieemail = request.getParameter("salesteamemail");
			HtmlEmail htmlEmail = new HtmlEmail();
			HtmlEmail htmlIEEmail = new HtmlEmail();
			String domainname = request.getParameter("domainname");
			String fname = request.getParameter("rfname");
			String rcompany = request.getParameter("rcompany");
			String remail = request.getParameter("email");
			String rmjob = request.getParameter("rjob");
			String rmphone = request.getParameter("rphone");
			String rmcity = request.getParameter("rcity");
			String rmstate = request.getParameter("rstate");
			String rmzip = request.getParameter("rzip");
			String rmcountry = request.getParameter("rcountry");
			String rminvoice = request.getParameter("rinvoice");
			String rmpo = request.getParameter("rpo");
			String rmsignature = request.getParameter("rsignature");
			String rmdate = request.getParameter("rdate");
			String rordertype = request.getParameter("ordertype");
			String rskuvalue = request.getParameter("rskuvalues");
			final Map<String, String> parameters = new HashMap<String, String>();
			parameters.put("email", remail);
			parameters.put("name", fname);
			parameters.put("company", rcompany);
			parameters.put("job", rmjob);
			parameters.put("phone", rmphone);
			parameters.put("city", rmcity);
			parameters.put("state", rmstate);
			parameters.put("zip", rmzip);
			parameters.put("country", rmcountry);
			parameters.put("invoice", rminvoice);
			parameters.put("po", rmpo);
			parameters.put("signature", rmsignature);
			parameters.put("date", rmdate);
			parameters.put("ordertype", rordertype);
			parameters.put("domainname", domainname);

			String templateString = loadTemplate(RMA_EMAIL_TEMPLATE, templateNode, resolver);
			String mailTemplatemail = processTemplateemail(parameters, templateString);
			// send email structure impl for IE
			String templateStringie = loadTemplateie(RMA_EMAIL_TEMPLATE_SENDIE, templateNode, resolver);

			String loopTemplateString = loadDetailTemplate(RMA_EMAIL_IE_TEMPLATE_LOOP, templateNode, resolver);
			String proccessedOrderDetail = processOrderDetailsTemplate(parameters, loopTemplateString, rskuvalue);
			String mailTemplate1 = processTemplate(parameters, templateStringie, proccessedOrderDetail);

			String subjectLine = EMAIL_RMA_SUBLINE;
			if (messageGatewayService != null) {
				MessageGateway<HtmlEmail> gateway = messageGatewayService.getGateway(HtmlEmail.class);
				if (remail.equals(remail)) {
					htmlEmail.addTo(remail);
					if (subjectLine != null) {
						htmlEmail.setSubject(subjectLine);
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
			log.error("Exception is occurred while sending an email : {}", e.getMessage());

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
	private String processOrderDetailsTemplate(Map<String, String> paramMap, String template, String rskuvalue) {
		String completeOrderDetails = "";

		Gson gson = new Gson();
		RMAFormSkuDetails[] rskuvalues = gson.fromJson(rskuvalue, RMAFormSkuDetails[].class);
		for (RMAFormSkuDetails rmaskuDetail : rskuvalues) {
			String template1 = template.replace("${skuvalue}", rmaskuDetail.getSku());
			template1 = template1.replace("${quantity}", rmaskuDetail.getQuantity());
			template1 = template1.replace("${reorder}", rmaskuDetail.getReoder());
			completeOrderDetails = completeOrderDetails + template1;
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
