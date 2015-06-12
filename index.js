var merge = require('merge');
var jade = require('jade');

exports = module.exports = function(opt) {

  var options = merge(true, opt || {});

  return {
    map: {
      '.html': '.jade',
      '.htm': '.jade'
    },
    encoding: options.encoding || 'utf8',
    compile: function(file, data, opt, cb) {
      var fn;
      try {
        fn = jade.compileClientWithDependenciesTracked(data, { filename: file, cache: false });
      } catch (err) {
        return cb(err);
      }
      cb(null, fn.body, [file].concat(fn.dependencies));
    },
    render: function(url, data, opt, cb) {
      var source;
      try {
        var fn = new Function('return ' + data);
        var locals = opt.ctx;
        if (options.renderCallback) locals = options.renderCallback(opt.ctx);
        source = fn()(locals);
      } catch (err) {
        return cb(err);
      }
      cb(null, source);
    }
  };

};
