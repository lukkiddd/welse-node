(function (){
	'use strict';

	angular
		.module('app')
		.controller('fitbitCtrl', fitbitCtrl);

	fitbitCtrl.$inject = ['$state', '$stateParams', '$http', 'Auth'];

	function fitbitCtrl($state, $stateParams, $http, Auth) {

		if($stateParams.data) {
			var data = JSON.parse($stateParams.data);

			Auth.$onAuthStateChanged(function(authData) {
				console.log(data);
				if(authData) {
					_.forEach(data['activities-steps'], function (val) {
						var time = new Date(val.dateTime).getTime();
						firebase.database().ref('/health/').child(authData.uid)
							.push({
								chartType: 'column',
								isDanger: false,
								name: 'Steps',
								timestamp: time / 1000,
								unit: 'steps',
								value: val.value
							});
					});
					$state.go('dashboard.me');
				}
			});
		}

}
})();