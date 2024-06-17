/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/@algolia/recommend-js@1.8.1/dist/umd/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*! @algolia/recommend-js 1.8.1 | MIT License | © Algolia, Inc. and contributors | https://github.com/algolia/recommend */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self)["@algolia/recommend-js"]={})}(this,(function(e){"use strict";function t(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function n(){return n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},n.apply(this,arguments)}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t){if(e){if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(e,t):void 0}}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i=[],a=!0,c=!1;try{for(n=n.call(e);!(a=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);a=!0);}catch(e){c=!0,o=e}finally{try{a||null==n.return||n.return()}finally{if(c)throw o}}return i}}(e,t)||i(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(e){var t=e.hits,n=e.maxRecommendations,r=e.nrOfObjs,o={};t.forEach((function(e){e.forEach((function(e,t){o[e.objectID]?o[e.objectID]={indexSum:o[e.objectID].indexSum+t,nr:o[e.objectID].nr+1}:o[e.objectID]={indexSum:t,nr:1}}))}));var i=function(e,t){for(var n=[],r=0,o=Object.keys(e);r<o.length;r++){var i=o[r];e[i].nr<2&&(e[i].indexSum+=100),n.push({objectID:i,avgOfIndices:e[i].indexSum/t})}return n.sort((function(e,t){return e.avgOfIndices>t.avgOfIndices?1:-1}))}(o,r);return i.reduce((function(e,n){var r=t.flat().find((function(e){return e.objectID===n.objectID}));return r?e.concat(r):e}),[]).slice(0,n&&n>0?n:void 0)}function l(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||i(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e){var t,n,r,o=e.hits,i=e.maxRecommendations;return(t=function(e,t){return(e._score||0)>(t._score||0)?-1:1},n=o,r=l(n),r.sort(t),r).slice(0,i&&i>0?i:void 0)}var s="1.8.1";function m(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter(Boolean).join(" ")}function _(e){var t=e.createElement,n=e.Fragment;return function(e){return 0===e.recommendations.length&&"idle"===e.status?t(e.Fallback,null):t("section",{className:m("auc-Recommend",e.classNames.root)},t(e.Header,{classNames:e.classNames,recommendations:e.recommendations,translations:e.translations,createElement:t,Fragment:n}),t(e.View,null))}}function f(e){var t=e.createElement;return function(e){return!e.recommendations||e.recommendations.length<1?null:e.translations.title?t("h3",{className:m("auc-Recommend-title",e.classNames.title)},e.translations.title):null}}function p(e){var t=e.createElement,n=e.Fragment;return function(e){return t("div",{className:m("auc-Recommend-container",e.classNames.container)},t("ol",{className:m("auc-Recommend-list",e.classNames.list)},e.items.map((function(r){return t("li",{key:r.objectID,className:m("auc-Recommend-item",e.classNames.item)},t(e.itemComponent,{createElement:t,Fragment:n,item:r}))}))))}}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function h(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}var y,g,O,j,w={},P=[],k=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function C(e,t){for(var n in t)e[n]=t[n];return e}function E(e){var t=e.parentNode;t&&t.removeChild(e)}function D(e,t,n){var r,o,i,a=arguments,c={};for(i in t)"key"==i?r=t[i]:"ref"==i?o=t[i]:c[i]=t[i];if(arguments.length>3)for(n=[n],i=3;i<arguments.length;i++)n.push(a[i]);if(null!=n&&(c.children=n),"function"==typeof e&&null!=e.defaultProps)for(i in e.defaultProps)void 0===c[i]&&(c[i]=e.defaultProps[i]);return S(e,c,r,o,null)}function S(e,t,n,r,o){var i={type:e,props:t,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++y.__v:o};return null!=y.vnode&&y.vnode(i),i}function F(e){return e.children}function N(e,t){this.props=e,this.context=t}function x(e,t){if(null==t)return e.__?x(e.__,e.__.__k.indexOf(e)+1):null;for(var n;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e)return n.__e;return"function"==typeof e.type?x(e):null}function A(e){var t,n;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e){e.__e=e.__c.base=n.__e;break}return A(e)}}function I(e){(!e.__d&&(e.__d=!0)&&g.push(e)&&!R.__r++||j!==y.debounceRendering)&&((j=y.debounceRendering)||O)(R)}function R(){for(var e;R.__r=g.length;)e=g.sort((function(e,t){return e.__v.__b-t.__v.__b})),g=[],e.some((function(e){var t,n,r,o,i,a;e.__d&&(i=(o=(t=e).__v).__e,(a=t.__P)&&(n=[],(r=C({},o)).__v=o.__v+1,W(a,o,r,t.__n,void 0!==a.ownerSVGElement,null!=o.__h?[i]:null,n,null==i?x(o):i,o.__h),B(n,o),o.__e!=i&&A(o)))}))}function T(e,t,n,r,o,i,a,c,l,u){var s,m,_,f,p,d,h,v=r&&r.__k||P,b=v.length;for(n.__k=[],s=0;s<t.length;s++)if(null!=(f=n.__k[s]=null==(f=t[s])||"boolean"==typeof f?null:"string"==typeof f||"number"==typeof f||"bigint"==typeof f?S(null,f,null,null,f):Array.isArray(f)?S(F,{children:f},null,null,null):f.__b>0?S(f.type,f.props,f.key,null,f.__v):f)){if(f.__=n,f.__b=n.__b+1,null===(_=v[s])||_&&f.key==_.key&&f.type===_.type)v[s]=void 0;else for(m=0;m<b;m++){if((_=v[m])&&f.key==_.key&&f.type===_.type){v[m]=void 0;break}_=null}W(e,f,_=_||w,o,i,a,c,l,u),p=f.__e,(m=f.ref)&&_.ref!=m&&(h||(h=[]),_.ref&&h.push(_.ref,null,f),h.push(m,f.__c||p,f)),null!=p?(null==d&&(d=p),"function"==typeof f.type&&null!=f.__k&&f.__k===_.__k?f.__d=l=H(f,l,e):l=q(e,f,_,v,p,l),u||"option"!==n.type?"function"==typeof n.type&&(n.__d=l):e.value=""):l&&_.__e==l&&l.parentNode!=e&&(l=x(_))}for(n.__e=d,s=b;s--;)null!=v[s]&&("function"==typeof n.type&&null!=v[s].__e&&v[s].__e==n.__d&&(n.__d=x(r,s+1)),z(v[s],v[s]));if(h)for(s=0;s<h.length;s++)G(h[s],h[++s],h[++s])}function H(e,t,n){var r,o;for(r=0;r<e.__k.length;r++)(o=e.__k[r])&&(o.__=e,t="function"==typeof o.type?H(o,t,n):q(n,o,o,e.__k,o.__e,t));return t}function q(e,t,n,r,o,i){var a,c,l;if(void 0!==t.__d)a=t.__d,t.__d=void 0;else if(null==n||o!=i||null==o.parentNode)e:if(null==i||i.parentNode!==e)e.appendChild(o),a=null;else{for(c=i,l=0;(c=c.nextSibling)&&l<r.length;l+=2)if(c==o)break e;e.insertBefore(o,i),a=i}return void 0!==a?a:o.nextSibling}function M(e,t,n){"-"===t[0]?e.setProperty(t,n):e[t]=null==n?"":"number"!=typeof n||k.test(t)?n:n+"px"}function L(e,t,n,r,o){var i;e:if("style"===t)if("string"==typeof n)e.style.cssText=n;else{if("string"==typeof r&&(e.style.cssText=r=""),r)for(t in r)n&&t in n||M(e.style,t,"");if(n)for(t in n)r&&n[t]===r[t]||M(e.style,t,n[t])}else if("o"===t[0]&&"n"===t[1])i=t!==(t=t.replace(/Capture$/,"")),t=t.toLowerCase()in e?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=n,n?r||e.addEventListener(t,i?V:U,i):e.removeEventListener(t,i?V:U,i);else if("dangerouslySetInnerHTML"!==t){if(o)t=t.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==t&&"list"!==t&&"form"!==t&&"tabIndex"!==t&&"download"!==t&&t in e)try{e[t]=null==n?"":n;break e}catch(e){}"function"==typeof n||(null!=n&&(!1!==n||"a"===t[0]&&"r"===t[1])?e.setAttribute(t,n):e.removeAttribute(t))}}function U(e){this.l[e.type+!1](y.event?y.event(e):e)}function V(e){this.l[e.type+!0](y.event?y.event(e):e)}function W(e,t,n,r,o,i,a,c,l){var u,s,m,_,f,p,d,h,v,b,g,O=t.type;if(void 0!==t.constructor)return null;null!=n.__h&&(l=n.__h,c=t.__e=n.__e,t.__h=null,i=[c]),(u=y.__b)&&u(t);try{e:if("function"==typeof O){if(h=t.props,v=(u=O.contextType)&&r[u.__c],b=u?v?v.props.value:u.__:r,n.__c?d=(s=t.__c=n.__c).__=s.__E:("prototype"in O&&O.prototype.render?t.__c=s=new O(h,b):(t.__c=s=new N(h,b),s.constructor=O,s.render=J),v&&v.sub(s),s.props=h,s.state||(s.state={}),s.context=b,s.__n=r,m=s.__d=!0,s.__h=[]),null==s.__s&&(s.__s=s.state),null!=O.getDerivedStateFromProps&&(s.__s==s.state&&(s.__s=C({},s.__s)),C(s.__s,O.getDerivedStateFromProps(h,s.__s))),_=s.props,f=s.state,m)null==O.getDerivedStateFromProps&&null!=s.componentWillMount&&s.componentWillMount(),null!=s.componentDidMount&&s.__h.push(s.componentDidMount);else{if(null==O.getDerivedStateFromProps&&h!==_&&null!=s.componentWillReceiveProps&&s.componentWillReceiveProps(h,b),!s.__e&&null!=s.shouldComponentUpdate&&!1===s.shouldComponentUpdate(h,s.__s,b)||t.__v===n.__v){s.props=h,s.state=s.__s,t.__v!==n.__v&&(s.__d=!1),s.__v=t,t.__e=n.__e,t.__k=n.__k,t.__k.forEach((function(e){e&&(e.__=t)})),s.__h.length&&a.push(s);break e}null!=s.componentWillUpdate&&s.componentWillUpdate(h,s.__s,b),null!=s.componentDidUpdate&&s.__h.push((function(){s.componentDidUpdate(_,f,p)}))}s.context=b,s.props=h,s.state=s.__s,(u=y.__r)&&u(t),s.__d=!1,s.__v=t,s.__P=e,u=s.render(s.props,s.state,s.context),s.state=s.__s,null!=s.getChildContext&&(r=C(C({},r),s.getChildContext())),m||null==s.getSnapshotBeforeUpdate||(p=s.getSnapshotBeforeUpdate(_,f)),g=null!=u&&u.type===F&&null==u.key?u.props.children:u,T(e,Array.isArray(g)?g:[g],t,n,r,o,i,a,c,l),s.base=t.__e,t.__h=null,s.__h.length&&a.push(s),d&&(s.__E=s.__=null),s.__e=!1}else null==i&&t.__v===n.__v?(t.__k=n.__k,t.__e=n.__e):t.__e=$(n.__e,t,n,r,o,i,a,l);(u=y.diffed)&&u(t)}catch(e){t.__v=null,(l||null!=i)&&(t.__e=c,t.__h=!!l,i[i.indexOf(c)]=null),y.__e(e,t,n)}}function B(e,t){y.__c&&y.__c(t,e),e.some((function(t){try{e=t.__h,t.__h=[],e.some((function(e){e.call(t)}))}catch(e){y.__e(e,t.__v)}}))}function $(e,t,n,r,o,i,a,c){var l,u,s,m,_=n.props,f=t.props,p=t.type,d=0;if("svg"===p&&(o=!0),null!=i)for(;d<i.length;d++)if((l=i[d])&&(l===e||(p?l.localName==p:3==l.nodeType))){e=l,i[d]=null;break}if(null==e){if(null===p)return document.createTextNode(f);e=o?document.createElementNS("http://www.w3.org/2000/svg",p):document.createElement(p,f.is&&f),i=null,c=!1}if(null===p)_===f||c&&e.data===f||(e.data=f);else{if(i=i&&P.slice.call(e.childNodes),u=(_=n.props||w).dangerouslySetInnerHTML,s=f.dangerouslySetInnerHTML,!c){if(null!=i)for(_={},m=0;m<e.attributes.length;m++)_[e.attributes[m].name]=e.attributes[m].value;(s||u)&&(s&&(u&&s.__html==u.__html||s.__html===e.innerHTML)||(e.innerHTML=s&&s.__html||""))}if(function(e,t,n,r,o){var i;for(i in n)"children"===i||"key"===i||i in t||L(e,i,null,n[i],r);for(i in t)o&&"function"!=typeof t[i]||"children"===i||"key"===i||"value"===i||"checked"===i||n[i]===t[i]||L(e,i,t[i],n[i],r)}(e,f,_,o,c),s)t.__k=[];else if(d=t.props.children,T(e,Array.isArray(d)?d:[d],t,n,r,o&&"foreignObject"!==p,i,a,e.firstChild,c),null!=i)for(d=i.length;d--;)null!=i[d]&&E(i[d]);c||("value"in f&&void 0!==(d=f.value)&&(d!==e.value||"progress"===p&&!d)&&L(e,"value",d,_.value,!1),"checked"in f&&void 0!==(d=f.checked)&&d!==e.checked&&L(e,"checked",d,_.checked,!1))}return e}function G(e,t,n){try{"function"==typeof e?e(t):e.current=t}catch(e){y.__e(e,n)}}function z(e,t,n){var r,o,i;if(y.unmount&&y.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||G(r,null,t)),n||"function"==typeof e.type||(n=null!=(o=e.__e)),e.__e=e.__d=void 0,null!=(r=e.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){y.__e(e,t)}r.base=r.__P=null}if(r=e.__k)for(i=0;i<r.length;i++)r[i]&&z(r[i],t,n);null!=o&&E(o)}function J(e,t,n){return this.constructor(e,n)}function K(e,t,n){var r,o,i;y.__&&y.__(e,t),o=(r="function"==typeof n)?null:n&&n.__k||t.__k,i=[],W(t,e=(!r&&n||t).__k=D(F,null,[e]),o||w,w,void 0!==t.ownerSVGElement,!r&&n?[n]:o?null:t.firstChild?P.slice.call(t.childNodes):null,i,!r&&n?n:o?o.__e:t.firstChild,r),B(i,e)}y={__e:function(e,t){for(var n,r,o;t=t.__;)if((n=t.__c)&&!n.__)try{if((r=n.constructor)&&null!=r.getDerivedStateFromError&&(n.setState(r.getDerivedStateFromError(e)),o=n.__d),null!=n.componentDidCatch&&(n.componentDidCatch(e),o=n.__d),o)return n.__E=n}catch(t){e=t}throw e},__v:0},N.prototype.setState=function(e,t){var n;n=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=C({},this.state),"function"==typeof e&&(e=e(C({},n),this.props)),e&&C(n,e),null!=e&&this.__v&&(t&&this.__h.push(t),I(this))},N.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),I(this))},N.prototype.render=F,g=[],O="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,R.__r=0;var Q=function(e,t,n,r){var o;t[0]=0;for(var i=1;i<t.length;i++){var a=t[i++],c=t[i]?(t[0]|=a?1:2,n[t[i++]]):t[++i];3===a?r[0]=c:4===a?r[1]=Object.assign(r[1]||{},c):5===a?(r[1]=r[1]||{})[t[++i]]=c:6===a?r[1][t[++i]]+=c+"":a?(o=e.apply(c,Q(e,c,n,["",null])),r.push(o),c[0]?t[0]|=2:(t[i-2]=0,t[i]=o)):r.push(c)}return r},X=new Map;var Y,Z,ee,te=function(e){var t=X.get(this);return t||(t=new Map,X.set(this,t)),(t=Q(this,t.get(e)||(t.set(e,t=function(e){for(var t,n,r=1,o="",i="",a=[0],c=function(e){1===r&&(e||(o=o.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?a.push(0,e,o):3===r&&(e||o)?(a.push(3,e,o),r=2):2===r&&"..."===o&&e?a.push(4,e,0):2===r&&o&&!e?a.push(5,0,!0,o):r>=5&&((o||!e&&5===r)&&(a.push(r,0,o,n),r=6),e&&(a.push(r,e,0,n),r=6)),o=""},l=0;l<e.length;l++){l&&(1===r&&c(),c(l));for(var u=0;u<e[l].length;u++)t=e[l][u],1===r?"<"===t?(c(),a=[a],r=3):o+=t:4===r?"--"===o&&">"===t?(r=1,o=""):o=t+o[0]:i?t===i?i="":o+=t:'"'===t||"'"===t?i=t:">"===t?(c(),r=1):r&&("="===t?(r=5,n=o,o=""):"/"===t&&(r<5||">"===e[l][u+1])?(c(),3===r&&(a=a[0]),r=a,(a=a[0]).push(2,0,r),r=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(c(),r=2):o+=t),3===r&&"!--"===o&&(r=4,a=a[0])}return c(),a}(e)),t),arguments,[])).length>1?t:t[0]}.bind(D),ne=0,re=[],oe=y.__b,ie=y.__r,ae=y.diffed,ce=y.__c,le=y.unmount;function ue(e,t){y.__h&&y.__h(Z,e,ne||t),ne=0;var n=Z.__H||(Z.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function se(e){return ne=1,function(e,t,n){var r=ue(Y++,2);return r.t=e,r.__c||(r.__=[n?n(t):be(void 0,t),function(e){var t=r.t(r.__[0],e);r.__[0]!==t&&(r.__=[t,r.__[1]],r.__c.setState({}))}],r.__c=Z),r.__}(be,e)}function me(e,t){var n=ue(Y++,3);!y.__s&&ve(n.__H,t)&&(n.__=e,n.__H=t,Z.__H.__h.push(n))}function _e(e){return ne=5,function(e,t){var n=ue(Y++,7);return ve(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}((function(){return{current:e}}),[])}function fe(){re.forEach((function(e){if(e.__P)try{e.__H.__h.forEach(de),e.__H.__h.forEach(he),e.__H.__h=[]}catch(t){e.__H.__h=[],y.__e(t,e.__v)}})),re=[]}y.__b=function(e){Z=null,oe&&oe(e)},y.__r=function(e){ie&&ie(e),Y=0;var t=(Z=e.__c).__H;t&&(t.__h.forEach(de),t.__h.forEach(he),t.__h=[])},y.diffed=function(e){ae&&ae(e);var t=e.__c;t&&t.__H&&t.__H.__h.length&&(1!==re.push(t)&&ee===y.requestAnimationFrame||((ee=y.requestAnimationFrame)||function(e){var t,n=function(){clearTimeout(r),pe&&cancelAnimationFrame(t),setTimeout(e)},r=setTimeout(n,100);pe&&(t=requestAnimationFrame(n))})(fe)),Z=void 0},y.__c=function(e,t){t.some((function(e){try{e.__h.forEach(de),e.__h=e.__h.filter((function(e){return!e.__||he(e)}))}catch(n){t.some((function(e){e.__h&&(e.__h=[])})),t=[],y.__e(n,e.__v)}})),ce&&ce(e,t)},y.unmount=function(e){le&&le(e);var t=e.__c;if(t&&t.__H)try{t.__H.__.forEach(de)}catch(e){y.__e(e,t.__v)}};var pe="function"==typeof requestAnimationFrame;function de(e){var t=Z;"function"==typeof e.__c&&e.__c(),Z=t}function he(e){var t=Z;e.__c=e.__(),Z=t}function ve(e,t){return!e||e.length!==t.length||t.some((function(t,n){return t!==e[n]}))}function be(e,t){return"function"==typeof t?t(e):t}function ye(e,t){return"string"==typeof e?t.document.querySelector(e):e}function ge(e){me((function(){e.recommendClient.addAlgoliaAgent("recommend-js","1.8.1")}),[e.recommendClient])}function Oe(e){var t=_e(void 0),n=a(se(e),2),r=n[0],o=n[1];return me((function(){"stalled"!==r&&t.current&&clearTimeout(t.current),"loading"===r&&(t.current=setTimeout((function(){o("stalled")}),300))}),[r]),{status:r,setStatus:o}}function je(e){return function(t){return D(e,n({},t,{html:te}))}}var we=["container","environment","itemComponent","fallbackComponent","headerComponent","view","children"];function Pe(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ke(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Pe(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Pe(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Ce,Ee,De,Se=(Ee=(Ce={createElement:D,Fragment:F}).createElement,De=Ce.Fragment,function(e){var t,o,i,a,c,l=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({title:"Frequently bought together",sliderLabel:"Frequently bought together products"},e.translations),u=null!==(t=e.classNames)&&void 0!==t?t:{},s=null!==(o=e.children)&&void 0!==o?o:_({createElement:Ee,Fragment:De}),m=null!==(i=e.fallbackComponent)&&void 0!==i?i:function(){return null},h=null!==(a=e.headerComponent)&&void 0!==a?a:f({createElement:Ee,Fragment:De}),v=null!==(c=e.view)&&void 0!==c?c:p({createElement:Ee,Fragment:De});return s({classNames:u,Fallback:function(){return Ee(m,{Fragment:De,createElement:Ee})},Header:h,recommendations:e.items,status:e.status,translations:l,View:function(t){return Ee(v,n({classNames:u,itemComponent:e.itemComponent,items:e.items,translations:l,Fragment:De,createElement:Ee},t))}})});function Fe(e){var t=a(se({recommendations:[]}),2),n=t[0],r=t[1],o=Oe("loading"),i=o.status,l=o.setStatus;return ge({recommendClient:e.recommendClient}),me((function(){l("loading"),function(e){var t=e.objectIDs,n=e.recommendClient,r=e.transformItems,o=void 0===r?function(e){return e}:r,i=e.indexName,a=e.maxRecommendations,l=e.queryParameters,u=e.threshold,m=t.map((function(e){return{indexName:i,maxRecommendations:a,objectID:e,queryParameters:l,threshold:u}}));return n.addAlgoliaAgent("recommend-core",s),n.getFrequentlyBoughtTogether(m).then((function(e){return c({maxRecommendations:a,hits:e.results.map((function(e){return e.hits})),nrOfObjs:t.length})})).then((function(e){return{recommendations:o(e)}}))}(e).then((function(e){r(e),l("idle")}))}),[e,l]),ke(ke({},n),{},{status:i})}function Ne(e){var t=Fe(e),r=t.recommendations,o=t.status;return D(Se,n({},e,{items:r,status:o}))}var xe=["container","environment","itemComponent","fallbackComponent","headerComponent","view","children"];function Ae(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Ie(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Ae(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Ae(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Re=function(e){var t=e.createElement,o=e.Fragment;return function(e){var i,a,c,l,u,s=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?h(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):h(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({title:"Related products",sliderLabel:"Related products"},e.translations),m=null!==(i=e.classNames)&&void 0!==i?i:{},d=null!==(a=e.children)&&void 0!==a?a:_({createElement:t,Fragment:o}),v=null!==(c=e.fallbackComponent)&&void 0!==c?c:function(){return null},b=null!==(l=e.headerComponent)&&void 0!==l?l:f({createElement:t,Fragment:o}),y=null!==(u=e.view)&&void 0!==u?u:p({createElement:t,Fragment:o});return d({classNames:m,Fallback:function(){return t(v,{Fragment:o,createElement:t})},Header:b,recommendations:e.items,status:e.status,translations:s,View:function(r){return t(y,n({classNames:m,itemComponent:e.itemComponent,items:e.items,translations:s,Fragment:o,createElement:t},r))}})}}({createElement:D,Fragment:F});function Te(e){var t=a(se({recommendations:[]}),2),n=t[0],r=t[1],o=Oe("loading"),i=o.status,l=o.setStatus;return ge({recommendClient:e.recommendClient}),me((function(){l("loading"),function(e){var t=e.objectIDs,n=e.recommendClient,r=e.transformItems,o=void 0===r?function(e){return e}:r,i=e.fallbackParameters,a=e.indexName,l=e.maxRecommendations,u=e.queryParameters,m=e.threshold,_=t.map((function(e){return{fallbackParameters:i,indexName:a,maxRecommendations:l,objectID:e,queryParameters:u,threshold:m}}));return n.addAlgoliaAgent("recommend-core",s),n.getRelatedProducts(_).then((function(e){return c({maxRecommendations:l,hits:e.results.map((function(e){return e.hits})),nrOfObjs:t.length})})).then((function(e){return{recommendations:o(e)}}))}(e).then((function(e){r(e),l("idle")}))}),[e,l]),Ie(Ie({},n),{},{status:i})}function He(e){var t=Te(e),r=t.recommendations,o=t.status;return D(Re,n({},e,{items:r,status:o}))}var qe=["container","environment","itemComponent","fallbackComponent","headerComponent","view","children"];function Me(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Le(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Me(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Me(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var Ue=function(e){var t=e.createElement,o=e.Fragment;return function(e){var i,a,c,l,u,s=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?v(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({title:"Trending facets",sliderLabel:"Trending facets"},e.translations),p=null!==(i=e.classNames)&&void 0!==i?i:{},d=null!==(a=e.children)&&void 0!==a?a:_({createElement:t,Fragment:o}),h=null!==(c=e.fallbackComponent)&&void 0!==c?c:function(){return null},b=null!==(l=e.headerComponent)&&void 0!==l?l:f({createElement:t,Fragment:o}),y=null!==(u=e.view)&&void 0!==u?u:function(e){var t=e.createElement,n=e.Fragment;return function(e){return t("div",{className:m("auc-Recommend-container",e.classNames.container)},t("ol",{className:m("auc-Recommend-list",e.classNames.list)},e.items.map((function(r){return t("li",{key:r.facetValue,className:m("auc-Recommend-item",e.classNames.item)},t(e.itemComponent,{createElement:t,Fragment:n,item:r}))}))))}}({createElement:t,Fragment:o});return d({classNames:p,Fallback:function(){return t(h,{Fragment:o,createElement:t})},Header:b,recommendations:e.items,status:e.status,translations:s,View:function(r){return t(y,n({classNames:p,itemComponent:e.itemComponent,items:e.items,translations:s,Fragment:o,createElement:t},r))}})}}({createElement:D,Fragment:F});function Ve(e){var t=a(se({recommendations:[]}),2),n=t[0],r=t[1],o=Oe("loading"),i=o.status,c=o.setStatus;return ge({recommendClient:e.recommendClient}),me((function(){c("loading"),function(e){var t=e.recommendClient,n=e.transformItems,r=void 0===n?function(e){return e}:n,o=e.indexName,i=e.maxRecommendations,a=e.threshold,c=e.facetName,l={indexName:o,maxRecommendations:i,threshold:a,facetName:c};return t.addAlgoliaAgent("recommend-core",s),t.getTrendingFacets([l]).then((function(e){return u({maxRecommendations:i,hits:e.results.map((function(e){return e.hits})).flat()})})).then((function(e){return{recommendations:r(e)}}))}(e).then((function(e){r(e),c("idle")}))}),[e,c]),Le(Le({},n),{},{status:i})}function We(e){var t=Ve(e),r=t.recommendations,o=t.status;return D(Ue,n({},e,{items:r,status:o}))}var Be=["container","environment","itemComponent","fallbackComponent","headerComponent","view","children"];function $e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function Ge(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?$e(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):$e(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var ze=function(e){var t=e.createElement,o=e.Fragment;return function(e){var i,a,c,l,u,s=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({title:"Trending items",sliderLabel:"Trending items"},e.translations),m=null!==(i=e.classNames)&&void 0!==i?i:{},d=null!==(a=e.children)&&void 0!==a?a:_({createElement:t,Fragment:o}),h=null!==(c=e.fallbackComponent)&&void 0!==c?c:function(){return null},v=null!==(l=e.headerComponent)&&void 0!==l?l:f({createElement:t,Fragment:o}),y=null!==(u=e.view)&&void 0!==u?u:p({createElement:t,Fragment:o});return d({classNames:m,Fallback:function(){return t(h,{Fragment:o,createElement:t})},Header:v,recommendations:e.items,status:e.status,translations:s,View:function(r){return t(y,n({classNames:m,itemComponent:e.itemComponent,items:e.items,translations:s,Fragment:o,createElement:t},r))}})}}({createElement:D,Fragment:F});function Je(e){var t=a(se({recommendations:[]}),2),n=t[0],r=t[1],o=Oe("loading"),i=o.status,c=o.setStatus;return ge({recommendClient:e.recommendClient}),me((function(){c("loading"),function(e){var t=e.recommendClient,n=e.transformItems,r=void 0===n?function(e){return e}:n,o=e.fallbackParameters,i=e.indexName,a=e.maxRecommendations,c=e.queryParameters,m=e.threshold,_=e.facetName,f=e.facetValue,p={fallbackParameters:o,indexName:i,maxRecommendations:a,queryParameters:c,threshold:m,facetName:_,facetValue:f};return t.addAlgoliaAgent("recommend-core",s),t.getTrendingItems([p]).then((function(e){return u({maxRecommendations:a,hits:(t="objectID",n=e.results.map((function(e){return e.hits})).flat(),l(new Map(n.map((function(e){return[e[t],e]}))).values()))});var t,n})).then((function(e){return{recommendations:r(e)}}))}(e).then((function(e){r(e),c("idle")}))}),[e,c]),Ge(Ge({},n),{},{status:i})}function Ke(e){var t=Je(e),r=t.recommendations,o=t.status;return D(ze,n({},e,{items:r,status:o}))}e.frequentlyBoughtTogether=function(e){var r=e.container,o=e.environment,i=void 0===o?window:o,a=e.itemComponent,c=e.fallbackComponent,l=e.headerComponent,u=e.view,s=e.children,m=D(Ne,n({},t(e,we),{view:u&&je(u),itemComponent:a&&je(a),headerComponent:l&&je(l),fallbackComponent:c&&je(c)}),s?function(e){return s(ke(ke({},e),{},{html:te}))}:void 0);return r?(K(m,ye(r,i)),null):m},e.relatedProducts=function(e){var r=e.container,o=e.environment,i=void 0===o?window:o,a=e.itemComponent,c=e.fallbackComponent,l=e.headerComponent,u=e.view,s=e.children,m=D(He,n({},t(e,xe),{view:u&&je(u),itemComponent:a&&je(a),headerComponent:l&&je(l),fallbackComponent:c&&je(c)}),s?function(e){return s(Ie(Ie({},e),{},{html:te}))}:void 0);return r?(K(m,ye(r,i)),null):m},e.trendingFacets=function(e){var r=e.container,o=e.environment,i=void 0===o?window:o,a=e.itemComponent,c=e.fallbackComponent,l=e.headerComponent,u=e.view,s=e.children,m=D(We,n({},t(e,qe),{view:u&&je(u),itemComponent:a&&je(a),headerComponent:l&&je(l),fallbackComponent:c&&je(c)}),s?function(e){return s(Le(Le({},e),{},{html:te}))}:void 0);return r?(K(m,ye(r,i)),null):m},e.trendingItems=function(e){var r=e.container,o=e.environment,i=void 0===o?window:o,a=e.itemComponent,c=e.fallbackComponent,l=e.headerComponent,u=e.view,s=e.children,m=D(Ke,n({},t(e,Be),{view:u&&je(u),itemComponent:a&&je(a),headerComponent:l&&je(l),fallbackComponent:c&&je(c)}),s?function(e){return s(Ge(Ge({},e),{},{html:te}))}:void 0);return r?(K(m,ye(r,i)),null):m},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=index.js.map
