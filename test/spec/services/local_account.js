'use strict';

describe('Service: localAccount', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var localAccount;
  beforeEach(inject(function (_localAccount_) {
    localAccount = _localAccount_;
  }));

  it('should do something', function () {
    expect(!!localAccount).toBe(true);
  });

});
