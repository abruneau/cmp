'use strict';

/**
 * @ngdoc directive
 * @name cmpApp.directive:matchWindowHeight
 * @description
 * # matchWindowHeight
 */
angular.module('cmpApp').directive('matchWindowHeight', function ($timeout, $window) {
	return function postLink(scope, element) {

			function setHeight() {
				element.css("height", $window.innerHeight+"px");
			}

			setHeight();

			$timeout(setHeight());

			angular.element($window).on( "resize", setHeight);

			function cleanup() {
				angular.element($window).off( "resize", setHeight);
			}

			element.on( '$destroy', cleanup);
	};
});
