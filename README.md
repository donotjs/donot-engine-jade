smart-static-jade
==============

[Jade](http://npmjs.org/packages/jade) support for [smart-static](http://github.com/trenskow/smart-static.js).

----

# Usage

An example of how to use

    var smartStatic = require('smart-static');
    var jade = require('smart-static-jade');
    
    // Setup smart-static
    smartStatic(someDir);
    
    smartStatic.engine(jade());

# Todo

* Support for options.
