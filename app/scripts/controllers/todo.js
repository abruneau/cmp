'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:TodoCtrl
 * @description
 * # TodoCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('TodoCtrl', function ($scope, $filter, $routeParams, Todos) {

	/*global moment */

	var updateTodos = function () {
		$scope.$apply(function () {
			$scope.todos = Todos.list;
		});
	};

	$scope.todos = [];

	Todos.getAll();
	Todos.registerObserverCallback(updateTodos);

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function () {
		$scope.remainingCount = $filter('filter')($scope.todos, {
			completed: false
		}).length;
		$scope.completedCount = $scope.todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
	}, true);

	// Monitor the current route for changes and adjust the filter accordingly.
	$scope.changeStatus = function (stat) {
		var status = $scope.status = stat || '';
		$scope.statusFilter = (status === 'active') ? {
			completed: false
		} : (status === 'completed') ? {
			completed: true
		} : {};
	};

	$scope.addTodo = function () {

		if (!$scope.newTodo.task) {
			return;
		}

		var newTodo = {
			attributes: {
				type: 'Todo'
			},
			task: $scope.newTodo.task.trim(),
			dueDate: $scope.newTodo.dueDate,
			completed: false
		};

		$scope.saving = true;
		Todos.add(newTodo);
		$scope.newTodo = '';
		$scope.saving = false;
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

	$scope.saveEdits = function (todo, event) {
		// Blur events are automatically triggered after the form submit event.
		// This does some unfortunate logic handling to prevent saving twice.
		if (event === 'blur' && $scope.saveEvent === 'submit') {
			$scope.saveEvent = null;
			return;
		}

		$scope.saveEvent = event;

		if ($scope.reverted) {
			// Todo edits were reverted-- don't save.
			$scope.reverted = null;
			return;
		}

		todo.task = todo.task.trim();

		if (todo.task === $scope.originalTodo.task) {
			$scope.editedTodo = null;
			return;
		}

		if (todo.task) {
			Todos.update(todo);
			$scope.editedTodo = null;
		} else {
			Todos.del(todo);
			var index = $scope.todos.indexOf(todo);
			$scope.todo.splice(index, 1);
		}
	};

	$scope.revertEdits = function (todo) {
		$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
		$scope.editedTodo = null;
		$scope.originalTodo = null;
		$scope.reverted = true;
	};

	$scope.removeTodo = function (todo) {
		Todos.del(todo);
		var index = $scope.todos.indexOf(todo);
		$scope.todos.splice(index, 1);
	};

	$scope.saveTodo = function (todo) {
		Todos.update(todo);
	};

	$scope.toggleCompleted = function (todo, completed) {
		if (angular.isDefined(completed)) {
			todo.completed = completed;
		}

		Todos.update(todo);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos.forEach(function (todo) {
			if (todo.completed) {
				$scope.removeTodo(todo);
			}
		});
	};

	$scope.markAll = function (completed) {
		$scope.todos.forEach(function (todo) {
			if (todo.completed !== completed) {
				$scope.toggleCompleted(todo, completed);
			}
		});
	};

	$scope.formatDate = function (date) {
		date = moment(date);
		return date.calendar();
		// if (date.isSame(moment(), 'day')) {
		//     // date is Today
		//     return 'Today ' + date.format('HH:mm');
		// } else if (date.isSame(moment().add(1, 'days'), 'day')) {
		//     return 'Tomorrow ' + date.format('HH:mm');
		// } else if (date.isSame(moment(), 'week')) {
		//     return 'This week ' + date.format('ddd HH:mm');
		// } else {
		//     return date.format();
		// }
	};
});
