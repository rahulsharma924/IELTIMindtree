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

    var constants = ns.multieditor.constants;

    ns.MultiEditorManager = function(options) {
        // class creator
        this._editorContainers = [];
        this.options = options ? options : {};
        // common parent of all containers used to determine OOA clicks for a MultiEditor
        this.$_root = this.options.$root;
    };

    ns.MultiEditorManager.prototype.getEditor = function($container) {
        var containerIndex, containerObj, container = $container[0];
        if (!$container.hasClass("cfm-multieditor")) {
            return;
        }
        for (containerIndex = 0; containerIndex < this._editorContainers.length; containerIndex++) {
            containerObj = this._editorContainers[containerIndex];
            if (containerObj.container === container) {
                return containerObj.editor;
            }
        }
    };

    ns.MultiEditorManager.prototype.handleContainer = function($container) {
        // return if already handled.
        var containerIndex, containerObj;
        if (!$container.hasClass("cfm-multieditor") || this.getEditor($container)) {
            return;
        }
        var $textField = $container.find("[" + constants.ATTR_DATA_INPUT_FIELD + "=true]");
        var editor = new ns.MultiEditor($container);
        this._registerSubEditors(editor, $container.find(".cfm-multieditor-fullscreen"), $textField, true);
        this._registerSubEditors(editor, $container.find("[data-form-view-container=true]"), $textField);
        containerObj = {
            "container": $container[0],
            "editor": editor
        };
        this._editorContainers.push(containerObj);
        var contentType = $textField.data("contentType");
        if (editor.$multiFieldItem) {
            var arrayMimeType = this._getArrayContentType($container);
            if (arrayMimeType) {
                contentType = arrayMimeType;
            }
            $textField.attr("data-content-type", contentType);
        }
        // we currently only support three types of contentType
        // if our contentType is not one of these, then we default to RICHTEXT_MIME_TYPE
        // this is our most robust contentType, so there would be no data lost regarding this
        if (contentType === undefined || (
            contentType !== constants.PLAINTEXT_MIME_TYPE &&
            contentType !== constants.MARKDOWN_MIME_TYPE &&
            contentType !== constants.RICHTEXT_MIME_TYPE)) {
            contentType = constants.PLAINTEXT_MIME_TYPE;
        }
        editor.start(contentType);
    };

    ns.MultiEditorManager.prototype._registerSubEditors = function(editor, $section, $textField, isFullscreen) {
        var mimeType = undefined, $embeds, itemIndex, markDownEditor, rteOptions = {}, $editable;
        $embeds = $section.find("[data-embedded-editor=true]");
        for (itemIndex = 0; itemIndex < $embeds.length; itemIndex++) {
            var $item = $($embeds[itemIndex]);
            var mimeType = $item.data("accepts-mimetype");
            if (mimeType === constants.PLAINTEXT_MIME_TYPE) {
                editor.registerEditor(new ns.PlainTextEditor({
                    "$container": $item,
                    "$textField": $textField
                }), $item[0]);
            } else if (mimeType === constants.MARKDOWN_MIME_TYPE) {
                markDownEditor = new ns.MarkdownEditor({
                    "$container": $item,
                    "$textField": $textField
                });
                editor.registerEditor(markDownEditor, $item[0]);
            } else if (mimeType === constants.RICHTEXT_MIME_TYPE) {
                $editable = $section.find(rteOptions["selectorForEditable"]);
                rteOptions["selectorForEditable"] = "[" + constants.ATTR_DATA_RICHTEXT_EDITABLE + "=true]";
                rteOptions["$textField"] = $textField;
                rteOptions["editorType"] = $editable.data("editorType");
                rteOptions["externalStyleSheets"] = $editable.data("externalStyleSheets");
                rteOptions["customStart"] = $editable.data("customStart");
                // todo if we create a factory for creating editors, the multieditor factory should find and add toolbar
                // dom to all sub editors' data attributes. The sub editors factories would then read it from dom.
                rteOptions["$rteToolbarContainer"] = $section.find(".rte-ui");
                rteOptions["$formViewContainer"] = $item;
                if (!isFullscreen) {
                    rteOptions["disableToolbarOnStart"] = true;
                }
                editor.registerEditor(new ns.StyledTextEditor(rteOptions), $item[0]);
            }

        }
        return editor;
    };

    // The handleInit handler needs to be registered with a higher rank as the main editor loader.
    ns.Core.registerReadyHandler(handleInit, 1001);

    function handleInit() {
        var $target = $("." + constants.CONTAINER_ROOT_CLASS);

        if ($target.length > 0) {
            var editorManager = $target.data(constants.ATTR_DATA_MANAGER);
            if (!editorManager) {
                editorManager = new ns.MultiEditorManager({
                    "$root": $target
                });
                $target.data(constants.ATTR_DATA_MANAGER, editorManager);
            }
        }
        var $container = $target.hasClass(constants.MULTI_EDITOR_CONTAINER_CLASS) ? $target : $target.find("." + constants.MULTI_EDITOR_CONTAINER_CLASS);
        // Find editorManager for each multi-editor to handle it.
        $container.each(function() {
            var $this = $(this);
            var editorManager = $this.closest("." + constants.CONTAINER_ROOT_CLASS).data(constants.ATTR_DATA_MANAGER);
            if (editorManager) {
                editorManager.handleContainer($this);
            }
        });

    };
    ns.MultiEditorManager.prototype._getArrayContentType = function($container) {
        var $fields = $container.closest("[data-cfminput='true']");
        var items;
        var arrayMimeType;
        //find mimeType from previous multiField item if new multiEditor(click add button) item added in Array
        $fields.each(function() {
            var $this = $(this);
            if ($this.is("coral-multifield")) {
                items = this.items.getAll();
                if (items.length > 1) {
                    var $textField = $(items[0].content).find("[" + constants.ATTR_DATA_INPUT_FIELD + "=true]");
                    arrayMimeType = $textField.attr("data-content-type");
                }
            }

        });
        return arrayMimeType;
    };

})(Granite.$, window.Dam.CFM);