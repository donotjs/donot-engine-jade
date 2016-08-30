/*jshint expr: true*/

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const PugTransform = require('../');

chai.should();
chai.use(chaiAsPromised);

const testFile = path.normalize(__dirname + '/data/test.pug');
const malformedFile = path.normalize(__dirname + '/data/malformed.pug');
const localsFile = path.normalize(__dirname + '/data/locals.pug');

var transform = new PugTransform();

describe('pug', () => {

	var test, malformed, locals;
	before(() => {
		test = fs.readFileSync(testFile);
		malformed = fs.readFileSync(malformedFile);
		locals = fs.readFileSync(localsFile);
	});

	describe('compiler', () => {

		it ('should return true when filename is .html', () => {
			expect(transform.canTransform('my.html')).to.be.true;
		});

		it ('should return false when filename is .pug', () => {
			expect(transform.canTransform('my.pug')).to.be.false;
		});

		it ('should return false when filename is .pug', () => {
			expect(transform.allowAccess('my.pug')).to.be.false;
		});

		it ('should return true when filename is .htm', () => {
			expect(transform.allowAccess('my.htm')).to.be.true;
		});

		it ('should return error on malformed pug', () => {
			return transform.compile(malformedFile, malformed).should.eventually.be.rejected;
		});

		it ('should return compiled pug', () => {
			return transform.compile(testFile, test).then((result) => {
				expect(result).to.be.an('object');
				expect(result).to.have.property('data');
				expect(result).to.have.property('files');
				expect(result.data.toString()).to.be.equal('<h1>this is pug</h1>');
				expect(result.files).to.be.an.array;
				expect(result.files[0]).to.be.a('string');
			}).should.eventually.be.fulfilled;
		});

		it ('should return compiled pug with locals', () => {
			return transform.compile(localsFile, locals, null, {
				header: 'this is locals'
			}).then((result) => {
				expect(result).to.be.an('object');
				expect(result).to.have.property('data');
				expect(result).to.have.property('files');
				expect(result.data.toString()).to.be.equal('<h1>this is locals</h1>');
				expect(result.files).to.be.an.array;
				expect(result.files[0]).to.be.a('string');
			}).should.eventually.be.fulfilled;
		});

	});

});
