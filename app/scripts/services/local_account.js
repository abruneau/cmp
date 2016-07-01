'use strict';

/**
 * @ngdoc service
 * @name cmpApp.localAccount
 * @description
 * # localAccount
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('localAccount', function (database) {
	var self = this;

	var observerCallbacks = [];
	var selectedAccount = null;
	var accountList = [];

	//call this when you know 'foo' has been changed
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	var updateList = function () {
		database.find({
			"attributes.type": 'LocalInfo'
		}, {
			group: 1,
			accountId: 1,
			_id: 0
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

	var get = function (accountId) {
		database.findOne({
			accountId: accountId
		}, function (err, doc) {
			if (doc) {
				self.selected = doc;
				notifyObservers();
			}
			if (err) {
				console.log(err);
			}
		});
	};

	var insert = function (info) {
		database.insert(info, function (err, newDoc) {
			if (!err && newDoc) {
				self.selected = newDoc;
				updateList();
				notifyObservers();
			} else {
				console.log(err);
			}
		});
	};

	var update = function (info) {
		database.update({
			_id: info._id
		}, info, {}, function (err) {
			if (err) {
				console.log(err);
			} else {
				updateList();
			}
		});
	};

	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};

	self.selected = selectedAccount;
	self.list = accountList;

	self.updateList = updateList;
	self.get = get;
	self.insert = insert;
	self.update = update;

	return self;
});
