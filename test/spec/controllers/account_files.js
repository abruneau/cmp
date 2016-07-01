'use strict';

describe('Controller: AccountFilesCtrl', function () {

  // load the controller's module
  beforeEach(module('cmpApp'));

  var AccountFilesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountFilesCtrl = $controller('AccountFilesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AccountFilesCtrl.awesomeThings.length).toBe(3);
  });
});
