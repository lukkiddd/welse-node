(function () {
	'use strict';

	angular
		.module('app')
		.controller('friendDashboardCtrl', friendDashboardCtrl);

	friendDashboardCtrl.$inject = ['$stateParams', '$interval', 'Users', 'Health'];

	function friendDashboardCtrl($stateParams, $interval, Users, Health) {
		var vm = this;
		
		var userId = $stateParams.id;
		if (userId) {
			$interval(function () {
				getProfile(userId);
			}, 3000);
		}

		function getProfile(userId) {
			Users
				.getProfileUser(userId)
				.then(function (data) {
					vm.friend = data;
					getHealthUser(userId);
				})
				.catch(function (err) {
					if(!vm.friend) {
						getProfile(userId);
					}
				});
		}

		function getHealthUser(userId) {
			Health
				.getHealthUser(userId)
				.then(function (data) {
					vm.health = data;
				})
				.catch(function (error) {
					if(!vm.health) {
						getHealthUser(userId);
					}
				});
		}

	}
	
})();