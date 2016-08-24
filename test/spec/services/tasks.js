'use strict';

describe('Service: Tasks', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var Tasks;
  beforeEach(inject(function (_Tasks_) {
    Tasks = _Tasks_;
  }));

  it('should do something', function () {
    expect(!!Tasks).toBe(true);
  });

});
