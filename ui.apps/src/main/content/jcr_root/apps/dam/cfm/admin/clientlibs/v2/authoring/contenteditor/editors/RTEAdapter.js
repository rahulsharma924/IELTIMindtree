/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 * 
 *  Copyright 2017 Adobe
 *  All Rights Reserved.
 * 
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 *************************************************************************/
 
(function($, ns) {
    "use strict";

    var sel = CUI.rte.Selection;

    function getBookmark(rte) {
        var context = rte.editorKernel.getEditContext();
        return sel.createSelectionBookmark(context);
    }

    function selectBookmark(rte, bookmark) {
        var context = rte.editorKernel.getEditContext();
        sel.selectBookmark(context, bookmark);
    }

    ns.RTEAdapter = function(baseRTE) {
        this.baseRTE = baseRTE;
    };

    ns.RTEAdapter.prototype = Object.create(ns.CFMEditorAdapter);

    ns.RTEAdapter.prototype.extractContextInfo = function() {
        var self = this;
        this.contextInfo = {
            "bkm": getBookmark(self.baseRTE),
            "undoConfig": self.baseRTE.getUndoConfig(),
            "editContext": self.baseRTE.editorKernel.getEditContext()
        };
    };

    ns.RTEAdapter.prototype.getAdaptedContext = function(newEditor) {
        this._convertBookmark(this.contextInfo.bkm, newEditor.rte.editorKernel.getEditContext());
        return this.contextInfo;
    };

    ns.RTEAdapter.prototype._convertBookmark = function(bkm, toContext) {
        var indexPath;
        var com = CUI.rte.Common;
        var fromContext = this.contextInfo.editContext;
        if (bkm.insertObject) {
            indexPath = com.createIndexPath(fromContext, bkm.insertObject);
            bkm.insertObject = com.getElementByIndexPath(toContext.root, indexPath);
        }
        if (bkm.object) {
            indexPath = com.createIndexPath(fromContext, bkm.object);
            bkm.object = com.getElementByIndexPath(toContext.root, indexPath);
        }
        if (bkm.cells) {
            var cellsCopy = [];
            for (var c=0; c < bkm.cells.length; c++) {
                indexPath = com.createIndexPath(fromContext, bkm.cells[c]);
                cellsCopy.push(com.getElementByIndexPath(toContext.root, indexPath));
            }
            bkm.cells = cellsCopy;
        }
    };

})(Granite.$, window.Dam.CFM);
