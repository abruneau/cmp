'use strict';

/**
 * @memberof cmpApp
 * @ngdoc controller
 * @name AccountCtrl
 * @param $scope {service} controller scope
 * @param $routeParams {service} route scope
 * @param $timeout {service} angular timeout
 * @param Accounts {service} Accounts service
 * @param salesForce {service} salesForce service
 * @param localAccount {service} localAccount service
 * @description
 * # AccountCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountCtrl', function ($scope, $routeParams, $timeout, Accounts, salesForce, localAccount) {

	var remote = require('electron').remote;
	var dialog = remote.dialog; // Load the dialogs component of the OS
	var accountId = $routeParams.id;

	/**
	 * Observer Callback for Accounts service
	 * @memberof AccountCtrl
	 * @function updateAccounts
	 */
	var updateAccounts = function () {
		$scope.accountList = Accounts.list;
		$scope.account = Accounts.selected;
		$scope.opportunities = Accounts.opportunities;
	};

	/**
	 * Observer Callback for local infos
	 * @memberof AccountCtrl
	 * @function updateLocalInfo
	 */
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
	$scope.showClosedOpport = false;

	/**
	 * Update opportunities for an account
	 * @memberof AccountCtrl
	 * @function updateOpportunities
	 */
	$scope.updateOpportunities = function () {
		salesForce.loadOpportunities($scope.account.Id);
	};

	/**
	 * Open Dialog to select local directory for the account
	 * @memberof AccountCtrl
	 * @function selectDirectory
	 */
	$scope.selectDirectory = function () {
		dialog.showOpenDialog({
			properties: ['openDirectory']
		}, function (path) {
			$scope.$apply(function () {
				$scope.localInfo.path = path[0];
			});
		});
	};

	/**
	 * Update local infos
	 * @memberof AccountCtrl
	 * @function updateLocalInfo
	 */
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
