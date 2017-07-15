(function() {
	'use strict';

	angular
			.module('app')
			.filter('filterName', filterName);

	function filterName() {
		return function (input) {
			return input;
		}
	}

})();
