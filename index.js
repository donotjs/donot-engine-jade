var merge = require('merge');
var jade = require('jade');

exports = module.exports = function(opt) {

  var options = merge(true, opt || {});

  // Set default dummy render callback
  options.renderCallback = options.renderCallback || function() {};

  return {
    map: {
      '.html': '.jade',
      '.htm': '.jade'
    },
    encoding: options.encoding || 'utf8',
    compile: function(file, data, opt, cb) {
      var fn;
      try {
        fn = jade.compileClientWithDependenciesTracked(data, { filename: file });
      } catch (err) {
        return cb(err);
      }
      cb(null, fn.body, [file].concat(fn.dependencies));
    },
    render: function(url, data, opt, cb) {
      var source;
      try {
        var fn = new Function('return ' + data);
        source = fn()(options.renderCallback(opt.ctx));
      } catch (err) {
        return cb(err);
      }
      cb(null, source);
    }
  };

};
