'use strict';

/**
 * @ngdoc service
 * @name cmpApp.Todos
 * @description
 * # Todos
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('Todos', function (database) {
	var self = this;

	var list = [];
	var observerCallbacks = [];

	//call this when you know 'foo' has been changed
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	var getAll = function () {
		database.find({
			"attributes.type": 'Todo'
		}, function (err, docs) {
			if (err) {
				console.log(err);
			}
			if (docs) {
				self.list = docs;
				notifyObservers();
			}
		});
	};

	var add = function (newTodo) {
		database.insert(newTodo, function (err, newDoc) {
			if (!err && newDoc) {
				getAll();
			} else {
				console.log(err);
			}
		});
	};

	var update = function (todo) {
		database.update({
			_id: todo._id
		}, todo, {}, function (err) {
			if (!err) {
				getAll();
			} else {
				console.log(err);
			}
		});
	};

	var del = function (todo) {
		database.remove({_id: todo._id}, {}, function (err) {
			if (err) {
				console.log(err);
			} else {
				getAll();
			}
		});
	};



	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};
	self.list = list;

	self.getAll = getAll;
	self.add = add;
	self.update = update;
	self.del = del;

	return self;
});
