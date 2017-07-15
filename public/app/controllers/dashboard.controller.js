(function() {
	'use strict';

	angular
			.module('app')
			.controller('dashboardCtrl', dashboardCtrl);

	dashboardCtrl.$inject = ['$state', '$interval', 'Users', 'Friend'];

	function dashboardCtrl($state, $interval, Users, Friend) {
		var vm = this;

		vm.devices_modal = {
			show: function() {
				this._show = true;
			},
			close: function() {
				this._show = false;
			},
			_show: false,
		}


		vm.friends_modal = {
			show: function () {
				this._show = true;
			},
			close: function () {
				this._show = false;
			},
			_show: false,
		}

		vm.me = {};
		vm.follow = follow;
		
		// vm.addDevice = addDevice;
		// vm.closeAddDevice = closeAddDevice;
		// vm.showAddDevice = false;
		// vm.addNewDevice = addNewDevice;
		vm.thirdPartyList = [{
			name: "wahoo",
		},{
			name: "skulpt aim"
		},{
			name: "mi band",
		},{
			name: "jawbone"
		}];


		function addDevice() {
			vm.showAddDevice = true;
		}

		function closeAddDevice() {
			vm.showAddDevice = false;
		}

		isAuth();
		function isAuth() {
			if(Users.isLogin()) {
				getProfile();
			}
		}

		function getProfile() {
			Users
				.getProfile()
				.then(function (data) {
					vm.me = data;
					getAllUsers();
				});
		}

		function getAllUsers() {
			Users
				.getUsers()
				.then(function (data) {
					vm.allUsers = data;
				})
		}

		function follow(user) {
			user.loading = true;
			Friend
				.follow(user._id)
				.then(function (data) {
					user.loading = false;
				})
				.catch(function (err) {
					user.loading = false;
				})
		}



	}
})();
