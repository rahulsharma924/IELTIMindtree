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

    var SYNC_WITH_MASTER_PLUGIN_ID = "syncWithMaster";
    var constants = ns.multieditor.constants;


    ns.SyncWithMasterPlugin = function() {
        // class creator
        this.id = SYNC_WITH_MASTER_PLUGIN_ID;
        this._stats = new ns.TextStats();
    };

    ns.SyncWithMasterPlugin.prototype = Object.create(ns.MultiEditorPlugin);

    ns.SyncWithMasterPlugin.prototype.setUp = function(options) {
        this.multiEditor = options.multiEditor;
        this.uiContainer = options.uiContainer;
    }

    ns.SyncWithMasterPlugin.prototype.getId = function() {
        return this.id;
    };

    ns.SyncWithMasterPlugin.prototype._updateUI = function(event) {
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

    ns.SyncWithMasterPlugin.prototype.initializeUI = function() {
        var index = 0, self = this;
        this.ui = this.uiContainer.appendChild(new Coral.Button()).set({
        	label: {
        	    innerHTML: Granite.I18n.get("Sync with master")
        	  },
            variant: "quiet",
            icon: "sync",
            iconSize: "S"
        });
        this.ui.on("click", function() {
            ns.Synchronization.setUp(self.multiEditor);
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
            this.ui.setAttribute("disabled", true);
        }, this);
        this.multiEditor.registerListener(ns.multieditor.events.ACTIVE_EDITOR_FOCUS, function(e) {
            this.ui.removeAttribute("disabled");
        }, this);
    };

    ns.SyncWithMasterPlugin.prototype.isEnabled = function() {
        var variation = ns.state.fragment.variation;
        return variation != undefined && variation != "";
    };
    
    ns.multieditor.plugins.PluginRegistry.register(SYNC_WITH_MASTER_PLUGIN_ID, ns.SyncWithMasterPlugin);

})(Granite.$, window.Dam.CFM);
