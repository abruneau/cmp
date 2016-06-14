'use strict';

var Datastore = require('nedb');
var db = new Datastore({ filename: 'cmp.db', autoload: true });

/**
 * @ngdoc service
 * @name cmpApp.database
 * @description
 * # database
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('database', function () {
	return db;
});
