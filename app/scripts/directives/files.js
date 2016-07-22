'use strict';

/**
 * @memberof cmpApp
 * @ngdoc directive
 * @name cmpApp.directive:files
 * @description
 * # files
 */
angular.module('cmpApp')
	.directive('files', function () {
		return {
			templateUrl: 'views/account_files.html',
			restrict: 'E',
			controller: 'AccountFilesCtrl',
			controllerAs: 'files'
		};
	});
