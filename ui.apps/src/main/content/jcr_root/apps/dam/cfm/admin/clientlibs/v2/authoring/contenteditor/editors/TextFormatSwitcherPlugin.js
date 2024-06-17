/*
 ADOBE CONFIDENTIAL

 Copyright 2017 Adobe Systems Incorporated
 All Rights Reserved.

 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and may be covered by U.S. and Foreign Patents,
 patents in process, and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
 */

(function($, ns) {
    "use strict";

    var TEXT_FORMAT_SWITCHER_PLUGIN_ID = "textFormatSwitcher";
    var constants = ns.multieditor.constants;
    var MIME_TYPE_NAME_MAP = {};
    MIME_TYPE_NAME_MAP[constants.PLAINTEXT_MIME_TYPE] = "Plain Text";
    MIME_TYPE_NAME_MAP[constants.RICHTEXT_MIME_TYPE] = "Rich Text";
    MIME_TYPE_NAME_MAP[constants.MARKDOWN_MIME_TYPE] = "Markdown";

    ns.TextFormatSwitcherPlugin = function() {
        // class creator
        this.id = TEXT_FORMAT_SWITCHER_PLUGIN_ID;
    };

    ns.TextFormatSwitcherPlugin.prototype = Object.create(ns.MultiEditorPlugin);

    ns.TextFormatSwitcherPlugin.prototype.setUp = function(options) {
        this.multiEditor = options.multiEditor;
        this.uiContainer = options.uiContainer;
        this.multiEditor.registerListener(ns.multieditor.events.EDITING_STARTED_FOR_MIME_TYPE, this._updateUI, this);
    }

    ns.TextFormatSwitcherPlugin.prototype.getId = function() {
        return this.id;
    };

    ns.TextFormatSwitcherPlugin.prototype._updateUI = function(event) {
        if (this.ui) {
            var items = this.ui.items.getAll(), index;
            var optionToSelect = MIME_TYPE_NAME_MAP[event.mimeType] ? MIME_TYPE_NAME_MAP[event.mimeType] : event.mimeType;
            for (index = 0; index < items.length; index++) {
                if (items[index].innerText === optionToSelect) {
                    items[index].selected = true;
                }
            }
        }
    };

    ns.TextFormatSwitcherPlugin.prototype.initializeUI = function() {
        var index = 0, self = this, mimeTypes = this.multiEditor.getAllMimeTypes(), mimeType, optionName;
        var selectedMimeType = undefined, innerHTML, currentMimeType = self.multiEditor.getMimeType();
        var formatSwitcherWarningDialogMessage = Granite.I18n.get(
            "Formatting information and annotations may be lost and Type will be applied to all items in multifield.<br>This action cannot be undone.");
        var formatSwitcherWarningDialogMultifield = Granite.I18n.get(
            "Formatting information and annotations may be lost. This action cannot be undone.");
        var formatSwitcherWarningDialogInnerHTML = [
            "<button data-action-type='cancel' is=\"coral-button\" variant=\"secondary\" coral-close=\"\">",
            Granite.I18n.get("Cancel"),
            "</button>",
            "<button data-action-type='ok' is=\"coral-button\" variant=\"primary\" coral-close=\"\">",
            Granite.I18n.get("Ok"),
            "</button>"
        ].join('');
        this.ui = new Coral.CycleButton().set({
            displayMode: "text",
            icon: ""
        });
        this.ui.classList.add('cfm-multieditor-formatswitcher');
        for (index = 0; index < mimeTypes.length; index++) {
            mimeType = mimeTypes[index];
            optionName = MIME_TYPE_NAME_MAP[mimeType] ? MIME_TYPE_NAME_MAP[mimeType] : mimeType;
            var itemObj = {
                content: {
                    innerHTML: [
                        "<span data-mime-type=\"" + mimeType + "\">",
                        Granite.I18n.get(optionName),
                        "</span>"
                    ].join('')
                },
                icon: ""
            };
            if (mimeType === currentMimeType) {
                itemObj.selected = true;
            }
            this.ui.items.add(itemObj);
        }
        this.uiContainer.appendChild(this.ui);
        var warnDialog = new Coral.Dialog().set({
            id: 'cfm-multieditor-formatswitcher-warning-dialog',
            header: {
                innerHTML: Granite.I18n.get("Warning")
            },
            content: {
                innerHTML: self.multiEditor.$multiFieldItem ?
                    formatSwitcherWarningDialogMessage :
                    formatSwitcherWarningDialogMultifield
            },
            footer: {
                innerHTML: formatSwitcherWarningDialogInnerHTML
            },
            variant: "warning"
        });
        this.warnDialog = warnDialog;
        this.uiContainer.appendChild(this.warnDialog);
        this.ui.on("coral-cyclebutton:change", function(e) {
            var textFormatSwitcherElement = e.target;
            if ($(textFormatSwitcherElement).closest(".cfm-multieditor-fullscreen").is(":hidden")) {
                return;
            }
            var selectedEl = e.detail.selection;
            self.oldSelection = e.detail.oldSelection;
            selectedMimeType = selectedEl.querySelectorAll("[data-mime-type]")[0].getAttribute("data-mime-type");
            if (self.multiEditor.$multiFieldItem || self.multiEditor.getMimeType() != constants.PLAINTEXT_MIME_TYPE) {
                self.warnDialog.show();
            } else {
                self.multiEditor.switchEditor(selectedMimeType);
            }
        });
        this.ui.on("mousedown", function() {
            self._isPluginClick = true;
        });
        this.ui.on("mouseup", function() {
            self._isPluginClick = false;
        });
        this.multiEditor.registerListener(ns.multieditor.events.ACTIVE_EDITOR_BLUR, function(e) {
            if (this._isPluginClick) {
                return;
            }
            this.ui.items.getAll().forEach(function(item) {
                if (!item.selected) {
                    item.setAttribute("disabled", true);
                }
            });
        }, this);
        this.multiEditor.registerListener(ns.multieditor.events.ACTIVE_EDITOR_FOCUS, function(e) {
            this.ui.items.getAll().forEach(function(item) {
                item.removeAttribute("disabled");
            });
        }, this);
        $(this.warnDialog).on("click", "[data-action-type=ok]", function(){
            self.multiEditor.switchEditor(selectedMimeType);
            self.warnDialog.hide();
        });
        $(this.warnDialog).on("click", "[data-action-type=cancel]", function(){
            self.oldSelection.selected = true;
            self.warnDialog.hide();
        });
    };

    ns.TextFormatSwitcherPlugin.prototype.isEnabled = function() {
        return true;
    };

    ns.multieditor.plugins.PluginRegistry.register(TEXT_FORMAT_SWITCHER_PLUGIN_ID, ns.TextFormatSwitcherPlugin);

})(Granite.$, window.Dam.CFM);
