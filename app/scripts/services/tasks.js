'use strict';

/**
 * @ngdoc service
 * @name cmpApp.Tasks
 * @description
 * # Tasks
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('Tasks', function (database) {
	var self = this;

	var deasync = require('deasync');
	var syncDatabaseFind = deasync(database.find);

	var observerCallbacks = [];

	//call this when you know 'foo' has been changed
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	var columns = {
		list: [],
		attributes: {
			type: 'Tasks-columns'
		}
	};

	var task = {
		list: [],
		attributes: {
			type: 'Task'
		}
	};

	function init() {
		database.insert(columns, function (err, newDoc) {
			if (err) {
				console.log(err);
			} else {
				self.columns = newDoc;
				notifyObservers();
			}
		});
	}

	self.syncGetColumns = function () {
		try {
			return syncDatabaseFind({
				"attributes.type": 'Tasks-columns'
			});
		} catch (e) {
			console.log('Error : ' + e);
		}
	};

	self.getColumns = function () {
		database.findOne({
			"attributes.type": 'Tasks-columns'
		}, function (err, doc) {
			if (doc) {
				self.columns = doc;
				notifyObservers();
			} else if (err) {
				console.log(err);
			} else {
				init();
			}
		});
	};

	self.getTasks = function () {
		database.find({
			"attributes.type": 'Task'
		}, function (err, docs) {
			if (err) {
				console.log(err);
			}
			if (docs) {
				self.tasks = docs;
				notifyObservers();
			}
		});
	};

	self.add = function (newTask) {
		database.insert(newTask, function (err) {
			if (err) {
				console.log(err);
			} else {
				self.tasks.push(newTask);
			}
		});
	};

	self.update = function (task) {
		database.update({
			_id: task._id
		}, task, {}, function (err) {
			if (err) {
				console.log(err);
			}
		});
	};

	self.del = function (task) {
		database.remove({
			_id: task._id
		}, {}, function (err) {
			if (err) {
				console.log(err);
			}
		});
	};

	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};

	return self;
});
