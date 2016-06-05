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

var transform = new PugTransform();

describe('pug', () => {

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
				expect(result.data).to.be.a('string');
				expect(result.files).to.be.an.array;
				expect(result.files[0]).to.be.a('string');
				compiled = result.data;
			}).should.eventually.be.fulfilled;
		});

	});

	describe('renderer', () => {

		it ('should render html from compiled pug', () => {
			return new Promise((resolved, rejected) => {
				transform.render(compiled).then((result) => {
					expect(result).to.have.property('data');
					expect(result.data).to.be.equal('<h1>this is pug</h1>');
					resolved(result.data);
				}, rejected);
			}).should.eventually.be.fulfilled;
		});

	});

});
