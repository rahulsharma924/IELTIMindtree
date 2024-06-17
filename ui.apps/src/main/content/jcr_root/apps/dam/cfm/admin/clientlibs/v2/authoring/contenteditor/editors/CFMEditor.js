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

    ns.CFMEditor = function() {
        // interface
        this._eventListeners = {};
    };

    ns.CFMEditor.prototype.start = function(options) {
        throw new Error("Editor implementation must implement start method.")
    };

    ns.CFMEditor.prototype.end = function() {
        throw new Error("Editor implementation must implement end method.")
    };

    ns.CFMEditor.prototype.getMimeType = function() {
        throw new Error("Editor implementation must implement getMimeType method.")
    };

    ns.CFMEditor.prototype.getValue = function() {
        throw new Error("Editor implementation must implement getValue method.")
    };

    ns.CFMEditor.prototype.setValue = function(value) {
        throw new Error("Editor implementation must implement setValue method.")
    };

    ns.CFMEditor.prototype.getPlainText = function() {
        throw new Error("Editor implementation must implement getPlainText method.")
    };

    /**
     * Sets focus on editable area of this editor.
     */
    ns.CFMEditor.prototype.focus = function(value) {
        throw new Error("Editor implementation must implement focus method.")
    };

    /**
     * Adds an event listener to this editor for an event. Currently following events are supported-
     * 1. cfm-editor-focus - focus event of the editable area of this editor
     * 2. cfm-editor-blur - blur event of the editable area of this editor
     * The event is passed as first parameter to the listener.
     * @param {Function} fn - the handler
     * @param {String} event - the event name
     * @param {Object} scope Scope for fn
     */
    ns.CFMEditor.prototype.addEventListener = function(fn, event, scope) {
        if (event === "cfm-editor-focus" || event === "cfm-editor-blur") {
            if (!this._eventListeners[event]) {
                this._eventListeners[event] = [];
            }
            this._eventListeners[event].push({
                fn : fn,
                scope: scope
            });
        }
    };

    /**
     * Removes an event listener to this editor for an event.
     * @param {Function} fn - the handler
     * @param {String} event - the event name
     * @param {Object} scope Scope for fn
     */
    ns.CFMEditor.prototype.removeEventListener = function(fn, event, scope) {
        var index = 0, listenerCount = this._eventListeners[event].length;
        for (; index < listenerCount; index++) {
            if (fn === this._eventListeners[event][index].fn && scope === this._eventListeners[event][index].scope) {
                this._eventListeners[event].splice(index, 1);
            }
        }
    };

    /**
     * Removes all event listeners added through ns.CFMEditor.prototype.addEventListener
     */
    ns.CFMEditor.prototype.removeAllEventListeners = function() {
        this._eventListeners = {};
    };

    /**
     * Calls the listeners registered for event defined by eventName.
     * @param {String} eventName - name of the event
     * @param {Event} event - the actual event object
     * @protected
     */
    ns.CFMEditor.prototype._triggerListeners = function(eventName, event) {
        var listeners = this._eventListeners[eventName];
        if (listeners) {
            listeners.forEach(function(fnObj) {
                fnObj.fn.call(fnObj.scope, event);
            });
        }
    };

    /**
     * @return {ns.CFMEditorAdapter}
     */
    ns.CFMEditor.prototype.getEditorAdapter = function () {
        throw new Error("Editor implementation must implement getEditorAdapter method.");
    }

    /**
     * Adapts current editor context to passed context (extracted from ns.CFMEditorAdapter)
     */
    ns.CFMEditor.prototype.adaptToContext = function(context) {
        throw new Error("Editor implementation must implement adaptToContext method.");
    }

    ns.CFMEditor.prototype.hasToolbar = function(context) {
        throw new Error("Editor implementation must implement hasToolbar method.");
    }

})($, window.Dam.CFM, window);
