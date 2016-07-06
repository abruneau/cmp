'use strict';

/**
 * @ngdoc service
 * @name cmpApp.Settings
 * @description
 * # Settings
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('Settings', function (database) {
	var self = this;

	var observerCallbacks = [];

	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	function init() {
		var setting = {
			noteSaveMode: 'l',
			attributes: {
				type: 'Settings'
			}
		};

		database.insert(setting, function (err, newDoc) {
			if (err) {
				console.log(err);
			} else {
				self.settings = newDoc;
				notifyObservers();
			}
		});
	}

	self.update = function (set) {
		database.update({
			_id: set._id
		}, set, {}, function (err) {
			if (!err) {
				self.settings = set;
				notifyObservers();
			} else {
				console.log(err);
			}
		});
	};

	self.get = function () {
		database.findOne({
			"attributes.type": 'Settings'
		}, function (err, doc) {
			if (doc) {
				self.settings = doc;
				notifyObservers();
			} else if (err) {
				console.log(err);
			} else {
				init();
			}
		});
	};

	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};

	return self;
});
