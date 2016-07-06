'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('ProfileCtrl', function (salesForce, Settings, $scope) {

	var updateSf = function () {
		$scope.$apply(function () {
			$scope.sf = salesForce.settings;
			$scope.identity = salesForce.identity;
			$scope.connected = salesForce.connected;
		});
	};

	var updateSettings = function () {
		$scope.$apply(function () {
			$scope.settings = Settings.settings;
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

	$scope.getDesc = function () {
		salesForce.getDesc();
	};

	$scope.saveSettings = function (set) {
		Settings.update(set);
	};

	salesForce.registerObserverCallback(updateSf);
	Settings.registerObserverCallback(updateSettings);

	Settings.get();

});
