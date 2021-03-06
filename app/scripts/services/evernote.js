'use strict';

/**
 * @ngdoc service
 * @name cmpApp.evernote
 * @description
 * # evernote
 * Factory in the cmpApp.
 */
angular.module('cmpApp').factory('evernote', function (evernoteOsa, $rootScope) {
	/*global toMarkdown */

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

	//////////////
	// Notebook //
	//////////////

	var notebookExists = function (name) {
		var deasync = require('deasync');
		var osa = deasync(osascript);
		try {
			return JSON.parse(osa(evernoteOsa.notebookExists(name), {
				flags: ['-s', 's'],
				type: 'AppleScript'
			}));
		} catch (e) {
			console.log(e);
		}
	};

	var createNotebook = function (name) {
		osascript(evernoteOsa.createNotebook(name), {
			flags: ['-s', 's']
		}, function (err) {
			if (err) {
				console.log(err);
			}
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
				self.noteList = JSON.parse(result);
				// self.noteList = JSON.parse(result.toString());
				notifyObservers();
			}
		});
	};

	//////////
	// Note //
	//////////

	var getNoteInfo = function (note) {
		if (note) {
			osascript(evernoteOsa.getNoteInfo(note), {
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

	var getHtml = function (note) {
		osascript(evernoteOsa.getHtml(note), {
			flags: ['-s', 's']
		}, function (err, result) {
			if (err) {
				console.log(err);
			}
			if (result) {
				self.html = result.replace(/\\n/g, '').replace(/\"/g, '').replace(/\\/g, '');
				notifyObservers();
			}
		});
	};

	var getHtmlSync = function (note) {
		var deasync = require('deasync');
		var osa = deasync(osascript);
		try {
			return osa(evernoteOsa.getHtml(note), {
				flags: ['-s', 's']
			});
		} catch (e) {
			console.log(e);
		}
	};

	var updateHtml = function (note, newHtml) {
		osascript(evernoteOsa.updateHtml(note, newHtml), {
			flags: ['-s', 's']
		}, function (err) {
			if (err) {
				console.log(err);
			}
		});
	};

	var createNote = function (title, notebook) {
		osascript(evernoteOsa.createNote(title, notebook), {
			flags: ['-s', 's']
		}, function (err) {
			if (err) {
				console.log(err);
			} else {
				getNoteList(notebook);
			}
		});
	};

	var createNoteWithHtml = function (title, notebook, html) {
		osascript(evernoteOsa.createNote(title, notebook, html), {
			flags: ['-s', 's']
		}, function (err) {
			if (err) {
				console.log(err);
			} else {
				getNoteList(notebook);
			}
		});
	};

	var deleteNote = function (note) {
		osascript(evernoteOsa.deleteNote(note), {
			flags: ['-s', 's']
		}, function (err) {
			if (err) {
				console.log(err);
			} else {
				self.html = null;
				getNoteList(note.notebook);
			}
		});
	};

	var openNote = function (note) {
		osascript(evernoteOsa.openNote(note), {
			flags: ['-s', 's'],
			type: 'AppleScript'
		}, function (err) {
			if (err) {
				console.log(err);
			}
		});
	};

	var Html2md = function (html) {

		var cheerio = require('cheerio'),
			$ = cheerio.load(html);

		// TOC
		$('.table-of-contents').replaceWith('{!toc}');

		// Checkbox
		$("input[type=checkbox]").each(function () {
			var md = "";
			if ($(this).checked) {
				md += "[x]";
			} else {
				md += "[ ]";
			}
			var text = $(this).parentElement.childNodes[1].textContent;
			md += " " + text;

			$(this).replaceWith(md);
		});

		html = $.html();
		html = html.replace(/nobreakspace/g, '&nbsp;');
		var markdown = toMarkdown(html).replace(/&#xA0;/g, ' ').replace(/&nbsp;/g, '     ');
		markdown = markdown.replace(/\n\*\s\*\s\*\s*\n/g, '\n------\n');
		markdown = markdown.replace(/(^|\n)((?:)|(?:[>\s]+))\*\s{3}/g, '$1$2-   ');
		markdown = markdown.replace(/<div id=\"en-note\">/g, "");
		markdown = markdown.replace("</div>", "");

		return markdown;

	};

	//register an observer
	self.registerObserverCallback = function (callback) {
		observerCallbacks.push(callback);
	};

	// Variables
	self.noteList = noteList;
	self.noteInfo = noteInfo;
	self.html = html;

	// Functions
	self.notebookExists = notebookExists;
	self.createNotebook = createNotebook;
	self.getNoteList = getNoteList;
	self.getNoteInfo = getNoteInfo;
	self.getHtml = getHtml;
	self.getHtmlSync = getHtmlSync;
	self.updateHtml = updateHtml;
	self.Html2md = Html2md;
	self.createNote = createNote;
	self.createNoteWithHtml = createNoteWithHtml;
	self.deleteNote = deleteNote;
	self.openNote = openNote;

	return self;
});
