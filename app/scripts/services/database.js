'use strict';

var Datastore = require('nedb');
// var db = new Datastore({
// 	filename: 'cmp.db',
// 	autoload: true
// });

/**
 * @ngdoc service
 * @name cmpApp.database
 * @description
 * # database
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('database', function () {

	var remote = require('electron').remote;
	var app = remote.app;
	var path = require('path');

	var db = new Datastore({
		filename: path.join(app.getPath('userData'), 'cmp.db'),
		autoload: true
	});

	return db;
});
