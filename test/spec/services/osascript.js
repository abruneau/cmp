'use strict';

describe('Service: osascript', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var osascript;
  beforeEach(inject(function (_osascript_) {
    osascript = _osascript_;
  }));

  it('should do something', function () {
    expect(!!osascript).toBe(true);
  });

});
