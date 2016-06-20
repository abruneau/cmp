'use strict';

describe('Controller: AccountFormCtrl', function () {

  // load the controller's module
  beforeEach(module('cmpApp'));

  var AccountFormCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountFormCtrl = $controller('AccountFormCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AccountFormCtrl.awesomeThings.length).toBe(3);
  });
});
