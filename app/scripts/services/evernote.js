'use strict';

/**
 * @ngdoc service
 * @name cmpApp.evernote
 * @description
 * # evernote
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('evernote', function (evernoteOsa, $rootScope) {
	var self = this;

	var observerCallbacks = [];
	var osascript = require('osascript').eval;
	var noteList = [];
	var noteInfo = null;
	var html = null;

	$rootScope.$on('$locationChangeSuccess', function () {
		self.noteInfo = null;
		self.html = null;
	});

	//call this when you know 'foo' has been changed
	var notifyObservers = function () {
		angular.forEach(observerCallbacks, function (callback) {
			callback();
		});
	};

	var getNoteList = function (notebook) {
		osascript(evernoteOsa.getNoteList(notebook), {
			flags: ['-s', 's']
		}, function (err, result) {
			if (err) {
				console.log(err);
			}
			if (result) {
				self.noteList = JSON.parse(result.toString());
				notifyObservers();
			}
		});
	};

	var getNoteInfo = function (link) {
		console.log(link);
		if (link) {
			osascript(evernoteOsa.getNoteInfo(link), {
				flags: ['-s', 's']
			}, function (err, result) {
				if (err) {
					console.log(err);
				}
				if (result) {
					self.noteInfo = JSON.parse(result.toString());
					notifyObservers();
				}
			});
		}
	};

	var getHtml = function (link) {
		osascript(evernoteOsa.getHtml(link), {
			flags: ['-s', 's']
		}, function (err, result) {
			if (err) {
				console.log(err);
			}
			if (result) {
				self.html = result.replace(/\\n/g, '<br/>').replace(/\"/g, '');
				notifyObservers();
			}
		});
	};

	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};
	self.noteList = noteList;
	self.noteInfo = noteInfo;
	self.html = html;
	self.getNoteList = getNoteList;
	self.getNoteInfo = getNoteInfo;
	self.getHtml = getHtml;

	return self;
});
