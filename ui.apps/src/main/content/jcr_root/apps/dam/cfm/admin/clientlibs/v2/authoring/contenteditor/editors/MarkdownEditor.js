/*
 * ADOBE CONFIDENTIAL
 * __________________
 *
 *  Copyright 2015 Adobe Systems Incorporated
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

    var ATTR_DATA_INPUT_FIELD = "data-cfm-multieditor-inputfield";

    var channel = $(window.document);

    var MarkdownAdapter = function() {
        //constructor
    };

    MarkdownAdapter.prototype = Object.create(ns.CFMEditorAdapter);

    MarkdownAdapter.prototype.extractContextInfo = function() {
        return {};
    };

    MarkdownAdapter.prototype.getAdaptedContext = function(newEditor) {
        return {}
    };

    ns.MarkdownEditor = function(options) {
        ns.CFMEditor.call(this, options);
        this.$container = options.$container;
        this.$textArea = this.$container.find(".markdown-editor");
        this.$textField = options.$textField;
        this.$validationInput = this.$textArea.closest(".cfm-multieditor").find(".cfm-multieditor-validation-input");
        this.markdownExtractor = new ns.MarkdownExtractor();
    };

    ns.MarkdownEditor.prototype = Object.create(ns.CFMEditor.prototype);

    ns.MarkdownEditor.prototype.start = function() {
        var self = this;
        this.$container.removeClass("hidden");
        this.$textArea.val(this.$textField.val());
        this.$textArea.on("focus.markdownEditor", function(e) {
            self._triggerListeners.call(self, "cfm-editor-focus", e);
        });
        this.$textArea.on("blur.markdownEditor", function(e) {
            self._triggerListeners.call(self, "cfm-editor-blur", e);
        });
        this.$textArea.on("change.markdownEditor", function(e) {
            channel.trigger(ns.constants.EVENT_CONTENT_FRAGMENT_FIELD_MODIFIED, e);
            // trigger validation on the "hidden" input field that we use for custom validation of the data
            self.$validationInput.val(e.target.value);
            self.$validationInput.trigger("change");
        });
    };

    ns.MarkdownEditor.prototype.focus = function() {
        this.$textArea.focus();
    };

    ns.MarkdownEditor.prototype.end = function() {
        if (this.$textArea) {
            this.$container.addClass("hidden");
            this._syncValue();
            this.removeAllEventListeners();
            this.$textArea.off("focus.markdownEditor");
            this.$textArea.off("blur.markdownEditor");
            this.$textArea.off("change.markdownEditor");
        }
    };

    ns.MarkdownEditor.prototype.suspend = function() {
        this._syncValue();
    };

    ns.MarkdownEditor.prototype.reactivate = function() {
        this.setValue(this.$textField.val());
    };

    ns.MarkdownEditor.prototype.getMimeType = function() {
        /* https://datatracker.ietf.org/doc/draft-ietf-appsawg-text-markdown/?include_text=1 */
        return "text/x-markdown";
    };

    ns.MarkdownEditor.prototype.getValue = function() {
        return this.$textArea.val();
    };

    ns.MarkdownEditor.prototype._syncValue = function() {
        this.$textField.val(this.$textArea.val());
    };

    ns.MarkdownEditor.prototype.setValue = function(value) {
        this.$textArea.val(value);
        channel.trigger(ns.constants.EVENT_CONTENT_FRAGMENT_FIELD_MODIFIED);
    };

    ns.MarkdownEditor.prototype.getPlainText = function() {
        return this.markdownExtractor.extract(this.$textArea);
    };

    ns.MarkdownEditor.prototype.getEditorAdapter  = function() {
        return new MarkdownAdapter();
    };

    ns.MarkdownEditor.prototype.adaptToContext = function() {
        // do nothing
    };

    ns.MarkdownEditor.prototype.hasToolbar = function() {
        return false;
    };


})($, window.Dam.CFM, window);
