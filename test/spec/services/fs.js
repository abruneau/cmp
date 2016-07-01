'use strict';

describe('Service: Fs', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var Fs;
  beforeEach(inject(function (_Fs_) {
    Fs = _Fs_;
  }));

  it('should do something', function () {
    expect(!!Fs).toBe(true);
  });

});
