'use strict';

/**
 * @ngdoc directive
 * @name cmpApp.directive:slideable
 * @description
 * # slideable
 * based on https://github.com/EricWVGG/AngularSlideables
 */
angular.module('cmpApp')
	.directive('slideable', function ($timeout) {
		return {
			restrict: 'C',
			compile: function () {
				// wrap tag
				//var contents = element.html();
				//element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

				return function postLink(scope, element, attrs) {
					$timeout(function () {
						attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
						attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;

						var height;
						if (element.attr('data-height')) {
							height = element.attr('data-height');
						} else {
							height = element[0].clientHeight + 'px';
							element.attr('data-height',height);
						}
						element.css({
							'overflow': 'hidden',
							'height': height,
							'transitionProperty': 'height',
							'transitionDuration': attrs.duration,
							'transitionTimingFunction': attrs.easing
						});
						if (element.attr('data-closed') === "true") {
							element.addClass('hide');
						}
					}, 1000);

					// default properties

				};
			}
		};
	})
	.directive('slideToggle', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var target, content;

				attrs.expanded = true;

				element.bind('click', function () {
					if (!target) {
						target = document.querySelector(attrs.slideToggle);
					}
					if (!content) {
						content = target.querySelector('.slideable_content');
					}

					var height = angular.element(target).attr('data-height');

					if (!attrs.expanded) {
						target.style.height = height;
					} else {
						target.style.height = '0px';
					}
					attrs.expanded = !attrs.expanded;
				});
			}
		};
	});
