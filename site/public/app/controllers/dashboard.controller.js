(function() {
	'use strict';

	angular
			.module('app')
			.controller('dashboardCtrl', dashboardCtrl);

	dashboardCtrl.$inject = ['$state', '$timeout', '$interval', 'Users', 'Friend', 'Health'];

	function dashboardCtrl($state, $timeout, $interval, Users, Friend, Health) {
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

		vm.me = false;
		vm.health = false;
		vm.follow = follow;
		vm.confirm = confirm;
		vm.decline = decline;
		vm.unfollow = unfollow;
		vm.removeHealth = removeHealth;

		vm.thirdPartyList = [{
			name: "iHealth"
		},{
			name: "wahoo",
		},{
			name: "skulpt aim"
		},{
			name: "mi band",
		},{
			name: "jawbone"
		}];

		function removeHealth(key) {
			swal({
				title: "Are you sure?",
				text: "Your will not be able to recover this data!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
				cancelButtonText: "No, cancel!",
				closeOnConfirm: false,
				closeOnCancel: false }, 
			function(isConfirm){ 
				if (isConfirm) {
					Health
					.removeHealth(key)
					.then(function (data) {
						console.log(data);
						swal("Deleted!", "Your data has been deleted.", "success");
					})
					.catch(function (error) {
						swal("Error", "Some error has occured", "error");
					})
				} else {
						swal("Cancelled", "Your data file is safe :)", "error");
				}
			});
		}

		function addDevice() {
			vm.showAddDevice = true;
		}

		function closeAddDevice() {
			vm.showAddDevice = false;
		}

		isAuth();
		function isAuth() {
			if(Users.isLogin()) {
				$interval(function () {
					getProfile();
				}, 3000);
			}
		}

		function getProfile() {
			Users
				.getProfile()
				.then(function (data) {
					vm.me = data;
					getAllUsers();
					getHealth();
				})
				.catch(function () {
					if(!vm.me) {
						getProfile();
					}
				});
		}

		function getAllUsers() {
			Users
				.getUsers()
				.then(function (data) {
					var following = _.map(vm.me.following, function (val) {
						return val._id;
					});
					var pending = _.map(vm.me.pending, function (val) {
						return val._id;
					});
					console.log(vm.me);
					console.log(pending);

					var users = _.filter(data, function(val) {
						return following.indexOf(val._id) < 0;
					});
					var retval = _.filter(users, function(val) {
						return pending.indexOf(val._id) < 0;
					})
					vm.allUsers = retval;
				})
				.catch(function () {
					if(!vm.allUsers) {
						getAllUsers()
					}
				});
		}

		function getHealth() {
			Health
				.getHealth()
				.then(function (data) {
					// console.log(data);
					vm.health = data;
				})
				.catch(function (error) {
					console.log(error);
					if(!vm.health) {
						getHealth();
					}
				});
		}

		function follow(user) {
			user.loading = true;
			Friend
				.follow(user._id)
				.then(function (data) {
					user.loading = false;
					vm.friends_modal.close();
					getProfile();
				})
				.catch(function (err) {
					user.loading = false;
					follow(user)
				})
		}

		function confirm(user) {
			user.loading = true;
			Friend
				.confirm(user._id)
				.then(function (data) {
					user.loading = false;
					getProfile();
				})
				.catch(function (err) {
					user.loading = false;
					confirm(user);
				});
		}

		function decline(user) {
			user.loading = true;
			Friend
				.decline(user._id)
				.then(function (data) {
					user.loading = false;
					getProfile();
				})
				.catch(function (err) {
					user.loading = false;
					decline(user);
				});
		}

		function unfollow(user) {
			user.loading = true;
			Friend
				.unfollow(user._id)
				.then(function (data) {
					user.loading = false;
					getProfile();
				})
				.catch(function (err) {
					user.loading = false;
					unfollow(user);
				});
		}



	}
})();
