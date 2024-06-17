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

    /**
     * An interface for multi editor plugins.
     */
    ns.MultiEditorPlugin = function() {
    };

    ns.MultiEditorPlugin.prototype.setUp = function() {
        throw new Error("MultiEditorPlugin implementation must implement setUp method.");
    };

    ns.MultiEditorPlugin.prototype.getId = function() {
        throw new Error("MultiEditorPlugin implementation must implement getId method.");
    };

    ns.MultiEditorPlugin.prototype.initializeUI = function() {
        throw new Error("MultiEditorPlugin implementation must implement initializeUI method.");
    };

    ns.MultiEditorPlugin.prototype.isEnabled = function() {
        throw new Error("MultiEditorPlugin implementation must implement isEnabled method.");
    };

    ns.multieditor.plugins = {};
    var PluginRegistry = function() {
        this._registry = {};
    };

    PluginRegistry.prototype.register = function(id, cls) {
        this._registry[id] = cls;
    };

    PluginRegistry.prototype.createPlugins = function() {
        var plugins = {};
        for (var plgId in this._registry) {
            if (this._registry.hasOwnProperty(plgId)) {
                plugins[plgId] = new this._registry[plgId];
            }
        }
        return plugins;
    };

    ns.multieditor.plugins.PluginRegistry = new PluginRegistry();

})(Granite.$, window.Dam.CFM);
