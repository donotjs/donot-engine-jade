var jade = require('jade');

exports = module.exports = {
  map: {
    '.html': '.jade',
    '.htm': '.jade'
  },
  compile: function(file, data, encoding, cb) {
    var fn;
    try {
      fn = jade.compileClientWithDependenciesTracked(data, { filename: file });
    } catch (err) {
      return cb(err);
    }
    cb(null, fn.body, [file].concat(fn.dependencies));
  },
  render: function(url, data, encoding, cb) {
    var source;
    try {
      var fn = new Function('return ' + data);
      source = fn()();
    } catch (err) {
      return cb(err);
    }
    cb(null, source);
  }
};
