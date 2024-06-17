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

    var editors = [ ];

    var editorsByMimeType = { };

    ns.EditorRegistry = {

        register: function(editor) {
            editors.push(editor);
            editorsByMimeType[editor.getMimeType()] = editor;
        },

        getEditors: function() {
            return editors;
        },

        getEditorForMimeType: function(mimeType) {
            if (editorsByMimeType.hasOwnProperty(mimeType)) {
                return editorsByMimeType[mimeType];
            }
            return undefined;
        }

    };

})($, window.Dam.CFM, window);
