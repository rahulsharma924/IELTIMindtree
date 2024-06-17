/*
 * ************************************************************************
 *  ADOBE CONFIDENTIAL
 *  ___________________
 *
 *   Copyright 2017 Adobe Systems Incorporated
 *   All Rights Reserved.
 *
 *  NOTICE:  All information contained herein is, and remains
 *  the property of Adobe Systems Incorporated and its suppliers,
 *  if any.  The intellectual and technical concepts contained
 *  herein are proprietary to Adobe Systems Incorporated and its
 *  suppliers and are protected by all applicable intellectual property
 *  laws, including trade secret and copyright laws.
 *  Dissemination of this information or reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from Adobe Systems Incorporated.
 * ************************************************************************
 */

(function($, ns) {
    "use strict";

    var SUMMARIZE_TEXT_PLUGIN_ID = "summarizeText";

    /**
     * Creates the Summarize Text Plugin.
     * @constructor
     */
    ns.SummarizeTextPlugin = function() {
        this.id = SUMMARIZE_TEXT_PLUGIN_ID;
    };

    ns.SummarizeTextPlugin.prototype = Object.create(ns.MultiEditorPlugin);

    ns.SummarizeTextPlugin.prototype.setUp = function(options) {
        this.multiEditor = options.multiEditor;
        this.uiContainer = options.uiContainer;
    };

    ns.SummarizeTextPlugin.prototype.getId = function() {
        return this.id;
    };

    ns.SummarizeTextPlugin.prototype._updateUI = function(event) {
        if (this.ui) {
            var items = this.ui.items.getAll(), index;
            var optionToSelect = MIME_TYPE_NAME_MAP[event.mimeType] ? MIME_TYPE_NAME_MAP[event.mimeType] : event.mimeType;
            for (index = 0; index < items.length; index++) {
                if (items[index].innerText == optionToSelect) {
                    items[index].selected = true;
                }
            }
        }
    };

    ns.SummarizeTextPlugin.prototype.initializeUI = function() {
        var path = ns.state.fragment.path, multiEditor = this.multiEditor, self = this;
        this.ui = this.uiContainer.appendChild(new Coral.Button()).set({
            label: {
                innerHTML: Granite.I18n.get("Summarize Text")
            },
            variant: "quiet",
            icon: "summarize",
            iconSize: "S"
        });
        $(this.ui).addClass('cfm-summarize-button foundation-toggleable-control js-cfm-trigger-summarization');
        $(this.ui).attr('data-foundation-toggleable-control-src',
            "/mnt/overlay/dam/cfm/admin/content/fragment-editor/summarization.html" + path);
        this.ui.on("click", function() {
            ns.state.currentMultiEditor = multiEditor;
        });
        this.ui.on("mousedown", function() {
            self._isPluginClick = true;
        });
        this.ui.on("mouseup", function() {
            self._isPluginClick = false;
            self.multiEditor.focusEditor();
        });
        this.multiEditor.registerListener(ns.multieditor.events.ACTIVE_EDITOR_BLUR, function(e) {
            if (this._isPluginClick) {
                return;
            }
            this.ui.setAttribute("disabled", true);
        }, this);
        this.multiEditor.registerListener(ns.multieditor.events.ACTIVE_EDITOR_FOCUS, function(e) {
            this.ui.removeAttribute("disabled");
        }, this);
    };

    ns.SummarizeTextPlugin.prototype.isEnabled = function() {
        var summarizationEnabled = $('#SmartContentSideBySide');
        return (summarizationEnabled.length !== 0);
    };

    ns.multieditor.plugins.PluginRegistry.register(SUMMARIZE_TEXT_PLUGIN_ID, ns.SummarizeTextPlugin);

})(Granite.$, window.Dam.CFM);
