'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:AccountNotesCtrl
 * @description
 * # AccountNotesCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountNotesCtrl', function (evernote, Notes, localAccount, Settings, Accounts, $scope, $sce, $window, $routeParams) {

	/*global moment */
	/*global $ */
	/*global EpicEditor */

	var accountId = $routeParams.id;

	var MarkdownIt = require('markdown-it')()
		.use(require('markdown-it-checkbox'))
		.use(require('markdown-it-emoji'))
		.use(require('markdown-it-highlightjs'))
		.use(require('markdown-it-contents'), {
			className: 'table-of-contents'
		});

	var markdown = function (md) {
		return MarkdownIt.render(md);
	};

	var opts = {
		container: 'epiceditor',
		textarea: 'my-edit-area',
		basePath: '../bower_components/EpicEditor/epiceditor/',
		clientSideStorage: false,
		localStorageName: 'epiceditor',
		useNativeFullscreen: true,
		parser: markdown,
		file: {
			name: 'epiceditor',
			defaultContent: '',
			autoSave: 100
		},
		theme: {
			base: '/themes/base/epiceditor.css',
			preview: '/themes/preview/github.css',
			editor: '/themes/editor/epic-dark.css'
		},
		button: {
			preview: true,
			fullscreen: true,
			bar: "auto"
		},
		focusOnLoad: false,
		shortcut: {
			modifier: 18,
			fullscreen: 70,
			preview: 80
		},
		string: {
			togglePreview: 'Toggle Preview Mode',
			toggleEdit: 'Toggle Edit Mode',
			toggleFullscreen: 'Enter Fullscreen'
		},
		autogrow: true
	};

	var localSave = false;
	var evernoteSave = false;
	var notebook = null;
	var evernoteList = [];

	function testSync() {
		if (evernoteSave && localSave) {
			$scope.syncOption = true;
		}
	}

	var updateEvernote = function () {
		if ($scope.notebookExists === false) {
			evernote.createNotebook(notebook);
		}
		if (evernoteSave && !localSave) {
			$scope.noteList = evernote.noteList;
			$scope.html = $sce.trustAsHtml(evernote.html);
			if ($scope.html) {
				$scope.md = evernote.Html2md($scope.html.toString());
			}
		} else {
			evernoteList = evernote.noteList;
			testSync();
		}
	};

	function init() {
		if ($scope.settings && $scope.localInfo) {
			notebook = Accounts.selected.Name;
			if ($scope.settings.noteSaveMode.indexOf('e') > -1) {
				evernoteSave = true;
				evernote.registerObserverCallback(updateEvernote);
				$scope.notebookExists = evernote.notebookExists(notebook);
				evernote.getNoteList(notebook);
			}
			if ($scope.settings.noteSaveMode.indexOf('l') > -1) {
				localSave = true;
				var path = $scope.localInfo.path;
				if (path) {
					if (!Notes.folderExist(path)) {
						Notes.createFolder(path);
					}
					$scope.noteList = Notes.getNoteList(path, notebook);
				} else {
					console.log("Path not set");
				}
			}
		}
	}

	var updateSettings = function () {
		$scope.$apply(function () {
			$scope.settings = Settings.settings;
			init();
		});
	};

	var updateLocalInfo = function () {
		$scope.localInfo = localAccount.selected;
		init();
	};

	$scope.notebookExists = true;
	$scope.editMode = false;
	$scope.note = null;
	$scope.newNoteTitle = '';
	$scope.md = '';
	$scope.syncOption = false;

	$scope.formatDate = function (date) {
		return moment(date).calendar();
	};

	$scope.loadNote = function (note) {
		$scope.note = note;
		$scope.editMode = false;
		if (localSave) {
			$scope.md = Notes.getMd(note.path);
			$scope.html = $sce.trustAsHtml(MarkdownIt.render($scope.md));
		}
		if (evernoteSave && !localSave) {
			evernote.getHtml(note);
			evernote.getNoteInfo(note);
		}
	};

	$scope.createNotebook = function () {
		evernote.createNotebook(notebook);
	};

	$scope.createNote = function () {
		var title = $scope.newNoteTitle.replace(/\\/g, '.');
		if (localSave) {
			Notes.createNote(title, $scope.localInfo.path);
			$scope.noteList = Notes.getNoteList($scope.localInfo.path);
		}
		if (evernoteSave) {
			evernote.createNote(title, notebook);
		}
		$scope.newNoteTitle = '';
	};

	$scope.deleteNote = function (note) {
		if (note) {
			var r = $window.confirm("Please confirm deletion of note " + note.title);
			if (r) {
				$scope.note = null;
				$scope.html = '';
				if (localSave) {
					Notes.deleteNote(note.path);
					$scope.noteList = Notes.getNoteList($scope.localInfo.path);
				}
				if (evernoteSave) {
					evernote.deleteNote(note);
				}
			}
		}
	};

	$scope.changeEditMode = function () {
		$scope.editMode = !$scope.editMode;
		if (!$scope.editMode) {
			$scope.md = $("#my-edit-area").val();
			var newHtml = MarkdownIt.render($scope.md.toString());
			$scope.html = $sce.trustAsHtml(newHtml);
		} else {
			setTimeout(function () {
				new EpicEditor(opts).load();
			}, 200);
		}

	};

	$scope.save = function (note) {
		if ($scope.editMode) {
			$scope.md = $("#my-edit-area").val();
			var newHtml = MarkdownIt.render($scope.md.toString());
			$scope.html = $sce.trustAsHtml(newHtml);
		}
		if (localSave) {
			Notes.updateMd(note.path, $scope.md);
		}
		if (evernoteSave) {
			evernote.updateHtml(note, $scope.html);
		}
	};

	$scope.open = function (note) {
		if (evernoteSave) {
			evernote.openNote(note);
		}
	};

	$scope.syncNotes = function () {

		for (var i in evernoteList) {
			var match = $.grep($scope.noteList, function (e) {
				return e.title === evernoteList[i].title;
			});
			if (match.length === 0) {
				var html = evernote.getHtmlSync(evernoteList[i]);
				var md = evernote.Html2md(html.toString());
				var path = $scope.localInfo.path + '/notes/' + evernoteList[i].title.replace(/\//g, '.') + '.md';
				Notes.updateMd(path, md);
			}
		}

		var noteList = $scope.noteList;

		for (var j in noteList) {
			var match2 = $.grep(evernoteList, function (e) {
				return e.title == noteList[i].title;
			});
			if (match2.length === 0) {
				var md2 = Notes.getMd(noteList[j].path);
				var html2 = MarkdownIt.render(md2);
				var title = noteList[j].title;
				evernote.createNoteWithHtml(title, notebook, html2);
			}
		}
		$scope.noteList = Notes.getNoteList($scope.localInfo.path);
	};

	Settings.registerObserverCallback(updateSettings);
	localAccount.registerObserverCallback(updateLocalInfo);

	Settings.get();
	localAccount.get(accountId);

});
