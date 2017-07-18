(function () {
	'use strict';

	angular
		.module('app')
		.controller('friendDashboardCtrl', friendDashboardCtrl);

	friendDashboardCtrl.$inject = ['$stateParams', 'Users', 'Health'];

	function friendDashboardCtrl($stateParams, Users, Health) {
		var vm = this;
		
		var userId = $stateParams.id;
		if (userId) {
			getProfile(userId);
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