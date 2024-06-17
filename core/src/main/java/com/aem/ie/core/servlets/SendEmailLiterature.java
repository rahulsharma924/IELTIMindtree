package com.aem.ie.core.servlets;

import static com.aem.ie.core.constants.ServletConstants.SEND_EMAIL_LITERATURE;
import static com.aem.ie.core.constants.ApplConstants.LITERATURE_EMAIL_TEMPLATE;
import static com.aem.ie.core.constants.ApplConstants.LITERATURE_IE_EMAIL_TEMPLATE;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_IE_TEMPLATE_LOOP;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_TEMPLATE_SENDIE;
import static com.aem.ie.core.constants.ApplConstants.EMAIL_LITERATURE_SUBLINE;
import static com.aem.ie.core.constants.ApplConstants.SALES_IE_EMAIL;
import static com.aem.ie.core.constants.ApplConstants.JCR_CONTENT;
import static com.aem.ie.core.constants.ApplConstants.JCR_DATA;
import static com.aem.ie.core.constants.ApplConstants.UTF_8;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.servlet.Servlet;

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

import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.io.IOUtils;

/**
 * Author Anuradha Vunnam
 * 
 * @author M1097457
 *
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Email Literature Servlet",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
		ServletResolverConstants.SLING_SERVLET_PATHS + "=" + SEND_EMAIL_LITERATURE })
public class SendEmailLiterature extends SlingAllMethodsServlet {
	private static Logger log = LoggerFactory.getLogger(SendEmailLiterature.class);
	@Reference
	private transient MessageGatewayService messageGatewayService;

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
		ResourceResolver resolver = request.getResourceResolver();
		try {
			Node templateNode = resolver.getResource(LITERATURE_EMAIL_TEMPLATE).adaptTo(Node.class);
			String email = request.getParameter("email");
			String ieemail = SALES_IE_EMAIL;
			String domainname = request.getParameter("domainname");
			String name = request.getParameter("name");
			String phonenumber = request.getParameter("phone");
			HtmlEmail htmlEmail = new HtmlEmail();
			HtmlEmail htmlIEEmail = new HtmlEmail();
			final Map<String, String> parameters = new HashMap<String, String>();
			parameters.put("email", email);
			parameters.put("name", name);
			parameters.put("phonenumber", phonenumber);
			parameters.put("domainname", domainname);
			String templateStringie = loadTemplateie(LITERATURE_EMAIL_TEMPLATE, templateNode, resolver);
			String mailTemplatemail = processTemplateEmail(parameters, templateStringie);
			String loopTemplateString = loadDetailTemplate(LITERATURE_IE_EMAIL_TEMPLATE, templateNode, resolver);
			// String proccessedOrderDetail = processOrderDetailsTemplate(parameters,
			// loopTemplateString);
			String mailTemplate1 = processTemplate(parameters, loopTemplateString);

			String subjectLine = EMAIL_LITERATURE_SUBLINE;
			if (messageGatewayService != null) {
				MessageGateway<HtmlEmail> gateway = messageGatewayService.getGateway(HtmlEmail.class);
				if (email.equals(email)) {
					htmlEmail.addTo(email);
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
		} catch (EmailException e) {
			log.error("Exception is occurred while sending an email : {}" , e.getMessage());

		} finally {
			if (resolver != null && resolver.isLive()) {
				resolver.close();
			}
		}
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

	private String processTemplateEmail(Map<String, String> paramMap, String template) {
		StringSubstitutor sub = new StringSubstitutor(paramMap);
		template = sub.replace(template);
		Pattern pattern = Pattern.compile("\\$(\\{)(.*?)(\\})", Pattern.DOTALL);
		Matcher matcher = pattern.matcher(template);
		while (matcher.find()) {
			template = matcher.replaceAll("-N/A-");
		}
		return template;
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

	private String processTemplate(Map<String, String> paramMap, String template) {
		StringSubstitutor sub = new StringSubstitutor(paramMap);
		template = sub.replace(template);
		Pattern pattern = Pattern.compile("\\$(\\{)(.*?)(\\})", Pattern.DOTALL);
		Matcher matcher = pattern.matcher(template);
		while (matcher.find()) {
			template = matcher.replaceAll("-N/A-");
		}
		return template;
	}
}
