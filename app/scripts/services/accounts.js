'use strict';

/**
 *
 * @memberof cmpApp
 * @ngdoc service
 * @name cmpApp.Accounts
 * @param {service} database local database service
 * @description
 * # Accounts
 * Service in the cmpApp.
 */
angular.module('cmpApp').factory('Accounts', function (database) {
	var self = this;

	var accountList = [];
	var opportunities = [];
	var observerCallbacks = [];
	var selectedAccount = null;

	//call this when you know 'foo' has been changed
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	/**
	 * Update accout list from database
	 * @memberof Accounts
	 */
	var updateList = function () {
		database.find({
			"attributes.type": 'Account'
		}, {
			Name: 1,
			Id: 1,
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

	var getOpportunities = function (id) {
		database.find({
			AccountId: id
		}, function (err, docs) {
			if (docs) {
				self.opportunities = docs;
				notifyObservers();
			}
			if (err) {
				console.log(err);
			}
		});
	};

	var get = function (id) {
		database.findOne({
			Id: id
		}, function (err, doc) {
			if (doc) {
				self.selected = doc;
				getOpportunities(id);
				notifyObservers();
			}
			if (err) {
				console.log(err);
			}
		});
	};


	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};
	self.list = accountList;
	self.opportunities = opportunities;
	self.updateList = updateList;
	self.selected = selectedAccount;
	self.get = get;
	self.getOpportunities = getOpportunities;

	return self;
});
