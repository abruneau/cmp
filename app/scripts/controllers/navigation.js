'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:NavigationCtrl
 * @description
 * # NavigationCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('NavigationCtrl', function (salesForce, $scope, Accounts, localAccount) {

	/* global $ */

	function mergeData() {
		if ($scope.accountList && $scope.localInfoList) {
			var result = [];
			for (var i in $scope.accountList) {
				var out  = $scope.accountList[i];
				var lil = $scope.localInfoList.filter(function (obj) {
					return obj.accountId ===  $scope.accountList[i].Id;
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

	var setContentHeight = function () {
		// reset height
		$('.right_col').css('min-height', $(window).height());

		var bodyHeight = $('body').outerHeight(),
			footerHeight = $('body').hasClass('footer_fixed') ? 0 : $('footer').height(),
			leftColHeight = $('.left_col').eq(1).height() + $('.sidebar-footer').height(),
			contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

		// normalize content
		contentHeight -= $('.nav_menu').height() + footerHeight;

		$('.right_col').css('min-height', contentHeight);
	};

	$scope.slide = function ($event) {
		var $li = $($event.currentTarget).parent();

		if ($li.is('.active')) {
			$li.removeClass('active active-sm');
			$('ul:first', $li).slideUp(function () {
				setContentHeight();
			});
		} else {
			// prevent closing menu if we are on child menu
			if (!$li.parent().is('.child_menu')) {
				$('#sidebar-menu li').removeClass('active active-sm');
				$('#sidebar-menu li ul').slideUp();
			}

			$li.addClass('active');

			$('ul:first', $li).slideDown(function () {
				setContentHeight();
			});
		}
	};

	$scope.toggle = function () {
		var BODY = $('body');
		var SIDEBAR_MENU = $('#sidebar-menu');

		if (BODY.hasClass('nav-md')) {
            SIDEBAR_MENU.find('li.active ul').hide();
            SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            SIDEBAR_MENU.find('li.active-sm ul').show();
            SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
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
});
