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

	compile(srcFilename, destFilename, options) {
		return new Promise((resolved, rejected) => {
			fs.readFile(srcFilename, 'utf8', (err, data) => {
				if (err) return rejected(err);
				var fn;
				try {
					fn = pug.compileClientWithDependenciesTracked(data, {
						filename: srcFilename,
						cache: false,
						pretty: /\.min\.(html|html)$/i.test(destFilename)
					});
				} catch(err) {
					return rejected(err);
				}
				fs.writeFile(destFilename, fn.body, 'utf8', (err) => {
					if (err) return rejected(err);
					resolved({
						files: [srcFilename].concat(fn.dependencies)
					});
				});
			});
		});
	}

	needsRendering(options) {
		return true;
	}

	render(compiledData, options) {
		return new Promise((resolved, rejected) => {
			var locals = (options || {}).ctx;
			if (this.options.renderCallback) locals = this.options.renderCallback(locals);
			resolved({
				data: new Function('return function() {' + compiledData + ' return template;}')()()(locals)
			});
		});
	}

}

exports = module.exports = PugTransform;
