'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:AccountsCtrl
 * @description
 * # AccountsCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountCtrl', function ($scope, $routeParams, $timeout, Accounts, salesForce) {
	var updateAccounts = function () {
		$scope.$apply(function () {
			$scope.accountList = Accounts.list;
			$scope.account = Accounts.selected;
			$scope.opportunities = Accounts.opportunities;
		});
	};

	$scope.updateOpportunities = function () {
		salesForce.loadOpportunities($scope.account.Id);
	};

	var accountId = $routeParams.id;

	$scope.accountList = Accounts.list;
	$scope.account = Accounts.selected;
	$scope.opportunities = Accounts.opportunities;

	Accounts.get(accountId);
	Accounts.registerObserverCallback(updateAccounts);

});
