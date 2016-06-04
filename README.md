donot-transform-pug
====================

[![Build Status](https://travis-ci.org/donotjs/donot-transform-pug.svg?branch=master)](https://travis-ci.org/donotjs/donot-transform-pug)

[pug](http://npmjs.org/packages/pug) compiler and renderer for [donot](http://github.com/donotjs/donot).

# Usage

Using the pug donot transform plug-in is pretty easy.

	var http = require('http'),
	    donot = require('donot'),
	    PugTransform = require('donot-transform-pug');

	var server = http.createServer(donot(__dirname + '/public', {
		transforms: [ new PugTransform({
			// Options
		}) ]
	}));

	server.listen(8000);

Now `.pug` files in the `/public` folder will automatically be compiled, rendered and served as `.html` files.

# Locals

Providing locals for pug renderings is possible using the `renderCallback` option.

An example on how to use this below (here with Express).

    var express = require('express'),
		    donot = require('donot'),
		    PugTransform = require('donot-transform-pug');

		var app = express();

		app.get('/index.html', function(req, res, next) {
			req.options = {
				// pug locals
			};
			next();
		});

		app.use(donot(__dirname + '/public', {
			transforms: [ new PugTransform({
				renderCallback: function(req) {
					return req.options;
				}
			}) ]
		}));

In the above example the `renderCallback` is called whenever pug is rendering a template. The `app.get('/index.html'...` route sets the `req.options` - which is then returned for pug to use in the callback.

# License

MIT
