'use strict';

describe('Controller: ScrumboardCtrl', function () {

  // load the controller's module
  beforeEach(module('cmpApp'));

  var ScrumboardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScrumboardCtrl = $controller('ScrumboardCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ScrumboardCtrl.awesomeThings.length).toBe(3);
  });
});
