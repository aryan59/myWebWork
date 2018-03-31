
/* woocommerce.js */

/* 1  */ jQuery( function( $ ) {
/* 2  */ 	// Orderby
/* 3  */ 	$( '.woocommerce-ordering' ).on( 'change', 'select.orderby', function() {
/* 4  */ 		$( this ).closest( 'form' ).submit();
/* 5  */ 	});
/* 6  */ 
/* 7  */ 	// Target quantity inputs on product pages
/* 8  */ 	$( 'input.qty:not(.product-quantity input.qty)' ).each( function() {
/* 9  */ 		var min = parseFloat( $( this ).attr( 'min' ) );
/* 10 */ 
/* 11 */ 		if ( min >= 0 && parseFloat( $( this ).val() ) < min ) {
/* 12 */ 			$( this ).val( min );
/* 13 */ 		}
/* 14 */ 	});
/* 15 */ });
/* 16 */ 

;
/* jquery.cookie.js */

/* 1   */ /*!
/* 2   *|  * jQuery Cookie Plugin v1.4.1
/* 3   *|  * https://github.com/carhartl/jquery-cookie
/* 4   *|  *
/* 5   *|  * Copyright 2013 Klaus Hartl
/* 6   *|  * Released under the MIT license
/* 7   *|  */
/* 8   */ (function (factory) {
/* 9   */ 	if (typeof define === 'function' && define.amd) {
/* 10  */ 		// AMD
/* 11  */ 		define(['jquery'], factory);
/* 12  */ 	} else if (typeof exports === 'object') {
/* 13  */ 		// CommonJS
/* 14  */ 		factory(require('jquery'));
/* 15  */ 	} else {
/* 16  */ 		// Browser globals
/* 17  */ 		factory(jQuery);
/* 18  */ 	}
/* 19  */ }(function ($) {
/* 20  */ 
/* 21  */ 	var pluses = /\+/g;
/* 22  */ 
/* 23  */ 	function encode(s) {
/* 24  */ 		return config.raw ? s : encodeURIComponent(s);
/* 25  */ 	}
/* 26  */ 
/* 27  */ 	function decode(s) {
/* 28  */ 		return config.raw ? s : decodeURIComponent(s);
/* 29  */ 	}
/* 30  */ 
/* 31  */ 	function stringifyCookieValue(value) {
/* 32  */ 		return encode(config.json ? JSON.stringify(value) : String(value));
/* 33  */ 	}
/* 34  */ 
/* 35  */ 	function parseCookieValue(s) {
/* 36  */ 		if (s.indexOf('"') === 0) {
/* 37  */ 			// This is a quoted cookie as according to RFC2068, unescape...
/* 38  */ 			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
/* 39  */ 		}
/* 40  */ 
/* 41  */ 		try {
/* 42  */ 			// Replace server-side written pluses with spaces.
/* 43  */ 			// If we can't decode the cookie, ignore it, it's unusable.
/* 44  */ 			// If we can't parse the cookie, ignore it, it's unusable.
/* 45  */ 			s = decodeURIComponent(s.replace(pluses, ' '));
/* 46  */ 			return config.json ? JSON.parse(s) : s;
/* 47  */ 		} catch(e) {}
/* 48  */ 	}
/* 49  */ 
/* 50  */ 	function read(s, converter) {

/* jquery.cookie.js */

/* 51  */ 		var value = config.raw ? s : parseCookieValue(s);
/* 52  */ 		return $.isFunction(converter) ? converter(value) : value;
/* 53  */ 	}
/* 54  */ 
/* 55  */ 	var config = $.cookie = function (key, value, options) {
/* 56  */ 
/* 57  */ 		// Write
/* 58  */ 
/* 59  */ 		if (value !== undefined && !$.isFunction(value)) {
/* 60  */ 			options = $.extend({}, config.defaults, options);
/* 61  */ 
/* 62  */ 			if (typeof options.expires === 'number') {
/* 63  */ 				var days = options.expires, t = options.expires = new Date();
/* 64  */ 				t.setTime(+t + days * 864e+5);
/* 65  */ 			}
/* 66  */ 
/* 67  */ 			return (document.cookie = [
/* 68  */ 				encode(key), '=', stringifyCookieValue(value),
/* 69  */ 				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
/* 70  */ 				options.path    ? '; path=' + options.path : '',
/* 71  */ 				options.domain  ? '; domain=' + options.domain : '',
/* 72  */ 				options.secure  ? '; secure' : ''
/* 73  */ 			].join(''));
/* 74  */ 		}
/* 75  */ 
/* 76  */ 		// Read
/* 77  */ 
/* 78  */ 		var result = key ? undefined : {};
/* 79  */ 
/* 80  */ 		// To prevent the for loop in the first place assign an empty array
/* 81  */ 		// in case there are no cookies at all. Also prevents odd result when
/* 82  */ 		// calling $.cookie().
/* 83  */ 		var cookies = document.cookie ? document.cookie.split('; ') : [];
/* 84  */ 
/* 85  */ 		for (var i = 0, l = cookies.length; i < l; i++) {
/* 86  */ 			var parts = cookies[i].split('=');
/* 87  */ 			var name = decode(parts.shift());
/* 88  */ 			var cookie = parts.join('=');
/* 89  */ 
/* 90  */ 			if (key && key === name) {
/* 91  */ 				// If second argument (value) is a function it's a converter...
/* 92  */ 				result = read(cookie, value);
/* 93  */ 				break;
/* 94  */ 			}
/* 95  */ 
/* 96  */ 			// Prevent storing a cookie that we couldn't decode.
/* 97  */ 			if (!key && (cookie = read(cookie)) !== undefined) {
/* 98  */ 				result[name] = cookie;
/* 99  */ 			}
/* 100 */ 		}

/* jquery.cookie.js */

/* 101 */ 
/* 102 */ 		return result;
/* 103 */ 	};
/* 104 */ 
/* 105 */ 	config.defaults = {};
/* 106 */ 
/* 107 */ 	$.removeCookie = function (key, options) {
/* 108 */ 		if ($.cookie(key) === undefined) {
/* 109 */ 			return false;
/* 110 */ 		}
/* 111 */ 
/* 112 */ 		// Must not alter options, thus extending a fresh object...
/* 113 */ 		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
/* 114 */ 		return !$.cookie(key);
/* 115 */ 	};
/* 116 */ 
/* 117 */ }));
