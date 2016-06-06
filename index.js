'use strict';

const fs = require('fs');
const merge = require('merge');
const pug = require('pug');

const Transform = require('@donotjs/donot-transform');

class PugTransform extends Transform {

	constructor(options) {
		super();
		this.options = merge(true, options || {});
	}

	canTransform(filename) {
		return /(?:\.min)?\.(html|htm)$/i.test(filename);
	}

	allowAccess(filename) {
		return !/\.pug$/i.test(filename);
	}

	map(filename) {
		return filename.replace(/(?:\.min)?\.(html|htm)$/i, '.pug');
	}

	compile(filename, data) {
		return new Promise((resolved, rejected) => {
			var fn = pug.compileClientWithDependenciesTracked(data.toString(), {
				filename: filename,
				cache: false,
				pretty: /\.min\.(html|html)$/i.test(filename)
			});
			resolved({
				data: new Buffer(new Function('return function() {' + fn.body + ' return template;}')()()()),
				files: [filename].concat(fn.dependencies)
			});
		});
	}

}

exports = module.exports = PugTransform;
