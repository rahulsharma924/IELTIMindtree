package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "OLCC DAM Asset Upload Config ")
public @interface OLCCAssetUploadConfig {
	@AttributeDefinition(name = "API Key (clientId)", description = "Get API Key (clientId)")
	String getAPIKey() default "";
	@AttributeDefinition(name = "Secret (clientSecret)", description = "Client secret")
	String getSecret() default "";
	@AttributeDefinition(name = "Technical Account ID (Id)", description = "Technical Account id")
	String getTechnicalAccountId() default "";
	@AttributeDefinition(name = "OrgId (OrgId)", description = "Organization ID")
	String getOrgId() default "";
	@AttributeDefinition(name = "MetaScopes (metascopes)", description = "Meta Scopes")
	String getMetaScopes() default "";
	@AttributeDefinition(name = "key path", description = "key path")
	String getKeyPath() default "";
	@AttributeDefinition(name = "imsHost (imsEndpoint)", description = "Ims End point")
	String getImsHost() default "";
	@AttributeDefinition(name = "imsExchange", description = "imsExchange")
	String getImsExchange() default "";
	@AttributeDefinition(name = "Expiration JWT Time", description = "Expiration JWT Time")
	String getJWTExpirationTime() default "";
	@AttributeDefinition(name = "AEM HOST", description = "AEM HOST")
	String getAemHost() default "";
	@AttributeDefinition(name = "AEM PDF to Fetch Folder Download", description = "AEM PDF to Fetch Folder Download")
	String getAemMergedPdfFetchFolder() default "";
	@AttributeDefinition(name = "AEM Merged PDF Download Folder", description = "AEM Merged PDF Download Folder")
	String getAemMergedPdfDownloadFolder() default "";
	@AttributeDefinition(name = "AEM Merged PDF Upload Folder", description = "AEM Merged PDF Upload Folder")
	String getAemMergedPdfUploadFolder() default "";
	@AttributeDefinition(name = "AEM PDF Asset Download Folder", description = "AEM PDF Asset Download Folder")
	String getAemPdfAssetDownloadFolder() default "";
	@AttributeDefinition(name = "AEM PDF Asset Upload Folder", description = "AEM PDF Asset Upload Folder")
	String getAemPdfAssetUploadFolder() default "";
	@AttributeDefinition(name = "AEM Host ReplicateURL", description = "AEM Host ReplicateURL")
	String getAssetReplicateURL() default "";
	@AttributeDefinition(name = "AEM Asset Replicate FolderPath", description = "Asset Replicate FolderPath")
	String getAssetReplicateFolderPath() default "";
	@AttributeDefinition(name = "AEM PDF Asset Download Local FILE Path", description = "AEM PDF Asset Download Local FILE Path")
	String getAemPdfAssetLocalDownloadFilePath() default "";
	@AttributeDefinition(name = "AEM PDF Asset Upload Local Folder Path", description = "AEM PDF Asset Upload Local Folder Path")
	String getAemPdfAssetLocalUploadFolderPath() default "";

}
