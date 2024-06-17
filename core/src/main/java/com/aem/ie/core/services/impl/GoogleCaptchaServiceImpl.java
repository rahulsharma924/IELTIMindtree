package com.aem.ie.core.services.impl;

import com.aem.ie.core.Service.GoogleCaptchaService;
import com.aem.ie.core.configuration.GoogleCaptchaConfig;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.Designate;

@Component(service = GoogleCaptchaService.class, immediate = true)
@Designate(ocd = GoogleCaptchaConfig.class)
public class GoogleCaptchaServiceImpl implements GoogleCaptchaService {

	private String captchaSecretKey;

	@Activate
	protected void activate(GoogleCaptchaConfig googleCaptchaConfig) {
		captchaSecretKey = googleCaptchaConfig.secretKey();
	}

	@Override
	public String getSecretKey() {
		return captchaSecretKey;
	}
}
