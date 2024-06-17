package com.aem.ie.core.configuration;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "CT Accounts Integration API Configurations")
public @interface CTAccountsConfig {
	@AttributeDefinition(name = "Fetch Customer Product URL", description = "Fetch Customer Ordered Product URL")
	String getCustomerOrderedProductURL() default "";

	@AttributeDefinition(name = "Search Customer Product URL", description = "Search Customer Ordered Product URL")
	String getSearchCustomerOrderedProductURL() default "";

	@AttributeDefinition(name = "Add New Address URL", description = "Add New Address URL")
	String getNewAddressURL() default "";

	@AttributeDefinition(name = "Update Address URL", description = "API URL to Update the Shipping Information")
	String getUpdateAddressURL() default "";

	@AttributeDefinition(name = "Delete Address URL", description = "API URL to Delete the Address")
	String getDeleteAddressURL() default "";

	@AttributeDefinition(name = "Set default Payment Method", description = "Set default Payment Method CT URL")
	String getdefaultMethodSetURL() default "";

	@AttributeDefinition(name = "Set default Edit address URL", description = "Set default Edit address URL")
	String getEditAddressURL() default "";

	@AttributeDefinition(name = "View Payment Methods", description = "View Payment Method CT URL")
	String getViewPaymentMethodURL() default "";

	@AttributeDefinition(name = "Get Payment Token", description = "Get Payment Token For Braintee Integration")
	String getPaymentToken() default "";

	@AttributeDefinition(name = "process payment", description = "Process payment to Braintee ")
	String processPayment() default "";

	@AttributeDefinition(name = "Set default Customer Profile URL", description = "Set default Customer Profile URL")
	String getCustProfileURL() default "";

	@AttributeDefinition(name = "choose payment", description = "process payment for wiretransfer mode ")
	String choosePayment() default "";

	@AttributeDefinition(name = "Fetch Order Products", description = "Fetch order product API")
	String fetchOrderProductAPI() default "";

	@AttributeDefinition(name = "Update Personal Info", description = "Update Personal Info API")
	String updatepersonalinfo() default "";

	@AttributeDefinition(name = "Update Domain Info", description = "Update Domain Info ")
	String updateDomaininfo() default "";

}
