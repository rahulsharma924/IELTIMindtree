/*
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2017 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

(function($, ns, window) {
    'use strict';

    /**
     * Constructor for adapter. This class extracts current editing context (selection, undo state etc)
     * as per requirement of editors, so that the context can be transferred from one instance of the editor
     * to another.
     */
    ns.CFMEditorAdapter = function() {
        // interface
    };

    /**
     * Extracts the context information from base editor.
     */
    ns.CFMEditorAdapter.prototype.extractContextInfo = function() {
        throw new Error("Adapter implementation must implement start method.")
    };

    /**
     * Adapts the extracted context for use within target editor.
     */
    ns.CFMEditorAdapter.prototype.getAdaptedContext = function(targetEditor) {
        throw new Error("Adapter implementation must implement end method.")
    };

})($, window.Dam.CFM, window);
