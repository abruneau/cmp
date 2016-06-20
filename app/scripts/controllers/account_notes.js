'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:AccountNotesCtrl
 * @description
 * # AccountNotesCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountNotesCtrl', function (evernote, Accounts, $scope, $sce) {

	/*global moment */

	var updateEvernote = function () {
		$scope.$apply(function () {
			$scope.noteList = evernote.noteList;
			$scope.note = evernote.noteInfo;
			$scope.html = $sce.trustAsHtml(evernote.html);
		});
	};

	var updateAccounts = function () {
		$scope.$apply(function () {
			$scope.account = Accounts.selected;
			if ($scope.account) {
				evernote.getNoteList($scope.account.Name);
			}
		});
	};

	$scope.noteList = evernote.noteList;
	$scope.note = evernote.noteInfo;
	$scope.account = Accounts.selected;
	$scope.html = $sce.trustAsHtml(evernote.html);

	$scope.formatDate = function (date) {
		return moment(date).calendar();
	};

	$scope.loadNote = function (link) {
		evernote.getHtml(link);
		evernote.getNoteInfo(link);
	};

	//evernote.getNoteList($scope.account.Name);
	evernote.registerObserverCallback(updateEvernote);
	Accounts.registerObserverCallback(updateAccounts);

});
