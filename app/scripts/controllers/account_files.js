'use strict';

/**
 * @ngdoc function
 * @name cmpApp.controller:AccountFilesCtrl
 * @description
 * # AccountFilesCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountFilesCtrl', function ($scope, $routeParams, localAccount, Fs) {

	var accountId = $routeParams.id;

	function updateList(path) {
		if (path) {
			$scope.fileList = Fs.ls(path);
		}
	}

	var updateLocalInfo = function () {
		$scope.$apply(function () {
			$scope.localInfo = localAccount.selected;
			if (localAccount.selected) {
				updateList(localAccount.selected.path);
			}
		});
	};

	$scope.fileList = null;

	$scope.fileIcon = function (file) {

		if (file.directory) {
			return 'fa-folder-o';
		}

		switch (file.type) {
		case '.pdf':
			return 'fa-file-pdf-o';
		case '.docx':
			return 'fa-file-word-o';
		case '.doc':
			return 'fa-file-word-o';
		case '.xlsx':
			return 'fa-file-excel-o';
		case '.xls':
			return 'fa-file-excel-o';
		case '.pptx':
			return 'fa-file-powerpoint-o';
		case '.ppt':
			return 'fa-file-powerpoint-o';
		default:
			return 'fa-file-o';
		}
	};

	$scope.openFile = function (file) {
		if (file.directory) {
			var list = [];

			// Add Go back link
			if (file.path !== localAccount.selected.path) {
				list.push({
					name: '..',
					directory: true,
					path: Fs.fileParent(file.path)
				});
			}

			// list.push(Fs.ls(file.path));
			$scope.fileList = list.concat(Fs.ls(file.path));

		} else {
			Fs.open(file.path);
		}
	};

	$scope.openApplication = function (file) {
		Fs.open(file.path);
	};

	localAccount.get(accountId);
	localAccount.registerObserverCallback(updateLocalInfo);
});
