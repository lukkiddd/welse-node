(function() {
	'use strict';

	angular
			.module('app')
			.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function config($stateProvider, $urlRouterProvider){

		/* Member */
		var signup = {
		    name: 'signup',
		    url: '/signup/{type}',
		    templateUrl: 'templates/member/signup.html',
		    controller: 'signupCtrl',
		    controllerAs: 'vm'
		}
		var login = {
			name: 'login',
			url: '/login',
			templateUrl: 'templates/member/login.html',
		    controller: 'loginCtrl',
		    controllerAs: 'vm'
		}
		var forgetpassword = {
			name: 'forgetpassword',
			url: '/forgetpassword',
			templateUrl: 'templates/member/forgetpassword.html'
		}

	  /* Dashboard */
		var dashboardUser = {
			name: 'dashboard-user',
			url: '/dashboard/user/overview',
			templateUrl: 'templates/dashboard/user/overview.html',
			controller: 'dashboardUserCtrl',
			controllerAs: 'vm'
		}
		var dashboardUserParent = {
			name: 'dashboard-user-parent',
			url: '/dashboard/user/parent',
			templateUrl: 'templates/dashboard/user/parentList.html',
			controller: 'dashboardUserCtrl',
			controllerAs: 'vm'
		}
		var dashboardUserProfile = {
			name: 'dashboard-user-profile',
			url: '/dashboard/user/profile',
			templateUrl: 'templates/dashboard/user/profile.html',
			controller: 'dashboardUserCtrl',
			controllerAs: 'vm'
		}
		var dashboardStaff = {
			name: 'dashboard-staff',
			url: '/dashboard/staff/users',
			templateUrl: 'templates/dashboard/staff/users.html',
			controller: 'dashboardStaffCtrl',
			controllerAs: 'vm'
		}
		var dashboardStaffUser = {
			name: 'dashboard-staff-user',
			url: '/dashboard/staff/user/:index',
			templateUrl: 'templates/dashboard/staff/user-data.html',
			controller: 'dashboardStaffCtrl',
			controllerAs: 'vm'
		}
		var dashboardDoctor = {
			name: 'dashboard-doctor',
			url: '/dashboard/doctor/users',
			templateUrl: 'templates/dashboard/doctor/users.html',
			controller: 'dashboardDoctorCtrl',
			controllerAs: 'vm'
		}
		var dashboardDoctorUser = {
			name: 'dashboard-doctor-user',
			url: '/dashboard/doctor/users/:index',
			templateUrl: 'templates/dashboard/doctor/user-data.html',
			controller: 'dashboardDoctorCtrl',
			controllerAs: 'vm'
		}

		$stateProvider.state(login);
		$stateProvider.state(signup);
		$stateProvider.state(forgetpassword);
		$stateProvider.state(dashboardUser);
		$stateProvider.state(dashboardUserParent);
		$stateProvider.state(dashboardUserProfile);
		$stateProvider.state(dashboardStaff);
		$stateProvider.state(dashboardStaffUser);
		$stateProvider.state(dashboardDoctor);
		$stateProvider.state(dashboardDoctorUser);
		$urlRouterProvider.otherwise("/login");
	}
})();
