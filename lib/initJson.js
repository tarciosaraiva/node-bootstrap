var init = require('init-package-json');

exports = module.exports = {};

exports.execute = function (appName, done) {

  init(appName, '', function (err, data) {
    if (err) {
      console.log([
        'Sorry, could not finish `npm init`.',
        'Please run it manually inside your new project folder.'
      ].join('\n'));

      return done(new Error('Could not run `npm init`.'));
    }

    done();
  });

};