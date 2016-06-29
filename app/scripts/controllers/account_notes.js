'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:AccountNotesCtrl
 * @description
 * # AccountNotesCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountNotesCtrl', function (evernote, Accounts, $scope, $sce, $window) {

	/*global moment */
	/*global $ */

	var MarkdownIt = require('markdown-it')()
		.use(require('markdown-it-checkbox'))
		.use(require('markdown-it-emoji'))
		.use(require('markdown-it-contents'), {className: 'table-of-contents'});

	var updateEvernote = function () {
		$scope.$apply(function () {
			$scope.notebookExists = evernote.notebookExists;
			$scope.noteList = evernote.noteList;
			// $scope.note = evernote.noteInfo;
			$scope.html = $sce.trustAsHtml(evernote.html);
			if ($scope.html) {
				$scope.md = evernote.Html2md($scope.html.toString());
			}
		});
	};

	var updateAccounts = function () {
		$scope.$apply(function () {
			$scope.account = Accounts.selected;
			if ($scope.account) {
				evernote.checkNotebookExists($scope.account.Name);
				evernote.getNoteList($scope.account.Name);
			}
		});
	};

	$scope.notebookExists = evernote.notebookExists;
	$scope.editMode = false;
	$scope.noteList = evernote.noteList;
	$scope.note = null;
	$scope.account = Accounts.selected;
	$scope.html = $sce.trustAsHtml(evernote.html);
	$scope.newNoteTitle = '';
	$scope.md = '';

	$scope.formatDate = function (date) {
		return moment(date).calendar();
	};

	$scope.loadNote = function (note) {
		$scope.note = note;
		$scope.editMode = false;
		evernote.getHtml(note);
		//evernote.getNoteInfo(note);
	};

	$scope.createNotebook = function () {
		evernote.createNotebook($scope.account.Name);
	};

	$scope.createNote = function () {
		evernote.createNote($scope.newNoteTitle, $scope.account.Name);
		$scope.newNoteTitle = '';
	};

	$scope.deleteNote = function (note) {
		if (note) {
			var r = $window.confirm("Please confirm deletion of note " + note.title);
			if (r) {
				$scope.note = null;
				$scope.html = '';
				evernote.deleteNote(note);
			}
		}
	};

	$scope.changeEditMode = function () {
		if ($scope.editMode) {
			$scope.md = $("#my-edit-area").val();
			var newHtml = MarkdownIt.render($scope.md.toString());
			$scope.html = $sce.trustAsHtml(newHtml);
		}
		$scope.editMode = !$scope.editMode;
	};

	$scope.updateHtml = function () {
		console.log($("#my-edit-area").val());
	};

	$scope.save = function (note) {
		if ($scope.editMode) {
			$scope.md = $("#my-edit-area").val();
			var newHtml = MarkdownIt.render($scope.md.toString());
			$scope.html = $sce.trustAsHtml(newHtml);
		}

		evernote.updateHtml(note, $scope.html);

	};

	//evernote.getNoteList($scope.account.Name);
	evernote.registerObserverCallback(updateEvernote);
	Accounts.registerObserverCallback(updateAccounts);

});
