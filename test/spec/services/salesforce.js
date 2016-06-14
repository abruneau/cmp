'use strict';

describe('Service: salesForce', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var salesForce;
  beforeEach(inject(function (_salesForce_) {
    salesForce = _salesForce_;
  }));

  it('should do something', function () {
    expect(!!salesForce).toBe(true);
  });

});
