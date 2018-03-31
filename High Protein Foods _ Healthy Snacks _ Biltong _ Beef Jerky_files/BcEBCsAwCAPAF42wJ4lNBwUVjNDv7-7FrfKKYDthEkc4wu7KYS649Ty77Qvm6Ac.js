
/* cart-fragments.js */

/* 1   */ /* global wc_cart_fragments_params */
/* 2   */ jQuery( function( $ ) {
/* 3   */ 
/* 4   */ 	// wc_cart_fragments_params is required to continue, ensure the object exists
/* 5   */ 	if ( typeof wc_cart_fragments_params === 'undefined' ) {
/* 6   */ 		return false;
/* 7   */ 	}
/* 8   */ 
/* 9   */ 	/* Storage Handling */
/* 10  */ 	var $supports_html5_storage;
/* 11  */ 	try {
/* 12  */ 		$supports_html5_storage = ( 'sessionStorage' in window && window.sessionStorage !== null );
/* 13  */ 		window.sessionStorage.setItem( 'wc', 'test' );
/* 14  */ 		window.sessionStorage.removeItem( 'wc' );
/* 15  */ 	} catch( err ) {
/* 16  */ 		$supports_html5_storage = false;
/* 17  */ 	}
/* 18  */ 
/* 19  */ 	/* Cart session creation time to base expiration on */
/* 20  */ 	function set_cart_creation_timestamp() {
/* 21  */ 		if ( $supports_html5_storage ) {
/* 22  */ 			sessionStorage.setItem( 'wc_cart_created', ( new Date() ).getTime() );
/* 23  */ 		}
/* 24  */ 	}
/* 25  */ 
/* 26  */ 	/** Set the cart hash in both session and local storage */
/* 27  */ 	function set_cart_hash( cart_hash ) {
/* 28  */ 		if ( $supports_html5_storage ) {
/* 29  */ 			localStorage.setItem( 'wc_cart_hash', cart_hash );
/* 30  */ 			sessionStorage.setItem( 'wc_cart_hash', cart_hash );
/* 31  */ 		}
/* 32  */ 	}
/* 33  */ 
/* 34  */ 	var $fragment_refresh = {
/* 35  */ 		url: wc_cart_fragments_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'get_refreshed_fragments' ),
/* 36  */ 		type: 'POST',
/* 37  */ 		success: function( data ) {
/* 38  */ 			if ( data && data.fragments ) {
/* 39  */ 
/* 40  */ 				$.each( data.fragments, function( key, value ) {
/* 41  */ 					$( key ).replaceWith( value );
/* 42  */ 				});
/* 43  */ 
/* 44  */ 				if ( $supports_html5_storage ) {
/* 45  */ 					sessionStorage.setItem( wc_cart_fragments_params.fragment_name, JSON.stringify( data.fragments ) );
/* 46  */ 					set_cart_hash( data.cart_hash );
/* 47  */ 
/* 48  */ 					if ( data.cart_hash ) {
/* 49  */ 						set_cart_creation_timestamp();
/* 50  */ 					}

/* cart-fragments.js */

/* 51  */ 				}
/* 52  */ 
/* 53  */ 				$( document.body ).trigger( 'wc_fragments_refreshed' );
/* 54  */ 			}
/* 55  */ 		}
/* 56  */ 	};
/* 57  */ 
/* 58  */ 	/* Named callback for refreshing cart fragment */
/* 59  */ 	function refresh_cart_fragment() {
/* 60  */ 		$.ajax( $fragment_refresh );
/* 61  */ 	}
/* 62  */ 
/* 63  */ 	/* Cart Handling */
/* 64  */ 	if ( $supports_html5_storage ) {
/* 65  */ 
/* 66  */ 		var cart_timeout = null,
/* 67  */ 			day_in_ms    = ( 24 * 60 * 60 * 1000 );
/* 68  */ 
/* 69  */ 		$( document.body ).bind( 'added_to_cart', function( event, fragments, cart_hash ) {
/* 70  */ 			var prev_cart_hash = sessionStorage.getItem( 'wc_cart_hash' );
/* 71  */ 
/* 72  */ 			if ( prev_cart_hash === null || prev_cart_hash === undefined || prev_cart_hash === '' ) {
/* 73  */ 				set_cart_creation_timestamp();
/* 74  */ 			}
/* 75  */ 
/* 76  */ 			sessionStorage.setItem( wc_cart_fragments_params.fragment_name, JSON.stringify( fragments ) );
/* 77  */ 			set_cart_hash( cart_hash );
/* 78  */ 		});
/* 79  */ 
/* 80  */ 		$( document.body ).bind( 'wc_fragments_refreshed', function() {
/* 81  */ 			clearTimeout( cart_timeout );
/* 82  */ 			cart_timeout = setTimeout( refresh_cart_fragment, day_in_ms );
/* 83  */ 		} );
/* 84  */ 
/* 85  */ 		// Refresh when storage changes in another tab
/* 86  */ 		$( window ).on( 'storage onstorage', function ( e ) {
/* 87  */ 			if ( 'wc_cart_hash' === e.originalEvent.key && localStorage.getItem( 'wc_cart_hash' ) !== sessionStorage.getItem( 'wc_cart_hash' ) ) {
/* 88  */ 				$.ajax( $fragment_refresh );
/* 89  */ 			}
/* 90  */ 		});
/* 91  */ 
/* 92  */ 		try {
/* 93  */ 			var wc_fragments = $.parseJSON( sessionStorage.getItem( wc_cart_fragments_params.fragment_name ) ),
/* 94  */ 				cart_hash    = sessionStorage.getItem( 'wc_cart_hash' ),
/* 95  */ 				cookie_hash  = $.cookie( 'woocommerce_cart_hash'),
/* 96  */ 				cart_created = sessionStorage.getItem( 'wc_cart_created' );
/* 97  */ 
/* 98  */ 			if ( cart_hash === null || cart_hash === undefined || cart_hash === '' ) {
/* 99  */ 				cart_hash = '';
/* 100 */ 			}

/* cart-fragments.js */

/* 101 */ 
/* 102 */ 			if ( cookie_hash === null || cookie_hash === undefined || cookie_hash === '' ) {
/* 103 */ 				cookie_hash = '';
/* 104 */ 			}
/* 105 */ 
/* 106 */ 			if ( cart_hash && ( cart_created === null || cart_created === undefined || cart_created === '' ) ) {
/* 107 */ 				throw 'No cart_created';
/* 108 */ 			}
/* 109 */ 
/* 110 */ 			if ( cart_created ) {
/* 111 */ 				var cart_expiration = ( ( 1 * cart_created ) + day_in_ms ),
/* 112 */ 					timestamp_now   = ( new Date() ).getTime();
/* 113 */ 				if ( cart_expiration < timestamp_now ) {
/* 114 */ 					throw 'Fragment expired';
/* 115 */ 				}
/* 116 */ 				cart_timeout = setTimeout( refresh_cart_fragment, ( cart_expiration - timestamp_now ) );
/* 117 */ 			}
/* 118 */ 
/* 119 */ 			if ( wc_fragments && wc_fragments['div.widget_shopping_cart_content'] && cart_hash === cookie_hash ) {
/* 120 */ 
/* 121 */ 				$.each( wc_fragments, function( key, value ) {
/* 122 */ 					$( key ).replaceWith(value);
/* 123 */ 				});
/* 124 */ 
/* 125 */ 				$( document.body ).trigger( 'wc_fragments_loaded' );
/* 126 */ 			} else {
/* 127 */ 				throw 'No fragment';
/* 128 */ 			}
/* 129 */ 
/* 130 */ 		} catch( err ) {
/* 131 */ 			refresh_cart_fragment();
/* 132 */ 		}
/* 133 */ 
/* 134 */ 	} else {
/* 135 */ 		refresh_cart_fragment();
/* 136 */ 	}
/* 137 */ 
/* 138 */ 	/* Cart Hiding */
/* 139 */ 	if ( $.cookie( 'woocommerce_items_in_cart' ) > 0 ) {
/* 140 */ 		$( '.hide_cart_widget_if_empty' ).closest( '.widget_shopping_cart' ).show();
/* 141 */ 	} else {
/* 142 */ 		$( '.hide_cart_widget_if_empty' ).closest( '.widget_shopping_cart' ).hide();
/* 143 */ 	}
/* 144 */ 
/* 145 */ 	$( document.body ).bind( 'adding_to_cart', function() {
/* 146 */ 		$( '.hide_cart_widget_if_empty' ).closest( '.widget_shopping_cart' ).show();
/* 147 */ 	});
/* 148 */ });
/* 149 */ 
