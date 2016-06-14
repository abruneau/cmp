'use strict';

/**
 * @ngdoc directive
 * @name cmpApp.directive:navigation
 * @description
 * # navigation
 */
angular.module('cmpApp')
	.directive('navigation', function () {
		return {
			templateUrl: 'views/navigation.html',
			restrict: 'E',
			controller: 'NavigationCtrl',
			controllerAs: 'navigation'
		};
	});
