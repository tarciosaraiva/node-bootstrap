'use strict';
/*global describe, it, before, beforeEach, after, afterEach */

var creation = require('../lib/creation');
var initJson = require('../lib/initJson');
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var rimraf = require('rimraf');
var assert = require('chai').assert;
var expect = require('chai').expect;

describe('creation', function () {

  describe('#processAnswers', function () {

    var initJSpy = sinon.spy(initJson, 'execute'),
      answers = ['appSpec', 'y', 'mocha', 'y', 'y'];

    after(function () {
      rimraf.sync(path.join(__dirname, '../appSpec'));
    });

    it('should not process without answers', function () {
      creation.processAnswers(['y'], function (err) {
        expect(err).to.be.an.instanceof(Error);
        assert.equal(err.message, 'You need to provide 5 answers.');
      });
    });

    it('should process answers', function () {

      creation.processAnswers(answers, function (err) {
        expect(err).to.be.undefined;

        initJSpy.calledOn(initJson);

        assert.isTrue(fs.existsSync(__dirname + '/appSpec'));
        assert.isTrue(fs.existsSync(__dirname + '/appSpec/.travis.yml'));
        assert.isTrue(fs.existsSync(__dirname + '/appSpec/.jshintrc'));
        assert.isTrue(fs.existsSync(__dirname + '/appSpec/package.json'));
        assert.isTrue(fs.existsSync(__dirname + '/appSpec/bin'));
        assert.isTrue(fs.existsSync(__dirname + '/appSpec/lib'));
        assert.isTrue(fs.existsSync(__dirname + '/appSpec/test'));
      });

    });

  });

});