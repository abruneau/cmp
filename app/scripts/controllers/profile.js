'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('ProfileCtrl', function (salesForce, $scope) {

	var updateSf = function () {
		$scope.$apply(function () {
			$scope.sf = salesForce.settings;
			$scope.identity = salesForce.identity;
			$scope.connected = salesForce.connected;
		});
	};

	$scope.sf = salesForce.settings;
	$scope.identity = salesForce.identity;
	$scope.connected = salesForce.connected;
	$scope.result = null;

	$scope.saveSf = function (set) {
		salesForce.update(set);
	};

	$scope.updateIdentity = function () {
		console.log("Update identity");
		salesForce.updateIndentity();
	};

	salesForce.registerObserverCallback(updateSf);

});
