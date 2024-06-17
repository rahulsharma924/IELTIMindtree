
package com.aem.ie.core.models;

import com.aem.ie.core.Service.*;
import com.aem.ie.core.services.impl.*;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@ExtendWith({AemContextExtension.class})
class ProductDetailTest {

    AemContext aemContext = new AemContext(ResourceResolverType.JCR_MOCK);
    ProductDetail productDetail;
    Map<String, String> configProps = new HashMap<String, String>();
    Map<String, String> configPropsDiscount = new HashMap<String, String>();
    Map<String, String> configPropsBearerTokenURl = new HashMap<String, String>();
    Map<String, String> configPropsCustomLength = new HashMap<String, String>();
    AlgoliaPDPService algoliaPDPService;
    DiscountFactorProductService discountFactorProductService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        configProps.put("algoliaId","testing20MRCI4146");
        configProps.put("algoliaKey","8f92b91fdf51d9543748d38e6df813b8");
        configProps.put("indexInuse","fm_product_en_dev");
        algoliaPDPService = aemContext.registerInjectActivateService(new AlgoliaPDPServiceImpl(),configProps);
        configPropsDiscount.put("getDiscountFactorPriceURL","https://apim-iedtecomm-dev01.azure-api.net/catalog/get-productprojection");
        discountFactorProductService = aemContext.registerInjectActivateService(new DiscountFactorProductServiceImpl(),configPropsDiscount);
        configPropsBearerTokenURl.put("getBearerTokenUrl", "https://login.microsoftonline.com/4f7484a6-7806-40b4-949d-8bb4c5da172f/oauth2/v2.0/token");
        configPropsBearerTokenURl.put("getScopeBearerTokenUrl", "00000002-0000-0000-c000-000000000000/.default");
        configPropsBearerTokenURl.put("getClientIdBearerTokenUrl", "3090757e-7360-4213-99bb-32f07945b4fc");
        configPropsBearerTokenURl.put("getGrantTypeBearerTokenUrl", "client_credentials");
        configPropsBearerTokenURl.put("getClientSecretBearerTokenUrl", "Tcr8Q~esAQaxXJ-85JSddHVrUp3o02JH6ioUXbwF");
        aemContext.registerInjectActivateService(new OLCCModuleServiceImpl(),configPropsBearerTokenURl);
        configPropsCustomLength.put("getCustomLengthPriceURL", "https://apim-iedtecomm-dev01.azure-api.net/cart/fairview/calculateCustomLengthPrice");
        aemContext.registerInjectActivateService(new CustomLengthPriceServiceImpl(),configPropsCustomLength);
        aemContext.addModelsForClasses(ProductDetail.class);
    }

    @Test
    void TestGetCoaxialCableCheck() {
        aemContext.requestPathInfo().setSelectorString("lmr500-low-loss-flexible-coax-cable-pe-jacket-lmr-500");
        productDetail = aemContext.request().adaptTo(ProductDetail.class);
        productDetail.getCoaxialCableCheck();
    }

    @Test
    void initRequestQuote() {
        aemContext.requestPathInfo().setSelectorString("wr-19-1.85mm-female-connector-waveguide-coax-adapter-40-60-ghz-19ac206");
        productDetail = aemContext.request().adaptTo(ProductDetail.class);
        productDetail.getRequestAQuoteLabelButton();
    }

    @Test
    void initDepleted() {
        aemContext.requestPathInfo().setSelectorString("n-male-spp-375-llpl-connector-tc-spp375-nm-lp");
        productDetail = aemContext.request().adaptTo(ProductDetail.class);
        productDetail.getStatusDiscontinue();
    }

    @Test
    void initSM() {
        NullPointerException thrown = Assertions.assertThrows(NullPointerException.class, () -> {
            aemContext.requestPathInfo().setSelectorString("sma-male-n-female-adapter-sm4241");
            productDetail = aemContext.request().adaptTo(ProductDetail.class);
            productDetail.getReplacementSKUValue();
            productDetail.getStatusDiscontinue();
            productDetail.getAssetLargeImage();
            productDetail.getDataSheet();
            productDetail.getCatName();
            productDetail.getSkuName();
            productDetail.getReachStatusValue();
            productDetail.getRohsStatusValue();
            productDetail.getTscaStatusValue();
            productDetail.getBrandSKUValue();
            productDetail.isHasNewValue();
            productDetail.isHasDiscontinuedValue();
            productDetail.getInventoryValue();
            productDetail.getBaseItemSKUValue();
            productDetail.getAssetsValue();
            productDetail.getKeySpecsValue();
            productDetail.getNameValue();
            productDetail.getWebDescValue();
            productDetail.getCurrencyCodeValue();
            productDetail.getUnitPriceValue();
            productDetail.getStartingPriceValue();
            productDetail.getPricingTiersValue();
            productDetail.getEccnValue();
            productDetail.isHasOversizedValue();
            productDetail.isHasSellableValue();
            productDetail.getDefaultColorValue();
            productDetail.getColorVariationsValue();
            productDetail.getBestSellerRankValue();
            productDetail.getLengthVariationsValue();
            productDetail.getLengthValue();
            productDetail.getColorValue();
            productDetail.getCategoryValue();
            productDetail.getObjectIDValue();
            productDetail.getProductIdValue();
            productDetail.isProp65Value();
            productDetail.getProductImageUrl();
            productDetail.getProductImageAltText();
            productDetail.getRequestAQuoteLabelButton();
            productDetail.getROHSLabelFlag();
            productDetail.getKeySpecificationValues();
            productDetail.getPriceChart();
            productDetail.getCurrentColorMatchMap();
            productDetail.getColorVariationCheckFlag();
            productDetail.getCurrentLengthMatchMap();
            productDetail.getLengthVariationCheckFlag();
            productDetail.getViewAllWithMap();
            productDetail.isSkuNotValid();
            productDetail.getAlgoliaErrorResponse();
            productDetail.getReplacementSKUValue();
        });
    }

    @Test
    void PDPLengthChangesTest() {
            aemContext.requestPathInfo().setSelectorString("sma-male-sma-male-cable-rg-316-coax-sca49316-48");
            productDetail = aemContext.request().adaptTo(ProductDetail.class);
            productDetail.isMasterCAValue();
            productDetail.getPdpLengthValue();
            productDetail.isCustomLengthAllowedValue();
            productDetail.getPDPLengthValueMatchMap();
            productDetail.getPDPSkuIdLengthMap();
            productDetail.getPDPLengthVariationCheckFlag();
            productDetail.isDataSheetFlag();
    }

    @Test
    void PDPLengthChangesTestTwo() {
        aemContext.requestPathInfo().setSelectorString("bnc-male-bnc-male-cable-m17-113-rg316-coax-fmc0808316");
        productDetail = aemContext.request().adaptTo(ProductDetail.class);
        productDetail.getPDPLengthValueMatchMap();
    }

    @Test
    void customChangesTest() throws IOException {
        aemContext.requestPathInfo().setSelectorString("mcx-plug-to-bnc-female-bulkhead-cable-rg-316-coax-fmc0738316");
        aemContext.request().addRequestParameter("customlength","9");
        aemContext.request().addRequestParameter("uom","IN");
        productDetail = aemContext.request().adaptTo(ProductDetail.class);
        productDetail.getCalculatedCustomLengthPrice();
        productDetail.isCustomStatusFlag();
        productDetail.getCustomSku();
        productDetail.getCustomLengthUnitPrice();
        productDetail.getCustomlengthRequestParam();
        productDetail.getCustomUOMTextList();
        productDetail.getCustomValueTextList();
    }
}
