var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var engine = require('../');

var testFile = path.normalize(__dirname + '/data/test.jade');
var malformedFile = path.normalize(__dirname + '/data/malformed.jade');

describe('jade', function() {

  var test;
  var malformed;
  before(function() {
    test = fs.readFileSync(testFile, { encoding: 'utf8' });
    malformed = fs.readFileSync(malformedFile, { encoding: 'utf8' });
  });

  describe('compiler', function() {

    it ('should return error on malformed jade', function(done) {
      engine.compile(malformedFile, malformed, 'utf8', function(err, data) {
        expect(err).to.be.instanceof(Error);
        done();
      });
    });

    it ('should return valid javascript on valid jade', function(done) {
      engine.compile(testFile, test, 'utf8', function(err, data) {
        expect(err).to.be.null;
        expect(data).to.be.a('string');
        expect(function() {
          var fn = new Function('return ' + data);
          fn()();
        }).not.to.throw(Error);
        done();
      });
    });

  });

  describe('renderer', function() {

    it ('should render html from compiled jade', function(done) {
      engine.compile(testFile, test, 'utf8', function(err, data, files) {
        expect(err).to.be.null;
        expect(data).to.be.a('string');
        expect(files).to.deep.equal([testFile]);
        engine.render(null, data, 'utf8', function(err, data) {
          expect(err).to.be.null;
          expect(data).to.be.equal('<h1>this is jade</h1>');
          done();
        });
      });
    });

  });

});
