'use strict';

describe('Service: Notes', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var Notes;
  beforeEach(inject(function (_Notes_) {
    Notes = _Notes_;
  }));

  it('should do something', function () {
    expect(!!Notes).toBe(true);
  });

});
