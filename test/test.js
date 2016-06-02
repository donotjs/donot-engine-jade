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
			expect(transform.canTransform('my.html')).to.be.true;
		});

		it ('should return false when filename is .jade', () => {
			expect(transform.canTransform('my.jade')).to.be.false;
		});

		it ('should return false when filename is .jade', () => {
			expect(transform.allowAccess('my.jade')).to.be.false;
		});

		it ('should return true when filename is .htm', () => {
			expect(transform.allowAccess('my.htm')).to.be.true;
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
