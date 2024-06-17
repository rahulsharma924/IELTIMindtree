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

(function($, ns, window) {
    "use strict";
    
    var IMPORT_TEXT_PLUGIN_ID = "importText";
    var constants = ns.multieditor.constants;
    var channel = $(window.document);
    
    /**
     * Creates the importText Plugin.
     * @constructor
     */
    ns.ImportTextPlugin = function() {
        this.id = IMPORT_TEXT_PLUGIN_ID;
    };
    
    ns.ImportTextPlugin.prototype = Object.create(ns.MultiEditorPlugin);
    
    ns.ImportTextPlugin.prototype.setUp = function(options) {
        this.multiEditor = options.multiEditor;
        this.uiContainer = options.uiContainer;
    }
    
    ns.ImportTextPlugin.prototype.getId = function() {
        return this.id;
    };    
    
    ns.ImportTextPlugin.prototype.initializeUI = function() {
        var index = 0, self = this;
        var multiEditor = this.multiEditor;
        var fileUpload = new Coral.FileUpload().set({
        	  accept: "text/plain",
        	  sizeLimit: 1000000,
        	  name: "upload",
        	  action: this.multiEditor.$textField.data("contentUploadPath"),
        	  autoStart: true
        	});
        
        fileUpload.classList.add("cfm-importcontent");
        fileUpload.set("async", "true");
        fileUpload.set("title", this.multiEditor.$textField.data("title"));
        
        var button = new Coral.Button().set({
            label: {
                innerHTML: Granite.I18n.get("Import Content")
            },
            title: Granite.I18n.get("Select the plain text file (*.txt) to import."),
            variant: "quiet",
            icon: "upload",
            iconSize: "S"
          });
            
        $(button).attr("coral-fileupload-select", "");
        fileUpload.appendChild(button);
        
        this.ui = this.uiContainer.appendChild(fileUpload);
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
        this.ui.on("coral-fileupload:load", function (element) {
            var url = Granite.HTTP.externalize("/libs/dam/cfm/admin/content/fragment-editor/importcontent/");
            if (element.detail.item.responseType === "text") {
                url += "plain.html";
            }
            ns.RequestManager.schedule({
                request: {
                    url: url + encodeURI(ns.state.fragment.path),
                    method: "get",
                    dataType: "html",
                    cache: false
                },
                type: ns.RequestManager.REQ_SEQUENTIAL,
                condition: ns.RequestManager.COND_NONE,
                ui: ns.RequestManager.UI_MASK_IMMEDIATELY,
                handlers: {
                    success: function(response) {
                        var data = response.data;
                        $("body").append(data);
                        var dialog = $("#importDialog")[0];
                        Coral.commons.ready(dialog, function() {
                            dialog.show();
                        });
                        dialog.on("click", "#importContentButton", function(event) {
                            var form = $("#importContent");
                            ns.editor.Core.notifyModification();
                            var formAction = form.attr("action");
                            var postData = form.serializeArray();
                            ns.RequestManager.schedule({
                                request: {
                                    url: formAction,
                                    type: "POST",
                                    dataType: "json",
                                    data: postData
                                },
                                type: ns.RequestManager.REQ_SEQUENTIAL,
                                condition: ns.RequestManager.COND_EDITSESSION,
                                ui: ns.RequestManager.UI_MASK_IMMEDIATELY,
                                handlers: {
                                    success: function(response) {
                                        var data = response.data;
                                        var previousContent = multiEditor.getValue();
                                        if (data.location === "replace") {
                                        	multiEditor.setValue(data.content);
                                            // after replacing the content save it, so the backend can do a consistency check on annotations
                                            // and then reload the timeline so it reflects the changes
                                            ns.editor.Page.requestSave((function(isSuccess) {
                                                if (isSuccess) {
                                                    ns.Annotate.updateTimeline();
                                                }
                                            }));
                                        }
                                        else if (data.location === "after") {
                                        	multiEditor.setValue(previousContent + data.content);
                                        }
                                        else if (data.location === "before") {
                                        	multiEditor.setValue(data.content + previousContent);
                                        }
                                    },
                                    fail: function() {
                                        var ui = $(window).adaptTo("foundation-ui");
                                        ui.alert(Granite.I18n.get("Error"), Granite.I18n.get("Could not import content from selected file"), "error");
                                    }
                                }
                            });
                            dialog.remove();
                        });
                        try {
                            var response = JSON.parse(element.detail.item._xhr.responseText);
                            $("#filename").val(element.detail.item._originalFile.name);
                            $("#mimetype").val(element.detail.item._originalFile.type);
                            $("#editorMimeType").val(multiEditor.getMimeType());
                            $("#tempNodeName").val(response.tempNodeName);
                            var isEncodingDetected = response.encodingDetected;
                            if (!isEncodingDetected) {
                                var $hint = $("#noEncodingDetected");
                                $hint[0].hidden = undefined;
                            }
                        }
                        catch (exception) {
                        	var ui = $(window).adaptTo("foundation-ui");
                        	ui.alert(Granite.I18n.get("Error"), Granite.I18n.get("Parsing the JSON/updating the UI failed."), "error");
                        }
                    }
                }
            });
        });
    };
    
    
    ns.ImportTextPlugin.prototype.isEnabled = function() {
    	return true;
    };
    
    ns.multieditor.plugins.PluginRegistry.register(IMPORT_TEXT_PLUGIN_ID, ns.ImportTextPlugin);
    
})(Granite.$, window.Dam.CFM, window);
