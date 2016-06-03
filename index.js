'use strict';

const fs = require('fs');
const merge = require('merge');
const jade = require('jade');

const Transform = require('@donotjs/donot-transform');

class JadeTransform extends Transform {

	constructor(options) {
		super();
		this.options = merge(true, options || {});
	}

	canTransform(filename) {
		return /\.(html|htm)$/i.test(filename);
	}

	allowAccess(filename) {
		return !/\.jade$/i.test(filename);
	}

	map(filename) {
		return filename.replace(/\.(html|htm)$/i, '.jade');
	}

	compile(srcFilename, destFilename, options) {
		return new Promise((resolved, rejected) => {
			fs.readFile(srcFilename, 'utf8', (err, data) => {
				if (err) return rejected(err);
				var fn;
				try {
					fn = jade.compileClientWithDependenciesTracked(data, {filename: srcFilename, cache: false });
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
				data: new Function('return ' + compiledData)()(locals)
			});
		});
	}

}

exports = module.exports = JadeTransform;
