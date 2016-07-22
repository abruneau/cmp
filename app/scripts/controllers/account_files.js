'use strict';

/**
 * @memberof cmpApp
 * @ngdoc controller
 * @name AccountFilesCtrl
 * @param $scope {service} controller scope
 * @param $routeParams {service} route scope
 * @param localAccount {service} laocal infos
 * @param Fs {service} Fs service
 * @description
 * # AccountFilesCtrl
 * Controller of the cmpApp
 */
angular.module('cmpApp').controller('AccountFilesCtrl', function ($scope, $routeParams, localAccount, Fs) {

	var accountId = $routeParams.id;
	var currentPath = '';

	/**
	 * Update list of files and folders for a given path
	 * Equivalent of a ls
	 * @memberof AccountFilesCtrl
	 * @function updateList
	 * @param  {String} path full path of the folders
	 */
	function updateList(path) {
		if (path) {
			var list = [];

			// Add Go back link
			if (path !== localAccount.selected.path) {
				list.push({
					name: '..',
					directory: true,
					path: Fs.fileParent(path)
				});
			}

			$scope.fileList = list.concat(Fs.ls(path));
			$scope.breadcrum = Fs.breadcrum(path, localAccount.selected.path);
			currentPath = path;
		}
	}

	/**
	 * Update $scope.localInfo on changes
	 * and triger updateList function
	 * @memberof AccountFilesCtrl
	 * @function updateLocalInfo
	 */
	function updateLocalInfo() {
		$scope.localInfo = localAccount.selected;
		if (localAccount.selected) {
			updateList(localAccount.selected.path);
		}
	}

	$scope.fileList = null;
	$scope.breadcrum = [];

	/**
	 * Return corresponding icon for a file type
	 * @memberof AccountFilesCtrl
	 * @function fileIcon
	 * @param  {String} file file name
	 * @return {String}      corresponding icon fa class
	 */
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

	/**
	 * Triger function updateList if file is a directory
	 * Open file with default application else
	 *
	 * @memberof AccountFilesCtrl
	 * @function openFile
	 * @param  {Object} file the file object
	 */
	$scope.openFile = function (file) {
		if (file.directory) {
			updateList(file.path);

		} else {
			Fs.open(file.path);
		}
	};

	/**
	 * Open file or folder with default application
	 *
	 * @memberof AccountFilesCtrl
	 * @function openApplication
	 * @param  {object} file the file object
	 */
	$scope.openApplication = function (file) {
		Fs.open(file.path);
	};

	/**
	 * Create a new directory in the current path
	 *
	 * @memberof AccountFilesCtrl
	 * @function mkdir
	 * @param  {String} name Name of the new folders
	 */
	$scope.mkdir = function (name) {
		Fs.mkdir(name, currentPath);
		updateList(currentPath);
	};

	/**
	 * Change the current directory
	 *
	 * @memberof AccountFilesCtrl
	 * @function cd
	 * @param  {String} path Target path
	 */
	$scope.cd = function (path) {
		updateList(path);
	};

	localAccount.get(accountId);
	localAccount.registerObserverCallback(updateLocalInfo);
});
