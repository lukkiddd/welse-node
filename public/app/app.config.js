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
			url: '/data/:uid/:key',
			templateUrl: 'pages/dashboard/dashboard-data.html',
			controller: 'dashboardDataCtrl'
		}

		var friends = {
			name: 'dashboard.friends',
			url: '/friends',
			templateUrl: 'pages/dashboard/friends.html',
			controller: 'friendsCtrl',
			controllerAs: 'vm'
		};

		var friendsDashboard = {
			name: 'dashboard.friendsDashbaord',
			url: '/friend/:uid',
			templateUrl: 'pages/dashboard/friend-dashboard.html',
			controller: 'friendDashboardCtrl',
			controllerAs: 'vm'
		}

		var ihealth = {
			name: 'ihealth',
			url: '/ihealth/:accessToken/:userId',
			controller: 'ihealthCtrl'
		}

		$stateProvider.state(dashboard);
		$stateProvider.state(dashboardMe);
		$stateProvider.state(dashboardData);
		$stateProvider.state(friends);
		$stateProvider.state(friendsDashboard);
		$stateProvider.state(ihealth);
		$stateProvider.state(login);
		$urlRouterProvider.otherwise("/login");
	}
})();
