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

    var PlainTextEditorAdapter = function() {
        //constructor
    };

    PlainTextEditorAdapter.prototype.extractContextInfo = function() {
        return {};
    };

    PlainTextEditorAdapter.prototype.getAdaptedContext = function(newEditor) {
        return {}
    };
    
    var channel = $(window.document);

    ns.PlainTextEditor = function(options) {
        ns.CFMEditor.call(this, options);
        this.$container = options.$container;
        this.$textArea = this.$container.find(".plaintext-editor");
        this.$validationInput = this.$textArea.closest(".cfm-multieditor").find(".cfm-multieditor-validation-input");
        this.$textField = options.$textField;
        this._initialValue = null;
        this.stateChangeIID = null;
    };

    ns.PlainTextEditor.prototype = Object.create(ns.CFMEditor.prototype);

    ns.PlainTextEditor.prototype.start = function() {
        var self = this;
        this.$container.removeClass("hidden");
        this.$textArea.val(this.$textField.val());
        this.stateChangeIID = undefined;
        this.$textArea.on("focus.plaintextEditor", function(e) {
            self._triggerListeners.call(self, "cfm-editor-focus", e);
        });
        this.$textArea.on("blur.plaintextEditor", function(e) {
            self._triggerListeners.call(self, "cfm-editor-blur", e);
        });
        this.$textArea.on("change.plaintextEditor", function(e) {
            channel.trigger(ns.constants.EVENT_CONTENT_FRAGMENT_FIELD_MODIFIED);
            // trigger validation on the "hidden" input field that we use for custom validation of the data
            self.$validationInput.val(e.target.value);
            self.$validationInput.trigger("change");
        });
    };

    ns.PlainTextEditor.prototype.focus = function() {
        this.$textArea.focus();
    };

    ns.PlainTextEditor.prototype.end = function() {
        if (this.$textArea) {
            this.$container.addClass("hidden");
            this._syncValue();
            this.removeAllEventListeners();
            this.$textArea.off("focus.plaintextEditor");
            this.$textArea.off("blur.plaintextEditor");
            this.$textArea.off("change.plaintextEditor");
        }
    };
    
    ns.PlainTextEditor.prototype.suspend = function() {
        this._finalizeEventHandling();
        this._syncValue();
    };
    
    ns.PlainTextEditor.prototype.reactivate = function() {
        this._initializeEventHandling();
        this.setValue(this.$textField.val());
    };

    ns.PlainTextEditor.prototype.getMimeType = function() {
        return "text/plain";
    };

    ns.PlainTextEditor.prototype.getValue = function() {
        return this.$textArea.val();
    };
    
    ns.PlainTextEditor.prototype._syncValue = function() {
        this.$textField.val(this.$textArea.val());
    };

    ns.PlainTextEditor.prototype.setValue = function(value) {
        this.$textArea.val(value);
        channel.trigger(ns.constants.EVENT_CONTENT_FRAGMENT_FIELD_MODIFIED);
    };

    ns.PlainTextEditor.prototype.getPlainText = function() {
        return this.getValue();
    };
    
    ns.PlainTextEditor.prototype.getEditorAdapter  = function() {
        return new PlainTextEditorAdapter();
    }
    
    ns.PlainTextEditor.prototype.adaptToContext = function() {
        // do nothing
    }

    ns.PlainTextEditor.prototype.hasToolbar = function() {
        return false;
    };

})($, window.Dam.CFM, window);
