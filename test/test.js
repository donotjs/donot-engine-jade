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
			return transform.canTransform('my.html').should.eventually.be.true;
		});

		it ('should return false when filename is .jade', () => {
			return transform.canTransform('my.jade').should.eventually.be.false;
		});

		it ('should return false when filename is .jade', () => {
			return transform.allowAccess('my.jade').should.eventually.be.false;
		});

		it ('should return true when filename is .htm', () => {
			return transform.allowAccess('my.htm').should.eventually.be.true;
		});

		it ('should return error on malformed jade', () => {
			return transform.compile(malformedFile, malformed).should.eventually.be.rejected;
		});

		it ('should return compiled jade', () => {
			return transform.compile(testFile, test).then((result) => {
				expect(result.data).to.be.a('string');
				expect(() => {
					var fn = new Function('return ' + result.data);
					fn()();
				}).not.to.throw(Error);
				compiled = result.data;
				expect(result.files).to.be.an.array;
				expect(result.files[0]).to.be.a('string');
			}).should.eventually.be.fulfilled;
		});

	});

	describe('renderer', () => {

		it ('should render html from compiled jade', () => {
			return transform.render(null, compiled).then((result) => {
				expect(result.data).to.be.equal('<h1>this is jade</h1>');
			}).should.eventually.be.fulfilled;
		});

	});

});
