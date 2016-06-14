'use strict';

/**
 * @ngdoc directive
 * @name cmpApp.directive:sidebar
 * @description
 * # sidebar
 */
angular.module('cmpApp').directive('sidebar', function () {
	return {
		templateUrl: 'views/_sidebar.html',
		restrict: 'E',
		controller: 'SidebarCtrl',
        controllerAs: 'sidebar'
	};
});
