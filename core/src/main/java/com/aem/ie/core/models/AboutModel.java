package com.aem.ie.core.models;
import java.util.ArrayList;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Model(adaptables = { Resource.class, SlingHttpServletResponse.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AboutModel {
	private static final Logger log = LoggerFactory.getLogger(AboutModel.class);
	@Inject
	private Resource resource;
		
	public List<Map<String,String>> getAccDetails() {
		List<Map<String,String>> list= new ArrayList<>();
		Resource res = resource.getChild("strengthdetails");
		if(res != null){
			for(Resource res1: res.getChildren()) {
				Map<String,String> map=new HashMap<>();
				map.put("ourstrengthImg", res1.getValueMap().get("ourstrengthImg", String.class));
				map.put("ourstrengthTitle", res1.getValueMap().get("ourstrengthTitle", String.class));
				list.add(map);
			}
			
		}
       return list;
    }
}
