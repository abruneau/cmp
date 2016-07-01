'use strict';

describe('Directive: sglclick', function () {

  // load the directive's module
  beforeEach(module('cmpApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sglclick></sglclick>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sglclick directive');
  }));
});
