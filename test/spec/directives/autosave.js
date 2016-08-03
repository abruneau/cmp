'use strict';

describe('Directive: AutoSave', function () {

  // load the directive's module
  beforeEach(module('cmpApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-auto-save></-auto-save>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the AutoSave directive');
  }));
});
