smart-static-jade
=================

[![Build Status](https://travis-ci.org/trenskow/smart-static-jade.svg?branch=master)](https://travis-ci.org/trenskow/smart-static-jade)

[Jade](http://npmjs.org/packages/jade) rendering engine for [smart-static](http://github.com/trenskow/smart-static.js).

# Usage

Using the Jade smart-static engine plug-in is pretty easy.

	var http = require('http');
	
	var smartStatic = require('smart-static');
    var jade = require('smart-static-jade');
    
    var server = http.createServer(smartStatic(__dirname + '/public', {
        engines: [
        	jade({
        		// Options
        	})
        ]
    }));
    
    server.listen(8000);

Now `.jade` files in the `/public` folder will automatically be compiled, rendered and served as `.html` files.

# Locals

Providing locals for jade renderings is possible using the `renderCallback` option.

An example on how to use this below (here with Express).

    var express = require('express');
    var smartStatic = require('smart-static');
    var jade = require('smart-static-jade');
    
    var app = express();
    
    app.get('/index.html', function(req, res, next) {
        req.options = {
            // Jade locals
        };
        next();
    });
    
    app.use(smartStatic(__dirname + '/public', {
        engines: [
            jade({
                renderCallback: function(req) {
                    return req.options;
                }
            })
        ]
    }));

In the above example the `renderCallback` is called whenever Jade is rendering a template. The `app.get('/index.html'...` route sets the `req.options` - which is then returned for Jade to use in the callback.
