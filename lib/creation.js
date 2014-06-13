'use strict';

var fs = require('fs');
var logger = require('./logger');
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
  },
  JSHINTRC = [
    '{',
    '  \"node\": true,',
    '  \"esnext\": false,',
    '  \"bitwise\": true,',
    '  \"curly\": true,',
    '  \"eqeqeq\": true,',
    '  \"eqnull\": true,',
    '  \"immed\": true,',
    '  \"latedef\": true,',
    '  \"newcap\": true,',
    '  \"noarg\": true,',
    '  \"undef\": true,',
    '  \"strict\": false,',
    '  \"trailing\": true,',
    '  \"smarttabs\": true,',
    '  \"indent\": 2,',
    '  \"white\": true,',
    '  \"quotmark\": \"single\",',
    '  \"laxbreak\": true',
    '}'
  ].join('\n'),
  GIT_IGNORE = [
    'lib-cov',
    '*.seed',
    '*.log',
    '*.csv',
    '*.dat',
    '*.out',
    '*.pid',
    '*.gz',
    '',
    'pids',
    'logs',
    'results',
    '',
    'npm-debug.log',
    'node_modules',
    '*.iml',
    '.idea',
  ].join('\n');

exports = module.exports = {};
exports.main_file = '/app.js';
exports.main_spec = '/appSpec.js';
exports.main_spec_content = 'var app = require(\'../app\');';

exports.processAnswers = function (answers, done) {
  var self = this;

  if (answers.length !== 5) {
    logger.log('error', 'Provided [%d] answers instead of 5.', answers.length);
    return done(new Error('You need to provide 5 answers.'));
  }

  function handleExistingError(err) {
    // ignore error for now
    logger.log('error', 'Something is wrong while creating directory: %j', err);
  }

  function makeDir(ans, dir) {
    logger.log('info', 'Deciding wheter to create directory [%s]. Answer was [%s].', dir, ans);
    if (ans.toLowerCase() === 'y') {
      fs.mkdir(dir, handleExistingError);
    }
  }

  function executeAnswer(ans, idx) {
    switch (idx) {
    case 0:
      self.app_name = ans;
      fs.mkdir(ans, handleExistingError);
      fs.writeFile(ans + self.main_file, '', handleExistingError);
      break;
    case 1:
      makeDir(ans, self.app_name + '/lib');
      break;
    case 2:
      var testFolder = self.app_name + '/test',
        appSpec = testFolder + self.main_spec;

      fs.mkdir(testFolder, handleExistingError);
      fs.writeFile(appSpec, self.main_spec_content, handleExistingError);

      PKG_DEFAULT.devDependencies[ans] = 'latest';
      PKG_DEFAULT.scripts.test = TEST_SCRIPT_MAP[ans];

      break;
    case 3:
      makeDir(ans, self.app_name + '/bin');
      break;
    case 4:
      fs.writeFile(self.app_name + '/.travis.yml', TRAVIS_CONTENT, handleExistingError);
      fs.writeFile(self.app_name + '/.jshintrc', JSHINTRC, handleExistingError);
      fs.writeFile(self.app_name + '/.gitignore', GIT_IGNORE, handleExistingError);
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
  fs.writeFile(this.app_name + '/package.json', pkgStr, function (err) {
    if (err) {
      process.exit(1);
    }
    initJson.execute(self.app_name, done);
  });

};