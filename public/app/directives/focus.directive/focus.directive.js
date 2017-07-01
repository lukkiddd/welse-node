(function() {
	'use strict';

  angular
      .module('app')
      .directive('Wchart', Wchart);

    function Wchart() {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, elem, attrs) {
            
        };
        
    }

})();
