var app = require('../lib/nodecreate');
var readline = require('readline');
var sinon = require('sinon');

describe('app', function() {

  describe('#run', function() {

    var rlSpy = sinon.spy(readline, 'createInterface');

    it('should prompt user for 6 questions', function() {
      app.run();
    });

  });

});