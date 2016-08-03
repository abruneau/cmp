'use strict';

/**
 * @ngdoc directive
 * @name autoSave
 * @description
 * # autoSave
 */
angular.module('cmpApp').directive('autoSave', ['$interval',
	function ($interval) {
		return {
			restrict: 'A',
			link: function ($scope, $element, $attrs) {
				var latestModel = null;
				var autoSaveModel = $scope.$eval($attrs.autoSaveModel);
				// var hasModel = !!autoSaveModel;
				var autoSaveFn = $scope.$eval($attrs.autoSaveFn);
				var autoSaveMode = $attrs.autoSaveMode;
				var autoSaveInterval = $scope.$eval($attrs.autoSaveInterval) * 1;
				latestModel = angular.copy(autoSaveModel);
				var intervalPromise = null;

				function blurHandler() {
					$scope.$apply(function () {
						console.log("Change");
						// autoSaveFn(autoSaveModel);
					});
				}

				if (autoSaveMode === 'interval') {
					intervalPromise = $interval(function () {
						// console.log(hasModel);
						autoSaveModel = $scope.$eval($attrs.autoSaveModel);
						latestModel = angular.copy(autoSaveModel);
						autoSaveFn(autoSaveModel);
					}, autoSaveInterval);
				} else if (autoSaveMode === 'blur') {
					$element.find('input').on('blur', blurHandler);
					$element.find('textarea').on('blur', blurHandler);
				} else if (autoSaveMode === 'change') {
					$element.find('input').on('change', blurHandler);
					$element.find('textarea').on('change', blurHandler);
				}

				$element.on('$destroy', function () {
					if (intervalPromise) {
						$interval.cancel(intervalPromise);
					}
					if (autoSaveMode === 'blur') {
						$element.find('input').off('blur', blurHandler);
					}
				});
			}
		};
	}
]);
