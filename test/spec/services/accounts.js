'use strict';

describe('Service: Accounts', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var Accounts;
  beforeEach(inject(function (_Accounts_) {
    Accounts = _Accounts_;
  }));

  it('should do something', function () {
    expect(!!Accounts).toBe(true);
  });

});
