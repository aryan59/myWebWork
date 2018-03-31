
/* preloader.js */

/* 1    */ /*!
/* 2    *|  * Modernizr v2.8.2
/* 3    *|  * www.modernizr.com
/* 4    *|  *
/* 5    *|  * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
/* 6    *|  * Available under the BSD and MIT licenses: www.modernizr.com/license/
/* 7    *|  */
/* 8    */ 
/* 9    */ /*
/* 10   *|  * Modernizr tests which native CSS3 and HTML5 features are available in
/* 11   *|  * the current UA and makes the results available to you in two ways:
/* 12   *|  * as properties on a global Modernizr object, and as classes on the
/* 13   *|  * <html> element. This information allows you to progressively enhance
/* 14   *|  * your pages with a granular level of control over the experience.
/* 15   *|  *
/* 16   *|  * Modernizr has an optional (not included) conditional resource loader
/* 17   *|  * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
/* 18   *|  * To get a build that includes Modernizr.load(), as well as choosing
/* 19   *|  * which tests to include, go to www.modernizr.com/download/
/* 20   *|  *
/* 21   *|  * Authors        Faruk Ates, Paul Irish, Alex Sexton
/* 22   *|  * Contributors   Ryan Seddon, Ben Alman
/* 23   *|  */
/* 24   */ 
/* 25   */ window.Modernizr = (function( window, document, undefined ) {
/* 26   */ 
/* 27   */     var version = '2.8.2',
/* 28   */ 
/* 29   */     Modernizr = {},
/* 30   */ 
/* 31   */     /*>>cssclasses*/
/* 32   */     // option for enabling the HTML classes to be added
/* 33   */     enableClasses = true,
/* 34   */     /*>>cssclasses*/
/* 35   */ 
/* 36   */     docElement = document.documentElement,
/* 37   */ 
/* 38   */     /**
/* 39   *|      * Create our "modernizr" element that we do most feature tests on.
/* 40   *|      */
/* 41   */     mod = 'modernizr',
/* 42   */     modElem = document.createElement(mod),
/* 43   */     mStyle = modElem.style,
/* 44   */ 
/* 45   */     /**
/* 46   *|      * Create the input element for various Web Forms feature tests.
/* 47   *|      */
/* 48   */     inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,
/* 49   */ 
/* 50   */     /*>>smile*/

/* preloader.js */

/* 51   */     smile = ':)',
/* 52   */     /*>>smile*/
/* 53   */ 
/* 54   */     toString = {}.toString,
/* 55   */ 
/* 56   */     // TODO :: make the prefixes more granular
/* 57   */     /*>>prefixes*/
/* 58   */     // List of property values to set for css tests. See ticket #21
/* 59   */     prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
/* 60   */     /*>>prefixes*/
/* 61   */ 
/* 62   */     /*>>domprefixes*/
/* 63   */     // Following spec is to expose vendor-specific style properties as:
/* 64   */     //   elem.style.WebkitBorderRadius
/* 65   */     // and the following would be incorrect:
/* 66   */     //   elem.style.webkitBorderRadius
/* 67   */ 
/* 68   */     // Webkit ghosts their properties in lowercase but Opera & Moz do not.
/* 69   */     // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
/* 70   */     //   erik.eae.net/archives/2008/03/10/21.48.10/
/* 71   */ 
/* 72   */     // More here: github.com/Modernizr/Modernizr/issues/issue/21
/* 73   */     omPrefixes = 'Webkit Moz O ms',
/* 74   */ 
/* 75   */     cssomPrefixes = omPrefixes.split(' '),
/* 76   */ 
/* 77   */     domPrefixes = omPrefixes.toLowerCase().split(' '),
/* 78   */     /*>>domprefixes*/
/* 79   */ 
/* 80   */     /*>>ns*/
/* 81   */     ns = {'svg': 'http://www.w3.org/2000/svg'},
/* 82   */     /*>>ns*/
/* 83   */ 
/* 84   */     tests = {},
/* 85   */     inputs = {},
/* 86   */     attrs = {},
/* 87   */ 
/* 88   */     classes = [],
/* 89   */ 
/* 90   */     slice = classes.slice,
/* 91   */ 
/* 92   */     featureName, // used in testing loop
/* 93   */ 
/* 94   */ 
/* 95   */     /*>>teststyles*/
/* 96   */     // Inject element with style element and some CSS rules
/* 97   */     injectElementWithStyles = function( rule, callback, nodes, testnames ) {
/* 98   */ 
/* 99   */       var style, ret, node, docOverflow,
/* 100  */           div = document.createElement('div'),

/* preloader.js */

/* 101  */           // After page load injecting a fake body doesn't work so check if body exists
/* 102  */           body = document.body,
/* 103  */           // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
/* 104  */           fakeBody = body || document.createElement('body');
/* 105  */ 
/* 106  */       if ( parseInt(nodes, 10) ) {
/* 107  */           // In order not to give false positives we create a node for each test
/* 108  */           // This also allows the method to scale for unspecified uses
/* 109  */           while ( nodes-- ) {
/* 110  */               node = document.createElement('div');
/* 111  */               node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
/* 112  */               div.appendChild(node);
/* 113  */           }
/* 114  */       }
/* 115  */ 
/* 116  */       // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
/* 117  */       // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
/* 118  */       // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
/* 119  */       // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
/* 120  */       // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
/* 121  */       style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
/* 122  */       div.id = mod;
/* 123  */       // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
/* 124  */       // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
/* 125  */       (body ? div : fakeBody).innerHTML += style;
/* 126  */       fakeBody.appendChild(div);
/* 127  */       if ( !body ) {
/* 128  */           //avoid crashing IE8, if background image is used
/* 129  */           fakeBody.style.background = '';
/* 130  */           //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
/* 131  */           fakeBody.style.overflow = 'hidden';
/* 132  */           docOverflow = docElement.style.overflow;
/* 133  */           docElement.style.overflow = 'hidden';
/* 134  */           docElement.appendChild(fakeBody);
/* 135  */       }
/* 136  */ 
/* 137  */       ret = callback(div, rule);
/* 138  */       // If this is done after page load we don't want to remove the body so check if body exists
/* 139  */       if ( !body ) {
/* 140  */           fakeBody.parentNode.removeChild(fakeBody);
/* 141  */           docElement.style.overflow = docOverflow;
/* 142  */       } else {
/* 143  */           div.parentNode.removeChild(div);
/* 144  */       }
/* 145  */ 
/* 146  */       return !!ret;
/* 147  */ 
/* 148  */     },
/* 149  */     /*>>teststyles*/
/* 150  */ 

/* preloader.js */

/* 151  */     /*>>mq*/
/* 152  */     // adapted from matchMedia polyfill
/* 153  */     // by Scott Jehl and Paul Irish
/* 154  */     // gist.github.com/786768
/* 155  */     testMediaQuery = function( mq ) {
/* 156  */ 
/* 157  */       var matchMedia = window.matchMedia || window.msMatchMedia;
/* 158  */       if ( matchMedia ) {
/* 159  */         return matchMedia(mq) && matchMedia(mq).matches || false;
/* 160  */       }
/* 161  */ 
/* 162  */       var bool;
/* 163  */ 
/* 164  */       injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
/* 165  */         bool = (window.getComputedStyle ?
/* 166  */                   getComputedStyle(node, null) :
/* 167  */                   node.currentStyle)['position'] == 'absolute';
/* 168  */       });
/* 169  */ 
/* 170  */       return bool;
/* 171  */ 
/* 172  */      },
/* 173  */      /*>>mq*/
/* 174  */ 
/* 175  */ 
/* 176  */     /*>>hasevent*/
/* 177  */     //
/* 178  */     // isEventSupported determines if a given element supports the given event
/* 179  */     // kangax.github.com/iseventsupported/
/* 180  */     //
/* 181  */     // The following results are known incorrects:
/* 182  */     //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
/* 183  */     //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
/* 184  */     //   ...
/* 185  */     isEventSupported = (function() {
/* 186  */ 
/* 187  */       var TAGNAMES = {
/* 188  */         'select': 'input', 'change': 'input',
/* 189  */         'submit': 'form', 'reset': 'form',
/* 190  */         'error': 'img', 'load': 'img', 'abort': 'img'
/* 191  */       };
/* 192  */ 
/* 193  */       function isEventSupported( eventName, element ) {
/* 194  */ 
/* 195  */         element = element || document.createElement(TAGNAMES[eventName] || 'div');
/* 196  */         eventName = 'on' + eventName;
/* 197  */ 
/* 198  */         // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
/* 199  */         var isSupported = eventName in element;
/* 200  */ 

/* preloader.js */

/* 201  */         if ( !isSupported ) {
/* 202  */           // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
/* 203  */           if ( !element.setAttribute ) {
/* 204  */             element = document.createElement('div');
/* 205  */           }
/* 206  */           if ( element.setAttribute && element.removeAttribute ) {
/* 207  */             element.setAttribute(eventName, '');
/* 208  */             isSupported = is(element[eventName], 'function');
/* 209  */ 
/* 210  */             // If property was created, "remove it" (by setting value to `undefined`)
/* 211  */             if ( !is(element[eventName], 'undefined') ) {
/* 212  */               element[eventName] = undefined;
/* 213  */             }
/* 214  */             element.removeAttribute(eventName);
/* 215  */           }
/* 216  */         }
/* 217  */ 
/* 218  */         element = null;
/* 219  */         return isSupported;
/* 220  */       }
/* 221  */       return isEventSupported;
/* 222  */     })(),
/* 223  */     /*>>hasevent*/
/* 224  */ 
/* 225  */     // TODO :: Add flag for hasownprop ? didn't last time
/* 226  */ 
/* 227  */     // hasOwnProperty shim by kangax needed for Safari 2.0 support
/* 228  */     _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;
/* 229  */ 
/* 230  */     if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
/* 231  */       hasOwnProp = function (object, property) {
/* 232  */         return _hasOwnProperty.call(object, property);
/* 233  */       };
/* 234  */     }
/* 235  */     else {
/* 236  */       hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
/* 237  */         return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
/* 238  */       };
/* 239  */     }
/* 240  */ 
/* 241  */     // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
/* 242  */     // es5.github.com/#x15.3.4.5
/* 243  */ 
/* 244  */     if (!Function.prototype.bind) {
/* 245  */       Function.prototype.bind = function bind(that) {
/* 246  */ 
/* 247  */         var target = this;
/* 248  */ 
/* 249  */         if (typeof target != "function") {
/* 250  */             throw new TypeError();

/* preloader.js */

/* 251  */         }
/* 252  */ 
/* 253  */         var args = slice.call(arguments, 1),
/* 254  */             bound = function () {
/* 255  */ 
/* 256  */             if (this instanceof bound) {
/* 257  */ 
/* 258  */               var F = function(){};
/* 259  */               F.prototype = target.prototype;
/* 260  */               var self = new F();
/* 261  */ 
/* 262  */               var result = target.apply(
/* 263  */                   self,
/* 264  */                   args.concat(slice.call(arguments))
/* 265  */               );
/* 266  */               if (Object(result) === result) {
/* 267  */                   return result;
/* 268  */               }
/* 269  */               return self;
/* 270  */ 
/* 271  */             } else {
/* 272  */ 
/* 273  */               return target.apply(
/* 274  */                   that,
/* 275  */                   args.concat(slice.call(arguments))
/* 276  */               );
/* 277  */ 
/* 278  */             }
/* 279  */ 
/* 280  */         };
/* 281  */ 
/* 282  */         return bound;
/* 283  */       };
/* 284  */     }
/* 285  */ 
/* 286  */     /**
/* 287  *|      * setCss applies given styles to the Modernizr DOM node.
/* 288  *|      */
/* 289  */     function setCss( str ) {
/* 290  */         mStyle.cssText = str;
/* 291  */     }
/* 292  */ 
/* 293  */     /**
/* 294  *|      * setCssAll extrapolates all vendor-specific css strings.
/* 295  *|      */
/* 296  */     function setCssAll( str1, str2 ) {
/* 297  */         return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
/* 298  */     }
/* 299  */ 
/* 300  */     /**

/* preloader.js */

/* 301  *|      * is returns a boolean for if typeof obj is exactly type.
/* 302  *|      */
/* 303  */     function is( obj, type ) {
/* 304  */         return typeof obj === type;
/* 305  */     }
/* 306  */ 
/* 307  */     /**
/* 308  *|      * contains returns a boolean for if substr is found within str.
/* 309  *|      */
/* 310  */     function contains( str, substr ) {
/* 311  */         return !!~('' + str).indexOf(substr);
/* 312  */     }
/* 313  */ 
/* 314  */     /*>>testprop*/
/* 315  */ 
/* 316  */     // testProps is a generic CSS / DOM property test.
/* 317  */ 
/* 318  */     // In testing support for a given CSS property, it's legit to test:
/* 319  */     //    `elem.style[styleName] !== undefined`
/* 320  */     // If the property is supported it will return an empty string,
/* 321  */     // if unsupported it will return undefined.
/* 322  */ 
/* 323  */     // We'll take advantage of this quick test and skip setting a style
/* 324  */     // on our modernizr element, but instead just testing undefined vs
/* 325  */     // empty string.
/* 326  */ 
/* 327  */     // Because the testing of the CSS property names (with "-", as
/* 328  */     // opposed to the camelCase DOM properties) is non-portable and
/* 329  */     // non-standard but works in WebKit and IE (but not Gecko or Opera),
/* 330  */     // we explicitly reject properties with dashes so that authors
/* 331  */     // developing in WebKit or IE first don't end up with
/* 332  */     // browser-specific content by accident.
/* 333  */ 
/* 334  */     function testProps( props, prefixed ) {
/* 335  */         for ( var i in props ) {
/* 336  */             var prop = props[i];
/* 337  */             if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
/* 338  */                 return prefixed == 'pfx' ? prop : true;
/* 339  */             }
/* 340  */         }
/* 341  */         return false;
/* 342  */     }
/* 343  */     /*>>testprop*/
/* 344  */ 
/* 345  */     // TODO :: add testDOMProps
/* 346  */     /**
/* 347  *|      * testDOMProps is a generic DOM property test; if a browser supports
/* 348  *|      *   a certain property, it won't return undefined for it.
/* 349  *|      */
/* 350  */     function testDOMProps( props, obj, elem ) {

/* preloader.js */

/* 351  */         for ( var i in props ) {
/* 352  */             var item = obj[props[i]];
/* 353  */             if ( item !== undefined) {
/* 354  */ 
/* 355  */                 // return the property name as a string
/* 356  */                 if (elem === false) return props[i];
/* 357  */ 
/* 358  */                 // let's bind a function
/* 359  */                 if (is(item, 'function')){
/* 360  */                   // default to autobind unless override
/* 361  */                   return item.bind(elem || obj);
/* 362  */                 }
/* 363  */ 
/* 364  */                 // return the unbound function or obj or value
/* 365  */                 return item;
/* 366  */             }
/* 367  */         }
/* 368  */         return false;
/* 369  */     }
/* 370  */ 
/* 371  */     /*>>testallprops*/
/* 372  */     /**
/* 373  *|      * testPropsAll tests a list of DOM properties we want to check against.
/* 374  *|      *   We specify literally ALL possible (known and/or likely) properties on
/* 375  *|      *   the element including the non-vendor prefixed one, for forward-
/* 376  *|      *   compatibility.
/* 377  *|      */
/* 378  */     function testPropsAll( prop, prefixed, elem ) {
/* 379  */ 
/* 380  */         var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
/* 381  */             props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
/* 382  */ 
/* 383  */         // did they call .prefixed('boxSizing') or are we just testing a prop?
/* 384  */         if(is(prefixed, "string") || is(prefixed, "undefined")) {
/* 385  */           return testProps(props, prefixed);
/* 386  */ 
/* 387  */         // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
/* 388  */         } else {
/* 389  */           props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
/* 390  */           return testDOMProps(props, prefixed, elem);
/* 391  */         }
/* 392  */     }
/* 393  */     /*>>testallprops*/
/* 394  */ 
/* 395  */ 
/* 396  */     /**
/* 397  *|      * Tests
/* 398  *|      * -----
/* 399  *|      */
/* 400  */ 

/* preloader.js */

/* 401  */     // The *new* flexbox
/* 402  */     // dev.w3.org/csswg/css3-flexbox
/* 403  */ 
/* 404  */     tests['flexbox'] = function() {
/* 405  */       return testPropsAll('flexWrap');
/* 406  */     };
/* 407  */ 
/* 408  */     // The *old* flexbox
/* 409  */     // www.w3.org/TR/2009/WD-css3-flexbox-20090723/
/* 410  */ 
/* 411  */     tests['flexboxlegacy'] = function() {
/* 412  */         return testPropsAll('boxDirection');
/* 413  */     };
/* 414  */ 
/* 415  */     // On the S60 and BB Storm, getContext exists, but always returns undefined
/* 416  */     // so we actually have to call getContext() to verify
/* 417  */     // github.com/Modernizr/Modernizr/issues/issue/97/
/* 418  */ 
/* 419  */     tests['canvas'] = function() {
/* 420  */         var elem = document.createElement('canvas');
/* 421  */         return !!(elem.getContext && elem.getContext('2d'));
/* 422  */     };
/* 423  */ 
/* 424  */     tests['canvastext'] = function() {
/* 425  */         return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
/* 426  */     };
/* 427  */ 
/* 428  */     // webk.it/70117 is tracking a legit WebGL feature detect proposal
/* 429  */ 
/* 430  */     // We do a soft detect which may false positive in order to avoid
/* 431  */     // an expensive context creation: bugzil.la/732441
/* 432  */ 
/* 433  */     tests['webgl'] = function() {
/* 434  */         return !!window.WebGLRenderingContext;
/* 435  */     };
/* 436  */ 
/* 437  */     /*
/* 438  *|      * The Modernizr.touch test only indicates if the browser supports
/* 439  *|      *    touch events, which does not necessarily reflect a touchscreen
/* 440  *|      *    device, as evidenced by tablets running Windows 7 or, alas,
/* 441  *|      *    the Palm Pre / WebOS (touch) phones.
/* 442  *|      *
/* 443  *|      * Additionally, Chrome (desktop) used to lie about its support on this,
/* 444  *|      *    but that has since been rectified: crbug.com/36415
/* 445  *|      *
/* 446  *|      * We also test for Firefox 4 Multitouch Support.
/* 447  *|      *
/* 448  *|      * For more info, see: modernizr.github.com/Modernizr/touch.html
/* 449  *|      */
/* 450  */ 

/* preloader.js */

/* 451  */     tests['touch'] = function() {
/* 452  */         var bool;
/* 453  */ 
/* 454  */         if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
/* 455  */           bool = true;
/* 456  */         } else {
/* 457  */           injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
/* 458  */             bool = node.offsetTop === 9;
/* 459  */           });
/* 460  */         }
/* 461  */ 
/* 462  */         return bool;
/* 463  */     };
/* 464  */ 
/* 465  */ 
/* 466  */     // geolocation is often considered a trivial feature detect...
/* 467  */     // Turns out, it's quite tricky to get right:
/* 468  */     //
/* 469  */     // Using !!navigator.geolocation does two things we don't want. It:
/* 470  */     //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
/* 471  */     //   2. Disables page caching in WebKit: webk.it/43956
/* 472  */     //
/* 473  */     // Meanwhile, in Firefox < 8, an about:config setting could expose
/* 474  */     // a false positive that would throw an exception: bugzil.la/688158
/* 475  */ 
/* 476  */     tests['geolocation'] = function() {
/* 477  */         return 'geolocation' in navigator;
/* 478  */     };
/* 479  */ 
/* 480  */ 
/* 481  */     tests['postmessage'] = function() {
/* 482  */       return !!window.postMessage;
/* 483  */     };
/* 484  */ 
/* 485  */ 
/* 486  */     // Chrome incognito mode used to throw an exception when using openDatabase
/* 487  */     // It doesn't anymore.
/* 488  */     tests['websqldatabase'] = function() {
/* 489  */       return !!window.openDatabase;
/* 490  */     };
/* 491  */ 
/* 492  */     // Vendors had inconsistent prefixing with the experimental Indexed DB:
/* 493  */     // - Webkit's implementation is accessible through webkitIndexedDB
/* 494  */     // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
/* 495  */     // For speed, we don't test the legacy (and beta-only) indexedDB
/* 496  */     tests['indexedDB'] = function() {
/* 497  */       return !!testPropsAll("indexedDB", window);
/* 498  */     };
/* 499  */ 
/* 500  */     // documentMode logic from YUI to filter out IE8 Compat Mode

/* preloader.js */

/* 501  */     //   which false positives.
/* 502  */     tests['hashchange'] = function() {
/* 503  */       return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
/* 504  */     };
/* 505  */ 
/* 506  */     // Per 1.6:
/* 507  */     // This used to be Modernizr.historymanagement but the longer
/* 508  */     // name has been deprecated in favor of a shorter and property-matching one.
/* 509  */     // The old API is still available in 1.6, but as of 2.0 will throw a warning,
/* 510  */     // and in the first release thereafter disappear entirely.
/* 511  */     tests['history'] = function() {
/* 512  */       return !!(window.history && history.pushState);
/* 513  */     };
/* 514  */ 
/* 515  */     tests['draganddrop'] = function() {
/* 516  */         var div = document.createElement('div');
/* 517  */         return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
/* 518  */     };
/* 519  */ 
/* 520  */     // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
/* 521  */     // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
/* 522  */     // FF10 still uses prefixes, so check for it until then.
/* 523  */     // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
/* 524  */     tests['websockets'] = function() {
/* 525  */         return 'WebSocket' in window || 'MozWebSocket' in window;
/* 526  */     };
/* 527  */ 
/* 528  */ 
/* 529  */     // css-tricks.com/rgba-browser-support/
/* 530  */     tests['rgba'] = function() {
/* 531  */         // Set an rgba() color and check the returned value
/* 532  */ 
/* 533  */         setCss('background-color:rgba(150,255,150,.5)');
/* 534  */ 
/* 535  */         return contains(mStyle.backgroundColor, 'rgba');
/* 536  */     };
/* 537  */ 
/* 538  */     tests['hsla'] = function() {
/* 539  */         // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
/* 540  */         //   except IE9 who retains it as hsla
/* 541  */ 
/* 542  */         setCss('background-color:hsla(120,40%,100%,.5)');
/* 543  */ 
/* 544  */         return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
/* 545  */     };
/* 546  */ 
/* 547  */     tests['multiplebgs'] = function() {
/* 548  */         // Setting multiple images AND a color on the background shorthand property
/* 549  */         //  and then querying the style.background property value for the number of
/* 550  */         //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

/* preloader.js */

/* 551  */ 
/* 552  */         setCss('background:url(https://),url(https://),red url(https://)');
/* 553  */ 
/* 554  */         // If the UA supports multiple backgrounds, there should be three occurrences
/* 555  */         //   of the string "url(" in the return value for elemStyle.background
/* 556  */ 
/* 557  */         return (/(url\s*\(.*?){3}/).test(mStyle.background);
/* 558  */     };
/* 559  */ 
/* 560  */ 
/* 561  */ 
/* 562  */     // this will false positive in Opera Mini
/* 563  */     //   github.com/Modernizr/Modernizr/issues/396
/* 564  */ 
/* 565  */     tests['backgroundsize'] = function() {
/* 566  */         return testPropsAll('backgroundSize');
/* 567  */     };
/* 568  */ 
/* 569  */     tests['borderimage'] = function() {
/* 570  */         return testPropsAll('borderImage');
/* 571  */     };
/* 572  */ 
/* 573  */ 
/* 574  */     // Super comprehensive table about all the unique implementations of
/* 575  */     // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance
/* 576  */ 
/* 577  */     tests['borderradius'] = function() {
/* 578  */         return testPropsAll('borderRadius');
/* 579  */     };
/* 580  */ 
/* 581  */     // WebOS unfortunately false positives on this test.
/* 582  */     tests['boxshadow'] = function() {
/* 583  */         return testPropsAll('boxShadow');
/* 584  */     };
/* 585  */ 
/* 586  */     // FF3.0 will false positive on this test
/* 587  */     tests['textshadow'] = function() {
/* 588  */         return document.createElement('div').style.textShadow === '';
/* 589  */     };
/* 590  */ 
/* 591  */ 
/* 592  */     tests['opacity'] = function() {
/* 593  */         // Browsers that actually have CSS Opacity implemented have done so
/* 594  */         //  according to spec, which means their return values are within the
/* 595  */         //  range of [0.0,1.0] - including the leading zero.
/* 596  */ 
/* 597  */         setCssAll('opacity:.55');
/* 598  */ 
/* 599  */         // The non-literal . in this regex is intentional:
/* 600  */         //   German Chrome returns this value as 0,55

/* preloader.js */

/* 601  */         // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
/* 602  */         return (/^0.55$/).test(mStyle.opacity);
/* 603  */     };
/* 604  */ 
/* 605  */ 
/* 606  */     // Note, Android < 4 will pass this test, but can only animate
/* 607  */     //   a single property at a time
/* 608  */     //   goo.gl/v3V4Gp
/* 609  */     tests['cssanimations'] = function() {
/* 610  */         return testPropsAll('animationName');
/* 611  */     };
/* 612  */ 
/* 613  */ 
/* 614  */     tests['csscolumns'] = function() {
/* 615  */         return testPropsAll('columnCount');
/* 616  */     };
/* 617  */ 
/* 618  */ 
/* 619  */     tests['cssgradients'] = function() {
/* 620  */         /**
/* 621  *|          * For CSS Gradients syntax, please see:
/* 622  *|          * webkit.org/blog/175/introducing-css-gradients/
/* 623  *|          * developer.mozilla.org/en/CSS/-moz-linear-gradient
/* 624  *|          * developer.mozilla.org/en/CSS/-moz-radial-gradient
/* 625  *|          * dev.w3.org/csswg/css3-images/#gradients-
/* 626  *|          */
/* 627  */ 
/* 628  */         var str1 = 'background-image:',
/* 629  */             str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
/* 630  */             str3 = 'linear-gradient(left top,#9f9, white);';
/* 631  */ 
/* 632  */         setCss(
/* 633  */              // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
/* 634  */               (str1 + '-webkit- '.split(' ').join(str2 + str1) +
/* 635  */              // standard syntax             // trailing 'background-image:'
/* 636  */               prefixes.join(str3 + str1)).slice(0, -str1.length)
/* 637  */         );
/* 638  */ 
/* 639  */         return contains(mStyle.backgroundImage, 'gradient');
/* 640  */     };
/* 641  */ 
/* 642  */ 
/* 643  */     tests['cssreflections'] = function() {
/* 644  */         return testPropsAll('boxReflect');
/* 645  */     };
/* 646  */ 
/* 647  */ 
/* 648  */     tests['csstransforms'] = function() {
/* 649  */         return !!testPropsAll('transform');
/* 650  */     };

/* preloader.js */

/* 651  */ 
/* 652  */ 
/* 653  */     tests['csstransforms3d'] = function() {
/* 654  */ 
/* 655  */         var ret = !!testPropsAll('perspective');
/* 656  */ 
/* 657  */         // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
/* 658  */         //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
/* 659  */         //   some conditions. As a result, Webkit typically recognizes the syntax but
/* 660  */         //   will sometimes throw a false positive, thus we must do a more thorough check:
/* 661  */         if ( ret && 'webkitPerspective' in docElement.style ) {
/* 662  */ 
/* 663  */           // Webkit allows this media query to succeed only if the feature is enabled.
/* 664  */           // `@media (transform-3d),(-webkit-transform-3d){ ... }`
/* 665  */           injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
/* 666  */             ret = node.offsetLeft === 9 && node.offsetHeight === 3;
/* 667  */           });
/* 668  */         }
/* 669  */         return ret;
/* 670  */     };
/* 671  */ 
/* 672  */ 
/* 673  */     tests['csstransitions'] = function() {
/* 674  */         return testPropsAll('transition');
/* 675  */     };
/* 676  */ 
/* 677  */ 
/* 678  */     /*>>fontface*/
/* 679  */     // @font-face detection routine by Diego Perini
/* 680  */     // javascript.nwbox.com/CSSSupport/
/* 681  */ 
/* 682  */     // false positives:
/* 683  */     //   WebOS github.com/Modernizr/Modernizr/issues/342
/* 684  */     //   WP7   github.com/Modernizr/Modernizr/issues/538
/* 685  */     tests['fontface'] = function() {
/* 686  */         var bool;
/* 687  */ 
/* 688  */         injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
/* 689  */           var style = document.getElementById('smodernizr'),
/* 690  */               sheet = style.sheet || style.styleSheet,
/* 691  */               cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
/* 692  */ 
/* 693  */           bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
/* 694  */         });
/* 695  */ 
/* 696  */         return bool;
/* 697  */     };
/* 698  */     /*>>fontface*/
/* 699  */ 
/* 700  */     // CSS generated content detection

/* preloader.js */

/* 701  */     tests['generatedcontent'] = function() {
/* 702  */         var bool;
/* 703  */ 
/* 704  */         injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
/* 705  */           bool = node.offsetHeight >= 3;
/* 706  */         });
/* 707  */ 
/* 708  */         return bool;
/* 709  */     };
/* 710  */ 
/* 711  */ 
/* 712  */ 
/* 713  */     // These tests evaluate support of the video/audio elements, as well as
/* 714  */     // testing what types of content they support.
/* 715  */     //
/* 716  */     // We're using the Boolean constructor here, so that we can extend the value
/* 717  */     // e.g.  Modernizr.video     // true
/* 718  */     //       Modernizr.video.ogg // 'probably'
/* 719  */     //
/* 720  */     // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
/* 721  */     //                     thx to NielsLeenheer and zcorpan
/* 722  */ 
/* 723  */     // Note: in some older browsers, "no" was a return value instead of empty string.
/* 724  */     //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
/* 725  */     //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5
/* 726  */ 
/* 727  */     tests['video'] = function() {
/* 728  */         var elem = document.createElement('video'),
/* 729  */             bool = false;
/* 730  */ 
/* 731  */         // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
/* 732  */         try {
/* 733  */             if ( bool = !!elem.canPlayType ) {
/* 734  */                 bool      = new Boolean(bool);
/* 735  */                 bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');
/* 736  */ 
/* 737  */                 // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
/* 738  */                 bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');
/* 739  */ 
/* 740  */                 bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
/* 741  */             }
/* 742  */ 
/* 743  */         } catch(e) { }
/* 744  */ 
/* 745  */         return bool;
/* 746  */     };
/* 747  */ 
/* 748  */     tests['audio'] = function() {
/* 749  */         var elem = document.createElement('audio'),
/* 750  */             bool = false;

/* preloader.js */

/* 751  */ 
/* 752  */         try {
/* 753  */             if ( bool = !!elem.canPlayType ) {
/* 754  */                 bool      = new Boolean(bool);
/* 755  */                 bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
/* 756  */                 bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');
/* 757  */ 
/* 758  */                 // Mimetypes accepted:
/* 759  */                 //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
/* 760  */                 //   bit.ly/iphoneoscodecs
/* 761  */                 bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
/* 762  */                 bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
/* 763  */                               elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
/* 764  */             }
/* 765  */         } catch(e) { }
/* 766  */ 
/* 767  */         return bool;
/* 768  */     };
/* 769  */ 
/* 770  */ 
/* 771  */     // In FF4, if disabled, window.localStorage should === null.
/* 772  */ 
/* 773  */     // Normally, we could not test that directly and need to do a
/* 774  */     //   `('localStorage' in window) && ` test first because otherwise Firefox will
/* 775  */     //   throw bugzil.la/365772 if cookies are disabled
/* 776  */ 
/* 777  */     // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
/* 778  */     // will throw the exception:
/* 779  */     //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
/* 780  */     // Peculiarly, getItem and removeItem calls do not throw.
/* 781  */ 
/* 782  */     // Because we are forced to try/catch this, we'll go aggressive.
/* 783  */ 
/* 784  */     // Just FWIW: IE8 Compat mode supports these features completely:
/* 785  */     //   www.quirksmode.org/dom/html5.html
/* 786  */     // But IE8 doesn't support either with local files
/* 787  */ 
/* 788  */     tests['localstorage'] = function() {
/* 789  */         try {
/* 790  */             localStorage.setItem(mod, mod);
/* 791  */             localStorage.removeItem(mod);
/* 792  */             return true;
/* 793  */         } catch(e) {
/* 794  */             return false;
/* 795  */         }
/* 796  */     };
/* 797  */ 
/* 798  */     tests['sessionstorage'] = function() {
/* 799  */         try {
/* 800  */             sessionStorage.setItem(mod, mod);

/* preloader.js */

/* 801  */             sessionStorage.removeItem(mod);
/* 802  */             return true;
/* 803  */         } catch(e) {
/* 804  */             return false;
/* 805  */         }
/* 806  */     };
/* 807  */ 
/* 808  */ 
/* 809  */     tests['webworkers'] = function() {
/* 810  */         return !!window.Worker;
/* 811  */     };
/* 812  */ 
/* 813  */ 
/* 814  */     tests['applicationcache'] = function() {
/* 815  */         return !!window.applicationCache;
/* 816  */     };
/* 817  */ 
/* 818  */ 
/* 819  */     // Thanks to Erik Dahlstrom
/* 820  */     tests['svg'] = function() {
/* 821  */         return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
/* 822  */     };
/* 823  */ 
/* 824  */     // specifically for SVG inline in HTML, not within XHTML
/* 825  */     // test page: paulirish.com/demo/inline-svg
/* 826  */     tests['inlinesvg'] = function() {
/* 827  */       var div = document.createElement('div');
/* 828  */       div.innerHTML = '<svg/>';
/* 829  */       return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
/* 830  */     };
/* 831  */ 
/* 832  */     // SVG SMIL animation
/* 833  */     tests['smil'] = function() {
/* 834  */         return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
/* 835  */     };
/* 836  */ 
/* 837  */     // This test is only for clip paths in SVG proper, not clip paths on HTML content
/* 838  */     // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg
/* 839  */ 
/* 840  */     // However read the comments to dig into applying SVG clippaths to HTML content here:
/* 841  */     //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
/* 842  */     tests['svgclippaths'] = function() {
/* 843  */         return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
/* 844  */     };
/* 845  */ 
/* 846  */     /*>>webforms*/
/* 847  */     // input features and input types go directly onto the ret object, bypassing the tests loop.
/* 848  */     // Hold this guy to execute in a moment.
/* 849  */     function webforms() {
/* 850  */         /*>>input*/

/* preloader.js */

/* 851  */         // Run through HTML5's new input attributes to see if the UA understands any.
/* 852  */         // We're using f which is the <input> element created early on
/* 853  */         // Mike Taylr has created a comprehensive resource for testing these attributes
/* 854  */         //   when applied to all input types:
/* 855  */         //   miketaylr.com/code/input-type-attr.html
/* 856  */         // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
/* 857  */ 
/* 858  */         // Only input placeholder is tested while textarea's placeholder is not.
/* 859  */         // Currently Safari 4 and Opera 11 have support only for the input placeholder
/* 860  */         // Both tests are available in feature-detects/forms-placeholder.js
/* 861  */         Modernizr['input'] = (function( props ) {
/* 862  */             for ( var i = 0, len = props.length; i < len; i++ ) {
/* 863  */                 attrs[ props[i] ] = !!(props[i] in inputElem);
/* 864  */             }
/* 865  */             if (attrs.list){
/* 866  */               // safari false positive's on datalist: webk.it/74252
/* 867  */               // see also github.com/Modernizr/Modernizr/issues/146
/* 868  */               attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
/* 869  */             }
/* 870  */             return attrs;
/* 871  */         })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
/* 872  */         /*>>input*/
/* 873  */ 
/* 874  */         /*>>inputtypes*/
/* 875  */         // Run through HTML5's new input types to see if the UA understands any.
/* 876  */         //   This is put behind the tests runloop because it doesn't return a
/* 877  */         //   true/false like all the other tests; instead, it returns an object
/* 878  */         //   containing each input type with its corresponding true/false value
/* 879  */ 
/* 880  */         // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
/* 881  */         Modernizr['inputtypes'] = (function(props) {
/* 882  */ 
/* 883  */             for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {
/* 884  */ 
/* 885  */                 inputElem.setAttribute('type', inputElemType = props[i]);
/* 886  */                 bool = inputElem.type !== 'text';
/* 887  */ 
/* 888  */                 // We first check to see if the type we give it sticks..
/* 889  */                 // If the type does, we feed it a textual value, which shouldn't be valid.
/* 890  */                 // If the value doesn't stick, we know there's input sanitization which infers a custom UI
/* 891  */                 if ( bool ) {
/* 892  */ 
/* 893  */                     inputElem.value         = smile;
/* 894  */                     inputElem.style.cssText = 'position:absolute;visibility:hidden;';
/* 895  */ 
/* 896  */                     if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {
/* 897  */ 
/* 898  */                       docElement.appendChild(inputElem);
/* 899  */                       defaultView = document.defaultView;
/* 900  */ 

/* preloader.js */

/* 901  */                       // Safari 2-4 allows the smiley as a value, despite making a slider
/* 902  */                       bool =  defaultView.getComputedStyle &&
/* 903  */                               defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
/* 904  */                               // Mobile android web browser has false positive, so must
/* 905  */                               // check the height to see if the widget is actually there.
/* 906  */                               (inputElem.offsetHeight !== 0);
/* 907  */ 
/* 908  */                       docElement.removeChild(inputElem);
/* 909  */ 
/* 910  */                     } else if ( /^(search|tel)$/.test(inputElemType) ){
/* 911  */                       // Spec doesn't define any special parsing or detectable UI
/* 912  */                       //   behaviors so we pass these through as true
/* 913  */ 
/* 914  */                       // Interestingly, opera fails the earlier test, so it doesn't
/* 915  */                       //  even make it here.
/* 916  */ 
/* 917  */                     } else if ( /^(url|email)$/.test(inputElemType) ) {
/* 918  */                       // Real url and email support comes with prebaked validation.
/* 919  */                       bool = inputElem.checkValidity && inputElem.checkValidity() === false;
/* 920  */ 
/* 921  */                     } else {
/* 922  */                       // If the upgraded input compontent rejects the :) text, we got a winner
/* 923  */                       bool = inputElem.value != smile;
/* 924  */                     }
/* 925  */                 }
/* 926  */ 
/* 927  */                 inputs[ props[i] ] = !!bool;
/* 928  */             }
/* 929  */             return inputs;
/* 930  */         })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
/* 931  */         /*>>inputtypes*/
/* 932  */     }
/* 933  */     /*>>webforms*/
/* 934  */ 
/* 935  */ 
/* 936  */     // End of test definitions
/* 937  */     // -----------------------
/* 938  */ 
/* 939  */ 
/* 940  */ 
/* 941  */     // Run through all tests and detect their support in the current UA.
/* 942  */     // todo: hypothetically we could be doing an array of tests and use a basic loop here.
/* 943  */     for ( var feature in tests ) {
/* 944  */         if ( hasOwnProp(tests, feature) ) {
/* 945  */             // run the test, throw the return value into the Modernizr,
/* 946  */             //   then based on that boolean, define an appropriate className
/* 947  */             //   and push it into an array of classes we'll join later.
/* 948  */             featureName  = feature.toLowerCase();
/* 949  */             Modernizr[featureName] = tests[feature]();
/* 950  */ 

/* preloader.js */

/* 951  */             classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
/* 952  */         }
/* 953  */     }
/* 954  */ 
/* 955  */     /*>>webforms*/
/* 956  */     // input tests need to run.
/* 957  */     Modernizr.input || webforms();
/* 958  */     /*>>webforms*/
/* 959  */ 
/* 960  */ 
/* 961  */     /**
/* 962  *|      * addTest allows the user to define their own feature tests
/* 963  *|      * the result will be added onto the Modernizr object,
/* 964  *|      * as well as an appropriate className set on the html element
/* 965  *|      *
/* 966  *|      * @param feature - String naming the feature
/* 967  *|      * @param test - Function returning true if feature is supported, false if not
/* 968  *|      */
/* 969  */      Modernizr.addTest = function ( feature, test ) {
/* 970  */        if ( typeof feature == 'object' ) {
/* 971  */          for ( var key in feature ) {
/* 972  */            if ( hasOwnProp( feature, key ) ) {
/* 973  */              Modernizr.addTest( key, feature[ key ] );
/* 974  */            }
/* 975  */          }
/* 976  */        } else {
/* 977  */ 
/* 978  */          feature = feature.toLowerCase();
/* 979  */ 
/* 980  */          if ( Modernizr[feature] !== undefined ) {
/* 981  */            // we're going to quit if you're trying to overwrite an existing test
/* 982  */            // if we were to allow it, we'd do this:
/* 983  */            //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
/* 984  */            //   docElement.className = docElement.className.replace( re, '' );
/* 985  */            // but, no rly, stuff 'em.
/* 986  */            return Modernizr;
/* 987  */          }
/* 988  */ 
/* 989  */          test = typeof test == 'function' ? test() : test;
/* 990  */ 
/* 991  */          if (typeof enableClasses !== "undefined" && enableClasses) {
/* 992  */            docElement.className += ' ' + (test ? '' : 'no-') + feature;
/* 993  */          }
/* 994  */          Modernizr[feature] = test;
/* 995  */ 
/* 996  */        }
/* 997  */ 
/* 998  */        return Modernizr; // allow chaining.
/* 999  */      };
/* 1000 */ 

/* preloader.js */

/* 1001 */ 
/* 1002 */     // Reset modElem.cssText to nothing to reduce memory footprint.
/* 1003 */     setCss('');
/* 1004 */     modElem = inputElem = null;
/* 1005 */ 
/* 1006 */     /*>>shiv*/
/* 1007 */     /**
/* 1008 *|      * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
/* 1009 *|      */
/* 1010 */     ;(function(window, document) {
/* 1011 */         /*jshint evil:true */
/* 1012 */         /** version */
/* 1013 */         var version = '3.7.0';
/* 1014 */ 
/* 1015 */         /** Preset options */
/* 1016 */         var options = window.html5 || {};
/* 1017 */ 
/* 1018 */         /** Used to skip problem elements */
/* 1019 */         var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
/* 1020 */ 
/* 1021 */         /** Not all elements can be cloned in IE **/
/* 1022 */         var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
/* 1023 */ 
/* 1024 */         /** Detect whether the browser supports default html5 styles */
/* 1025 */         var supportsHtml5Styles;
/* 1026 */ 
/* 1027 */         /** Name of the expando, to work with multiple documents or to re-shiv one document */
/* 1028 */         var expando = '_html5shiv';
/* 1029 */ 
/* 1030 */         /** The id for the the documents expando */
/* 1031 */         var expanID = 0;
/* 1032 */ 
/* 1033 */         /** Cached data for each document */
/* 1034 */         var expandoData = {};
/* 1035 */ 
/* 1036 */         /** Detect whether the browser supports unknown elements */
/* 1037 */         var supportsUnknownElements;
/* 1038 */ 
/* 1039 */         (function() {
/* 1040 */           try {
/* 1041 */             var a = document.createElement('a');
/* 1042 */             a.innerHTML = '<xyz></xyz>';
/* 1043 */             //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
/* 1044 */             supportsHtml5Styles = ('hidden' in a);
/* 1045 */ 
/* 1046 */             supportsUnknownElements = a.childNodes.length == 1 || (function() {
/* 1047 */               // assign a false positive if unable to shiv
/* 1048 */               (document.createElement)('a');
/* 1049 */               var frag = document.createDocumentFragment();
/* 1050 */               return (

/* preloader.js */

/* 1051 */                 typeof frag.cloneNode == 'undefined' ||
/* 1052 */                 typeof frag.createDocumentFragment == 'undefined' ||
/* 1053 */                 typeof frag.createElement == 'undefined'
/* 1054 */               );
/* 1055 */             }());
/* 1056 */           } catch(e) {
/* 1057 */             // assign a false positive if detection fails => unable to shiv
/* 1058 */             supportsHtml5Styles = true;
/* 1059 */             supportsUnknownElements = true;
/* 1060 */           }
/* 1061 */ 
/* 1062 */         }());
/* 1063 */ 
/* 1064 */         /*--------------------------------------------------------------------------*/
/* 1065 */ 
/* 1066 */         /**
/* 1067 *|          * Creates a style sheet with the given CSS text and adds it to the document.
/* 1068 *|          * @private
/* 1069 *|          * @param {Document} ownerDocument The document.
/* 1070 *|          * @param {String} cssText The CSS text.
/* 1071 *|          * @returns {StyleSheet} The style element.
/* 1072 *|          */
/* 1073 */         function addStyleSheet(ownerDocument, cssText) {
/* 1074 */           var p = ownerDocument.createElement('p'),
/* 1075 */           parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
/* 1076 */ 
/* 1077 */           p.innerHTML = 'x<style>' + cssText + '</style>';
/* 1078 */           return parent.insertBefore(p.lastChild, parent.firstChild);
/* 1079 */         }
/* 1080 */ 
/* 1081 */         /**
/* 1082 *|          * Returns the value of `html5.elements` as an array.
/* 1083 *|          * @private
/* 1084 *|          * @returns {Array} An array of shived element node names.
/* 1085 *|          */
/* 1086 */         function getElements() {
/* 1087 */           var elements = html5.elements;
/* 1088 */           return typeof elements == 'string' ? elements.split(' ') : elements;
/* 1089 */         }
/* 1090 */ 
/* 1091 */         /**
/* 1092 *|          * Returns the data associated to the given document
/* 1093 *|          * @private
/* 1094 *|          * @param {Document} ownerDocument The document.
/* 1095 *|          * @returns {Object} An object of data.
/* 1096 *|          */
/* 1097 */         function getExpandoData(ownerDocument) {
/* 1098 */           var data = expandoData[ownerDocument[expando]];
/* 1099 */           if (!data) {
/* 1100 */             data = {};

/* preloader.js */

/* 1101 */             expanID++;
/* 1102 */             ownerDocument[expando] = expanID;
/* 1103 */             expandoData[expanID] = data;
/* 1104 */           }
/* 1105 */           return data;
/* 1106 */         }
/* 1107 */ 
/* 1108 */         /**
/* 1109 *|          * returns a shived element for the given nodeName and document
/* 1110 *|          * @memberOf html5
/* 1111 *|          * @param {String} nodeName name of the element
/* 1112 *|          * @param {Document} ownerDocument The context document.
/* 1113 *|          * @returns {Object} The shived element.
/* 1114 *|          */
/* 1115 */         function createElement(nodeName, ownerDocument, data){
/* 1116 */           if (!ownerDocument) {
/* 1117 */             ownerDocument = document;
/* 1118 */           }
/* 1119 */           if(supportsUnknownElements){
/* 1120 */             return ownerDocument.createElement(nodeName);
/* 1121 */           }
/* 1122 */           if (!data) {
/* 1123 */             data = getExpandoData(ownerDocument);
/* 1124 */           }
/* 1125 */           var node;
/* 1126 */ 
/* 1127 */           if (data.cache[nodeName]) {
/* 1128 */             node = data.cache[nodeName].cloneNode();
/* 1129 */           } else if (saveClones.test(nodeName)) {
/* 1130 */             node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
/* 1131 */           } else {
/* 1132 */             node = data.createElem(nodeName);
/* 1133 */           }
/* 1134 */ 
/* 1135 */           // Avoid adding some elements to fragments in IE < 9 because
/* 1136 */           // * Attributes like `name` or `type` cannot be set/changed once an element
/* 1137 */           //   is inserted into a document/fragment
/* 1138 */           // * Link elements with `src` attributes that are inaccessible, as with
/* 1139 */           //   a 403 response, will cause the tab/window to crash
/* 1140 */           // * Script elements appended to fragments will execute when their `src`
/* 1141 */           //   or `text` property is set
/* 1142 */           return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
/* 1143 */         }
/* 1144 */ 
/* 1145 */         /**
/* 1146 *|          * returns a shived DocumentFragment for the given document
/* 1147 *|          * @memberOf html5
/* 1148 *|          * @param {Document} ownerDocument The context document.
/* 1149 *|          * @returns {Object} The shived DocumentFragment.
/* 1150 *|          */

/* preloader.js */

/* 1151 */         function createDocumentFragment(ownerDocument, data){
/* 1152 */           if (!ownerDocument) {
/* 1153 */             ownerDocument = document;
/* 1154 */           }
/* 1155 */           if(supportsUnknownElements){
/* 1156 */             return ownerDocument.createDocumentFragment();
/* 1157 */           }
/* 1158 */           data = data || getExpandoData(ownerDocument);
/* 1159 */           var clone = data.frag.cloneNode(),
/* 1160 */           i = 0,
/* 1161 */           elems = getElements(),
/* 1162 */           l = elems.length;
/* 1163 */           for(;i<l;i++){
/* 1164 */             clone.createElement(elems[i]);
/* 1165 */           }
/* 1166 */           return clone;
/* 1167 */         }
/* 1168 */ 
/* 1169 */         /**
/* 1170 *|          * Shivs the `createElement` and `createDocumentFragment` methods of the document.
/* 1171 *|          * @private
/* 1172 *|          * @param {Document|DocumentFragment} ownerDocument The document.
/* 1173 *|          * @param {Object} data of the document.
/* 1174 *|          */
/* 1175 */         function shivMethods(ownerDocument, data) {
/* 1176 */           if (!data.cache) {
/* 1177 */             data.cache = {};
/* 1178 */             data.createElem = ownerDocument.createElement;
/* 1179 */             data.createFrag = ownerDocument.createDocumentFragment;
/* 1180 */             data.frag = data.createFrag();
/* 1181 */           }
/* 1182 */ 
/* 1183 */ 
/* 1184 */           ownerDocument.createElement = function(nodeName) {
/* 1185 */             //abort shiv
/* 1186 */             if (!html5.shivMethods) {
/* 1187 */               return data.createElem(nodeName);
/* 1188 */             }
/* 1189 */             return createElement(nodeName, ownerDocument, data);
/* 1190 */           };
/* 1191 */ 
/* 1192 */           ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
/* 1193 */                                                           'var n=f.cloneNode(),c=n.createElement;' +
/* 1194 */                                                           'h.shivMethods&&(' +
/* 1195 */                                                           // unroll the `createElement` calls
/* 1196 */                                                           getElements().join().replace(/[\w\-]+/g, function(nodeName) {
/* 1197 */             data.createElem(nodeName);
/* 1198 */             data.frag.createElement(nodeName);
/* 1199 */             return 'c("' + nodeName + '")';
/* 1200 */           }) +

/* preloader.js */

/* 1201 */             ');return n}'
/* 1202 */                                                          )(html5, data.frag);
/* 1203 */         }
/* 1204 */ 
/* 1205 */         /*--------------------------------------------------------------------------*/
/* 1206 */ 
/* 1207 */         /**
/* 1208 *|          * Shivs the given document.
/* 1209 *|          * @memberOf html5
/* 1210 *|          * @param {Document} ownerDocument The document to shiv.
/* 1211 *|          * @returns {Document} The shived document.
/* 1212 *|          */
/* 1213 */         function shivDocument(ownerDocument) {
/* 1214 */ 
/* 1215 */           if (!ownerDocument) {
/* 1216 */             ownerDocument = document;
/* 1217 */           }
/* 1218 */           var data = getExpandoData(ownerDocument);
/* 1219 */ 
/* 1220 */           if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
/* 1221 */             data.hasCSS = !!addStyleSheet(ownerDocument,
/* 1222 */                                           // corrects block display not defined in IE6/7/8/9
/* 1223 */                                           'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
/* 1224 */                                             // adds styling not present in IE6/7/8/9
/* 1225 */                                             'mark{background:#FF0;color:#000}' +
/* 1226 */                                             // hides non-rendered elements
/* 1227 */                                             'template{display:none}'
/* 1228 */                                          );
/* 1229 */           }
/* 1230 */           if (!supportsUnknownElements) {
/* 1231 */             shivMethods(ownerDocument, data);
/* 1232 */           }
/* 1233 */           return ownerDocument;
/* 1234 */         }
/* 1235 */ 
/* 1236 */         /*--------------------------------------------------------------------------*/
/* 1237 */ 
/* 1238 */         /**
/* 1239 *|          * The `html5` object is exposed so that more elements can be shived and
/* 1240 *|          * existing shiving can be detected on iframes.
/* 1241 *|          * @type Object
/* 1242 *|          * @example
/* 1243 *|          *
/* 1244 *|          * // options can be changed before the script is included
/* 1245 *|          * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
/* 1246 *|          */
/* 1247 */         var html5 = {
/* 1248 */ 
/* 1249 */           /**
/* 1250 *|            * An array or space separated string of node names of the elements to shiv.

/* preloader.js */

/* 1251 *|            * @memberOf html5
/* 1252 *|            * @type Array|String
/* 1253 *|            */
/* 1254 */           'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',
/* 1255 */ 
/* 1256 */           /**
/* 1257 *|            * current version of html5shiv
/* 1258 *|            */
/* 1259 */           'version': version,
/* 1260 */ 
/* 1261 */           /**
/* 1262 *|            * A flag to indicate that the HTML5 style sheet should be inserted.
/* 1263 *|            * @memberOf html5
/* 1264 *|            * @type Boolean
/* 1265 *|            */
/* 1266 */           'shivCSS': (options.shivCSS !== false),
/* 1267 */ 
/* 1268 */           /**
/* 1269 *|            * Is equal to true if a browser supports creating unknown/HTML5 elements
/* 1270 *|            * @memberOf html5
/* 1271 *|            * @type boolean
/* 1272 *|            */
/* 1273 */           'supportsUnknownElements': supportsUnknownElements,
/* 1274 */ 
/* 1275 */           /**
/* 1276 *|            * A flag to indicate that the document's `createElement` and `createDocumentFragment`
/* 1277 *|            * methods should be overwritten.
/* 1278 *|            * @memberOf html5
/* 1279 *|            * @type Boolean
/* 1280 *|            */
/* 1281 */           'shivMethods': (options.shivMethods !== false),
/* 1282 */ 
/* 1283 */           /**
/* 1284 *|            * A string to describe the type of `html5` object ("default" or "default print").
/* 1285 *|            * @memberOf html5
/* 1286 *|            * @type String
/* 1287 *|            */
/* 1288 */           'type': 'default',
/* 1289 */ 
/* 1290 */           // shivs the document according to the specified `html5` object options
/* 1291 */           'shivDocument': shivDocument,
/* 1292 */ 
/* 1293 */           //creates a shived element
/* 1294 */           createElement: createElement,
/* 1295 */ 
/* 1296 */           //creates a shived documentFragment
/* 1297 */           createDocumentFragment: createDocumentFragment
/* 1298 */         };
/* 1299 */ 
/* 1300 */         /*--------------------------------------------------------------------------*/

/* preloader.js */

/* 1301 */ 
/* 1302 */         // expose html5
/* 1303 */         window.html5 = html5;
/* 1304 */ 
/* 1305 */         // shiv the document
/* 1306 */         shivDocument(document);
/* 1307 */ 
/* 1308 */     }(this, document));
/* 1309 */     /*>>shiv*/
/* 1310 */ 
/* 1311 */     // Assign private properties to the return object with prefix
/* 1312 */     Modernizr._version      = version;
/* 1313 */ 
/* 1314 */     // expose these for the plugin API. Look in the source for how to join() them against your input
/* 1315 */     /*>>prefixes*/
/* 1316 */     Modernizr._prefixes     = prefixes;
/* 1317 */     /*>>prefixes*/
/* 1318 */     /*>>domprefixes*/
/* 1319 */     Modernizr._domPrefixes  = domPrefixes;
/* 1320 */     Modernizr._cssomPrefixes  = cssomPrefixes;
/* 1321 */     /*>>domprefixes*/
/* 1322 */ 
/* 1323 */     /*>>mq*/
/* 1324 */     // Modernizr.mq tests a given media query, live against the current state of the window
/* 1325 */     // A few important notes:
/* 1326 */     //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
/* 1327 */     //   * A max-width or orientation query will be evaluated against the current state, which may change later.
/* 1328 */     //   * You must specify values. Eg. If you are testing support for the min-width media query use:
/* 1329 */     //       Modernizr.mq('(min-width:0)')
/* 1330 */     // usage:
/* 1331 */     // Modernizr.mq('only screen and (max-width:768)')
/* 1332 */     Modernizr.mq            = testMediaQuery;
/* 1333 */     /*>>mq*/
/* 1334 */ 
/* 1335 */     /*>>hasevent*/
/* 1336 */     // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
/* 1337 */     // Modernizr.hasEvent('gesturestart', elem)
/* 1338 */     Modernizr.hasEvent      = isEventSupported;
/* 1339 */     /*>>hasevent*/
/* 1340 */ 
/* 1341 */     /*>>testprop*/
/* 1342 */     // Modernizr.testProp() investigates whether a given style property is recognized
/* 1343 */     // Note that the property names must be provided in the camelCase variant.
/* 1344 */     // Modernizr.testProp('pointerEvents')
/* 1345 */     Modernizr.testProp      = function(prop){
/* 1346 */         return testProps([prop]);
/* 1347 */     };
/* 1348 */     /*>>testprop*/
/* 1349 */ 
/* 1350 */     /*>>testallprops*/

/* preloader.js */

/* 1351 */     // Modernizr.testAllProps() investigates whether a given style property,
/* 1352 */     //   or any of its vendor-prefixed variants, is recognized
/* 1353 */     // Note that the property names must be provided in the camelCase variant.
/* 1354 */     // Modernizr.testAllProps('boxSizing')
/* 1355 */     Modernizr.testAllProps  = testPropsAll;
/* 1356 */     /*>>testallprops*/
/* 1357 */ 
/* 1358 */ 
/* 1359 */     /*>>teststyles*/
/* 1360 */     // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
/* 1361 */     // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
/* 1362 */     Modernizr.testStyles    = injectElementWithStyles;
/* 1363 */     /*>>teststyles*/
/* 1364 */ 
/* 1365 */ 
/* 1366 */     /*>>prefixed*/
/* 1367 */     // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
/* 1368 */     // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'
/* 1369 */ 
/* 1370 */     // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
/* 1371 */     // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
/* 1372 */     //
/* 1373 */     //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
/* 1374 */ 
/* 1375 */     // If you're trying to ascertain which transition end event to bind to, you might do something like...
/* 1376 */     //
/* 1377 */     //     var transEndEventNames = {
/* 1378 */     //       'WebkitTransition' : 'webkitTransitionEnd',
/* 1379 */     //       'MozTransition'    : 'transitionend',
/* 1380 */     //       'OTransition'      : 'oTransitionEnd',
/* 1381 */     //       'msTransition'     : 'MSTransitionEnd',
/* 1382 */     //       'transition'       : 'transitionend'
/* 1383 */     //     },
/* 1384 */     //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
/* 1385 */ 
/* 1386 */     Modernizr.prefixed      = function(prop, obj, elem){
/* 1387 */       if(!obj) {
/* 1388 */         return testPropsAll(prop, 'pfx');
/* 1389 */       } else {
/* 1390 */         // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
/* 1391 */         return testPropsAll(prop, obj, elem);
/* 1392 */       }
/* 1393 */     };
/* 1394 */     /*>>prefixed*/
/* 1395 */ 
/* 1396 */ 
/* 1397 */     /*>>cssclasses*/
/* 1398 */     // Remove "no-js" class from <html> element, if it exists:
/* 1399 */     docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
/* 1400 */ 

/* preloader.js */

/* 1401 */                             // Add the new classes to the <html> element.
/* 1402 */                             (enableClasses ? ' js ' + classes.join(' ') : '');
/* 1403 */     /*>>cssclasses*/
/* 1404 */ 
/* 1405 */     return Modernizr;
/* 1406 */ 
/* 1407 */ })(this, this.document);
/* 1408 */ 

;
/* jquery.validate.js */

/* 1    */ /*!
/* 2    *|  * jQuery Validation Plugin v1.14.0
/* 3    *|  *
/* 4    *|  * http://jqueryvalidation.org/
/* 5    *|  *
/* 6    *|  * Copyright (c) 2015 Jörn Zaefferer
/* 7    *|  * Released under the MIT license
/* 8    *|  */
/* 9    */ (function( factory ) {
/* 10   */ 	if ( typeof define === "function" && define.amd ) {
/* 11   */ 		define( ["jquery"], factory );
/* 12   */ 	} else {
/* 13   */ 		factory( jQuery );
/* 14   */ 	}
/* 15   */ }(function( $ ) {
/* 16   */ 
/* 17   */ $.extend($.fn, {
/* 18   */ 	// http://jqueryvalidation.org/validate/
/* 19   */ 	validate: function( options ) {
/* 20   */ 
/* 21   */ 		// if nothing is selected, return nothing; can't chain anyway
/* 22   */ 		if ( !this.length ) {
/* 23   */ 			if ( options && options.debug && window.console ) {
/* 24   */ 				console.warn( "Nothing selected, can't validate, returning nothing." );
/* 25   */ 			}
/* 26   */ 			return;
/* 27   */ 		}
/* 28   */ 
/* 29   */ 		// check if a validator for this form was already created
/* 30   */ 		var validator = $.data( this[ 0 ], "validator" );
/* 31   */ 		if ( validator ) {
/* 32   */ 			return validator;
/* 33   */ 		}
/* 34   */ 
/* 35   */ 		// Add novalidate tag if HTML5.
/* 36   */ 		this.attr( "novalidate", "novalidate" );
/* 37   */ 
/* 38   */ 		validator = new $.validator( options, this[ 0 ] );
/* 39   */ 		$.data( this[ 0 ], "validator", validator );
/* 40   */ 
/* 41   */ 		if ( validator.settings.onsubmit ) {
/* 42   */ 
/* 43   */ 			this.on( "click.validate", ":submit", function( event ) {
/* 44   */ 				if ( validator.settings.submitHandler ) {
/* 45   */ 					validator.submitButton = event.target;
/* 46   */ 				}
/* 47   */ 
/* 48   */ 				// allow suppressing validation by adding a cancel class to the submit button
/* 49   */ 				if ( $( this ).hasClass( "cancel" ) ) {
/* 50   */ 					validator.cancelSubmit = true;

/* jquery.validate.js */

/* 51   */ 				}
/* 52   */ 
/* 53   */ 				// allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
/* 54   */ 				if ( $( this ).attr( "formnovalidate" ) !== undefined ) {
/* 55   */ 					validator.cancelSubmit = true;
/* 56   */ 				}
/* 57   */ 			});
/* 58   */ 
/* 59   */ 			// validate the form on submit
/* 60   */ 			this.on( "submit.validate", function( event ) {
/* 61   */ 				if ( validator.settings.debug ) {
/* 62   */ 					// prevent form submit to be able to see console output
/* 63   */ 					event.preventDefault();
/* 64   */ 				}
/* 65   */ 				function handle() {
/* 66   */ 					var hidden, result;
/* 67   */ 					if ( validator.settings.submitHandler ) {
/* 68   */ 						if ( validator.submitButton ) {
/* 69   */ 							// insert a hidden input as a replacement for the missing submit button
/* 70   */ 							hidden = $( "<input type='hidden'/>" )
/* 71   */ 								.attr( "name", validator.submitButton.name )
/* 72   */ 								.val( $( validator.submitButton ).val() )
/* 73   */ 								.appendTo( validator.currentForm );
/* 74   */ 						}
/* 75   */ 						result = validator.settings.submitHandler.call( validator, validator.currentForm, event );
/* 76   */ 						if ( validator.submitButton ) {
/* 77   */ 							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
/* 78   */ 							hidden.remove();
/* 79   */ 						}
/* 80   */ 						if ( result !== undefined ) {
/* 81   */ 							return result;
/* 82   */ 						}
/* 83   */ 						return false;
/* 84   */ 					}
/* 85   */ 					return true;
/* 86   */ 				}
/* 87   */ 
/* 88   */ 				// prevent submit for invalid forms or custom submit handlers
/* 89   */ 				if ( validator.cancelSubmit ) {
/* 90   */ 					validator.cancelSubmit = false;
/* 91   */ 					return handle();
/* 92   */ 				}
/* 93   */ 				if ( validator.form() ) {
/* 94   */ 					if ( validator.pendingRequest ) {
/* 95   */ 						validator.formSubmitted = true;
/* 96   */ 						return false;
/* 97   */ 					}
/* 98   */ 					return handle();
/* 99   */ 				} else {
/* 100  */ 					validator.focusInvalid();

/* jquery.validate.js */

/* 101  */ 					return false;
/* 102  */ 				}
/* 103  */ 			});
/* 104  */ 		}
/* 105  */ 
/* 106  */ 		return validator;
/* 107  */ 	},
/* 108  */ 	// http://jqueryvalidation.org/valid/
/* 109  */ 	valid: function() {
/* 110  */ 		var valid, validator, errorList;
/* 111  */ 
/* 112  */ 		if ( $( this[ 0 ] ).is( "form" ) ) {
/* 113  */ 			valid = this.validate().form();
/* 114  */ 		} else {
/* 115  */ 			errorList = [];
/* 116  */ 			valid = true;
/* 117  */ 			validator = $( this[ 0 ].form ).validate();
/* 118  */ 			this.each( function() {
/* 119  */ 				valid = validator.element( this ) && valid;
/* 120  */ 				errorList = errorList.concat( validator.errorList );
/* 121  */ 			});
/* 122  */ 			validator.errorList = errorList;
/* 123  */ 		}
/* 124  */ 		return valid;
/* 125  */ 	},
/* 126  */ 
/* 127  */ 	// http://jqueryvalidation.org/rules/
/* 128  */ 	rules: function( command, argument ) {
/* 129  */ 		var element = this[ 0 ],
/* 130  */ 			settings, staticRules, existingRules, data, param, filtered;
/* 131  */ 
/* 132  */ 		if ( command ) {
/* 133  */ 			settings = $.data( element.form, "validator" ).settings;
/* 134  */ 			staticRules = settings.rules;
/* 135  */ 			existingRules = $.validator.staticRules( element );
/* 136  */ 			switch ( command ) {
/* 137  */ 			case "add":
/* 138  */ 				$.extend( existingRules, $.validator.normalizeRule( argument ) );
/* 139  */ 				// remove messages from rules, but allow them to be set separately
/* 140  */ 				delete existingRules.messages;
/* 141  */ 				staticRules[ element.name ] = existingRules;
/* 142  */ 				if ( argument.messages ) {
/* 143  */ 					settings.messages[ element.name ] = $.extend( settings.messages[ element.name ], argument.messages );
/* 144  */ 				}
/* 145  */ 				break;
/* 146  */ 			case "remove":
/* 147  */ 				if ( !argument ) {
/* 148  */ 					delete staticRules[ element.name ];
/* 149  */ 					return existingRules;
/* 150  */ 				}

/* jquery.validate.js */

/* 151  */ 				filtered = {};
/* 152  */ 				$.each( argument.split( /\s/ ), function( index, method ) {
/* 153  */ 					filtered[ method ] = existingRules[ method ];
/* 154  */ 					delete existingRules[ method ];
/* 155  */ 					if ( method === "required" ) {
/* 156  */ 						$( element ).removeAttr( "aria-required" );
/* 157  */ 					}
/* 158  */ 				});
/* 159  */ 				return filtered;
/* 160  */ 			}
/* 161  */ 		}
/* 162  */ 
/* 163  */ 		data = $.validator.normalizeRules(
/* 164  */ 		$.extend(
/* 165  */ 			{},
/* 166  */ 			$.validator.classRules( element ),
/* 167  */ 			$.validator.attributeRules( element ),
/* 168  */ 			$.validator.dataRules( element ),
/* 169  */ 			$.validator.staticRules( element )
/* 170  */ 		), element );
/* 171  */ 
/* 172  */ 		// make sure required is at front
/* 173  */ 		if ( data.required ) {
/* 174  */ 			param = data.required;
/* 175  */ 			delete data.required;
/* 176  */ 			data = $.extend( { required: param }, data );
/* 177  */ 			$( element ).attr( "aria-required", "true" );
/* 178  */ 		}
/* 179  */ 
/* 180  */ 		// make sure remote is at back
/* 181  */ 		if ( data.remote ) {
/* 182  */ 			param = data.remote;
/* 183  */ 			delete data.remote;
/* 184  */ 			data = $.extend( data, { remote: param });
/* 185  */ 		}
/* 186  */ 
/* 187  */ 		return data;
/* 188  */ 	}
/* 189  */ });
/* 190  */ 
/* 191  */ // Custom selectors
/* 192  */ $.extend( $.expr[ ":" ], {
/* 193  */ 	// http://jqueryvalidation.org/blank-selector/
/* 194  */ 	blank: function( a ) {
/* 195  */ 		return !$.trim( "" + $( a ).val() );
/* 196  */ 	},
/* 197  */ 	// http://jqueryvalidation.org/filled-selector/
/* 198  */ 	filled: function( a ) {
/* 199  */ 		return !!$.trim( "" + $( a ).val() );
/* 200  */ 	},

/* jquery.validate.js */

/* 201  */ 	// http://jqueryvalidation.org/unchecked-selector/
/* 202  */ 	unchecked: function( a ) {
/* 203  */ 		return !$( a ).prop( "checked" );
/* 204  */ 	}
/* 205  */ });
/* 206  */ 
/* 207  */ // constructor for validator
/* 208  */ $.validator = function( options, form ) {
/* 209  */ 	this.settings = $.extend( true, {}, $.validator.defaults, options );
/* 210  */ 	this.currentForm = form;
/* 211  */ 	this.init();
/* 212  */ };
/* 213  */ 
/* 214  */ // http://jqueryvalidation.org/jQuery.validator.format/
/* 215  */ $.validator.format = function( source, params ) {
/* 216  */ 	if ( arguments.length === 1 ) {
/* 217  */ 		return function() {
/* 218  */ 			var args = $.makeArray( arguments );
/* 219  */ 			args.unshift( source );
/* 220  */ 			return $.validator.format.apply( this, args );
/* 221  */ 		};
/* 222  */ 	}
/* 223  */ 	if ( arguments.length > 2 && params.constructor !== Array  ) {
/* 224  */ 		params = $.makeArray( arguments ).slice( 1 );
/* 225  */ 	}
/* 226  */ 	if ( params.constructor !== Array ) {
/* 227  */ 		params = [ params ];
/* 228  */ 	}
/* 229  */ 	$.each( params, function( i, n ) {
/* 230  */ 		source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
/* 231  */ 			return n;
/* 232  */ 		});
/* 233  */ 	});
/* 234  */ 	return source;
/* 235  */ };
/* 236  */ 
/* 237  */ $.extend( $.validator, {
/* 238  */ 
/* 239  */ 	defaults: {
/* 240  */ 		messages: {},
/* 241  */ 		groups: {},
/* 242  */ 		rules: {},
/* 243  */ 		errorClass: "error",
/* 244  */ 		validClass: "valid",
/* 245  */ 		errorElement: "label",
/* 246  */ 		focusCleanup: false,
/* 247  */ 		focusInvalid: true,
/* 248  */ 		errorContainer: $( [] ),
/* 249  */ 		errorLabelContainer: $( [] ),
/* 250  */ 		onsubmit: true,

/* jquery.validate.js */

/* 251  */ 		ignore: ":hidden",
/* 252  */ 		ignoreTitle: false,
/* 253  */ 		onfocusin: function( element ) {
/* 254  */ 			this.lastActive = element;
/* 255  */ 
/* 256  */ 			// Hide error label and remove error class on focus if enabled
/* 257  */ 			if ( this.settings.focusCleanup ) {
/* 258  */ 				if ( this.settings.unhighlight ) {
/* 259  */ 					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
/* 260  */ 				}
/* 261  */ 				this.hideThese( this.errorsFor( element ) );
/* 262  */ 			}
/* 263  */ 		},
/* 264  */ 		onfocusout: function( element ) {
/* 265  */ 			if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
/* 266  */ 				this.element( element );
/* 267  */ 			}
/* 268  */ 		},
/* 269  */ 		onkeyup: function( element, event ) {
/* 270  */ 			// Avoid revalidate the field when pressing one of the following keys
/* 271  */ 			// Shift       => 16
/* 272  */ 			// Ctrl        => 17
/* 273  */ 			// Alt         => 18
/* 274  */ 			// Caps lock   => 20
/* 275  */ 			// End         => 35
/* 276  */ 			// Home        => 36
/* 277  */ 			// Left arrow  => 37
/* 278  */ 			// Up arrow    => 38
/* 279  */ 			// Right arrow => 39
/* 280  */ 			// Down arrow  => 40
/* 281  */ 			// Insert      => 45
/* 282  */ 			// Num lock    => 144
/* 283  */ 			// AltGr key   => 225
/* 284  */ 			var excludedKeys = [
/* 285  */ 				16, 17, 18, 20, 35, 36, 37,
/* 286  */ 				38, 39, 40, 45, 144, 225
/* 287  */ 			];
/* 288  */ 
/* 289  */ 			if ( event.which === 9 && this.elementValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
/* 290  */ 				return;
/* 291  */ 			} else if ( element.name in this.submitted || element === this.lastElement ) {
/* 292  */ 				this.element( element );
/* 293  */ 			}
/* 294  */ 		},
/* 295  */ 		onclick: function( element ) {
/* 296  */ 			// click on selects, radiobuttons and checkboxes
/* 297  */ 			if ( element.name in this.submitted ) {
/* 298  */ 				this.element( element );
/* 299  */ 
/* 300  */ 			// or option elements, check parent select in that case

/* jquery.validate.js */

/* 301  */ 			} else if ( element.parentNode.name in this.submitted ) {
/* 302  */ 				this.element( element.parentNode );
/* 303  */ 			}
/* 304  */ 		},
/* 305  */ 		highlight: function( element, errorClass, validClass ) {
/* 306  */ 			if ( element.type === "radio" ) {
/* 307  */ 				this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
/* 308  */ 			} else {
/* 309  */ 				$( element ).addClass( errorClass ).removeClass( validClass );
/* 310  */ 			}
/* 311  */ 		},
/* 312  */ 		unhighlight: function( element, errorClass, validClass ) {
/* 313  */ 			if ( element.type === "radio" ) {
/* 314  */ 				this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
/* 315  */ 			} else {
/* 316  */ 				$( element ).removeClass( errorClass ).addClass( validClass );
/* 317  */ 			}
/* 318  */ 		}
/* 319  */ 	},
/* 320  */ 
/* 321  */ 	// http://jqueryvalidation.org/jQuery.validator.setDefaults/
/* 322  */ 	setDefaults: function( settings ) {
/* 323  */ 		$.extend( $.validator.defaults, settings );
/* 324  */ 	},
/* 325  */ 
/* 326  */ 	messages: {
/* 327  */ 		required: "This field is required.",
/* 328  */ 		remote: "Please fix this field.",
/* 329  */ 		email: "Please enter a valid email address.",
/* 330  */ 		url: "Please enter a valid URL.",
/* 331  */ 		date: "Please enter a valid date.",
/* 332  */ 		dateISO: "Please enter a valid date ( ISO ).",
/* 333  */ 		number: "Please enter a valid number.",
/* 334  */ 		digits: "Please enter only digits.",
/* 335  */ 		creditcard: "Please enter a valid credit card number.",
/* 336  */ 		equalTo: "Please enter the same value again.",
/* 337  */ 		maxlength: $.validator.format( "Please enter no more than {0} characters." ),
/* 338  */ 		minlength: $.validator.format( "Please enter at least {0} characters." ),
/* 339  */ 		rangelength: $.validator.format( "Please enter a value between {0} and {1} characters long." ),
/* 340  */ 		range: $.validator.format( "Please enter a value between {0} and {1}." ),
/* 341  */ 		max: $.validator.format( "Please enter a value less than or equal to {0}." ),
/* 342  */ 		min: $.validator.format( "Please enter a value greater than or equal to {0}." )
/* 343  */ 	},
/* 344  */ 
/* 345  */ 	autoCreateRanges: false,
/* 346  */ 
/* 347  */ 	prototype: {
/* 348  */ 
/* 349  */ 		init: function() {
/* 350  */ 			this.labelContainer = $( this.settings.errorLabelContainer );

/* jquery.validate.js */

/* 351  */ 			this.errorContext = this.labelContainer.length && this.labelContainer || $( this.currentForm );
/* 352  */ 			this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
/* 353  */ 			this.submitted = {};
/* 354  */ 			this.valueCache = {};
/* 355  */ 			this.pendingRequest = 0;
/* 356  */ 			this.pending = {};
/* 357  */ 			this.invalid = {};
/* 358  */ 			this.reset();
/* 359  */ 
/* 360  */ 			var groups = ( this.groups = {} ),
/* 361  */ 				rules;
/* 362  */ 			$.each( this.settings.groups, function( key, value ) {
/* 363  */ 				if ( typeof value === "string" ) {
/* 364  */ 					value = value.split( /\s/ );
/* 365  */ 				}
/* 366  */ 				$.each( value, function( index, name ) {
/* 367  */ 					groups[ name ] = key;
/* 368  */ 				});
/* 369  */ 			});
/* 370  */ 			rules = this.settings.rules;
/* 371  */ 			$.each( rules, function( key, value ) {
/* 372  */ 				rules[ key ] = $.validator.normalizeRule( value );
/* 373  */ 			});
/* 374  */ 
/* 375  */ 			function delegate( event ) {
/* 376  */ 				var validator = $.data( this.form, "validator" ),
/* 377  */ 					eventType = "on" + event.type.replace( /^validate/, "" ),
/* 378  */ 					settings = validator.settings;
/* 379  */ 				if ( settings[ eventType ] && !$( this ).is( settings.ignore ) ) {
/* 380  */ 					settings[ eventType ].call( validator, this, event );
/* 381  */ 				}
/* 382  */ 			}
/* 383  */ 
/* 384  */ 			$( this.currentForm )
/* 385  */ 				.on( "focusin.validate focusout.validate keyup.validate",
/* 386  */ 					":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
/* 387  */ 					"[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
/* 388  */ 					"[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
/* 389  */ 					"[type='radio'], [type='checkbox']", delegate)
/* 390  */ 				// Support: Chrome, oldIE
/* 391  */ 				// "select" is provided as event.target when clicking a option
/* 392  */ 				.on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);
/* 393  */ 
/* 394  */ 			if ( this.settings.invalidHandler ) {
/* 395  */ 				$( this.currentForm ).on( "invalid-form.validate", this.settings.invalidHandler );
/* 396  */ 			}
/* 397  */ 
/* 398  */ 			// Add aria-required to any Static/Data/Class required fields before first validation
/* 399  */ 			// Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
/* 400  */ 			$( this.currentForm ).find( "[required], [data-rule-required], .required" ).attr( "aria-required", "true" );

/* jquery.validate.js */

/* 401  */ 		},
/* 402  */ 
/* 403  */ 		// http://jqueryvalidation.org/Validator.form/
/* 404  */ 		form: function() {
/* 405  */ 			this.checkForm();
/* 406  */ 			$.extend( this.submitted, this.errorMap );
/* 407  */ 			this.invalid = $.extend({}, this.errorMap );
/* 408  */ 			if ( !this.valid() ) {
/* 409  */ 				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
/* 410  */ 			}
/* 411  */ 			this.showErrors();
/* 412  */ 			return this.valid();
/* 413  */ 		},
/* 414  */ 
/* 415  */ 		checkForm: function() {
/* 416  */ 			this.prepareForm();
/* 417  */ 			for ( var i = 0, elements = ( this.currentElements = this.elements() ); elements[ i ]; i++ ) {
/* 418  */ 				this.check( elements[ i ] );
/* 419  */ 			}
/* 420  */ 			return this.valid();
/* 421  */ 		},
/* 422  */ 
/* 423  */ 		// http://jqueryvalidation.org/Validator.element/
/* 424  */ 		element: function( element ) {
/* 425  */ 			var cleanElement = this.clean( element ),
/* 426  */ 				checkElement = this.validationTargetFor( cleanElement ),
/* 427  */ 				result = true;
/* 428  */ 
/* 429  */ 			this.lastElement = checkElement;
/* 430  */ 
/* 431  */ 			if ( checkElement === undefined ) {
/* 432  */ 				delete this.invalid[ cleanElement.name ];
/* 433  */ 			} else {
/* 434  */ 				this.prepareElement( checkElement );
/* 435  */ 				this.currentElements = $( checkElement );
/* 436  */ 
/* 437  */ 				result = this.check( checkElement ) !== false;
/* 438  */ 				if ( result ) {
/* 439  */ 					delete this.invalid[ checkElement.name ];
/* 440  */ 				} else {
/* 441  */ 					this.invalid[ checkElement.name ] = true;
/* 442  */ 				}
/* 443  */ 			}
/* 444  */ 			// Add aria-invalid status for screen readers
/* 445  */ 			$( element ).attr( "aria-invalid", !result );
/* 446  */ 
/* 447  */ 			if ( !this.numberOfInvalids() ) {
/* 448  */ 				// Hide error containers on last error
/* 449  */ 				this.toHide = this.toHide.add( this.containers );
/* 450  */ 			}

/* jquery.validate.js */

/* 451  */ 			this.showErrors();
/* 452  */ 			return result;
/* 453  */ 		},
/* 454  */ 
/* 455  */ 		// http://jqueryvalidation.org/Validator.showErrors/
/* 456  */ 		showErrors: function( errors ) {
/* 457  */ 			if ( errors ) {
/* 458  */ 				// add items to error list and map
/* 459  */ 				$.extend( this.errorMap, errors );
/* 460  */ 				this.errorList = [];
/* 461  */ 				for ( var name in errors ) {
/* 462  */ 					this.errorList.push({
/* 463  */ 						message: errors[ name ],
/* 464  */ 						element: this.findByName( name )[ 0 ]
/* 465  */ 					});
/* 466  */ 				}
/* 467  */ 				// remove items from success list
/* 468  */ 				this.successList = $.grep( this.successList, function( element ) {
/* 469  */ 					return !( element.name in errors );
/* 470  */ 				});
/* 471  */ 			}
/* 472  */ 			if ( this.settings.showErrors ) {
/* 473  */ 				this.settings.showErrors.call( this, this.errorMap, this.errorList );
/* 474  */ 			} else {
/* 475  */ 				this.defaultShowErrors();
/* 476  */ 			}
/* 477  */ 		},
/* 478  */ 
/* 479  */ 		// http://jqueryvalidation.org/Validator.resetForm/
/* 480  */ 		resetForm: function() {
/* 481  */ 			if ( $.fn.resetForm ) {
/* 482  */ 				$( this.currentForm ).resetForm();
/* 483  */ 			}
/* 484  */ 			this.submitted = {};
/* 485  */ 			this.lastElement = null;
/* 486  */ 			this.prepareForm();
/* 487  */ 			this.hideErrors();
/* 488  */ 			var i, elements = this.elements()
/* 489  */ 				.removeData( "previousValue" )
/* 490  */ 				.removeAttr( "aria-invalid" );
/* 491  */ 
/* 492  */ 			if ( this.settings.unhighlight ) {
/* 493  */ 				for ( i = 0; elements[ i ]; i++ ) {
/* 494  */ 					this.settings.unhighlight.call( this, elements[ i ],
/* 495  */ 						this.settings.errorClass, "" );
/* 496  */ 				}
/* 497  */ 			} else {
/* 498  */ 				elements.removeClass( this.settings.errorClass );
/* 499  */ 			}
/* 500  */ 		},

/* jquery.validate.js */

/* 501  */ 
/* 502  */ 		numberOfInvalids: function() {
/* 503  */ 			return this.objectLength( this.invalid );
/* 504  */ 		},
/* 505  */ 
/* 506  */ 		objectLength: function( obj ) {
/* 507  */ 			/* jshint unused: false */
/* 508  */ 			var count = 0,
/* 509  */ 				i;
/* 510  */ 			for ( i in obj ) {
/* 511  */ 				count++;
/* 512  */ 			}
/* 513  */ 			return count;
/* 514  */ 		},
/* 515  */ 
/* 516  */ 		hideErrors: function() {
/* 517  */ 			this.hideThese( this.toHide );
/* 518  */ 		},
/* 519  */ 
/* 520  */ 		hideThese: function( errors ) {
/* 521  */ 			errors.not( this.containers ).text( "" );
/* 522  */ 			this.addWrapper( errors ).hide();
/* 523  */ 		},
/* 524  */ 
/* 525  */ 		valid: function() {
/* 526  */ 			return this.size() === 0;
/* 527  */ 		},
/* 528  */ 
/* 529  */ 		size: function() {
/* 530  */ 			return this.errorList.length;
/* 531  */ 		},
/* 532  */ 
/* 533  */ 		focusInvalid: function() {
/* 534  */ 			if ( this.settings.focusInvalid ) {
/* 535  */ 				try {
/* 536  */ 					$( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [])
/* 537  */ 					.filter( ":visible" )
/* 538  */ 					.focus()
/* 539  */ 					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
/* 540  */ 					.trigger( "focusin" );
/* 541  */ 				} catch ( e ) {
/* 542  */ 					// ignore IE throwing errors when focusing hidden elements
/* 543  */ 				}
/* 544  */ 			}
/* 545  */ 		},
/* 546  */ 
/* 547  */ 		findLastActive: function() {
/* 548  */ 			var lastActive = this.lastActive;
/* 549  */ 			return lastActive && $.grep( this.errorList, function( n ) {
/* 550  */ 				return n.element.name === lastActive.name;

/* jquery.validate.js */

/* 551  */ 			}).length === 1 && lastActive;
/* 552  */ 		},
/* 553  */ 
/* 554  */ 		elements: function() {
/* 555  */ 			var validator = this,
/* 556  */ 				rulesCache = {};
/* 557  */ 
/* 558  */ 			// select all valid inputs inside the form (no submit or reset buttons)
/* 559  */ 			return $( this.currentForm )
/* 560  */ 			.find( "input, select, textarea" )
/* 561  */ 			.not( ":submit, :reset, :image, :disabled" )
/* 562  */ 			.not( this.settings.ignore )
/* 563  */ 			.filter( function() {
/* 564  */ 				if ( !this.name && validator.settings.debug && window.console ) {
/* 565  */ 					console.error( "%o has no name assigned", this );
/* 566  */ 				}
/* 567  */ 
/* 568  */ 				// select only the first element for each name, and only those with rules specified
/* 569  */ 				if ( this.name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
/* 570  */ 					return false;
/* 571  */ 				}
/* 572  */ 
/* 573  */ 				rulesCache[ this.name ] = true;
/* 574  */ 				return true;
/* 575  */ 			});
/* 576  */ 		},
/* 577  */ 
/* 578  */ 		clean: function( selector ) {
/* 579  */ 			return $( selector )[ 0 ];
/* 580  */ 		},
/* 581  */ 
/* 582  */ 		errors: function() {
/* 583  */ 			var errorClass = this.settings.errorClass.split( " " ).join( "." );
/* 584  */ 			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
/* 585  */ 		},
/* 586  */ 
/* 587  */ 		reset: function() {
/* 588  */ 			this.successList = [];
/* 589  */ 			this.errorList = [];
/* 590  */ 			this.errorMap = {};
/* 591  */ 			this.toShow = $( [] );
/* 592  */ 			this.toHide = $( [] );
/* 593  */ 			this.currentElements = $( [] );
/* 594  */ 		},
/* 595  */ 
/* 596  */ 		prepareForm: function() {
/* 597  */ 			this.reset();
/* 598  */ 			this.toHide = this.errors().add( this.containers );
/* 599  */ 		},
/* 600  */ 

/* jquery.validate.js */

/* 601  */ 		prepareElement: function( element ) {
/* 602  */ 			this.reset();
/* 603  */ 			this.toHide = this.errorsFor( element );
/* 604  */ 		},
/* 605  */ 
/* 606  */ 		elementValue: function( element ) {
/* 607  */ 			var val,
/* 608  */ 				$element = $( element ),
/* 609  */ 				type = element.type;
/* 610  */ 
/* 611  */ 			if ( type === "radio" || type === "checkbox" ) {
/* 612  */ 				return this.findByName( element.name ).filter(":checked").val();
/* 613  */ 			} else if ( type === "number" && typeof element.validity !== "undefined" ) {
/* 614  */ 				return element.validity.badInput ? false : $element.val();
/* 615  */ 			}
/* 616  */ 
/* 617  */ 			val = $element.val();
/* 618  */ 			if ( typeof val === "string" ) {
/* 619  */ 				return val.replace(/\r/g, "" );
/* 620  */ 			}
/* 621  */ 			return val;
/* 622  */ 		},
/* 623  */ 
/* 624  */ 		check: function( element ) {
/* 625  */ 			element = this.validationTargetFor( this.clean( element ) );
/* 626  */ 
/* 627  */ 			var rules = $( element ).rules(),
/* 628  */ 				rulesCount = $.map( rules, function( n, i ) {
/* 629  */ 					return i;
/* 630  */ 				}).length,
/* 631  */ 				dependencyMismatch = false,
/* 632  */ 				val = this.elementValue( element ),
/* 633  */ 				result, method, rule;
/* 634  */ 
/* 635  */ 			for ( method in rules ) {
/* 636  */ 				rule = { method: method, parameters: rules[ method ] };
/* 637  */ 				try {
/* 638  */ 
/* 639  */ 					result = $.validator.methods[ method ].call( this, val, element, rule.parameters );
/* 640  */ 
/* 641  */ 					// if a method indicates that the field is optional and therefore valid,
/* 642  */ 					// don't mark it as valid when there are no other rules
/* 643  */ 					if ( result === "dependency-mismatch" && rulesCount === 1 ) {
/* 644  */ 						dependencyMismatch = true;
/* 645  */ 						continue;
/* 646  */ 					}
/* 647  */ 					dependencyMismatch = false;
/* 648  */ 
/* 649  */ 					if ( result === "pending" ) {
/* 650  */ 						this.toHide = this.toHide.not( this.errorsFor( element ) );

/* jquery.validate.js */

/* 651  */ 						return;
/* 652  */ 					}
/* 653  */ 
/* 654  */ 					if ( !result ) {
/* 655  */ 						this.formatAndAdd( element, rule );
/* 656  */ 						return false;
/* 657  */ 					}
/* 658  */ 				} catch ( e ) {
/* 659  */ 					if ( this.settings.debug && window.console ) {
/* 660  */ 						console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
/* 661  */ 					}
/* 662  */ 					if ( e instanceof TypeError ) {
/* 663  */ 						e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
/* 664  */ 					}
/* 665  */ 
/* 666  */ 					throw e;
/* 667  */ 				}
/* 668  */ 			}
/* 669  */ 			if ( dependencyMismatch ) {
/* 670  */ 				return;
/* 671  */ 			}
/* 672  */ 			if ( this.objectLength( rules ) ) {
/* 673  */ 				this.successList.push( element );
/* 674  */ 			}
/* 675  */ 			return true;
/* 676  */ 		},
/* 677  */ 
/* 678  */ 		// return the custom message for the given element and validation method
/* 679  */ 		// specified in the element's HTML5 data attribute
/* 680  */ 		// return the generic message if present and no method specific message is present
/* 681  */ 		customDataMessage: function( element, method ) {
/* 682  */ 			return $( element ).data( "msg" + method.charAt( 0 ).toUpperCase() +
/* 683  */ 				method.substring( 1 ).toLowerCase() ) || $( element ).data( "msg" );
/* 684  */ 		},
/* 685  */ 
/* 686  */ 		// return the custom message for the given element name and validation method
/* 687  */ 		customMessage: function( name, method ) {
/* 688  */ 			var m = this.settings.messages[ name ];
/* 689  */ 			return m && ( m.constructor === String ? m : m[ method ]);
/* 690  */ 		},
/* 691  */ 
/* 692  */ 		// return the first defined argument, allowing empty strings
/* 693  */ 		findDefined: function() {
/* 694  */ 			for ( var i = 0; i < arguments.length; i++) {
/* 695  */ 				if ( arguments[ i ] !== undefined ) {
/* 696  */ 					return arguments[ i ];
/* 697  */ 				}
/* 698  */ 			}
/* 699  */ 			return undefined;
/* 700  */ 		},

/* jquery.validate.js */

/* 701  */ 
/* 702  */ 		defaultMessage: function( element, method ) {
/* 703  */ 			return this.findDefined(
/* 704  */ 				this.customMessage( element.name, method ),
/* 705  */ 				this.customDataMessage( element, method ),
/* 706  */ 				// title is never undefined, so handle empty string as undefined
/* 707  */ 				!this.settings.ignoreTitle && element.title || undefined,
/* 708  */ 				$.validator.messages[ method ],
/* 709  */ 				"<strong>Warning: No message defined for " + element.name + "</strong>"
/* 710  */ 			);
/* 711  */ 		},
/* 712  */ 
/* 713  */ 		formatAndAdd: function( element, rule ) {
/* 714  */ 			var message = this.defaultMessage( element, rule.method ),
/* 715  */ 				theregex = /\$?\{(\d+)\}/g;
/* 716  */ 			if ( typeof message === "function" ) {
/* 717  */ 				message = message.call( this, rule.parameters, element );
/* 718  */ 			} else if ( theregex.test( message ) ) {
/* 719  */ 				message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
/* 720  */ 			}
/* 721  */ 			this.errorList.push({
/* 722  */ 				message: message,
/* 723  */ 				element: element,
/* 724  */ 				method: rule.method
/* 725  */ 			});
/* 726  */ 
/* 727  */ 			this.errorMap[ element.name ] = message;
/* 728  */ 			this.submitted[ element.name ] = message;
/* 729  */ 		},
/* 730  */ 
/* 731  */ 		addWrapper: function( toToggle ) {
/* 732  */ 			if ( this.settings.wrapper ) {
/* 733  */ 				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
/* 734  */ 			}
/* 735  */ 			return toToggle;
/* 736  */ 		},
/* 737  */ 
/* 738  */ 		defaultShowErrors: function() {
/* 739  */ 			var i, elements, error;
/* 740  */ 			for ( i = 0; this.errorList[ i ]; i++ ) {
/* 741  */ 				error = this.errorList[ i ];
/* 742  */ 				if ( this.settings.highlight ) {
/* 743  */ 					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
/* 744  */ 				}
/* 745  */ 				this.showLabel( error.element, error.message );
/* 746  */ 			}
/* 747  */ 			if ( this.errorList.length ) {
/* 748  */ 				this.toShow = this.toShow.add( this.containers );
/* 749  */ 			}
/* 750  */ 			if ( this.settings.success ) {

/* jquery.validate.js */

/* 751  */ 				for ( i = 0; this.successList[ i ]; i++ ) {
/* 752  */ 					this.showLabel( this.successList[ i ] );
/* 753  */ 				}
/* 754  */ 			}
/* 755  */ 			if ( this.settings.unhighlight ) {
/* 756  */ 				for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
/* 757  */ 					this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
/* 758  */ 				}
/* 759  */ 			}
/* 760  */ 			this.toHide = this.toHide.not( this.toShow );
/* 761  */ 			this.hideErrors();
/* 762  */ 			this.addWrapper( this.toShow ).show();
/* 763  */ 		},
/* 764  */ 
/* 765  */ 		validElements: function() {
/* 766  */ 			return this.currentElements.not( this.invalidElements() );
/* 767  */ 		},
/* 768  */ 
/* 769  */ 		invalidElements: function() {
/* 770  */ 			return $( this.errorList ).map(function() {
/* 771  */ 				return this.element;
/* 772  */ 			});
/* 773  */ 		},
/* 774  */ 
/* 775  */ 		showLabel: function( element, message ) {
/* 776  */ 			var place, group, errorID,
/* 777  */ 				error = this.errorsFor( element ),
/* 778  */ 				elementID = this.idOrName( element ),
/* 779  */ 				describedBy = $( element ).attr( "aria-describedby" );
/* 780  */ 			if ( error.length ) {
/* 781  */ 				// refresh error/success class
/* 782  */ 				error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
/* 783  */ 				// replace message on existing label
/* 784  */ 				error.html( message );
/* 785  */ 			} else {
/* 786  */ 				// create error element
/* 787  */ 				error = $( "<" + this.settings.errorElement + ">" )
/* 788  */ 					.attr( "id", elementID + "-error" )
/* 789  */ 					.addClass( this.settings.errorClass )
/* 790  */ 					.html( message || "" );
/* 791  */ 
/* 792  */ 				// Maintain reference to the element to be placed into the DOM
/* 793  */ 				place = error;
/* 794  */ 				if ( this.settings.wrapper ) {
/* 795  */ 					// make sure the element is visible, even in IE
/* 796  */ 					// actually showing the wrapped element is handled elsewhere
/* 797  */ 					place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
/* 798  */ 				}
/* 799  */ 				if ( this.labelContainer.length ) {
/* 800  */ 					this.labelContainer.append( place );

/* jquery.validate.js */

/* 801  */ 				} else if ( this.settings.errorPlacement ) {
/* 802  */ 					this.settings.errorPlacement( place, $( element ) );
/* 803  */ 				} else {
/* 804  */ 					place.insertAfter( element );
/* 805  */ 				}
/* 806  */ 
/* 807  */ 				// Link error back to the element
/* 808  */ 				if ( error.is( "label" ) ) {
/* 809  */ 					// If the error is a label, then associate using 'for'
/* 810  */ 					error.attr( "for", elementID );
/* 811  */ 				} else if ( error.parents( "label[for='" + elementID + "']" ).length === 0 ) {
/* 812  */ 					// If the element is not a child of an associated label, then it's necessary
/* 813  */ 					// to explicitly apply aria-describedby
/* 814  */ 
/* 815  */ 					errorID = error.attr( "id" ).replace( /(:|\.|\[|\]|\$)/g, "\\$1");
/* 816  */ 					// Respect existing non-error aria-describedby
/* 817  */ 					if ( !describedBy ) {
/* 818  */ 						describedBy = errorID;
/* 819  */ 					} else if ( !describedBy.match( new RegExp( "\\b" + errorID + "\\b" ) ) ) {
/* 820  */ 						// Add to end of list if not already present
/* 821  */ 						describedBy += " " + errorID;
/* 822  */ 					}
/* 823  */ 					$( element ).attr( "aria-describedby", describedBy );
/* 824  */ 
/* 825  */ 					// If this element is grouped, then assign to all elements in the same group
/* 826  */ 					group = this.groups[ element.name ];
/* 827  */ 					if ( group ) {
/* 828  */ 						$.each( this.groups, function( name, testgroup ) {
/* 829  */ 							if ( testgroup === group ) {
/* 830  */ 								$( "[name='" + name + "']", this.currentForm )
/* 831  */ 									.attr( "aria-describedby", error.attr( "id" ) );
/* 832  */ 							}
/* 833  */ 						});
/* 834  */ 					}
/* 835  */ 				}
/* 836  */ 			}
/* 837  */ 			if ( !message && this.settings.success ) {
/* 838  */ 				error.text( "" );
/* 839  */ 				if ( typeof this.settings.success === "string" ) {
/* 840  */ 					error.addClass( this.settings.success );
/* 841  */ 				} else {
/* 842  */ 					this.settings.success( error, element );
/* 843  */ 				}
/* 844  */ 			}
/* 845  */ 			this.toShow = this.toShow.add( error );
/* 846  */ 		},
/* 847  */ 
/* 848  */ 		errorsFor: function( element ) {
/* 849  */ 			var name = this.idOrName( element ),
/* 850  */ 				describer = $( element ).attr( "aria-describedby" ),

/* jquery.validate.js */

/* 851  */ 				selector = "label[for='" + name + "'], label[for='" + name + "'] *";
/* 852  */ 
/* 853  */ 			// aria-describedby should directly reference the error element
/* 854  */ 			if ( describer ) {
/* 855  */ 				selector = selector + ", #" + describer.replace( /\s+/g, ", #" );
/* 856  */ 			}
/* 857  */ 			return this
/* 858  */ 				.errors()
/* 859  */ 				.filter( selector );
/* 860  */ 		},
/* 861  */ 
/* 862  */ 		idOrName: function( element ) {
/* 863  */ 			return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
/* 864  */ 		},
/* 865  */ 
/* 866  */ 		validationTargetFor: function( element ) {
/* 867  */ 
/* 868  */ 			// If radio/checkbox, validate first element in group instead
/* 869  */ 			if ( this.checkable( element ) ) {
/* 870  */ 				element = this.findByName( element.name );
/* 871  */ 			}
/* 872  */ 
/* 873  */ 			// Always apply ignore filter
/* 874  */ 			return $( element ).not( this.settings.ignore )[ 0 ];
/* 875  */ 		},
/* 876  */ 
/* 877  */ 		checkable: function( element ) {
/* 878  */ 			return ( /radio|checkbox/i ).test( element.type );
/* 879  */ 		},
/* 880  */ 
/* 881  */ 		findByName: function( name ) {
/* 882  */ 			return $( this.currentForm ).find( "[name='" + name + "']" );
/* 883  */ 		},
/* 884  */ 
/* 885  */ 		getLength: function( value, element ) {
/* 886  */ 			switch ( element.nodeName.toLowerCase() ) {
/* 887  */ 			case "select":
/* 888  */ 				return $( "option:selected", element ).length;
/* 889  */ 			case "input":
/* 890  */ 				if ( this.checkable( element ) ) {
/* 891  */ 					return this.findByName( element.name ).filter( ":checked" ).length;
/* 892  */ 				}
/* 893  */ 			}
/* 894  */ 			return value.length;
/* 895  */ 		},
/* 896  */ 
/* 897  */ 		depend: function( param, element ) {
/* 898  */ 			return this.dependTypes[typeof param] ? this.dependTypes[typeof param]( param, element ) : true;
/* 899  */ 		},
/* 900  */ 

/* jquery.validate.js */

/* 901  */ 		dependTypes: {
/* 902  */ 			"boolean": function( param ) {
/* 903  */ 				return param;
/* 904  */ 			},
/* 905  */ 			"string": function( param, element ) {
/* 906  */ 				return !!$( param, element.form ).length;
/* 907  */ 			},
/* 908  */ 			"function": function( param, element ) {
/* 909  */ 				return param( element );
/* 910  */ 			}
/* 911  */ 		},
/* 912  */ 
/* 913  */ 		optional: function( element ) {
/* 914  */ 			var val = this.elementValue( element );
/* 915  */ 			return !$.validator.methods.required.call( this, val, element ) && "dependency-mismatch";
/* 916  */ 		},
/* 917  */ 
/* 918  */ 		startRequest: function( element ) {
/* 919  */ 			if ( !this.pending[ element.name ] ) {
/* 920  */ 				this.pendingRequest++;
/* 921  */ 				this.pending[ element.name ] = true;
/* 922  */ 			}
/* 923  */ 		},
/* 924  */ 
/* 925  */ 		stopRequest: function( element, valid ) {
/* 926  */ 			this.pendingRequest--;
/* 927  */ 			// sometimes synchronization fails, make sure pendingRequest is never < 0
/* 928  */ 			if ( this.pendingRequest < 0 ) {
/* 929  */ 				this.pendingRequest = 0;
/* 930  */ 			}
/* 931  */ 			delete this.pending[ element.name ];
/* 932  */ 			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
/* 933  */ 				$( this.currentForm ).submit();
/* 934  */ 				this.formSubmitted = false;
/* 935  */ 			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted ) {
/* 936  */ 				$( this.currentForm ).triggerHandler( "invalid-form", [ this ]);
/* 937  */ 				this.formSubmitted = false;
/* 938  */ 			}
/* 939  */ 		},
/* 940  */ 
/* 941  */ 		previousValue: function( element ) {
/* 942  */ 			return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
/* 943  */ 				old: null,
/* 944  */ 				valid: true,
/* 945  */ 				message: this.defaultMessage( element, "remote" )
/* 946  */ 			});
/* 947  */ 		},
/* 948  */ 
/* 949  */ 		// cleans up all forms and elements, removes validator-specific events
/* 950  */ 		destroy: function() {

/* jquery.validate.js */

/* 951  */ 			this.resetForm();
/* 952  */ 
/* 953  */ 			$( this.currentForm )
/* 954  */ 				.off( ".validate" )
/* 955  */ 				.removeData( "validator" );
/* 956  */ 		}
/* 957  */ 
/* 958  */ 	},
/* 959  */ 
/* 960  */ 	classRuleSettings: {
/* 961  */ 		required: { required: true },
/* 962  */ 		email: { email: true },
/* 963  */ 		url: { url: true },
/* 964  */ 		date: { date: true },
/* 965  */ 		dateISO: { dateISO: true },
/* 966  */ 		number: { number: true },
/* 967  */ 		digits: { digits: true },
/* 968  */ 		creditcard: { creditcard: true }
/* 969  */ 	},
/* 970  */ 
/* 971  */ 	addClassRules: function( className, rules ) {
/* 972  */ 		if ( className.constructor === String ) {
/* 973  */ 			this.classRuleSettings[ className ] = rules;
/* 974  */ 		} else {
/* 975  */ 			$.extend( this.classRuleSettings, className );
/* 976  */ 		}
/* 977  */ 	},
/* 978  */ 
/* 979  */ 	classRules: function( element ) {
/* 980  */ 		var rules = {},
/* 981  */ 			classes = $( element ).attr( "class" );
/* 982  */ 
/* 983  */ 		if ( classes ) {
/* 984  */ 			$.each( classes.split( " " ), function() {
/* 985  */ 				if ( this in $.validator.classRuleSettings ) {
/* 986  */ 					$.extend( rules, $.validator.classRuleSettings[ this ]);
/* 987  */ 				}
/* 988  */ 			});
/* 989  */ 		}
/* 990  */ 		return rules;
/* 991  */ 	},
/* 992  */ 
/* 993  */ 	normalizeAttributeRule: function( rules, type, method, value ) {
/* 994  */ 
/* 995  */ 		// convert the value to a number for number inputs, and for text for backwards compability
/* 996  */ 		// allows type="date" and others to be compared as strings
/* 997  */ 		if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
/* 998  */ 			value = Number( value );
/* 999  */ 
/* 1000 */ 			// Support Opera Mini, which returns NaN for undefined minlength

/* jquery.validate.js */

/* 1001 */ 			if ( isNaN( value ) ) {
/* 1002 */ 				value = undefined;
/* 1003 */ 			}
/* 1004 */ 		}
/* 1005 */ 
/* 1006 */ 		if ( value || value === 0 ) {
/* 1007 */ 			rules[ method ] = value;
/* 1008 */ 		} else if ( type === method && type !== "range" ) {
/* 1009 */ 
/* 1010 */ 			// exception: the jquery validate 'range' method
/* 1011 */ 			// does not test for the html5 'range' type
/* 1012 */ 			rules[ method ] = true;
/* 1013 */ 		}
/* 1014 */ 	},
/* 1015 */ 
/* 1016 */ 	attributeRules: function( element ) {
/* 1017 */ 		var rules = {},
/* 1018 */ 			$element = $( element ),
/* 1019 */ 			type = element.getAttribute( "type" ),
/* 1020 */ 			method, value;
/* 1021 */ 
/* 1022 */ 		for ( method in $.validator.methods ) {
/* 1023 */ 
/* 1024 */ 			// support for <input required> in both html5 and older browsers
/* 1025 */ 			if ( method === "required" ) {
/* 1026 */ 				value = element.getAttribute( method );
/* 1027 */ 
/* 1028 */ 				// Some browsers return an empty string for the required attribute
/* 1029 */ 				// and non-HTML5 browsers might have required="" markup
/* 1030 */ 				if ( value === "" ) {
/* 1031 */ 					value = true;
/* 1032 */ 				}
/* 1033 */ 
/* 1034 */ 				// force non-HTML5 browsers to return bool
/* 1035 */ 				value = !!value;
/* 1036 */ 			} else {
/* 1037 */ 				value = $element.attr( method );
/* 1038 */ 			}
/* 1039 */ 
/* 1040 */ 			this.normalizeAttributeRule( rules, type, method, value );
/* 1041 */ 		}
/* 1042 */ 
/* 1043 */ 		// maxlength may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
/* 1044 */ 		if ( rules.maxlength && /-1|2147483647|524288/.test( rules.maxlength ) ) {
/* 1045 */ 			delete rules.maxlength;
/* 1046 */ 		}
/* 1047 */ 
/* 1048 */ 		return rules;
/* 1049 */ 	},
/* 1050 */ 

/* jquery.validate.js */

/* 1051 */ 	dataRules: function( element ) {
/* 1052 */ 		var rules = {},
/* 1053 */ 			$element = $( element ),
/* 1054 */ 			type = element.getAttribute( "type" ),
/* 1055 */ 			method, value;
/* 1056 */ 
/* 1057 */ 		for ( method in $.validator.methods ) {
/* 1058 */ 			value = $element.data( "rule" + method.charAt( 0 ).toUpperCase() + method.substring( 1 ).toLowerCase() );
/* 1059 */ 			this.normalizeAttributeRule( rules, type, method, value );
/* 1060 */ 		}
/* 1061 */ 		return rules;
/* 1062 */ 	},
/* 1063 */ 
/* 1064 */ 	staticRules: function( element ) {
/* 1065 */ 		var rules = {},
/* 1066 */ 			validator = $.data( element.form, "validator" );
/* 1067 */ 
/* 1068 */ 		if ( validator.settings.rules ) {
/* 1069 */ 			rules = $.validator.normalizeRule( validator.settings.rules[ element.name ] ) || {};
/* 1070 */ 		}
/* 1071 */ 		return rules;
/* 1072 */ 	},
/* 1073 */ 
/* 1074 */ 	normalizeRules: function( rules, element ) {
/* 1075 */ 		// handle dependency check
/* 1076 */ 		$.each( rules, function( prop, val ) {
/* 1077 */ 			// ignore rule when param is explicitly false, eg. required:false
/* 1078 */ 			if ( val === false ) {
/* 1079 */ 				delete rules[ prop ];
/* 1080 */ 				return;
/* 1081 */ 			}
/* 1082 */ 			if ( val.param || val.depends ) {
/* 1083 */ 				var keepRule = true;
/* 1084 */ 				switch ( typeof val.depends ) {
/* 1085 */ 				case "string":
/* 1086 */ 					keepRule = !!$( val.depends, element.form ).length;
/* 1087 */ 					break;
/* 1088 */ 				case "function":
/* 1089 */ 					keepRule = val.depends.call( element, element );
/* 1090 */ 					break;
/* 1091 */ 				}
/* 1092 */ 				if ( keepRule ) {
/* 1093 */ 					rules[ prop ] = val.param !== undefined ? val.param : true;
/* 1094 */ 				} else {
/* 1095 */ 					delete rules[ prop ];
/* 1096 */ 				}
/* 1097 */ 			}
/* 1098 */ 		});
/* 1099 */ 
/* 1100 */ 		// evaluate parameters

/* jquery.validate.js */

/* 1101 */ 		$.each( rules, function( rule, parameter ) {
/* 1102 */ 			rules[ rule ] = $.isFunction( parameter ) ? parameter( element ) : parameter;
/* 1103 */ 		});
/* 1104 */ 
/* 1105 */ 		// clean number parameters
/* 1106 */ 		$.each([ "minlength", "maxlength" ], function() {
/* 1107 */ 			if ( rules[ this ] ) {
/* 1108 */ 				rules[ this ] = Number( rules[ this ] );
/* 1109 */ 			}
/* 1110 */ 		});
/* 1111 */ 		$.each([ "rangelength", "range" ], function() {
/* 1112 */ 			var parts;
/* 1113 */ 			if ( rules[ this ] ) {
/* 1114 */ 				if ( $.isArray( rules[ this ] ) ) {
/* 1115 */ 					rules[ this ] = [ Number( rules[ this ][ 0 ]), Number( rules[ this ][ 1 ] ) ];
/* 1116 */ 				} else if ( typeof rules[ this ] === "string" ) {
/* 1117 */ 					parts = rules[ this ].replace(/[\[\]]/g, "" ).split( /[\s,]+/ );
/* 1118 */ 					rules[ this ] = [ Number( parts[ 0 ]), Number( parts[ 1 ] ) ];
/* 1119 */ 				}
/* 1120 */ 			}
/* 1121 */ 		});
/* 1122 */ 
/* 1123 */ 		if ( $.validator.autoCreateRanges ) {
/* 1124 */ 			// auto-create ranges
/* 1125 */ 			if ( rules.min != null && rules.max != null ) {
/* 1126 */ 				rules.range = [ rules.min, rules.max ];
/* 1127 */ 				delete rules.min;
/* 1128 */ 				delete rules.max;
/* 1129 */ 			}
/* 1130 */ 			if ( rules.minlength != null && rules.maxlength != null ) {
/* 1131 */ 				rules.rangelength = [ rules.minlength, rules.maxlength ];
/* 1132 */ 				delete rules.minlength;
/* 1133 */ 				delete rules.maxlength;
/* 1134 */ 			}
/* 1135 */ 		}
/* 1136 */ 
/* 1137 */ 		return rules;
/* 1138 */ 	},
/* 1139 */ 
/* 1140 */ 	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
/* 1141 */ 	normalizeRule: function( data ) {
/* 1142 */ 		if ( typeof data === "string" ) {
/* 1143 */ 			var transformed = {};
/* 1144 */ 			$.each( data.split( /\s/ ), function() {
/* 1145 */ 				transformed[ this ] = true;
/* 1146 */ 			});
/* 1147 */ 			data = transformed;
/* 1148 */ 		}
/* 1149 */ 		return data;
/* 1150 */ 	},

/* jquery.validate.js */

/* 1151 */ 
/* 1152 */ 	// http://jqueryvalidation.org/jQuery.validator.addMethod/
/* 1153 */ 	addMethod: function( name, method, message ) {
/* 1154 */ 		$.validator.methods[ name ] = method;
/* 1155 */ 		$.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
/* 1156 */ 		if ( method.length < 3 ) {
/* 1157 */ 			$.validator.addClassRules( name, $.validator.normalizeRule( name ) );
/* 1158 */ 		}
/* 1159 */ 	},
/* 1160 */ 
/* 1161 */ 	methods: {
/* 1162 */ 
/* 1163 */ 		// http://jqueryvalidation.org/required-method/
/* 1164 */ 		required: function( value, element, param ) {
/* 1165 */ 			// check if dependency is met
/* 1166 */ 			if ( !this.depend( param, element ) ) {
/* 1167 */ 				return "dependency-mismatch";
/* 1168 */ 			}
/* 1169 */ 			if ( element.nodeName.toLowerCase() === "select" ) {
/* 1170 */ 				// could be an array for select-multiple or a string, both are fine this way
/* 1171 */ 				var val = $( element ).val();
/* 1172 */ 				return val && val.length > 0;
/* 1173 */ 			}
/* 1174 */ 			if ( this.checkable( element ) ) {
/* 1175 */ 				return this.getLength( value, element ) > 0;
/* 1176 */ 			}
/* 1177 */ 			return value.length > 0;
/* 1178 */ 		},
/* 1179 */ 
/* 1180 */ 		// http://jqueryvalidation.org/email-method/
/* 1181 */ 		email: function( value, element ) {
/* 1182 */ 			// From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
/* 1183 */ 			// Retrieved 2014-01-14
/* 1184 */ 			// If you have a problem with this implementation, report a bug against the above spec
/* 1185 */ 			// Or use custom methods to implement your own email validation
/* 1186 */ 			return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
/* 1187 */ 		},
/* 1188 */ 
/* 1189 */ 		// http://jqueryvalidation.org/url-method/
/* 1190 */ 		url: function( value, element ) {
/* 1191 */ 
/* 1192 */ 			// Copyright (c) 2010-2013 Diego Perini, MIT licensed
/* 1193 */ 			// https://gist.github.com/dperini/729294
/* 1194 */ 			// see also https://mathiasbynens.be/demo/url-regex
/* 1195 */ 			// modified to allow protocol-relative URLs
/* 1196 */ 			return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
/* 1197 */ 		},
/* 1198 */ 
/* 1199 */ 		// http://jqueryvalidation.org/date-method/
/* 1200 */ 		date: function( value, element ) {

/* jquery.validate.js */

/* 1201 */ 			return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
/* 1202 */ 		},
/* 1203 */ 
/* 1204 */ 		// http://jqueryvalidation.org/dateISO-method/
/* 1205 */ 		dateISO: function( value, element ) {
/* 1206 */ 			return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
/* 1207 */ 		},
/* 1208 */ 
/* 1209 */ 		// http://jqueryvalidation.org/number-method/
/* 1210 */ 		number: function( value, element ) {
/* 1211 */ 			return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
/* 1212 */ 		},
/* 1213 */ 
/* 1214 */ 		// http://jqueryvalidation.org/digits-method/
/* 1215 */ 		digits: function( value, element ) {
/* 1216 */ 			return this.optional( element ) || /^\d+$/.test( value );
/* 1217 */ 		},
/* 1218 */ 
/* 1219 */ 		// http://jqueryvalidation.org/creditcard-method/
/* 1220 */ 		// based on http://en.wikipedia.org/wiki/Luhn_algorithm
/* 1221 */ 		creditcard: function( value, element ) {
/* 1222 */ 			if ( this.optional( element ) ) {
/* 1223 */ 				return "dependency-mismatch";
/* 1224 */ 			}
/* 1225 */ 			// accept only spaces, digits and dashes
/* 1226 */ 			if ( /[^0-9 \-]+/.test( value ) ) {
/* 1227 */ 				return false;
/* 1228 */ 			}
/* 1229 */ 			var nCheck = 0,
/* 1230 */ 				nDigit = 0,
/* 1231 */ 				bEven = false,
/* 1232 */ 				n, cDigit;
/* 1233 */ 
/* 1234 */ 			value = value.replace( /\D/g, "" );
/* 1235 */ 
/* 1236 */ 			// Basing min and max length on
/* 1237 */ 			// http://developer.ean.com/general_info/Valid_Credit_Card_Types
/* 1238 */ 			if ( value.length < 13 || value.length > 19 ) {
/* 1239 */ 				return false;
/* 1240 */ 			}
/* 1241 */ 
/* 1242 */ 			for ( n = value.length - 1; n >= 0; n--) {
/* 1243 */ 				cDigit = value.charAt( n );
/* 1244 */ 				nDigit = parseInt( cDigit, 10 );
/* 1245 */ 				if ( bEven ) {
/* 1246 */ 					if ( ( nDigit *= 2 ) > 9 ) {
/* 1247 */ 						nDigit -= 9;
/* 1248 */ 					}
/* 1249 */ 				}
/* 1250 */ 				nCheck += nDigit;

/* jquery.validate.js */

/* 1251 */ 				bEven = !bEven;
/* 1252 */ 			}
/* 1253 */ 
/* 1254 */ 			return ( nCheck % 10 ) === 0;
/* 1255 */ 		},
/* 1256 */ 
/* 1257 */ 		// http://jqueryvalidation.org/minlength-method/
/* 1258 */ 		minlength: function( value, element, param ) {
/* 1259 */ 			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
/* 1260 */ 			return this.optional( element ) || length >= param;
/* 1261 */ 		},
/* 1262 */ 
/* 1263 */ 		// http://jqueryvalidation.org/maxlength-method/
/* 1264 */ 		maxlength: function( value, element, param ) {
/* 1265 */ 			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
/* 1266 */ 			return this.optional( element ) || length <= param;
/* 1267 */ 		},
/* 1268 */ 
/* 1269 */ 		// http://jqueryvalidation.org/rangelength-method/
/* 1270 */ 		rangelength: function( value, element, param ) {
/* 1271 */ 			var length = $.isArray( value ) ? value.length : this.getLength( value, element );
/* 1272 */ 			return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
/* 1273 */ 		},
/* 1274 */ 
/* 1275 */ 		// http://jqueryvalidation.org/min-method/
/* 1276 */ 		min: function( value, element, param ) {
/* 1277 */ 			return this.optional( element ) || value >= param;
/* 1278 */ 		},
/* 1279 */ 
/* 1280 */ 		// http://jqueryvalidation.org/max-method/
/* 1281 */ 		max: function( value, element, param ) {
/* 1282 */ 			return this.optional( element ) || value <= param;
/* 1283 */ 		},
/* 1284 */ 
/* 1285 */ 		// http://jqueryvalidation.org/range-method/
/* 1286 */ 		range: function( value, element, param ) {
/* 1287 */ 			return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
/* 1288 */ 		},
/* 1289 */ 
/* 1290 */ 		// http://jqueryvalidation.org/equalTo-method/
/* 1291 */ 		equalTo: function( value, element, param ) {
/* 1292 */ 			// bind to the blur event of the target in order to revalidate whenever the target field is updated
/* 1293 */ 			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
/* 1294 */ 			var target = $( param );
/* 1295 */ 			if ( this.settings.onfocusout ) {
/* 1296 */ 				target.off( ".validate-equalTo" ).on( "blur.validate-equalTo", function() {
/* 1297 */ 					$( element ).valid();
/* 1298 */ 				});
/* 1299 */ 			}
/* 1300 */ 			return value === target.val();

/* jquery.validate.js */

/* 1301 */ 		},
/* 1302 */ 
/* 1303 */ 		// http://jqueryvalidation.org/remote-method/
/* 1304 */ 		remote: function( value, element, param ) {
/* 1305 */ 			if ( this.optional( element ) ) {
/* 1306 */ 				return "dependency-mismatch";
/* 1307 */ 			}
/* 1308 */ 
/* 1309 */ 			var previous = this.previousValue( element ),
/* 1310 */ 				validator, data;
/* 1311 */ 
/* 1312 */ 			if (!this.settings.messages[ element.name ] ) {
/* 1313 */ 				this.settings.messages[ element.name ] = {};
/* 1314 */ 			}
/* 1315 */ 			previous.originalMessage = this.settings.messages[ element.name ].remote;
/* 1316 */ 			this.settings.messages[ element.name ].remote = previous.message;
/* 1317 */ 
/* 1318 */ 			param = typeof param === "string" && { url: param } || param;
/* 1319 */ 
/* 1320 */ 			if ( previous.old === value ) {
/* 1321 */ 				return previous.valid;
/* 1322 */ 			}
/* 1323 */ 
/* 1324 */ 			previous.old = value;
/* 1325 */ 			validator = this;
/* 1326 */ 			this.startRequest( element );
/* 1327 */ 			data = {};
/* 1328 */ 			data[ element.name ] = value;
/* 1329 */ 			$.ajax( $.extend( true, {
/* 1330 */ 				mode: "abort",
/* 1331 */ 				port: "validate" + element.name,
/* 1332 */ 				dataType: "json",
/* 1333 */ 				data: data,
/* 1334 */ 				context: validator.currentForm,
/* 1335 */ 				success: function( response ) {
/* 1336 */ 					var valid = response === true || response === "true",
/* 1337 */ 						errors, message, submitted;
/* 1338 */ 
/* 1339 */ 					validator.settings.messages[ element.name ].remote = previous.originalMessage;
/* 1340 */ 					if ( valid ) {
/* 1341 */ 						submitted = validator.formSubmitted;
/* 1342 */ 						validator.prepareElement( element );
/* 1343 */ 						validator.formSubmitted = submitted;
/* 1344 */ 						validator.successList.push( element );
/* 1345 */ 						delete validator.invalid[ element.name ];
/* 1346 */ 						validator.showErrors();
/* 1347 */ 					} else {
/* 1348 */ 						errors = {};
/* 1349 */ 						message = response || validator.defaultMessage( element, "remote" );
/* 1350 */ 						errors[ element.name ] = previous.message = $.isFunction( message ) ? message( value ) : message;

/* jquery.validate.js */

/* 1351 */ 						validator.invalid[ element.name ] = true;
/* 1352 */ 						validator.showErrors( errors );
/* 1353 */ 					}
/* 1354 */ 					previous.valid = valid;
/* 1355 */ 					validator.stopRequest( element, valid );
/* 1356 */ 				}
/* 1357 */ 			}, param ) );
/* 1358 */ 			return "pending";
/* 1359 */ 		}
/* 1360 */ 	}
/* 1361 */ 
/* 1362 */ });
/* 1363 */ 
/* 1364 */ // ajax mode: abort
/* 1365 */ // usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
/* 1366 */ // if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
/* 1367 */ 
/* 1368 */ var pendingRequests = {},
/* 1369 */ 	ajax;
/* 1370 */ // Use a prefilter if available (1.5+)
/* 1371 */ if ( $.ajaxPrefilter ) {
/* 1372 */ 	$.ajaxPrefilter(function( settings, _, xhr ) {
/* 1373 */ 		var port = settings.port;
/* 1374 */ 		if ( settings.mode === "abort" ) {
/* 1375 */ 			if ( pendingRequests[port] ) {
/* 1376 */ 				pendingRequests[port].abort();
/* 1377 */ 			}
/* 1378 */ 			pendingRequests[port] = xhr;
/* 1379 */ 		}
/* 1380 */ 	});
/* 1381 */ } else {
/* 1382 */ 	// Proxy ajax
/* 1383 */ 	ajax = $.ajax;
/* 1384 */ 	$.ajax = function( settings ) {
/* 1385 */ 		var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
/* 1386 */ 			port = ( "port" in settings ? settings : $.ajaxSettings ).port;
/* 1387 */ 		if ( mode === "abort" ) {
/* 1388 */ 			if ( pendingRequests[port] ) {
/* 1389 */ 				pendingRequests[port].abort();
/* 1390 */ 			}
/* 1391 */ 			pendingRequests[port] = ajax.apply(this, arguments);
/* 1392 */ 			return pendingRequests[port];
/* 1393 */ 		}
/* 1394 */ 		return ajax.apply(this, arguments);
/* 1395 */ 	};
/* 1396 */ }
/* 1397 */ 
/* 1398 */ }));

;
/* loginvalidation.js */

/* 1   */ jQuery(window).load(function() {
/* 2   */     // this code runs after the page finished loading
/* 3   */    //    $("#af_redirect_id").val('checkout');
/* 4   */  
/* 5   */     try{
/* 6   */         
/* 7   */     //    alert(jQuery("#af_redirect_id").val());
/* 8   */         
/* 9   */         
/* 10  */         jQuery("#addto_basket_continue").click(function(){
/* 11  */       
/* 12  */       
/* 13  */       if(jQuery("#pa_package_size").val()==""){
/* 14  */           jQuery("#pa_package_size").addClass('validation-failed');
/* 15  */             jQuery("#pa_package_size").append('<div class="validation-advice" id="advice-required-entry-attribute970">This is a required field.</div>');
/* 16  */           
/* 17  */           
/* 18  */          // alert('Please Select a Package Size');
/* 19  */       }else{
/* 20  */         jQuery("#af_redirect_id").val('countinue');
/* 21  */         //  alert('1');
/* 22  */         //  alert('set');
/* 23  */          jQuery("#addto_basket_continue").attr('type','submit');
/* 24  */          jQuery("#addto_basket_continue").submit();
/* 25  */      }
/* 26  */         
/* 27  */     });
/* 28  */      jQuery("#addto_basket_chechout").click(function(){
/* 29  */        if(jQuery("#pa_package_size").val()==""){
/* 30  */                 jQuery("#pa_package_size").addClass('validation-failed');
/* 31  */             jQuery("#pa_package_size").append('<div class="validation-advice" id="advice-required-entry-attribute970">This is a required field.</div>');
/* 32  */           
/* 33  */       }else{
/* 34  */         jQuery("#af_redirect_id").val('checkout');
/* 35  */        //   alert('2');
/* 36  */          jQuery("#addto_basket_chechout").attr('type','submit');
/* 37  */          jQuery("#addto_basket_chechout").submit();
/* 38  */      }
/* 39  */     });
/* 40  */         
/* 41  */     }catch(e){
/* 42  */         alert(e);
/* 43  */     }
/* 44  */  
/* 45  */ });  
/* 46  */ 
/* 47  */     
/* 48  */        jQuery(function($) {
/* 49  */ try{
/* 50  */     

/* loginvalidation.js */

/* 51  */  $("#registeraiom").validate({
/* 52  */ 			rules: {
/* 53  */ 				first_name: "required",
/* 54  */                                 last_name: "required",
/* 55  */ 			 
/* 56  */ 				reg_password: {
/* 57  */ 					required: true,
/* 58  */ 					minlength: 5
/* 59  */ 				},
/* 60  */ 				cpassword: {
/* 61  */ 					required: true,
/* 62  */ 					minlength: 5,
/* 63  */                                          equalTo: "#reg_password"
/* 64  */ 				},
/* 65  */ 				email: {
/* 66  */ 					required: true,
/* 67  */ 					email: true,
/* 68  */                                      
/* 69  */ 				},
/* 70  */                                
/* 71  */ 				agree: "required",
/* 72  */                                 is_subscribed:"required"
/* 73  */ 			},
/* 74  */ 			messages: {
/* 75  */ 				first_name: "Please enter your First name",
/* 76  */                                 last_name: "Please enter your Last name",
/* 77  */ 				
/* 78  */ 				reg_password: {
/* 79  */ 					required: "Please provide a password",
/* 80  */ 					minlength: "Your password must be at least 5 characters long"
/* 81  */ 				},
/* 82  */ 				cpassword: {
/* 83  */ 					required: "Please provide a password",
/* 84  */ 					minlength: "Your password must be at least 5 characters long",
/* 85  */ 					equalTo: "Please enter the same password as above"
/* 86  */ 				},mobile:{
/* 87  */                                    required: "Please provide a Mobile Number",
/* 88  */                                     minlength:"Please provide a Mobile Number",
/* 89  */                                           maxlength:"Please provide a Mobile Number",
/* 90  */ 					digits: "Please enter numbers only" 
/* 91  */                                 },
/* 92  */ 				email: {
/* 93  */                                     
/* 94  */              required : "Please enter a valid email address",
/* 95  */               email : "Please enter a valid email address",
/* 96  */             
/* 97  */                                 },
/* 98  */ 				agree: "Please accept our policy",
/* 99  */                                 is_subscribed:"This is a required field."
/* 100 */ 

/* loginvalidation.js */

/* 101 */ 			},  onkeyup: false
/* 102 */                         ,
/* 103 */         errorPlacement: function (error, element) {
/* 104 */             if (element.attr("type") == "checkbox") {
/* 105 */                  error.insertAfter($(element).closest("span"));
/* 106 */             } else {
/* 107 */                 // something else
/* 108 */             }
/* 109 */         }
/* 110 */ 		});
/* 111 */                  //  console.info($('#registeraiom').valid());
/* 112 */                //alert($("#registeraiom").valid());
/* 113 */                 }catch(e){
/* 114 */                     alert(e);
/* 115 */                 }
/* 116 */ });
/* 117 */ 
/* 118 */ 
/* 119 */ 
