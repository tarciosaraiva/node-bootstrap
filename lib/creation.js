'use strict';

var fs = require('fs');
var initJson = require('./initJson');

var TRAVIS_CONTENT = [
  'language: node_js',
  'node_js:',
  '- \"0.10\"',
  '',
  'branches:',
  '  only:',
  '    - master'
].join('\n'),
  PKG_DEFAULT = {
    main: 'app.js',
    version: '0.0.1',
    scripts: {
      test: ''
    },
    devDependencies: {
      chai: 'latest',
      sinon: 'latest',
      should: 'latest'
    }
  },
  TEST_SCRIPT_MAP = {
    mocha: 'mocha -R spec',
    tap: 'tap ./test'
  };

exports = module.exports = {};
exports.main_file = '/app.js';
exports.main_spec = '/appSpec.js';
exports.main_spec_content = 'var app = require(\'../app\');';

exports.processAnswers = function (answers, done) {
  var self = this;

  if (answers.length !== 5) {
    return done(new Error('You need to provide 5 answers.'));
  }

  function makeDir(ans, dir) {
    if (ans.toLowerCase() === 'y') {
      fs.mkdirSync(dir);
    }
  }

  function executeAnswer(ans, idx) {
    switch (idx) {
    case 0:
      self.app_name = ans;
      fs.mkdirSync(ans);
      fs.writeFileSync(ans + self.main_file, '');
      break;
    case 1:
      makeDir(ans, self.app_name + '/lib');
      break;
    case 2:
      var testFolder = self.app_name + '/test',
        appSpec = testFolder + self.main_spec;

      fs.mkdirSync(testFolder);
      fs.writeFileSync(appSpec, self.main_spec_content);

      PKG_DEFAULT.devDependencies[ans] = 'latest';
      PKG_DEFAULT.scripts.test = TEST_SCRIPT_MAP[ans];

      break;
    case 3:
      makeDir(ans, self.app_name + '/bin');
      break;
    case 4:
      fs.writeFileSync(self.app_name + '/.travis.yml', TRAVIS_CONTENT);
      break;
    }
  }

  answers.forEach(executeAnswer);

  console.log([
    '',
    'Running `npm init` now ...',
    ''
  ].join('\n'));

  var pkgStr = JSON.stringify(PKG_DEFAULT);
  fs.writeFileSync(this.app_name + '/package.json', pkgStr);
  initJson.execute(this.app_name, done);

};