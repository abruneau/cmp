'use strict';

/**
 * @ngdoc service
 * @name Scrumboard
 * @description
 * # Scrumboard
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('Scrumboard', function (database) {
	var self = this;

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
			type: 'Scrumboard-columns'
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

	self.getColumns = function () {
		database.findOne({
			"attributes.type": 'Scrumboard-columns'
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

	self.getCards = function () {
		database.find({
			"attributes.type": 'Scrumboard-card'
		}, function (err, docs) {
			if (err) {
				console.log(err);
			}
			if (docs) {
				self.cards = docs;
				notifyObservers();
			}
		});
	};

	self.add = function (newObj) {
		database.insert(newObj, function (err) {
			if (err) {
				console.log(err);
			} else {
				self.cards.push(newObj);
			}
		});
	};

	self.update = function (obj) {

		if (obj.attributes.type === 'Scrumboard-card') {
			database.update({
				id: obj.id
			}, obj, {}, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log(obj);
				}
			});
		} else {
			database.update({
				_id: obj._id
			}, obj, {}, function (err) {
				if (err) {
					console.log(err);
				}
			});
		}
	};

	self.del = function (obj) {
		database.remove({
			_id: obj._id
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
