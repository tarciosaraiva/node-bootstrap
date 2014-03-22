// script dependencies
var fs = require('fs');
var readline = require('readline');
var exec = require('child_process').exec;
var initJson = require('init-package-json');

exports = module.exports = {};

// script constants
var NEW_APP_NAME = __dirname.split('/').pop();
var NEW_APP_DIR = __dirname + '/';
var TRAVIS_CONTENT = [
  'language: node_js',
  'node_js:',
  '- \"0.10\"',
  '',
  'branches:',
  '  only:',
  '    - master'
].join('\n');
var PKG_DEFAULT = {
  version: '0.0.1',
  devDependencies: {
    chai: 'latest',
    sinon: 'latest',
    should: 'latest'
  }
};

// script variables
var rl = readline.createInterface(process.stdin, process.stdout),
  answers = [],
  questions = [
    'Is your project in CoffeeScript? [Yn] ',
    'Please enter the name of new app [' + NEW_APP_NAME + '] ',
    'Would you like to store your app contributors in a lib directory? [Yn] ',
    'What test framework would you like to use? [mocha] ',
    'Would you like me to create a bin directory? [Yn] ',
    'Would you like to include a Travis file? [Yn] '
  ],
  coffee = false;

function createAppDirectory(appName) {
  if (appName !== NEW_APP_NAME) {
    NEW_APP_DIR += appName + '/';
    fs.mkdirSync(NEW_APP_DIR);
  }
}

function processAnswer(el, idx, arr) {
  switch (idx) {
    case 1:
      createAppDirectory(el);
      var main = 'app.js';
      if (coffee) {
        fs.mkdirSync(NEW_APP_DIR + 'src');
        main = 'app.coffee';
      }
      fs.writeFileSync(NEW_APP_DIR + main, '');
      PKG_DEFAULT.main = main;
      break;
    case 2:
      if (el === 'Y' || el === 'y') {
        fs.mkdirSync(NEW_APP_DIR + 'lib');
      }
      break;
    case 3:
      var specDir = NEW_APP_DIR + 'test/';
      fs.mkdirSync(specDir);
      var mainSpec = 'appSpec.js',
        requireApp = 'var app = require(\'../app\');';
      if (coffee) {
        mainSpec = 'appSpec.coffee';
        requireApp = 'app = require \'../app\'';
      }
      fs.writeFileSync(specDir + mainSpec, requireApp);

      PKG_DEFAULT.devDependencies[arr[3]] = 'latest';

      break;
    case 4:
      if (el === 'Y' || el === 'y') {
        fs.mkdirSync(NEW_APP_DIR + 'bin');
      }
      break;
    case 5:
      if (el === 'Y' || el === 'y') {
        fs.writeFileSync(NEW_APP_DIR + '.travis.yml', TRAVIS_CONTENT);
      }
      break;
  }
}

exports.run = function() {

  console.log(
    [
      '',
      'Hi, my job is to help you bootstrap a new NodeJS project.',
      '',
      'I will ask you a couple of questions that will help me setup ',
      'a proper directory structure for you.',
      '',
      'After all questions are answered I\'ll run `npm init` so ',
      'we can properly generate a `package.json` file.',
      '',
      'Press ^C at any time to quit.',
      ''
    ].join('\n')
  );

  rl.setPrompt(questions.shift());
  rl.prompt();

  rl.on('line', function(answer) {
    switch (questions.length) {
      case 5:
        answers.push(answer || 'Y');
        break;
      case 4:
        answers.push(answer || NEW_APP_NAME);
        break;
      case 3:
        answers.push(answer || 'Y');
        break;
      case 2:
        answers.push(answer || 'mocha');
        break;
      case 1:
        answers.push(answer || 'Y');
        break;
      case 0:
        answers.push(answer || 'Y');
        break;
    }

    if (questions.length === 0) {
      rl.close();
    } else {
      rl.setPrompt(questions.shift());
      rl.prompt();
    }
  }).on('close', function() {
    if (answers.length === 6) {
      coffee = answers[0] === 'Y' || answers[0] === 'y';
      answers.forEach(processAnswer);

      console.log([
        '',
        'Running `npm init` now ...',
        ''
      ].join('\n'));

      fs.writeFile(NEW_APP_DIR + 'package.json', JSON.stringify(PKG_DEFAULT), function(err) {
        initJson(NEW_APP_DIR, '', function(err, data) {
          if (!err) {
            console.log('All done. Run `npm install` and you\'re done!');
          }
        });
      });

    }
  });

};