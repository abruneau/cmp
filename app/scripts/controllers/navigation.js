'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('NavigationCtrl', function (salesForce, $scope, $window, Accounts, localAccount, $timeout) {

	/* global moment */

	function mergeData() {
		if ($scope.accountList && $scope.localInfoList) {
			var result = [];
			for (var i in $scope.accountList) {
				var out = $scope.accountList[i];
				var lil = $scope.localInfoList.filter(function (obj) {
					return obj.accountId === $scope.accountList[i].Id;
				})[0];

				if (lil && lil.group) {
					out.group = lil.group;
				} else {
					out.group = "Unnamed";
				}
				result.push(out);
			}

			$scope.list = result;
		}
	}

	var updateSf = function () {
		$scope.identity = salesForce.identity;
	};

	var updateAccounts = function () {
		$scope.accountList = Accounts.list;
		mergeData();
	};

	var updateLocalInfo = function () {
		$scope.localInfoList = localAccount.list;
		mergeData();
	};

	function TimeCtrl() {
		var tickInterval = 1000; //ms

		var tick = function () {
			$scope.$apply(function () {
				$scope.clock = moment().format("dddd, MMMM Do YYYY, HH:mm"); // get the current time
				$timeout(tick, tickInterval); // reset the timer
			});
		};

		// Start the timer
		$timeout(tick, tickInterval);
	}

	$scope.clock = "loading clock..."; // initialise the time variable

	$scope.slide = function ($event) {
		var $li = angular.element($event.currentTarget).parent();

		if ($li.hasClass('active')) {
			angular.element($li.find('ul')[0]).addClass('hide');
			$li.removeClass('active active-sm');
		} else {
			$li.parent().find('li').removeClass('active active-sm');
			$li.parent().find('ul').addClass('hide');

			$li.addClass('active');
			angular.element($li.find('ul')[0]).removeClass('hide');
		}
	};

	$scope.toggle = function () {
		var BODY = angular.element(document.querySelector('body'));
		var SIDEBAR_MENU = angular.element(document.querySelector('#sidebar-menu'));

		if (BODY.hasClass('nav-md')) {
			angular.element(SIDEBAR_MENU[0].querySelector('li.active ul')).addClass('display-hide');
			angular.element(SIDEBAR_MENU[0].querySelector('li.active')).addClass('active-sm').removeClass('active');
		} else {
			angular.element(SIDEBAR_MENU[0].querySelector('li.active-sm ul')).removeClass('display-hide');
			angular.element(SIDEBAR_MENU[0].querySelector('li.active-sm')).addClass('active').removeClass('active-sm');
		}

		BODY.toggleClass('nav-md nav-sm');

	};

	$scope.homeIsCollapsed = false;
	$scope.identity = salesForce.identity;
	$scope.accountList = Accounts.list;
	$scope.localInfoList = localAccount.list;
	$scope.list = null;

	salesForce.registerObserverCallback(updateSf);
	Accounts.updateList();
	localAccount.updateList();
	Accounts.registerObserverCallback(updateAccounts);
	localAccount.registerObserverCallback(updateLocalInfo);
	TimeCtrl();

});
