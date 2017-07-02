(function (){
	'use strict';

	angular
		.module('app')
		.controller('fitbitCtrl', fitbitCtrl);

	fitbitCtrl.$inject = ['$state', '$stateParams', '$http', 'Auth'];

	function fitbitCtrl($state, $stateParams, $http, Auth) {

		console.log($stateParams);
		var data = $stateParams.data;
		
		console.log(JSON.parse(data));

}
})();