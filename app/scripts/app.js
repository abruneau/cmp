'use strict';

/**
 * @ngdoc overview
 * @name cmpApp
 * @description
 * # cmpApp
 *
 * Main module of the application.
 */
angular
	.module('cmpApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ui.bootstrap',
		'angular.filter',
		'ui.bootstrap.datetimepicker',
		'isoCurrency'
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/about', {
				templateUrl: 'views/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'about'
			})
			.when('/profile', {
				templateUrl: 'views/profile.html',
				controller: 'ProfileCtrl',
				controllerAs: 'profile'
			})
			.when('/account/:id', {
				templateUrl: 'views/account.html',
				controller: 'AccountCtrl',
				controllerAs: 'accounts'
			})
			.when('/accountForm', {
				templateUrl: 'views/accountform.html',
				controller: 'AccountformCtrl',
				controllerAs: 'accountForm'
			})
			.when('/account_form', {
				templateUrl: 'views/account_form.html',
				controller: 'AccountFormCtrl',
				controllerAs: 'accountForm'
			})
			.when('/todo', {
				templateUrl: 'views/todo.html',
				controller: 'TodoCtrl',
				controllerAs: 'todo'
			})
.when('/Scrumboard', {
  templateUrl: 'views/scrumboard.html',
  controller: 'ScrumboardCtrl',
  controllerAs: 'Scrumboard'
})
			.otherwise({
				redirectTo: '/'
			});
	});
