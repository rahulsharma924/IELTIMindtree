package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.OLCCDamAssetUploadService;
import com.aem.ie.core.configuration.OLCCAssetUploadConfig;
import com.aem.ie.core.constants.ApplConstants;
import com.day.cq.dam.api.AssetManager;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfCopy;
import com.itextpdf.text.pdf.PdfReader;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.fluent.Form;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Binary;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFactory;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component(service = OLCCDamAssetUploadService.class, immediate = true)
@Designate(ocd = OLCCAssetUploadConfig.class)
public class OLCCDamAssetUploadServiceImpl implements OLCCDamAssetUploadService {

	private static final Logger LOGGER = LoggerFactory.getLogger(OLCCDamAssetUploadServiceImpl.class);

	/**
	 * Instance of the OSGi configuration class
	 */
	private OLCCAssetUploadConfig configuration;

	@Reference
	protected ResourceResolverFactory resourceResolverFactory;

	@Activate
	protected void activate(OLCCAssetUploadConfig configuration) {
		this.configuration = configuration;
	}

	private String authorization = "Authorization";
	private String bearer = "Bearer ";
	private String contentType = "Content-Type";
	private String contentLength = "Content-Length";
	private String fileNAMEKey = "fileName";
	private String uploadTOKENKey = "uploadToken";
	private String mimeTYPEKey = "mimeType";
	private String fileSIZEKey = "fileSize";

	PdfCopy mergePDFCopy = null;
	ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

	@Override
	public String mergePDF(String mergedFileName, String connector1, String connector2, String cable,
			String bearerToken) {
		String aemCSHost = configuration.getAemHost();
		String downloadResponse = "";
		CloseableHttpClient httpclient = HttpClients.createDefault();
		String aemMergedPdfFetchFolder = configuration.getAemMergedPdfFetchFolder();
		try {
			String[] urls = { connector1, connector2, cable };
			List<PdfReader> readers = new ArrayList<>();
			for (String url : urls) {
				if (!url.isEmpty()) {
					String fetchPDFURL = aemCSHost + aemMergedPdfFetchFolder + url;
					HttpGet httpGet = new HttpGet(fetchPDFURL);
					httpGet.setHeader(authorization, bearer + bearerToken);
					CloseableHttpResponse httpResponse = httpclient.execute(httpGet);
					if (httpResponse.getStatusLine().getStatusCode() == 200) {
						double fileSize = httpResponse.getEntity().getContentLength();
						try (BufferedInputStream input = new BufferedInputStream(
								httpResponse.getEntity().getContent())) {
							PdfReader pdfReader = new PdfReader(input);
							PdfReader.unethicalreading = true;
							readers.add(pdfReader);
						}
					}
				}
			}

			Document document = new Document();
			mergePDFCopy = new PdfCopy(document, byteArrayOutputStream);
			document.open();
			for (PdfReader reader : readers) {
				mergePDFCopy.addDocument(reader);
				reader.close();
			}
			document.close();
			byteArrayOutputStream.close();
			downloadResponse = uploadToAEMCS(byteArrayOutputStream.toByteArray(), mergedFileName, bearerToken);
		} catch (IOException | DocumentException e) {
			LOGGER.error("error occurred during mergePDF : {}", e.getMessage());
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				LOGGER.error("error occurred during closing the call mergePDF {}", e.getMessage());
			}
		}
		return downloadResponse;
	}

	public String uploadToAEMCS(byte[] fileBytes, String mergedPDFNAME, String bearerToken) {
		String thirdStepResponse = "thirdStepResponse";
		String initiateUploadResponse = null;
		try {
			initiateUploadResponse = makeInitiateUploadRequest(fileBytes, mergedPDFNAME, bearerToken);
			ObjectMapper mapper = new ObjectMapper();
			Root ctNotification = mapper.readValue(initiateUploadResponse, Root.class);
			String binaryPUTUrl = ctNotification.getFiles().get(0).getUploadURIs().get(0);
			HttpResponse putResponse = Request.Put(binaryPUTUrl).bodyByteArray(fileBytes).execute().returnResponse();

			int statusCode = putResponse.getStatusLine().getStatusCode();
			if ((statusCode < 200) || (statusCode > 210)) {
				throw new IOException("Error uploading the binary");
			}
			String uploadToken = ctNotification.getFiles().get(0).uploadToken;
			String fileName = ctNotification.getFiles().get(0).fileName;
			String mimeType = ctNotification.getFiles().get(0).mimeType;
			String completeURI = ctNotification.completeURI;
			String completeResponse = makeCompleteUploadRequest(uploadToken, fileName, mimeType, completeURI,
					bearerToken);
			if (completeResponse.contains(mergedPDFNAME)) {
				saveMergedAsset(fileName,fileBytes);
				thirdStepResponse = completeResponse;
			}
		} catch (IOException | LoginException e) {
			LOGGER.error("Error occurred in uploadToAEMCS call during mergePDF : {}", e.getMessage());
		}
        return thirdStepResponse;
	}

	private String makeInitiateUploadRequest(byte[] fileBytes, String mergedPDFNAME, String bearerToken) {
		String aemCSHost = configuration.getAemHost();
		String initiateUploadResponse = "response";
		try {
			Form form = Form.form();
			form.add(fileNAMEKey, mergedPDFNAME);
			form.add(fileSIZEKey, String.valueOf(fileBytes.length));
			String initiateMergePdfUploadReq = aemCSHost + configuration.getAemMergedPdfUploadFolder()
					+ ".initiateUpload.json";
			initiateUploadResponse = Request.Post(initiateMergePdfUploadReq)
					.addHeader(contentType, "application/x-www-form-urlencoded; charset=UTF-8")
					.addHeader(authorization, bearer + bearerToken).bodyForm(form.build()).execute().returnContent()
					.asString();

		} catch (IOException e) {
			LOGGER.error("error occurred in makeInitiateUploadRequest during mergePDF : {}", e.getMessage());
		}
		return initiateUploadResponse;
	}

	private String makeCompleteUploadRequest(String uploadToken, String fileName, String mimeType, String completeURI,
			String bearerToken) {
		String aemCSHost = configuration.getAemHost();
		String completeResponse = "response";
		try {
			completeURI = aemCSHost + completeURI;
			Form form = Form.form();
			form.add(uploadTOKENKey, uploadToken);
			form.add(fileNAMEKey, fileName);
			form.add(mimeTYPEKey, mimeType);

			completeResponse = Request.Post(completeURI)
					.addHeader(contentType, "application/x-www-form-urlencoded; charset=UTF-8")
					.addHeader(authorization, bearer + bearerToken).bodyForm(form.build()).execute().returnContent()
					.asString();
		} catch (IOException e) {
			LOGGER.error("error occurred in makeCompleteUploadRequest during mergePDF : {}", e.getMessage());
		}
		return completeResponse;
	}

	void saveMergedAsset(String fileName,byte[] fileBytes) throws LoginException {
		String assetPath = configuration.getAssetReplicateFolderPath() + fileName;
		ResourceResolver resourceResolver = null;
		try {
			//creating resource resolver from service user
			Map<String, Object> paramMap = new HashMap<>();
			paramMap.put(ResourceResolverFactory.SUBSERVICE, "fm-service-user");
			resourceResolver = resourceResolverFactory.getServiceResourceResolver(paramMap);
			Session session = resourceResolver.adaptTo(Session.class);
			InputStream fileInputStream;
			// Get Binary from byte array to inputStream
			fileInputStream = new ByteArrayInputStream(fileBytes);
			// converting to Binary
			assert session != null;
			final ValueFactory valueFactory = session.getValueFactory();
			Binary binary =  valueFactory.createBinary(fileInputStream);
			// Creating/Updating merged pdf file in aem repository
			AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
			assert assetManager != null;
			assetManager.createOrUpdateAsset(assetPath, binary,"application/pdf", true);
			IOUtils.closeQuietly(fileInputStream);
			resourceResolver.commit();
			resourceResolver.refresh();
		} catch (LoginException | RepositoryException | PersistenceException exception) {
			LOGGER.error("Exception Occurred : {}", exception.getMessage());
		} finally {
			if (resourceResolver!=null && resourceResolver.isLive()) {
				resourceResolver.close();
			}
		}
	}
}