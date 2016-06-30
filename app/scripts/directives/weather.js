'use strict';

/**
 * @ngdoc directive
 * @name cmpApp.directive:Weather
 * @description
 * # Weather
 */
angular.module('cmpApp')
	.directive('weather', function () {
		return {
			templateUrl: 'views/weather.html',
			restrict: 'E',
			controller: 'WeatherCtrl',
			controllerAs: 'weather'
		};
	});
