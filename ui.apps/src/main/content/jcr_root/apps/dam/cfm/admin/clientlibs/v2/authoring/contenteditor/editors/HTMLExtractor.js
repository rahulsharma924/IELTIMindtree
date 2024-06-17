/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 * 
 *  Copyright 2017 Adobe
 *  All Rights Reserved.
 * 
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 *************************************************************************/
 
(function($, ns, window) {
    'use strict';

    var IGNORE_TAGS = [ "script", "style" ];


    function handleTextNode(dom, state) {
        state.text += dom.nodeValue;
    }

    function handleStructuralNodeStart(dom, state) {
        var com = CUI.rte.Common;
        if (com.isTag(dom, IGNORE_TAGS)) {
            state.ignoreSubTree = true;
        }

    }

    function handleStructuralNodeEnd(dom, state) {
        var com = CUI.rte.Common;
        if (com.isTag(dom, com.EDITBLOCK_TAGS)) {
            state.text += "\n";
        } else if (com.isTag(dom, IGNORE_TAGS)) {
            state.ignoreSubTree = false;
        }
    }

    function handleNodeStart(dom, state) {
        if (dom.nodeType === 3) {
            handleTextNode(dom, state);
        } else if (dom.nodeType === 1) {
            handleStructuralNodeStart(dom, state);
        }
    }

    function handleNodeEnd(dom, state) {
        if (dom.nodeType === 1) {
            handleStructuralNodeEnd(dom, state);
        }
    }

    function extract(dom, state) {
        handleNodeStart(dom, state);
        if (dom.nodeType === 1) {
            if (!state.ignoreSubTree) {
                var childCnt = dom.childNodes.length;
                for (var c = 0; c < childCnt; c++) {
                    var child = dom.childNodes[c];
                    extract(child, state);
                }
            }
        }
        handleNodeEnd(dom, state);
    }


    ns.HTMLExtractor = function() {
        // make class known to system
    };

    ns.HTMLExtractor.prototype.extract = function($source) {
        var state = {
            text: "",
            ignoreSubTree: false
        };

        var nodeCnt = $source.length;
        for (var n = 0; n < nodeCnt; n++) {
            extract($source[n], state);
        }
        if (state.text.slice(-2) == "\n\n") {
            return state.text.slice(0, -2);
        }
        else {
            return state.text;
        }

    };

})($, window.Dam.CFM, window);
