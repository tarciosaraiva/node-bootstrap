'use strict';

var os = require('os');
var path = require('path');
var winston = require('winston');

var fileName = path.join(os.tmpdir(), 'activity.log');

var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.File)({
      filename: fileName
    })
  ]
});

module.exports = logger;
module.exports.file = fileName;