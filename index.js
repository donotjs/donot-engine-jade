'use strict';

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

	compile(filename, data, options) {
		return new Promise((resolved, rejected) => {
			var fn = jade.compileClientWithDependenciesTracked(data, { filename: filename, cache: false });
			resolved({
				data: fn.body,
				files: [filename].concat(fn.dependencies)
			});
		});
	}

	render(filename, data, options) {
		return new Promise((resolved, rejected) => {
			var locals = (options || {}).ctx;
			if (this.options.renderCallback) locals = this.options.renderCallback(locals);
			resolved({
				data: new Function('return ' + data)()(locals)
			});
		});
	}

}

exports = module.exports = JadeTransform;
