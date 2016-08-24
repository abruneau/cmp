'use strict';

describe('Service: Scrumboard', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var Scrumboard;
  beforeEach(inject(function (_Scrumboard_) {
    Scrumboard = _Scrumboard_;
  }));

  it('should do something', function () {
    expect(!!Scrumboard).toBe(true);
  });

});
