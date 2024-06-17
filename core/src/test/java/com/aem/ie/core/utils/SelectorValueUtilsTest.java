package com.aem.ie.core.utils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith({AemContextExtension.class,MockitoExtension.class})
class SelectorValueUtilsTest {
    String seoName;
    String selector;
    String categoryValuefinal=null;
    @Mock
    ObjectMapper objectMapper;
    @Mock
    JsonNode jsonNode;
    @Test
    void getPDPSeoNameSelector() {
        SelectorValueUtils.getPDPSeoNameSelector(new String[]{"2", "92mm-nmd-female-to-n-male-adapter-with-stainless-steel-body-sm9986"},seoName);
    }

    @Test
    void getPDPSeoNameSelectorTestTwo() {
        SelectorValueUtils.getPDPSeoNameSelector(new String[]{"sma-male-n-female-adapter-sm4241"},seoName);
    }

    @Test
    void getPLPSeoNameSelector() {
        SelectorValueUtils.getPLPSeoNameSelector(new String[]{"antennas/directional-antennas/yagi-antennas"},selector,categoryValuefinal);
    }

    @Test
    void getPLPSeoNameSelectorTwo() {
        SelectorValueUtils.getPLPSeoNameSelector(new String[]{"antennas"},selector,categoryValuefinal);
    }
    @Test
    void getPLPSSRSeoNameTagSearchSelectortest() {
    	SelectorValueUtils.getPLPSSRSeoNameTagSearchSelector(new String[]{"antennas"}, selector, categoryValuefinal);
    }
    @Test
    void getPLPSSRSelectorone() {
    	SelectorValueUtils.getPLPSSRSelector(new String[]{"antennas"}, selector, categoryValuefinal);
    }
    @Test
    void getPLPSSRProductListSelectorone() {
    	SelectorValueUtils.getPLPSSRProductListSelector(new String[]{"antennas"}, selector);
    }
    @Test
    void getPLPSSRSeoNameTagSearchSelectortwo() {
    	SelectorValueUtils.getPLPSSRSeoNameTagSearchSelector(new String[]{"antennas", "directional-antennas"}, selector, categoryValuefinal);
    }
    @Test
    void getPLPSSRSelectortwo() {
    	SelectorValueUtils.getPLPSSRSelector(new String[]{"antennas", "directional-antennas"}, selector, categoryValuefinal);
    }
    @Test
    void getPLPSSRProductListSelectortwo() {
    	SelectorValueUtils.getPLPSSRProductListSelector(new String[]{"antennas", "directional-antennas"}, selector);
    }
    
}