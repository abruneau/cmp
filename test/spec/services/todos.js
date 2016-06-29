'use strict';

describe('Service: Todos', function () {

  // load the service's module
  beforeEach(module('cmpApp'));

  // instantiate service
  var Todos;
  beforeEach(inject(function (_Todos_) {
    Todos = _Todos_;
  }));

  it('should do something', function () {
    expect(!!Todos).toBe(true);
  });

});
