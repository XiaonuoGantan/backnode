/*
 * MIT License
 *
 * Copyright (c) 2013 Yasashii Syndicate
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

var environment = {};
environment.server = (typeof backnodeRenderInstance !== 'undefined');

define([
	'require',
	'backbone',
	'./SerializableModelMixinData',
], function(require) {
	var Model = require('backbone')['Model'];
	var SerializableModelMixinData = require('./SerializableModelMixinData');

	var AppModel = Model.extend({
		defaults: {
			attribution: "built by Yasashii Syndicate",
			tooSexy: true,
			holyGrail: true
		}
	});

	AppModel.prototype.initialize = function() {
		this._stuff = [];
		this.onserver = environment.server;
	};

	AppModel.prototype.clientReady = function() {
		if (environment.server) {
			window.backnodeRenderInstance.done();
		}
	};

	SerializableModelMixinData.mix(AppModel.prototype);

	return AppModel;
});

