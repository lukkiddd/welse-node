(function() {
	'use strict';

	angular
			.module('app')
			.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider){
		var login = {
			name: 'login',
			url: '/login',
			templateUrl: 'pages/login.html',
			controller: 'loginCtrl',
			controllerAs: 'vm',
		};

		var dashboard = {
			name: 'dashboard',
			url: '/dashboard',
			templateUrl: 'pages/dashboard/dashboard.html',
			controller: 'mainPageCtrl',
			controllerAs: 'vm'
		};

		var dashboardMe = {
			name: 'dashboard.me',
			url: '/me',
			templateUrl: 'pages/dashboard/me.html',
			controller: 'dashboardCtrl',
			controllerAs: 'vm'
		};

		var dashboardData = {
			name: 'dashboard.data',
			url: '/data/:key',
			templateUrl: 'pages/dashboard/dashboard-data.html',
			controller: 'dashboardDataCtrl'
		}


		var friendsDashboard = {
			name: 'dashboard.friend',
			url: '/friend/:id',
			templateUrl: 'pages/dashboard/friend-dashboard.html',
			controller: 'friendDashboardCtrl',
			controllerAs: 'vm'
		}
		var friendDashboardData = {
			name: 'dashboard.friendData',
			url: '/friend/:id/data/:key',
			templateUrl: 'pages/dashboard/friend-dashboard-data.html',
			controller: 'friendDashboardDataCtrl',
			controllerAs: 'vm'
		}


		$stateProvider.state(dashboard);
		$stateProvider.state(dashboardMe);
		$stateProvider.state(dashboardData);
		$stateProvider.state(friendsDashboard);
		$stateProvider.state(friendDashboardData);
		$stateProvider.state(login);
		$urlRouterProvider.otherwise("/login");
	}
})();
