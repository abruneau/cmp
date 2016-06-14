'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('NavigationCtrl', function (salesForce, $scope) {
	var updateSf = function () {
		$scope.$apply(function () {
			$scope.identity = salesForce.identity;
		});
	};

	$scope.homeIsCollapsed = false;
	$scope.identity = salesForce.identity;

	salesForce.registerObserverCallback(updateSf);
});
