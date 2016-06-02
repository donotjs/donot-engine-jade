/*jshint expr: true*/

'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const JadeTransform = require('../');

chai.should();
chai.use(chaiAsPromised);

const testFile = path.normalize(__dirname + '/data/test.jade');
const malformedFile = path.normalize(__dirname + '/data/malformed.jade');

var transform = new JadeTransform();

describe('jade', () => {

	var test;
	var malformed;
	var compiled;
	before(() => {
		test = fs.readFileSync(testFile, { encoding: 'utf8' });
		malformed = fs.readFileSync(malformedFile, { encoding: 'utf8' });
	});

	describe('compiler', () => {

		it ('should return true when filename is .html', () => {
			transform.canTransform('my.html').should.eventually.be.true;
		});

		it ('should return false when filename is .jade', () => {
			transform.canTransform('my.jade').should.eventually.be.false;
		});

		it ('should return true when filename is .jade', () => {
			transform.allowAccess('my.jade').should.eventually.be.true;
		});

		it ('should return false when filename is .htm', () => {
			transform.allowAccess('my.htm').should.eventually.be.false;
		});

		it ('should return error on malformed jade', () => {
			transform.compile(malformedFile, malformed).should.eventually.be.rejected;
		});

		it ('should return compiled jade', () => {
			transform.compile(testFile, test).then((data) => {
				expect(data).to.be.a('string');
				expect(() => {
					var fn = new Function('return ' + data);
					fn()();
				}).not.to.throw(Error);
				compiled = data;
			}).should.eventually.be.fulfilled;
		});

	});

	describe('renderer', () => {

		it ('should render html from compiled jade', () => {
			transform.render(null, compiled).then((data) => {
				expect(data).to.be.equal('<h1>this is jade</h1>');
			}).should.eventually.be.fulfilled;
		});

	});

});
