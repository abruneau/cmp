'use strict';

/**
 * @ngdoc service
 * @name cmpApp.Fs
 * @description
 * # Fs
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('Fs', function () {
	var self = this;

	var fs = require('fs');
	var p = require('path');
	var exec = require('child_process').exec;

	function nativePath(path, name) {
		return fs.realpathSync(path + '/' + name);
	}

	function getCommandLine() {
		switch (process.platform) {
		case 'darwin':
			return 'open';
		case 'win32':
			return 'start "" ';
		case 'win64':
			return 'start "" ';
		default:
			return 'xdg-open';
		}
	}

	self.fileName = function (path) {
		return p.basename(path);
	};

	self.fileParent = function (path) {
		return fs.realpathSync(path + '/..');
	};

	self.open = function (path) {
		exec(getCommandLine() + ' "' + path + '"');
	};

	self.ls = function (path) {
		var output = [];

		// Check if it is a file or a folder
		if (fs.lstatSync(path).isFile()) {

			// Open the file with difault system application
			self.openFile(path);
		} else {

			// Get the list of files and folders
			var tree = fs.readdirSync(path);

			tree.forEach(function (entry) {

				if (entry.substring(0, 1) !== ".") {
					// Add list
					var file = {
						name: entry,
						path: nativePath(path, entry),
						directory: false
					};
					if (fs.lstatSync(nativePath(path, entry)).isDirectory()) {
						file.directory = true;
					} else {
						file.type = p.extname(entry);
					}

					output.push(file);
				}

			});

		}
		return output;
	};

	self.mkdir = function (name, path) {
		fs.accessSync(path, fs.R_OK | fs.W_OK);
		fs.mkdirSync(path + "/" + name);
	};

	self.exists = function (path) {
		try {
			fs.accessSync(path);
			return true;
		} catch (e) {
			return false;
		}
	};

	self.creationDate = function (path) {
		return fs.statSync(path).birthtime;
	};

	self.read = function (path) {
		return fs.readFileSync(path, 'utf8');
	};

	self.write = function (path, data) {
		return fs.writeFileSync(path, data);
	};

	self.rm = function (path) {
		return fs.unlinkSync(path);
	};

	self.breadcrum = function (path, root) {
		var out = [];
		if (path.indexOf(root) === 0) {

			out.push({
				index: 0,
				path: root,
				name: root
			});

			var p = root;
			var o = path.replace(root, '');
			var list = o.split("/");

			for (var i in list) {
				if (i > 0) {
					p = p + "/" + list[i];
					out.push({
						index: i,
						name: list[i],
						path: p
					});
				}

			}
		}

		return out;
	};

	return self;
});
