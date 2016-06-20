'use strict';

describe('Controller: AccountNotesCtrl', function () {

  // load the controller's module
  beforeEach(module('cmpApp'));

  var AccountNotesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountNotesCtrl = $controller('AccountNotesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AccountNotesCtrl.awesomeThings.length).toBe(3);
  });
});
