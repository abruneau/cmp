'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:AccountsCtrl
 * @description
 * # AccountsCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountCtrl', function ($scope, $routeParams, $timeout, Accounts, salesForce, localAccount) {

	var remote = require('electron').remote;
	var dialog = remote.dialog; // Load the dialogs component of the OS
	var accountId = $routeParams.id;

	var updateAccounts = function () {
		$scope.accountList = Accounts.list;
		$scope.account = Accounts.selected;
		$scope.opportunities = Accounts.opportunities;
	};

	var updateLocalInfo = function () {
		$scope.localInfo = localAccount.selected;
	};

	$scope.localInfo = {
		path: '',
		saveNoteLocaly: false,
		group: '',
		attributes: {
			type: 'LocalInfo'
		},
		accountId: accountId
	};

	$scope.accountList = Accounts.list;
	$scope.account = Accounts.selected;
	$scope.opportunities = Accounts.opportunities;

	$scope.updateOpportunities = function () {
		salesForce.loadOpportunities($scope.account.Id);
	};

	$scope.selectDirectory = function () {
		dialog.showOpenDialog({
			properties: ['openDirectory']
		}, function (path) {
			$scope.$apply(function () {
				$scope.localInfo.path = path[0];
			});
		});
	};

	$scope.updateLocalInfo = function () {

		if ($scope.localInfo._id) {
			localAccount.update($scope.localInfo);
		} else {
			$scope.localInfo.accountId = $scope.account.Id;
			localAccount.insert($scope.localInfo);
		}
	};

	Accounts.get(accountId);
	localAccount.get(accountId);
	Accounts.registerObserverCallback(updateAccounts);
	localAccount.registerObserverCallback(updateLocalInfo);

});
