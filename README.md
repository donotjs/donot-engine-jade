donot-transform-jade
====================

[![Build Status](https://travis-ci.org/donotjs/donot-transform-jade.svg?branch=master)](https://travis-ci.org/donotjs/donot-transform-jade)

[Jade](http://npmjs.org/packages/jade) compiler and renderer for [donot](http://github.com/donotjs/donot-transform-jade).

# Usage

Using the Jade donot transform plug-in is pretty easy.

	var http = require('http'),
	    donot = require('donot'),
	    JadeTransform = require('donot-transform-jade');

	var server = http.createServer(donot(__dirname + '/public', {
		transforms: [ new JadeTransform({
			// Options
		}) ]
	}));

	server.listen(8000);

Now `.jade` files in the `/public` folder will automatically be compiled, rendered and served as `.html` files.

# Locals

Providing locals for jade renderings is possible using the `renderCallback` option.

An example on how to use this below (here with Express).

    var express = require('express'),
		    donot = require('donot'),
		    jade = require('donot-transform-jade');

		var app = express();

		app.get('/index.html', function(req, res, next) {
			req.options = {
				// Jade locals
			};
			next();
		});

		app.use(donot(__dirname + '/public', {
			transforms: [ new JadeTransform({
				renderCallback: function(req) {
					return req.options;
				}
			}) ]
		}));

In the above example the `renderCallback` is called whenever Jade is rendering a template. The `app.get('/index.html'...` route sets the `req.options` - which is then returned for Jade to use in the callback.

# License

MIT
