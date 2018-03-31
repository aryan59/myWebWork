
/* add-to-cart.js */

/* 1   */ /*!
/* 2   *|  * WooCommerce Add to Cart JS
/* 3   *|  */
/* 4   */ jQuery( function( $ ) {
/* 5   */ 
/* 6   */ 	/* global jQuery, wc_add_to_cart_params */
/* 7   */ 	if ( typeof wc_add_to_cart_params === 'undefined' ) {
/* 8   */ 		return false;
/* 9   */ 	}
/* 10  */ 
/* 11  */ 	// Ajax add to cart
/* 12  */ 	$( document ).on( 'click', '.add_to_cart_button', function() {
/* 13  */ 
/* 14  */ 		// AJAX add to cart request
/* 15  */ 		var $thisbutton = $( this );
/* 16  */ 
/* 17  */ 		if ( $thisbutton.is( '.ajax_add_to_cart' ) ) {
/* 18  */ 
/* 19  */ 			if ( ! $thisbutton.attr( 'data-product_id' ) ) {
/* 20  */ 				return true;
/* 21  */ 			}
/* 22  */ 
/* 23  */ 			$thisbutton.removeClass( 'added' );
/* 24  */ 			$thisbutton.addClass( 'loading' );
/* 25  */ 
/* 26  */ 			var data = {};
/* 27  */ 
/* 28  */ 			$.each( $thisbutton.data(), function( key, value ) {
/* 29  */ 				data[key] = value;
/* 30  */ 			});
/* 31  */ 
/* 32  */ 			// Trigger event
/* 33  */ 			$( document.body ).trigger( 'adding_to_cart', [ $thisbutton, data ] );
/* 34  */ 
/* 35  */ 			// Ajax action
/* 36  */ 			$.post( wc_add_to_cart_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'add_to_cart' ), data, function( response ) {
/* 37  */                             // alert();
/* 38  */                             
/* 39  */                          
/* 40  */                             
/* 41  */ 				if ( ! response ) {
/* 42  */ 					return;
/* 43  */ 				}
/* 44  */ 
/* 45  */ 				var this_page = window.location.toString();
/* 46  */ 
/* 47  */ 				this_page = this_page.replace( 'add-to-cart', 'added-to-cart' );
/* 48  */ 
/* 49  */ 				if ( response.error && response.product_url ) {
/* 50  */ 					window.location = response.product_url;

/* add-to-cart.js */

/* 51  */ 					return;
/* 52  */ 				}
/* 53  */ 
/* 54  */ 				// Redirect to cart option
/* 55  */ 				if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' ) {
/* 56  */ 
/* 57  */ 					window.location = wc_add_to_cart_params.cart_url;
/* 58  */ 					return;
/* 59  */ 
/* 60  */ 				} else {
/* 61  */ 
/* 62  */ 					$thisbutton.removeClass( 'loading' );
/* 63  */ 
/* 64  */ 					var fragments = response.fragments;
/* 65  */ 					var cart_hash = response.cart_hash;
/* 66  */                                               // alert(fragments);
/* 67  */                                             //    alert(cart_hash);
/* 68  */ 					// Block fragments class
/* 69  */ 					if ( fragments ) {
/* 70  */ 						$.each( fragments, function( key ) {
/* 71  */                                              //      alert(key);
/* 72  */ 
/* 73  */ 							$( key ).addClass( 'updating' );
/* 74  */ 						});
/* 75  */ 					}
/* 76  */ 
/* 77  */ 					// Block widgets and fragments
/* 78  */ 					$( '.shop_table.cart, .updating, .cart_totals' ).fadeTo( '400', '0.6' ).block({
/* 79  */ 						message: null,
/* 80  */ 						overlayCSS: {
/* 81  */ 							opacity: 0.6
/* 82  */ 						}
/* 83  */ 					});
/* 84  */ 
/* 85  */ 					// Changes button classes
/* 86  */ 					$thisbutton.addClass( 'added' );
/* 87  */ 
/* 88  */ 					// View cart text
/* 89  */ 					if ( ! wc_add_to_cart_params.is_cart && $thisbutton.parent().find( '.added_to_cart' ).size() === 0 ) {
/* 90  */                                           //  alert(wc_add_to_cart_params.cart_url);
/* 91  */                                             //webboom
/* 92  */                                          //   alert();
/* 93  */                               //             $(".relatedProducts").after( ' <ul class="messages"><li class="success-msg"><ul><li><span>Product added to your shopping cart.</span></li></ul></li></ul>');
/* 94  */ 						//$thisbutton.after( ' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' +
/* 95  */ 						//	wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>' );
/* 96  */ 					}
/* 97  */ $(".relatedProducts").after( ' <ul class="messages"><li class="success-msg"><ul><li><span>Product added to your shopping cart.</span></li></ul></li></ul>');
/* 98  */ 					
/* 99  */ 					// Replace fragments
/* 100 */ 					if ( fragments ) {

/* add-to-cart.js */

/* 101 */ 						$.each( fragments, function( key, value ) {
/* 102 */                                                //      alert(key);
/* 103 */                                                //      alert(value);
/* 104 */ 							$( key ).replaceWith( value );
/* 105 */ 						});
/* 106 */ 					}
/* 107 */ 
/* 108 */ 					// Unblock
/* 109 */ 					$( '.widget_shopping_cart, .updating' ).stop( true ).css( 'opacity', '1' ).unblock();
/* 110 */ 
/* 111 */ 					// Cart page elements
/* 112 */ 					$( '.shop_table.cart' ).load( this_page + ' .shop_table.cart:eq(0) > *', function() {
/* 113 */ 
/* 114 */ 						$( '.shop_table.cart' ).stop( true ).css( 'opacity', '1' ).unblock();
/* 115 */ 
/* 116 */ 						$( document.body ).trigger( 'cart_page_refreshed' );
/* 117 */ 					});
/* 118 */ 
/* 119 */ 					$( '.cart_totals' ).load( this_page + ' .cart_totals:eq(0) > *', function() {
/* 120 */ 						$( '.cart_totals' ).stop( true ).css( 'opacity', '1' ).unblock();
/* 121 */ 					});
/* 122 */ 
/* 123 */ 					// Trigger event so themes can refresh other areas
/* 124 */ 					$( document.body ).trigger( 'added_to_cart', [ fragments, cart_hash, $thisbutton ] );
/* 125 */ 				}
/* 126 */ 			});
/* 127 */ 
/* 128 */ 			return false;
/* 129 */ 
/* 130 */ 		}
/* 131 */ 
/* 132 */ 		return true;
/* 133 */ 	});
/* 134 */ 
/* 135 */ });
/* 136 */ 

;
/* jquery.blockUI.js */

/* 1   */ /*!
/* 2   *|  * jQuery blockUI plugin
/* 3   *|  * Version 2.70.0-2014.11.23
/* 4   *|  * Requires jQuery v1.7 or later
/* 5   *|  *
/* 6   *|  * Examples at: http://malsup.com/jquery/block/
/* 7   *|  * Copyright (c) 2007-2013 M. Alsup
/* 8   *|  * Dual licensed under the MIT and GPL licenses:
/* 9   *|  * http://www.opensource.org/licenses/mit-license.php
/* 10  *|  * http://www.gnu.org/licenses/gpl.html
/* 11  *|  *
/* 12  *|  * Thanks to Amir-Hossein Sobhi for some excellent contributions!
/* 13  *|  */
/* 14  */ ;(function() {
/* 15  */ /*jshint eqeqeq:false curly:false latedef:false */
/* 16  */ "use strict";
/* 17  */ 
/* 18  */ 	function setup($) {
/* 19  */ 		$.fn._fadeIn = $.fn.fadeIn;
/* 20  */ 
/* 21  */ 		var noOp = $.noop || function() {};
/* 22  */ 
/* 23  */ 		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
/* 24  */ 		// confusing userAgent strings on Vista)
/* 25  */ 		var msie = /MSIE/.test(navigator.userAgent);
/* 26  */ 		var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
/* 27  */ 		var mode = document.documentMode || 0;
/* 28  */ 		var setExpr = $.isFunction( document.createElement('div').style.setExpression );
/* 29  */ 
/* 30  */ 		// global $ methods for blocking/unblocking the entire page
/* 31  */ 		$.blockUI   = function(opts) { install(window, opts); };
/* 32  */ 		$.unblockUI = function(opts) { remove(window, opts); };
/* 33  */ 
/* 34  */ 		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
/* 35  */ 		$.growlUI = function(title, message, timeout, onClose) {
/* 36  */ 			var $m = $('<div class="growlUI"></div>');
/* 37  */ 			if (title) $m.append('<h1>'+title+'</h1>');
/* 38  */ 			if (message) $m.append('<h2>'+message+'</h2>');
/* 39  */ 			if (timeout === undefined) timeout = 3000;
/* 40  */ 
/* 41  */ 			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
/* 42  */ 			var callBlock = function(opts) {
/* 43  */ 				opts = opts || {};
/* 44  */ 
/* 45  */ 				$.blockUI({
/* 46  */ 					message: $m,
/* 47  */ 					fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
/* 48  */ 					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
/* 49  */ 					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
/* 50  */ 					centerY: false,

/* jquery.blockUI.js */

/* 51  */ 					showOverlay: false,
/* 52  */ 					onUnblock: onClose,
/* 53  */ 					css: $.blockUI.defaults.growlCSS
/* 54  */ 				});
/* 55  */ 			};
/* 56  */ 
/* 57  */ 			callBlock();
/* 58  */ 			var nonmousedOpacity = $m.css('opacity');
/* 59  */ 			$m.mouseover(function() {
/* 60  */ 				callBlock({
/* 61  */ 					fadeIn: 0,
/* 62  */ 					timeout: 30000
/* 63  */ 				});
/* 64  */ 
/* 65  */ 				var displayBlock = $('.blockMsg');
/* 66  */ 				displayBlock.stop(); // cancel fadeout if it has started
/* 67  */ 				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
/* 68  */ 			}).mouseout(function() {
/* 69  */ 				$('.blockMsg').fadeOut(1000);
/* 70  */ 			});
/* 71  */ 			// End konapun additions
/* 72  */ 		};
/* 73  */ 
/* 74  */ 		// plugin method for blocking element content
/* 75  */ 		$.fn.block = function(opts) {
/* 76  */ 			if ( this[0] === window ) {
/* 77  */ 				$.blockUI( opts );
/* 78  */ 				return this;
/* 79  */ 			}
/* 80  */ 			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
/* 81  */ 			this.each(function() {
/* 82  */ 				var $el = $(this);
/* 83  */ 				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
/* 84  */ 					return;
/* 85  */ 				$el.unblock({ fadeOut: 0 });
/* 86  */ 			});
/* 87  */ 
/* 88  */ 			return this.each(function() {
/* 89  */ 				if ($.css(this,'position') == 'static') {
/* 90  */ 					this.style.position = 'relative';
/* 91  */ 					$(this).data('blockUI.static', true);
/* 92  */ 				}
/* 93  */ 				this.style.zoom = 1; // force 'hasLayout' in ie
/* 94  */ 				install(this, opts);
/* 95  */ 			});
/* 96  */ 		};
/* 97  */ 
/* 98  */ 		// plugin method for unblocking element content
/* 99  */ 		$.fn.unblock = function(opts) {
/* 100 */ 			if ( this[0] === window ) {

/* jquery.blockUI.js */

/* 101 */ 				$.unblockUI( opts );
/* 102 */ 				return this;
/* 103 */ 			}
/* 104 */ 			return this.each(function() {
/* 105 */ 				remove(this, opts);
/* 106 */ 			});
/* 107 */ 		};
/* 108 */ 
/* 109 */ 		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!
/* 110 */ 
/* 111 */ 		// override these in your code to change the default behavior and style
/* 112 */ 		$.blockUI.defaults = {
/* 113 */ 			// message displayed when blocking (use null for no message)
/* 114 */ 			message:  '<h1>Please wait...</h1>',
/* 115 */ 
/* 116 */ 			title: null,		// title string; only used when theme == true
/* 117 */ 			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)
/* 118 */ 
/* 119 */ 			theme: false, // set to true to use with jQuery UI themes
/* 120 */ 
/* 121 */ 			// styles for the message when blocking; if you wish to disable
/* 122 */ 			// these and use an external stylesheet then do this in your code:
/* 123 */ 			// $.blockUI.defaults.css = {};
/* 124 */ 			css: {
/* 125 */ 				padding:	0,
/* 126 */ 				margin:		0,
/* 127 */ 				width:		'30%',
/* 128 */ 				top:		'40%',
/* 129 */ 				left:		'35%',
/* 130 */ 				textAlign:	'center',
/* 131 */ 				color:		'#000',
/* 132 */ 				border:		'3px solid #aaa',
/* 133 */ 				backgroundColor:'#fff',
/* 134 */ 				cursor:		'wait'
/* 135 */ 			},
/* 136 */ 
/* 137 */ 			// minimal style set used when themes are used
/* 138 */ 			themedCSS: {
/* 139 */ 				width:	'30%',
/* 140 */ 				top:	'40%',
/* 141 */ 				left:	'35%'
/* 142 */ 			},
/* 143 */ 
/* 144 */ 			// styles for the overlay
/* 145 */ 			overlayCSS:  {
/* 146 */ 				backgroundColor:	'#000',
/* 147 */ 				opacity:			0.6,
/* 148 */ 				cursor:				'wait'
/* 149 */ 			},
/* 150 */ 

/* jquery.blockUI.js */

/* 151 */ 			// style to replace wait cursor before unblocking to correct issue
/* 152 */ 			// of lingering wait cursor
/* 153 */ 			cursorReset: 'default',
/* 154 */ 
/* 155 */ 			// styles applied when using $.growlUI
/* 156 */ 			growlCSS: {
/* 157 */ 				width:		'350px',
/* 158 */ 				top:		'10px',
/* 159 */ 				left:		'',
/* 160 */ 				right:		'10px',
/* 161 */ 				border:		'none',
/* 162 */ 				padding:	'5px',
/* 163 */ 				opacity:	0.6,
/* 164 */ 				cursor:		'default',
/* 165 */ 				color:		'#fff',
/* 166 */ 				backgroundColor: '#000',
/* 167 */ 				'-webkit-border-radius':'10px',
/* 168 */ 				'-moz-border-radius':	'10px',
/* 169 */ 				'border-radius':		'10px'
/* 170 */ 			},
/* 171 */ 
/* 172 */ 			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
/* 173 */ 			// (hat tip to Jorge H. N. de Vasconcelos)
/* 174 */ 			/*jshint scripturl:true */
/* 175 */ 			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
/* 176 */ 
/* 177 */ 			// force usage of iframe in non-IE browsers (handy for blocking applets)
/* 178 */ 			forceIframe: false,
/* 179 */ 
/* 180 */ 			// z-index for the blocking overlay
/* 181 */ 			baseZ: 1000,
/* 182 */ 
/* 183 */ 			// set these to true to have the message automatically centered
/* 184 */ 			centerX: true, // <-- only effects element blocking (page block controlled via css above)
/* 185 */ 			centerY: true,
/* 186 */ 
/* 187 */ 			// allow body element to be stetched in ie6; this makes blocking look better
/* 188 */ 			// on "short" pages.  disable if you wish to prevent changes to the body height
/* 189 */ 			allowBodyStretch: true,
/* 190 */ 
/* 191 */ 			// enable if you want key and mouse events to be disabled for content that is blocked
/* 192 */ 			bindEvents: true,
/* 193 */ 
/* 194 */ 			// be default blockUI will supress tab navigation from leaving blocking content
/* 195 */ 			// (if bindEvents is true)
/* 196 */ 			constrainTabKey: true,
/* 197 */ 
/* 198 */ 			// fadeIn time in millis; set to 0 to disable fadeIn on block
/* 199 */ 			fadeIn:  200,
/* 200 */ 

/* jquery.blockUI.js */

/* 201 */ 			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
/* 202 */ 			fadeOut:  400,
/* 203 */ 
/* 204 */ 			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
/* 205 */ 			timeout: 0,
/* 206 */ 
/* 207 */ 			// disable if you don't want to show the overlay
/* 208 */ 			showOverlay: true,
/* 209 */ 
/* 210 */ 			// if true, focus will be placed in the first available input field when
/* 211 */ 			// page blocking
/* 212 */ 			focusInput: true,
/* 213 */ 
/* 214 */             // elements that can receive focus
/* 215 */             focusableElements: ':input:enabled:visible',
/* 216 */ 
/* 217 */ 			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
/* 218 */ 			// no longer needed in 2012
/* 219 */ 			// applyPlatformOpacityRules: true,
/* 220 */ 
/* 221 */ 			// callback method invoked when fadeIn has completed and blocking message is visible
/* 222 */ 			onBlock: null,
/* 223 */ 
/* 224 */ 			// callback method invoked when unblocking has completed; the callback is
/* 225 */ 			// passed the element that has been unblocked (which is the window object for page
/* 226 */ 			// blocks) and the options that were passed to the unblock call:
/* 227 */ 			//	onUnblock(element, options)
/* 228 */ 			onUnblock: null,
/* 229 */ 
/* 230 */ 			// callback method invoked when the overlay area is clicked.
/* 231 */ 			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
/* 232 */ 			onOverlayClick: null,
/* 233 */ 
/* 234 */ 			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
/* 235 */ 			quirksmodeOffsetHack: 4,
/* 236 */ 
/* 237 */ 			// class name of the message block
/* 238 */ 			blockMsgClass: 'blockMsg',
/* 239 */ 
/* 240 */ 			// if it is already blocked, then ignore it (don't unblock and reblock)
/* 241 */ 			ignoreIfBlocked: false
/* 242 */ 		};
/* 243 */ 
/* 244 */ 		// private data and functions follow...
/* 245 */ 
/* 246 */ 		var pageBlock = null;
/* 247 */ 		var pageBlockEls = [];
/* 248 */ 
/* 249 */ 		function install(el, opts) {
/* 250 */ 			var css, themedCSS;

/* jquery.blockUI.js */

/* 251 */ 			var full = (el == window);
/* 252 */ 			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
/* 253 */ 			opts = $.extend({}, $.blockUI.defaults, opts || {});
/* 254 */ 
/* 255 */ 			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
/* 256 */ 				return;
/* 257 */ 
/* 258 */ 			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
/* 259 */ 			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
/* 260 */ 			if (opts.onOverlayClick)
/* 261 */ 				opts.overlayCSS.cursor = 'pointer';
/* 262 */ 
/* 263 */ 			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
/* 264 */ 			msg = msg === undefined ? opts.message : msg;
/* 265 */ 
/* 266 */ 			// remove the current block (if there is one)
/* 267 */ 			if (full && pageBlock)
/* 268 */ 				remove(window, {fadeOut:0});
/* 269 */ 
/* 270 */ 			// if an existing element is being used as the blocking content then we capture
/* 271 */ 			// its current place in the DOM (and current display style) so we can restore
/* 272 */ 			// it when we unblock
/* 273 */ 			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
/* 274 */ 				var node = msg.jquery ? msg[0] : msg;
/* 275 */ 				var data = {};
/* 276 */ 				$(el).data('blockUI.history', data);
/* 277 */ 				data.el = node;
/* 278 */ 				data.parent = node.parentNode;
/* 279 */ 				data.display = node.style.display;
/* 280 */ 				data.position = node.style.position;
/* 281 */ 				if (data.parent)
/* 282 */ 					data.parent.removeChild(node);
/* 283 */ 			}
/* 284 */ 
/* 285 */ 			$(el).data('blockUI.onUnblock', opts.onUnblock);
/* 286 */ 			var z = opts.baseZ;
/* 287 */ 
/* 288 */ 			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
/* 289 */ 			// layer1 is the iframe layer which is used to supress bleed through of underlying content
/* 290 */ 			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
/* 291 */ 			// layer3 is the message content that is displayed while blocking
/* 292 */ 			var lyr1, lyr2, lyr3, s;
/* 293 */ 			if (msie || opts.forceIframe)
/* 294 */ 				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
/* 295 */ 			else
/* 296 */ 				lyr1 = $('<div class="blockUI" style="display:none"></div>');
/* 297 */ 
/* 298 */ 			if (opts.theme)
/* 299 */ 				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
/* 300 */ 			else

/* jquery.blockUI.js */

/* 301 */ 				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
/* 302 */ 
/* 303 */ 			if (opts.theme && full) {
/* 304 */ 				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
/* 305 */ 				if ( opts.title ) {
/* 306 */ 					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
/* 307 */ 				}
/* 308 */ 				s += '<div class="ui-widget-content ui-dialog-content"></div>';
/* 309 */ 				s += '</div>';
/* 310 */ 			}
/* 311 */ 			else if (opts.theme) {
/* 312 */ 				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
/* 313 */ 				if ( opts.title ) {
/* 314 */ 					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
/* 315 */ 				}
/* 316 */ 				s += '<div class="ui-widget-content ui-dialog-content"></div>';
/* 317 */ 				s += '</div>';
/* 318 */ 			}
/* 319 */ 			else if (full) {
/* 320 */ 				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
/* 321 */ 			}
/* 322 */ 			else {
/* 323 */ 				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
/* 324 */ 			}
/* 325 */ 			lyr3 = $(s);
/* 326 */ 
/* 327 */ 			// if we have a message, style it
/* 328 */ 			if (msg) {
/* 329 */ 				if (opts.theme) {
/* 330 */ 					lyr3.css(themedCSS);
/* 331 */ 					lyr3.addClass('ui-widget-content');
/* 332 */ 				}
/* 333 */ 				else
/* 334 */ 					lyr3.css(css);
/* 335 */ 			}
/* 336 */ 
/* 337 */ 			// style the overlay
/* 338 */ 			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
/* 339 */ 				lyr2.css(opts.overlayCSS);
/* 340 */ 			lyr2.css('position', full ? 'fixed' : 'absolute');
/* 341 */ 
/* 342 */ 			// make iframe layer transparent in IE
/* 343 */ 			if (msie || opts.forceIframe)
/* 344 */ 				lyr1.css('opacity',0.0);
/* 345 */ 
/* 346 */ 			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
/* 347 */ 			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
/* 348 */ 			$.each(layers, function() {
/* 349 */ 				this.appendTo($par);
/* 350 */ 			});

/* jquery.blockUI.js */

/* 351 */ 
/* 352 */ 			if (opts.theme && opts.draggable && $.fn.draggable) {
/* 353 */ 				lyr3.draggable({
/* 354 */ 					handle: '.ui-dialog-titlebar',
/* 355 */ 					cancel: 'li'
/* 356 */ 				});
/* 357 */ 			}
/* 358 */ 
/* 359 */ 			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
/* 360 */ 			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
/* 361 */ 			if (ie6 || expr) {
/* 362 */ 				// give body 100% height
/* 363 */ 				if (full && opts.allowBodyStretch && $.support.boxModel)
/* 364 */ 					$('html,body').css('height','100%');
/* 365 */ 
/* 366 */ 				// fix ie6 issue when blocked element has a border width
/* 367 */ 				if ((ie6 || !$.support.boxModel) && !full) {
/* 368 */ 					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
/* 369 */ 					var fixT = t ? '(0 - '+t+')' : 0;
/* 370 */ 					var fixL = l ? '(0 - '+l+')' : 0;
/* 371 */ 				}
/* 372 */ 
/* 373 */ 				// simulate fixed position
/* 374 */ 				$.each(layers, function(i,o) {
/* 375 */ 					var s = o[0].style;
/* 376 */ 					s.position = 'absolute';
/* 377 */ 					if (i < 2) {
/* 378 */ 						if (full)
/* 379 */ 							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
/* 380 */ 						else
/* 381 */ 							s.setExpression('height','this.parentNode.offsetHeight + "px"');
/* 382 */ 						if (full)
/* 383 */ 							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
/* 384 */ 						else
/* 385 */ 							s.setExpression('width','this.parentNode.offsetWidth + "px"');
/* 386 */ 						if (fixL) s.setExpression('left', fixL);
/* 387 */ 						if (fixT) s.setExpression('top', fixT);
/* 388 */ 					}
/* 389 */ 					else if (opts.centerY) {
/* 390 */ 						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
/* 391 */ 						s.marginTop = 0;
/* 392 */ 					}
/* 393 */ 					else if (!opts.centerY && full) {
/* 394 */ 						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
/* 395 */ 						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
/* 396 */ 						s.setExpression('top',expression);
/* 397 */ 					}
/* 398 */ 				});
/* 399 */ 			}
/* 400 */ 

/* jquery.blockUI.js */

/* 401 */ 			// show the message
/* 402 */ 			if (msg) {
/* 403 */ 				if (opts.theme)
/* 404 */ 					lyr3.find('.ui-widget-content').append(msg);
/* 405 */ 				else
/* 406 */ 					lyr3.append(msg);
/* 407 */ 				if (msg.jquery || msg.nodeType)
/* 408 */ 					$(msg).show();
/* 409 */ 			}
/* 410 */ 
/* 411 */ 			if ((msie || opts.forceIframe) && opts.showOverlay)
/* 412 */ 				lyr1.show(); // opacity is zero
/* 413 */ 			if (opts.fadeIn) {
/* 414 */ 				var cb = opts.onBlock ? opts.onBlock : noOp;
/* 415 */ 				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
/* 416 */ 				var cb2 = msg ? cb : noOp;
/* 417 */ 				if (opts.showOverlay)
/* 418 */ 					lyr2._fadeIn(opts.fadeIn, cb1);
/* 419 */ 				if (msg)
/* 420 */ 					lyr3._fadeIn(opts.fadeIn, cb2);
/* 421 */ 			}
/* 422 */ 			else {
/* 423 */ 				if (opts.showOverlay)
/* 424 */ 					lyr2.show();
/* 425 */ 				if (msg)
/* 426 */ 					lyr3.show();
/* 427 */ 				if (opts.onBlock)
/* 428 */ 					opts.onBlock.bind(lyr3)();
/* 429 */ 			}
/* 430 */ 
/* 431 */ 			// bind key and mouse events
/* 432 */ 			bind(1, el, opts);
/* 433 */ 
/* 434 */ 			if (full) {
/* 435 */ 				pageBlock = lyr3[0];
/* 436 */ 				pageBlockEls = $(opts.focusableElements,pageBlock);
/* 437 */ 				if (opts.focusInput)
/* 438 */ 					setTimeout(focus, 20);
/* 439 */ 			}
/* 440 */ 			else
/* 441 */ 				center(lyr3[0], opts.centerX, opts.centerY);
/* 442 */ 
/* 443 */ 			if (opts.timeout) {
/* 444 */ 				// auto-unblock
/* 445 */ 				var to = setTimeout(function() {
/* 446 */ 					if (full)
/* 447 */ 						$.unblockUI(opts);
/* 448 */ 					else
/* 449 */ 						$(el).unblock(opts);
/* 450 */ 				}, opts.timeout);

/* jquery.blockUI.js */

/* 451 */ 				$(el).data('blockUI.timeout', to);
/* 452 */ 			}
/* 453 */ 		}
/* 454 */ 
/* 455 */ 		// remove the block
/* 456 */ 		function remove(el, opts) {
/* 457 */ 			var count;
/* 458 */ 			var full = (el == window);
/* 459 */ 			var $el = $(el);
/* 460 */ 			var data = $el.data('blockUI.history');
/* 461 */ 			var to = $el.data('blockUI.timeout');
/* 462 */ 			if (to) {
/* 463 */ 				clearTimeout(to);
/* 464 */ 				$el.removeData('blockUI.timeout');
/* 465 */ 			}
/* 466 */ 			opts = $.extend({}, $.blockUI.defaults, opts || {});
/* 467 */ 			bind(0, el, opts); // unbind events
/* 468 */ 
/* 469 */ 			if (opts.onUnblock === null) {
/* 470 */ 				opts.onUnblock = $el.data('blockUI.onUnblock');
/* 471 */ 				$el.removeData('blockUI.onUnblock');
/* 472 */ 			}
/* 473 */ 
/* 474 */ 			var els;
/* 475 */ 			if (full) // crazy selector to handle odd field errors in ie6/7
/* 476 */ 				els = $(document.body).children().filter('.blockUI').add('body > .blockUI');
/* 477 */ 			else
/* 478 */ 				els = $el.find('>.blockUI');
/* 479 */ 
/* 480 */ 			// fix cursor issue
/* 481 */ 			if ( opts.cursorReset ) {
/* 482 */ 				if ( els.length > 1 )
/* 483 */ 					els[1].style.cursor = opts.cursorReset;
/* 484 */ 				if ( els.length > 2 )
/* 485 */ 					els[2].style.cursor = opts.cursorReset;
/* 486 */ 			}
/* 487 */ 
/* 488 */ 			if (full)
/* 489 */ 				pageBlock = pageBlockEls = null;
/* 490 */ 
/* 491 */ 			if (opts.fadeOut) {
/* 492 */ 				count = els.length;
/* 493 */ 				els.stop().fadeOut(opts.fadeOut, function() {
/* 494 */ 					if ( --count === 0)
/* 495 */ 						reset(els,data,opts,el);
/* 496 */ 				});
/* 497 */ 			}
/* 498 */ 			else
/* 499 */ 				reset(els, data, opts, el);
/* 500 */ 		}

/* jquery.blockUI.js */

/* 501 */ 
/* 502 */ 		// move blocking element back into the DOM where it started
/* 503 */ 		function reset(els,data,opts,el) {
/* 504 */ 			var $el = $(el);
/* 505 */ 			if ( $el.data('blockUI.isBlocked') )
/* 506 */ 				return;
/* 507 */ 
/* 508 */ 			els.each(function(i,o) {
/* 509 */ 				// remove via DOM calls so we don't lose event handlers
/* 510 */ 				if (this.parentNode)
/* 511 */ 					this.parentNode.removeChild(this);
/* 512 */ 			});
/* 513 */ 
/* 514 */ 			if (data && data.el) {
/* 515 */ 				data.el.style.display = data.display;
/* 516 */ 				data.el.style.position = data.position;
/* 517 */ 				data.el.style.cursor = 'default'; // #59
/* 518 */ 				if (data.parent)
/* 519 */ 					data.parent.appendChild(data.el);
/* 520 */ 				$el.removeData('blockUI.history');
/* 521 */ 			}
/* 522 */ 
/* 523 */ 			if ($el.data('blockUI.static')) {
/* 524 */ 				$el.css('position', 'static'); // #22
/* 525 */ 			}
/* 526 */ 
/* 527 */ 			if (typeof opts.onUnblock == 'function')
/* 528 */ 				opts.onUnblock(el,opts);
/* 529 */ 
/* 530 */ 			// fix issue in Safari 6 where block artifacts remain until reflow
/* 531 */ 			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
/* 532 */ 			body.width(w-1).width(w);
/* 533 */ 			body[0].style.width = cssW;
/* 534 */ 		}
/* 535 */ 
/* 536 */ 		// bind/unbind the handler
/* 537 */ 		function bind(b, el, opts) {
/* 538 */ 			var full = el == window, $el = $(el);
/* 539 */ 
/* 540 */ 			// don't bother unbinding if there is nothing to unbind
/* 541 */ 			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
/* 542 */ 				return;
/* 543 */ 
/* 544 */ 			$el.data('blockUI.isBlocked', b);
/* 545 */ 
/* 546 */ 			// don't bind events when overlay is not in use or if bindEvents is false
/* 547 */ 			if (!full || !opts.bindEvents || (b && !opts.showOverlay))
/* 548 */ 				return;
/* 549 */ 
/* 550 */ 			// bind anchors and inputs for mouse and key events

/* jquery.blockUI.js */

/* 551 */ 			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
/* 552 */ 			if (b)
/* 553 */ 				$(document).bind(events, opts, handler);
/* 554 */ 			else
/* 555 */ 				$(document).unbind(events, handler);
/* 556 */ 
/* 557 */ 		// former impl...
/* 558 */ 		//		var $e = $('a,:input');
/* 559 */ 		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
/* 560 */ 		}
/* 561 */ 
/* 562 */ 		// event handler to suppress keyboard/mouse events when blocking
/* 563 */ 		function handler(e) {
/* 564 */ 			// allow tab navigation (conditionally)
/* 565 */ 			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
/* 566 */ 				if (pageBlock && e.data.constrainTabKey) {
/* 567 */ 					var els = pageBlockEls;
/* 568 */ 					var fwd = !e.shiftKey && e.target === els[els.length-1];
/* 569 */ 					var back = e.shiftKey && e.target === els[0];
/* 570 */ 					if (fwd || back) {
/* 571 */ 						setTimeout(function(){focus(back);},10);
/* 572 */ 						return false;
/* 573 */ 					}
/* 574 */ 				}
/* 575 */ 			}
/* 576 */ 			var opts = e.data;
/* 577 */ 			var target = $(e.target);
/* 578 */ 			if (target.hasClass('blockOverlay') && opts.onOverlayClick)
/* 579 */ 				opts.onOverlayClick(e);
/* 580 */ 
/* 581 */ 			// allow events within the message content
/* 582 */ 			if (target.parents('div.' + opts.blockMsgClass).length > 0)
/* 583 */ 				return true;
/* 584 */ 
/* 585 */ 			// allow events for content that is not being blocked
/* 586 */ 			return target.parents().children().filter('div.blockUI').length === 0;
/* 587 */ 		}
/* 588 */ 
/* 589 */ 		function focus(back) {
/* 590 */ 			if (!pageBlockEls)
/* 591 */ 				return;
/* 592 */ 			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
/* 593 */ 			if (e)
/* 594 */ 				e.focus();
/* 595 */ 		}
/* 596 */ 
/* 597 */ 		function center(el, x, y) {
/* 598 */ 			var p = el.parentNode, s = el.style;
/* 599 */ 			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
/* 600 */ 			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');

/* jquery.blockUI.js */

/* 601 */ 			if (x) s.left = l > 0 ? (l+'px') : '0';
/* 602 */ 			if (y) s.top  = t > 0 ? (t+'px') : '0';
/* 603 */ 		}
/* 604 */ 
/* 605 */ 		function sz(el, p) {
/* 606 */ 			return parseInt($.css(el,p),10)||0;
/* 607 */ 		}
/* 608 */ 
/* 609 */ 	}
/* 610 */ 
/* 611 */ 
/* 612 */ 	/*global define:true */
/* 613 */ 	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
/* 614 */ 		define(['jquery'], setup);
/* 615 */ 	} else {
/* 616 */ 		setup(jQuery);
/* 617 */ 	}
/* 618 */ 
/* 619 */ })();
