'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:AccountFormCtrl
 * @description
 * # AccountFormCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountFormCtrl', function ($scope, salesForce) {

	var updateSf = function () {
		$scope.$apply(function () {
			$scope.accountOptions = salesForce.accountOptions;
		});
	};

	$scope.accountOptions = salesForce.accountOptions;
	$scope.search = '';

	$scope.searchAccount = function (search) {
		salesForce.findAccountByName(search);
		angular.element('#search').triggerHandler('click');
		$scope.search = '';
	};

	$scope.loadAccount = function (id) {
		salesForce.loadAccount(id);
		salesForce.accountOptions = [];
		$scope.accountOptions = [];
		console.log("Loading account : " + id);
		angular.element('#search').triggerHandler('click');
	};

	salesForce.registerObserverCallback(updateSf);
});
