
/* scripts.js */

/* 1   */ (function($) {
/* 2   */ 
/* 3   */ 	if (typeof _wpcf7 == 'undefined' || _wpcf7 === null) {
/* 4   */ 		_wpcf7 = {};
/* 5   */ 	}
/* 6   */ 
/* 7   */ 	_wpcf7 = $.extend({
/* 8   */ 		cached: 0
/* 9   */ 	}, _wpcf7);
/* 10  */ 
/* 11  */ 	$.fn.wpcf7InitForm = function() {
/* 12  */ 		this.ajaxForm({
/* 13  */ 			beforeSubmit: function(arr, $form, options) {
/* 14  */ 				$form.wpcf7ClearResponseOutput();
/* 15  */ 				$form.find('[aria-invalid]').attr('aria-invalid', 'false');
/* 16  */ 				$form.find('img.ajax-loader').css({ visibility: 'visible' });
/* 17  */ 				return true;
/* 18  */ 			},
/* 19  */ 			beforeSerialize: function($form, options) {
/* 20  */ 				$form.find('[placeholder].placeheld').each(function(i, n) {
/* 21  */ 					$(n).val('');
/* 22  */ 				});
/* 23  */ 				return true;
/* 24  */ 			},
/* 25  */ 			data: { '_wpcf7_is_ajax_call': 1 },
/* 26  */ 			dataType: 'json',
/* 27  */ 			success: $.wpcf7AjaxSuccess,
/* 28  */ 			error: function(xhr, status, error, $form) {
/* 29  */ 				var e = $('<div class="ajax-error"></div>').text(error.message);
/* 30  */ 				$form.after(e);
/* 31  */ 			}
/* 32  */ 		});
/* 33  */ 
/* 34  */ 		if (_wpcf7.cached) {
/* 35  */ 			this.wpcf7OnloadRefill();
/* 36  */ 		}
/* 37  */ 
/* 38  */ 		this.wpcf7ToggleSubmit();
/* 39  */ 
/* 40  */ 		this.find('.wpcf7-submit').wpcf7AjaxLoader();
/* 41  */ 
/* 42  */ 		this.find('.wpcf7-acceptance').click(function() {
/* 43  */ 			$(this).closest('form').wpcf7ToggleSubmit();
/* 44  */ 		});
/* 45  */ 
/* 46  */ 		this.find('.wpcf7-exclusive-checkbox').wpcf7ExclusiveCheckbox();
/* 47  */ 
/* 48  */ 		this.find('.wpcf7-list-item.has-free-text').wpcf7ToggleCheckboxFreetext();
/* 49  */ 
/* 50  */ 		this.find('[placeholder]').wpcf7Placeholder();

/* scripts.js */

/* 51  */ 
/* 52  */ 		if (_wpcf7.jqueryUi && ! _wpcf7.supportHtml5.date) {
/* 53  */ 			this.find('input.wpcf7-date[type="date"]').each(function() {
/* 54  */ 				$(this).datepicker({
/* 55  */ 					dateFormat: 'yy-mm-dd',
/* 56  */ 					minDate: new Date($(this).attr('min')),
/* 57  */ 					maxDate: new Date($(this).attr('max'))
/* 58  */ 				});
/* 59  */ 			});
/* 60  */ 		}
/* 61  */ 
/* 62  */ 		if (_wpcf7.jqueryUi && ! _wpcf7.supportHtml5.number) {
/* 63  */ 			this.find('input.wpcf7-number[type="number"]').each(function() {
/* 64  */ 				$(this).spinner({
/* 65  */ 					min: $(this).attr('min'),
/* 66  */ 					max: $(this).attr('max'),
/* 67  */ 					step: $(this).attr('step')
/* 68  */ 				});
/* 69  */ 			});
/* 70  */ 		}
/* 71  */ 
/* 72  */ 		this.find('.wpcf7-character-count').wpcf7CharacterCount();
/* 73  */ 
/* 74  */ 		this.find('.wpcf7-validates-as-url').change(function() {
/* 75  */ 			$(this).wpcf7NormalizeUrl();
/* 76  */ 		});
/* 77  */ 	};
/* 78  */ 
/* 79  */ 	$.wpcf7AjaxSuccess = function(data, status, xhr, $form) {
/* 80  */ 		if (! $.isPlainObject(data) || $.isEmptyObject(data)) {
/* 81  */ 			return;
/* 82  */ 		}
/* 83  */ 
/* 84  */ 		var $responseOutput = $form.find('div.wpcf7-response-output');
/* 85  */ 
/* 86  */ 		$form.wpcf7ClearResponseOutput();
/* 87  */ 
/* 88  */ 		$form.find('.wpcf7-form-control').removeClass('wpcf7-not-valid');
/* 89  */ 		$form.removeClass('invalid spam sent failed');
/* 90  */ 
/* 91  */ 		if (data.captcha) {
/* 92  */ 			$form.wpcf7RefillCaptcha(data.captcha);
/* 93  */ 		}
/* 94  */ 
/* 95  */ 		if (data.quiz) {
/* 96  */ 			$form.wpcf7RefillQuiz(data.quiz);
/* 97  */ 		}
/* 98  */ 
/* 99  */ 		if (data.invalids) {
/* 100 */ 			$.each(data.invalids, function(i, n) {

/* scripts.js */

/* 101 */ 				$form.find(n.into).wpcf7NotValidTip(n.message);
/* 102 */ 				$form.find(n.into).find('.wpcf7-form-control').addClass('wpcf7-not-valid');
/* 103 */ 				$form.find(n.into).find('[aria-invalid]').attr('aria-invalid', 'true');
/* 104 */ 			});
/* 105 */ 
/* 106 */ 			$responseOutput.addClass('wpcf7-validation-errors');
/* 107 */ 			$form.addClass('invalid');
/* 108 */ 
/* 109 */ 			$(data.into).trigger('wpcf7:invalid');
/* 110 */ 			$(data.into).trigger('invalid.wpcf7'); // deprecated
/* 111 */ 
/* 112 */ 		} else if (1 == data.spam) {
/* 113 */ 			$form.find('[name="g-recaptcha-response"]').each(function() {
/* 114 */ 				if ('' == $(this).val()) {
/* 115 */ 					var $recaptcha = $(this).closest('.wpcf7-form-control-wrap');
/* 116 */ 					$recaptcha.wpcf7NotValidTip(_wpcf7.recaptchaEmpty);
/* 117 */ 				}
/* 118 */ 			});
/* 119 */ 
/* 120 */ 			$responseOutput.addClass('wpcf7-spam-blocked');
/* 121 */ 			$form.addClass('spam');
/* 122 */ 
/* 123 */ 			$(data.into).trigger('wpcf7:spam');
/* 124 */ 			$(data.into).trigger('spam.wpcf7'); // deprecated
/* 125 */ 
/* 126 */ 		} else if (1 == data.mailSent) {
/* 127 */ 			$responseOutput.addClass('wpcf7-mail-sent-ok');
/* 128 */ 			$form.addClass('sent');
/* 129 */ 
/* 130 */ 			if (data.onSentOk) {
/* 131 */ 				$.each(data.onSentOk, function(i, n) { eval(n) });
/* 132 */ 			}
/* 133 */ 
/* 134 */ 			$(data.into).trigger('wpcf7:mailsent');
/* 135 */ 			$(data.into).trigger('mailsent.wpcf7'); // deprecated
/* 136 */ 
/* 137 */ 		} else {
/* 138 */ 			$responseOutput.addClass('wpcf7-mail-sent-ng');
/* 139 */ 			$form.addClass('failed');
/* 140 */ 
/* 141 */ 			$(data.into).trigger('wpcf7:mailfailed');
/* 142 */ 			$(data.into).trigger('mailfailed.wpcf7'); // deprecated
/* 143 */ 		}
/* 144 */ 
/* 145 */ 		if (data.onSubmit) {
/* 146 */ 			$.each(data.onSubmit, function(i, n) { eval(n) });
/* 147 */ 		}
/* 148 */ 
/* 149 */ 		$(data.into).trigger('wpcf7:submit');
/* 150 */ 		$(data.into).trigger('submit.wpcf7'); // deprecated

/* scripts.js */

/* 151 */ 
/* 152 */ 		if (1 == data.mailSent) {
/* 153 */ 			$form.resetForm();
/* 154 */ 		}
/* 155 */ 
/* 156 */ 		$form.find('[placeholder].placeheld').each(function(i, n) {
/* 157 */ 			$(n).val($(n).attr('placeholder'));
/* 158 */ 		});
/* 159 */ 
/* 160 */ 		$responseOutput.append(data.message).slideDown('fast');
/* 161 */ 		$responseOutput.attr('role', 'alert');
/* 162 */ 
/* 163 */ 		$.wpcf7UpdateScreenReaderResponse($form, data);
/* 164 */ 	};
/* 165 */ 
/* 166 */ 	$.fn.wpcf7ExclusiveCheckbox = function() {
/* 167 */ 		return this.find('input:checkbox').click(function() {
/* 168 */ 			var name = $(this).attr('name');
/* 169 */ 			$(this).closest('form').find('input:checkbox[name="' + name + '"]').not(this).prop('checked', false);
/* 170 */ 		});
/* 171 */ 	};
/* 172 */ 
/* 173 */ 	$.fn.wpcf7Placeholder = function() {
/* 174 */ 		if (_wpcf7.supportHtml5.placeholder) {
/* 175 */ 			return this;
/* 176 */ 		}
/* 177 */ 
/* 178 */ 		return this.each(function() {
/* 179 */ 			$(this).val($(this).attr('placeholder'));
/* 180 */ 			$(this).addClass('placeheld');
/* 181 */ 
/* 182 */ 			$(this).focus(function() {
/* 183 */ 				if ($(this).hasClass('placeheld'))
/* 184 */ 					$(this).val('').removeClass('placeheld');
/* 185 */ 			});
/* 186 */ 
/* 187 */ 			$(this).blur(function() {
/* 188 */ 				if ('' == $(this).val()) {
/* 189 */ 					$(this).val($(this).attr('placeholder'));
/* 190 */ 					$(this).addClass('placeheld');
/* 191 */ 				}
/* 192 */ 			});
/* 193 */ 		});
/* 194 */ 	};
/* 195 */ 
/* 196 */ 	$.fn.wpcf7AjaxLoader = function() {
/* 197 */ 		return this.each(function() {
/* 198 */ 			var loader = $('<img class="ajax-loader" />')
/* 199 */ 				.attr({ src: _wpcf7.loaderUrl, alt: _wpcf7.sending })
/* 200 */ 				.css('visibility', 'hidden');

/* scripts.js */

/* 201 */ 
/* 202 */ 			$(this).after(loader);
/* 203 */ 		});
/* 204 */ 	};
/* 205 */ 
/* 206 */ 	$.fn.wpcf7ToggleSubmit = function() {
/* 207 */ 		return this.each(function() {
/* 208 */ 			var form = $(this);
/* 209 */ 
/* 210 */ 			if (this.tagName.toLowerCase() != 'form') {
/* 211 */ 				form = $(this).find('form').first();
/* 212 */ 			}
/* 213 */ 
/* 214 */ 			if (form.hasClass('wpcf7-acceptance-as-validation')) {
/* 215 */ 				return;
/* 216 */ 			}
/* 217 */ 
/* 218 */ 			var submit = form.find('input:submit');
/* 219 */ 			if (! submit.length) return;
/* 220 */ 
/* 221 */ 			var acceptances = form.find('input:checkbox.wpcf7-acceptance');
/* 222 */ 			if (! acceptances.length) return;
/* 223 */ 
/* 224 */ 			submit.removeAttr('disabled');
/* 225 */ 			acceptances.each(function(i, n) {
/* 226 */ 				n = $(n);
/* 227 */ 				if (n.hasClass('wpcf7-invert') && n.is(':checked')
/* 228 */ 				|| ! n.hasClass('wpcf7-invert') && ! n.is(':checked')) {
/* 229 */ 					submit.attr('disabled', 'disabled');
/* 230 */ 				}
/* 231 */ 			});
/* 232 */ 		});
/* 233 */ 	};
/* 234 */ 
/* 235 */ 	$.fn.wpcf7ToggleCheckboxFreetext = function() {
/* 236 */ 		return this.each(function() {
/* 237 */ 			var $wrap = $(this).closest('.wpcf7-form-control');
/* 238 */ 
/* 239 */ 			if ($(this).find(':checkbox, :radio').is(':checked')) {
/* 240 */ 				$(this).find(':input.wpcf7-free-text').prop('disabled', false);
/* 241 */ 			} else {
/* 242 */ 				$(this).find(':input.wpcf7-free-text').prop('disabled', true);
/* 243 */ 			}
/* 244 */ 
/* 245 */ 			$wrap.find(':checkbox, :radio').change(function() {
/* 246 */ 				var $cb = $('.has-free-text', $wrap).find(':checkbox, :radio');
/* 247 */ 				var $freetext = $(':input.wpcf7-free-text', $wrap);
/* 248 */ 
/* 249 */ 				if ($cb.is(':checked')) {
/* 250 */ 					$freetext.prop('disabled', false).focus();

/* scripts.js */

/* 251 */ 				} else {
/* 252 */ 					$freetext.prop('disabled', true);
/* 253 */ 				}
/* 254 */ 			});
/* 255 */ 		});
/* 256 */ 	};
/* 257 */ 
/* 258 */ 	$.fn.wpcf7CharacterCount = function() {
/* 259 */ 		return this.each(function() {
/* 260 */ 			var $count = $(this);
/* 261 */ 			var name = $count.attr('data-target-name');
/* 262 */ 			var down = $count.hasClass('down');
/* 263 */ 			var starting = parseInt($count.attr('data-starting-value'), 10);
/* 264 */ 			var maximum = parseInt($count.attr('data-maximum-value'), 10);
/* 265 */ 			var minimum = parseInt($count.attr('data-minimum-value'), 10);
/* 266 */ 
/* 267 */ 			var updateCount = function($target) {
/* 268 */ 				var length = $target.val().length;
/* 269 */ 				var count = down ? starting - length : length;
/* 270 */ 				$count.attr('data-current-value', count);
/* 271 */ 				$count.text(count);
/* 272 */ 
/* 273 */ 				if (maximum && maximum < length) {
/* 274 */ 					$count.addClass('too-long');
/* 275 */ 				} else {
/* 276 */ 					$count.removeClass('too-long');
/* 277 */ 				}
/* 278 */ 
/* 279 */ 				if (minimum && length < minimum) {
/* 280 */ 					$count.addClass('too-short');
/* 281 */ 				} else {
/* 282 */ 					$count.removeClass('too-short');
/* 283 */ 				}
/* 284 */ 			};
/* 285 */ 
/* 286 */ 			$count.closest('form').find(':input[name="' + name + '"]').each(function() {
/* 287 */ 				updateCount($(this));
/* 288 */ 
/* 289 */ 				$(this).keyup(function() {
/* 290 */ 					updateCount($(this));
/* 291 */ 				});
/* 292 */ 			});
/* 293 */ 		});
/* 294 */ 	};
/* 295 */ 
/* 296 */ 	$.fn.wpcf7NormalizeUrl = function() {
/* 297 */ 		return this.each(function() {
/* 298 */ 			var val = $.trim($(this).val());
/* 299 */ 
/* 300 */ 			if (val && ! val.match(/^[a-z][a-z0-9.+-]*:/i)) { // check the scheme part

/* scripts.js */

/* 301 */ 				val = val.replace(/^\/+/, '');
/* 302 */ 				val = 'http://' + val;
/* 303 */ 			}
/* 304 */ 
/* 305 */ 			$(this).val(val);
/* 306 */ 		});
/* 307 */ 	};
/* 308 */ 
/* 309 */ 	$.fn.wpcf7NotValidTip = function(message) {
/* 310 */ 		return this.each(function() {
/* 311 */ 			var $into = $(this);
/* 312 */ 
/* 313 */ 			$into.find('span.wpcf7-not-valid-tip').remove();
/* 314 */ 			$into.append('<span role="alert" class="wpcf7-not-valid-tip">' + message + '</span>');
/* 315 */ 
/* 316 */ 			if ($into.is('.use-floating-validation-tip *')) {
/* 317 */ 				$('.wpcf7-not-valid-tip', $into).mouseover(function() {
/* 318 */ 					$(this).wpcf7FadeOut();
/* 319 */ 				});
/* 320 */ 
/* 321 */ 				$(':input', $into).focus(function() {
/* 322 */ 					$('.wpcf7-not-valid-tip', $into).not(':hidden').wpcf7FadeOut();
/* 323 */ 				});
/* 324 */ 			}
/* 325 */ 		});
/* 326 */ 	};
/* 327 */ 
/* 328 */ 	$.fn.wpcf7FadeOut = function() {
/* 329 */ 		return this.each(function() {
/* 330 */ 			$(this).animate({
/* 331 */ 				opacity: 0
/* 332 */ 			}, 'fast', function() {
/* 333 */ 				$(this).css({'z-index': -100});
/* 334 */ 			});
/* 335 */ 		});
/* 336 */ 	};
/* 337 */ 
/* 338 */ 	$.fn.wpcf7OnloadRefill = function() {
/* 339 */ 		return this.each(function() {
/* 340 */ 			var url = $(this).attr('action');
/* 341 */ 
/* 342 */ 			if (0 < url.indexOf('#')) {
/* 343 */ 				url = url.substr(0, url.indexOf('#'));
/* 344 */ 			}
/* 345 */ 
/* 346 */ 			var id = $(this).find('input[name="_wpcf7"]').val();
/* 347 */ 			var unitTag = $(this).find('input[name="_wpcf7_unit_tag"]').val();
/* 348 */ 
/* 349 */ 			$.getJSON(url,
/* 350 */ 				{ _wpcf7_is_ajax_call: 1, _wpcf7: id, _wpcf7_request_ver: $.now() },

/* scripts.js */

/* 351 */ 				function(data) {
/* 352 */ 					if (data && data.captcha) {
/* 353 */ 						$('#' + unitTag).wpcf7RefillCaptcha(data.captcha);
/* 354 */ 					}
/* 355 */ 
/* 356 */ 					if (data && data.quiz) {
/* 357 */ 						$('#' + unitTag).wpcf7RefillQuiz(data.quiz);
/* 358 */ 					}
/* 359 */ 				}
/* 360 */ 			);
/* 361 */ 		});
/* 362 */ 	};
/* 363 */ 
/* 364 */ 	$.fn.wpcf7RefillCaptcha = function(captcha) {
/* 365 */ 		return this.each(function() {
/* 366 */ 			var form = $(this);
/* 367 */ 
/* 368 */ 			$.each(captcha, function(i, n) {
/* 369 */ 				form.find(':input[name="' + i + '"]').clearFields();
/* 370 */ 				form.find('img.wpcf7-captcha-' + i).attr('src', n);
/* 371 */ 				var match = /([0-9]+)\.(png|gif|jpeg)$/.exec(n);
/* 372 */ 				form.find('input:hidden[name="_wpcf7_captcha_challenge_' + i + '"]').attr('value', match[1]);
/* 373 */ 			});
/* 374 */ 		});
/* 375 */ 	};
/* 376 */ 
/* 377 */ 	$.fn.wpcf7RefillQuiz = function(quiz) {
/* 378 */ 		return this.each(function() {
/* 379 */ 			var form = $(this);
/* 380 */ 
/* 381 */ 			$.each(quiz, function(i, n) {
/* 382 */ 				form.find(':input[name="' + i + '"]').clearFields();
/* 383 */ 				form.find(':input[name="' + i + '"]').siblings('span.wpcf7-quiz-label').text(n[0]);
/* 384 */ 				form.find('input:hidden[name="_wpcf7_quiz_answer_' + i + '"]').attr('value', n[1]);
/* 385 */ 			});
/* 386 */ 		});
/* 387 */ 	};
/* 388 */ 
/* 389 */ 	$.fn.wpcf7ClearResponseOutput = function() {
/* 390 */ 		return this.each(function() {
/* 391 */ 			$(this).find('div.wpcf7-response-output').hide().empty().removeClass('wpcf7-mail-sent-ok wpcf7-mail-sent-ng wpcf7-validation-errors wpcf7-spam-blocked').removeAttr('role');
/* 392 */ 			$(this).find('span.wpcf7-not-valid-tip').remove();
/* 393 */ 			$(this).find('img.ajax-loader').css({ visibility: 'hidden' });
/* 394 */ 		});
/* 395 */ 	};
/* 396 */ 
/* 397 */ 	$.wpcf7UpdateScreenReaderResponse = function($form, data) {
/* 398 */ 		$('.wpcf7 .screen-reader-response').html('').attr('role', '');
/* 399 */ 
/* 400 */ 		if (data.message) {

/* scripts.js */

/* 401 */ 			var $response = $form.siblings('.screen-reader-response').first();
/* 402 */ 			$response.append(data.message);
/* 403 */ 
/* 404 */ 			if (data.invalids) {
/* 405 */ 				var $invalids = $('<ul></ul>');
/* 406 */ 
/* 407 */ 				$.each(data.invalids, function(i, n) {
/* 408 */ 					if (n.idref) {
/* 409 */ 						var $li = $('<li></li>').append($('<a></a>').attr('href', '#' + n.idref).append(n.message));
/* 410 */ 					} else {
/* 411 */ 						var $li = $('<li></li>').append(n.message);
/* 412 */ 					}
/* 413 */ 
/* 414 */ 					$invalids.append($li);
/* 415 */ 				});
/* 416 */ 
/* 417 */ 				$response.append($invalids);
/* 418 */ 			}
/* 419 */ 
/* 420 */ 			$response.attr('role', 'alert').focus();
/* 421 */ 		}
/* 422 */ 	};
/* 423 */ 
/* 424 */ 	$.wpcf7SupportHtml5 = function() {
/* 425 */ 		var features = {};
/* 426 */ 		var input = document.createElement('input');
/* 427 */ 
/* 428 */ 		features.placeholder = 'placeholder' in input;
/* 429 */ 
/* 430 */ 		var inputTypes = ['email', 'url', 'tel', 'number', 'range', 'date'];
/* 431 */ 
/* 432 */ 		$.each(inputTypes, function(index, value) {
/* 433 */ 			input.setAttribute('type', value);
/* 434 */ 			features[value] = input.type !== 'text';
/* 435 */ 		});
/* 436 */ 
/* 437 */ 		return features;
/* 438 */ 	};
/* 439 */ 
/* 440 */ 	$(function() {
/* 441 */ 		_wpcf7.supportHtml5 = $.wpcf7SupportHtml5();
/* 442 */ 		$('div.wpcf7 > form').wpcf7InitForm();
/* 443 */ 	});
/* 444 */ 
/* 445 */ })(jQuery);
/* 446 */ 
