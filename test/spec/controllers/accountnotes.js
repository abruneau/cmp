'use strict';

describe('Controller: AccountnotesCtrl', function () {

  // load the controller's module
  beforeEach(module('cmpApp'));

  var AccountnotesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountnotesCtrl = $controller('AccountnotesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AccountnotesCtrl.awesomeThings.length).toBe(3);
  });
});
