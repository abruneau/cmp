'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('NavigationCtrl', function (salesForce, $scope, Accounts) {
	var updateSf = function () {
		$scope.$apply(function () {
			$scope.identity = salesForce.identity;
		});
	};

	var updateAccounts = function () {
		$scope.$apply(function () {
			$scope.accountList = Accounts.list;
		});
	};

	$scope.homeIsCollapsed = false;
	$scope.identity = salesForce.identity;
	$scope.accountList = Accounts.list;

	salesForce.registerObserverCallback(updateSf);
	Accounts.updateList();
	Accounts.registerObserverCallback(updateAccounts);
});
