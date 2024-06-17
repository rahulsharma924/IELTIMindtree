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

    ns.MarkdownExtractor = function() {};

    ns.MarkdownExtractor.prototype.extract = function($source) {
        var result = $source.val();

        /* underscore below headers */
        result = result.replace(/^[=\-]{2,}\s*$/g, '');

        /* images */
        result = result.replace(/\!\[.*?\][\[\(].*?[\]\)]/g, '');

        /* links */
        result = result.replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1');

        /* headers */
        result = result
            .replace(/^\#{1,6}\s*([^#]*)\s*(\#{1,6})?/gm, '$1')
            .replace(/([\*_]{1,2})(\S.*?\S)\1/g, '$2')
            .replace(/(`{3,})(.*?)\1/gm, '$2')
            .replace(/^-{3,}\s*$/g, '')
            .replace(/`(.+?)`/g, '$1')
            .replace(/\n{2,}/g, '\n\n');

        return result;
    };

})($, window.Dam.CFM, window);