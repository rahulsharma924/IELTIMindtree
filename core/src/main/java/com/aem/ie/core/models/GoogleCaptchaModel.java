package com.aem.ie.core.models;

import com.aem.ie.core.Service.GoogleCaptchaService;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class GoogleCaptchaModel {
    @OSGiService
    private GoogleCaptchaService googleCaptchaService;

    public String getSecretKey() {
        return googleCaptchaService.getSecretKey();
    }
}
