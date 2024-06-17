package com.aem.ie.core.Service;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.ie.core.configuration.IECTLoginConfig;
import com.aem.ie.core.configuration.IEDirectCallConfig;
import com.aem.ie.core.services.impl.IECTLoginImpl;

public interface IEUserActiveCart {
	
	public String getUserActiveCart(String ctToken,String bearerToken) throws ClientProtocolException, IOException;
}
