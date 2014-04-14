'use strict';

var readline = require('readline');
var creation = require('./lib/creation');

exports = module.exports = {};

exports.app_name = process.cwd().split('/').pop();
exports.def_answers = [exports.app_name, 'y', 'mocha', 'y', 'y'];

exports.run = function () {
  var self = this,
    questions = [
      'Please enter the name of new app [' + this.app_name + ']: ',
      'Would you like to store your app contributors in a lib directory? [Yn]: ',
      'What test framework would you like to use? [mocha]: ',
      'Would you like me to create a bin directory? [Yn]: ',
      'Would you like to include a Travis file? [Yn]: '
    ],
    reader = readline.createInterface(process.stdin, process.stdout);

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

  function finalise() {
    console.log([
      'Woohoo, all done!',
      'Go to your project folder, run `npm install` and you are ready to go.'
    ].join('\n'));
  }

  function promptUser(arr, idx) {
    if (idx >= arr.length) {
      reader.close();
      creation.processAnswers(self.def_answers, finalise);
    } else {
      reader.question(arr[idx], function (ans) {
        self.def_answers[idx] = ans || self.def_answers[idx];
        promptUser(arr, ++idx);
      });
    }
  }

  promptUser(questions, 0);

};