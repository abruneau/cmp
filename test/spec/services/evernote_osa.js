'use strict';

describe('Service: evernoteOsa', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var evernoteOsa;
  beforeEach(inject(function (_evernoteOsa_) {
    evernoteOsa = _evernoteOsa_;
  }));

  it('should do something', function () {
    expect(!!evernoteOsa).toBe(true);
  });

});
