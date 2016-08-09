'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:WeatherCtrl
 * @description
 * # WeatherCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('WeatherCtrl', function ($scope) {

	/* global $ */

	// Docs at http://simpleweatherjs.com

	$scope.weather = null;

	function loadWeather(location, woeid) {
		$.simpleWeather({
			location: location,
			woeid: woeid,
			unit: 'c',
			success: function (weather) {
				$scope.$apply(function () {
					$scope.weather = weather;
				});
			},
			error: function (error) {
				$("#weatherError").html('<p>' + error + '</p>');
			}
		});
	}

	$(document).ready(function () {
		loadWeather('Paris', ''); //@params location, woeid

		navigator.geolocation.getCurrentPosition(function (position) {
			loadWeather(position.coords.latitude + ',' + position.coords.longitude); //load weather using your lat/lng coordinates
		});
	});


});
