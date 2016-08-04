'use strict';

/**
 * @memberof cmpApp
 * @ngdoc controller
 * @name AccountFormCtrl
 * @param $scope {service} controller scope
 * @param salesForce {service} salesForce Service
 * @description
 * # AccountFormCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountFormCtrl', function ($scope, salesForce) {

	/**
	 * Observer Callback for salesForce Data
	 * @memberof AccountFormCtrl
	 * @function updateSf
	 */
	var updateSf = function () {
		$scope.$apply(function () {
			$scope.accountOptions = salesForce.accountOptions;
		});
	};

	$scope.accountOptions = salesForce.accountOptions;
	$scope.search = '';

	/**
	 * Search SalesForce account from key words
	 * @memberof AccountFormCtrl
	 * @function searchAccount
	 * @param  {String} search Account to search for
	 */
	$scope.searchAccount = function (search) {
		salesForce.findAccountByName(search);
		angular.element('#search').triggerHandler('click');
		$scope.search = '';
	};

	/**
	 * Load data of a SalesForce account
	 * @memberof AccountFormCtrl
	 * @function loadAccount
	 * @param  {String} id SalesForce account Id
	 */
	$scope.loadAccount = function (id) {
		salesForce.loadAccount(id);
		salesForce.accountOptions = [];
		$scope.accountOptions = [];
		console.log("Loading account : " + id);
		angular.element('#search').triggerHandler('click');
	};

	salesForce.registerObserverCallback(updateSf);
});
