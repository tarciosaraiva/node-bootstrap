'use strict';
/*global describe, it, before, beforeEach, after, afterEach */

var app = require('../app');
var sinon = require('sinon');
var assert = require('chai').assert;

describe('app', function () {

  describe('#run', function () {

    var clock, answers = [{
        to: 50,
        ans: 'appSpec'
      }, {
        to: 75,
        ans: '\n'
      }, {
        to: 100,
        ans: '\n'
      }, {
        to: 125,
        ans: '\n'
      }, {
        to: 150,
        ans: '\n'
      }];

    before(function () {
      clock = sinon.useFakeTimers();

      answers.forEach(function (el) {
        setTimeout(function () {
          process.stdin.emit('data', el.ans);
        }, el.to);
      });

      app.run();
    });

    it('should have prompted user for 5 questions', function () {
      clock.tick(500);
      assert.equal(app.def_answers.length, 5, 'should have 5 answers');
    });

    it('should have app name as "appSpec"', function () {
      assert.equal(app.def_answers[0], 'appSpec', 'second answer should be appSpec');
    });

  });

});