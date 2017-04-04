(function() {
	'use strict';

  angular
      .module('app')
      .directive('focus', focus);

  function focus() {
      var directive = {
          link: link,
          restrict: 'A'
      };
      return directive;

      function link(scope, elem, attrs) {

				elem.bind('keydown', function (e) {
	        elem.next()[0].focus();
		    });
				
      }
  }

})();
