'use strict';

/**
 * @ngdoc service
 * @name cmpApp.Notes
 * @description
 * # Notes
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('Notes', function (Fs) {
	var self = this;

	function getNoteInfo(path, notebook) {
		var title = Fs.fileName(path).replace('.md', '');
		var creationDate = Fs.creationDate(path);
		var out = {
			title: title,
			creationDate: creationDate,
			path: path
		};

		if (notebook) {
			out.notebook = notebook;
		}
		return out;
	}

	self.folderExist = function (path) {
		return Fs.exists(path + '/notes');
	};

	self.createFolder = function (path) {
		Fs.mkdir('notes', path);
	};

	self.getNoteList = function (path, notebook) {
		var list = Fs.ls(path + '/notes');

		list = list.filter(function (el) {
			return el.directory === false && el.type === '.md';
		});

		var out = [];

		for (var i in list) {
			out.push(getNoteInfo(list[i].path, notebook));
		}

		return out;
	};

	self.getMd = function (path) {
		return Fs.read(path);
	};

	self.updateMd = function (path, md) {
		return Fs.write(path, md);
	};

	self.createNote = function (name, p) {
		var path = p + '/notes/' + name + '.md';
		var md = "## Table of Content \r \r {!toc} \r \r # Title 1";

		return Fs.write(path, md);
	};

	self.deleteNote = function (path) {
		Fs.rm(path);
	};

	return self;
});
