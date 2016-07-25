'use strict';

/**
 * @memberof cmpApp
 * @ngdoc controller
 * @name MainCtrl
 * @param $scope {service} controller scope
 * @param Todos {service} Todos service
 * @description
 * # MainCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('MainCtrl', function ($scope, Todos) {

	/*global moment */

	function filterTodos(todos) {
		var out = [];
		for (var i in todos) {
			var todo = todos[i];
			if (moment(todo.dueDate).isSameOrBefore(moment(), 'day')) {
				out.push(todo);
			}
		}
		return out;
	}


	var updateTodos = function () {
		$scope.$apply(function () {
			$scope.todos = filterTodos(Todos.list);
		});
	};

	$scope.todos = [];

	$scope.isLate = function (todo) {
		if (moment(todo.dueDate).isBefore(moment(), 'day')) {
			return {'background-color':'#f2dede'};
		}
	};

	$scope.toggleCompleted = function (todo, completed) {
		if (angular.isDefined(completed)) {
			todo.completed = completed;
		}
		Todos.update(todo);
	};

	Todos.getAll();
	Todos.registerObserverCallback(updateTodos);
});
