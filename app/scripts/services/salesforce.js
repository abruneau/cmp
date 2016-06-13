'use strict';

var jsforce = require('jsforce');

/**
 * @ngdoc service
 * @name cmpApp.salesForce
 * @description
 * # salesForce
 * Service in the cmpApp.
 */
angular.module('cmpApp').factory('salesForce', function (database) {
	var self = this;

	var connection;
	var connected = false;
	var observerCallbacks = [];

	function Sf() {
		this.setting = 'sf';
		this.loginUrl = '';
		this.email = '';
		this.password = '';
		this.token = '';
	}

	function Identity() {
		this.setting = 'identity';
	}

	var identity = new Identity();
	var settings = new Sf();

	//call this when you know 'foo' has been changed
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	function settingsAreComplit() {
		if (self.setting._id && self.setting.loginUrl && self.setting.email && self.setting.password && self.setting.token) {
			return true;
		} else {
			return false;
		}
	}

	var connect = function () {
		if (settingsAreComplit) {
			connection = new jsforce.Connection({
				loginUrl: self.settings.loginUrl
			});

			connection.login(self.settings.email, self.settings.password.concat(self.settings.token), function (err) {
				if (err) {
					console.log(err);
				} else {
					self.connected = true;
					notifyObservers();
					console.log("Sf connection success");
				}

			});
		}
	};

	var updateIndentity = function () {
		console.log(" Connected " + connected);
		if (self.connected) {
			connection.identity(function (err, res) {
				if (err) {
					return console.error(err);
				}

				res._id = self.identity._id;
				res.setting = self.identity.setting;
				database.update({
					_id: self.identity._id
				}, res, {}, function (err) {
					if (!err) {
						self.identity = res;
						notifyObservers();
					} else {
						console.log(err);
					}
				});
			});
		}
	};

	function getSettings() {
		database.findOne({
			setting: 'sf'
		}, function (err, doc) {
			if (doc) {
				self.settings = doc;
				connect();
				notifyObservers();
			} else if (err) {
				console.log(err);
			} else {
				database.insert(settings, function (err, newDoc) { // Callback is optional
					if (!err && newDoc) {
						self.settings = newDoc;
						notifyObservers();
					} else {
						console.log(err);
					}
				});
			}
		});
	}

	function getIdentity() {
		database.findOne({
			setting: 'identity'
		}, function (err, doc) {
			if (doc) {
				self.identity = doc;
				notifyObservers();
			} else if (err) {
				console.log(err);
			} else {
				database.insert(identity, function (err, newDoc) { // Callback is optional
					if (!err && newDoc) {
						self.identity = newDoc;
						notifyObservers();
					} else {
						console.log(err);
					}
				});
			}
		});
	}

	var update = function (set) {
		database.update({
			_id: set._id
		}, set, {}, function (err) {
			if (!err) {
				self.settings = set;
				connect();
				notifyObservers();
			} else {
				console.log(err);
			}
		});
	};

	getSettings();
	getIdentity();

	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};
	self.settings = settings;
	self.identity = identity;
	self.update = update;
	self.connected = connected;
	self.updateIndentity = updateIndentity;

	return self;
});
