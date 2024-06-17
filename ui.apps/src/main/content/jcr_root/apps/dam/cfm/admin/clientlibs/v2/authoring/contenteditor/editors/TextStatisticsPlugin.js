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

    var TEXT_STATISTICS_PLUGIN_ID = "textStatistics";
    var constants = ns.multieditor.constants;


    ns.TextStatisticsPlugin = function() {
        // class creator
        this.id = TEXT_STATISTICS_PLUGIN_ID;
        this._stats = new ns.TextStats();
    };

    ns.TextStatisticsPlugin.prototype = Object.create(ns.MultiEditorPlugin);

    ns.TextStatisticsPlugin.prototype.setUp = function(options) {
        this.multiEditor = options.multiEditor;
        this.uiContainer = options.uiContainer;
    }

    ns.TextStatisticsPlugin.prototype.getId = function() {
        return this.id;
    };

    ns.TextStatisticsPlugin.prototype._updateUI = function(event) {
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

    ns.TextStatisticsPlugin.prototype.initializeUI = function() {
        var index = 0, self = this;
        this.ui = this.uiContainer.appendChild(new Coral.Button()).set({
        	label: {
        	    innerHTML: Granite.I18n.get("Text Statistics")
        	  },
            variant: "quiet",
            icon: "infoCircle",
            iconSize: "S"
        });

        this.dialog = new Coral.Dialog().set({
            header: {
                innerHTML: Granite.I18n.get("Text Statistics")
            },
            content: {
                innerHTML: ''
            },
            footer: {
                innerHTML: "<button is=\"coral-button\" variant=\"primary\" coral-close=\"\" class=\"coral-Button coral-Button--primary\" size=\"M\"><coral-button-label>"+Granite.I18n.get("Ok")+"</coral-button-label></button>"
            }
        });
        this.ui.on("click", function(){
            self.execute();
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
        this.uiContainer.appendChild(this.dialog);
    };

    ns.TextStatisticsPlugin.prototype.isEnabled = function() {
        return true;
    };

    ns.TextStatisticsPlugin.prototype.execute = function() {
        var stats = undefined;
        var plainText = this.multiEditor.getPlainText();
        if (plainText) {
            stats = this._stats.calculate(plainText, {});
        }
        if (!stats) {
            stats = {
                paragraphs: 0,
                words: 0,
                sentences: 0,
                characters: 0,
                totalCharacters: 0,
                avgCharacters: 0,
                avgWords: 0,
                romanWords: 0,
                asianChars: 0,
                hasAsianCharacter: false
            };
        }
        var rowFunc = function(name, value) {
            return  '<div class="cfm-multieditor-textstats-row">'
                   +  '<div class="cfm-multieditor-textstats-col-left" >' + name + '</div>'
                   +  '<div class="cfm-multieditor-textstats-col-right">' + value + '</div>'
                   +'</div>';
        };
        var html = "";
        html += rowFunc(Granite.I18n.get("Words"), stats.words);
        html += rowFunc(Granite.I18n.get("Characters"), stats.characters);
        html += rowFunc(Granite.I18n.get("Characters (with spaces)"), stats.totalCharacters);
        html += rowFunc(Granite.I18n.get("Sentences"), stats.sentences);
        html += rowFunc(Granite.I18n.get("Avg. Sentence (words)"), stats.avgWords);
        html += rowFunc(Granite.I18n.get("Avg. Sentence (chars)"), stats.avgCharacters);
        html += rowFunc(Granite.I18n.get("Paragraphs"), stats.paragraphs);
        if (stats.hasAsianCharacters) {
            html += rowFunc("Non-Asian words", stats.romanWords);
            html += rowFunc("Asian characters", stats.asianChars);
        }
        this.dialog.content = new Coral.Dialog.Content();
        this.dialog.content.innerHTML = html;
        this.dialog.show();
    };

    ns.multieditor.plugins.PluginRegistry.register(TEXT_STATISTICS_PLUGIN_ID, ns.TextStatisticsPlugin);

})(Granite.$, window.Dam.CFM);
