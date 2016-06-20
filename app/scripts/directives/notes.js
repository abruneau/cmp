'use strict';

/**
 * @ngdoc directive
 * @name cmpApp.directive:notes
 * @description
 * # notes
 */
angular.module('cmpApp')
	.directive('notes', function () {
		return {
			templateUrl: 'views/account_notes.html',
			restrict: 'E',
			controller: 'AccountNotesCtrl',
			controllerAs: 'notes'
		};
	});
