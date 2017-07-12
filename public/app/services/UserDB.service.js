(function () {
	'use strict';

	angular
		.module('app')
		.service('User', UserService);
	
	UserService.$inject = ['$http', '$q'];

	function UserService($http, $q) {
		var USER_URL = "https://welse-app.azurewebsites.net/api/db/user";
		var userService = {
			register: register,
			login: login,
			logout: logout,
			getProfile: getProfile,
			addProfile: addProfile,
			editProfile: editProfile,
			getUsers: getUsers,
			getUser: getUser
		}
		return userService;

		function register(userData) {
			var defer = $q.defer();
			var data = {
				email: userData.email,
				password: userData.password,
				fname: userData.fname,
				lname: userData.lname,
				profilePic: userData.profilePic
			}
			$http
				.post(USER_URL + '/register', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function login(userData) {
			var defer = $q.defer();
			var data = {
				email: userData.email,
				password: userData.password
			}
			$http
				.post(USER_URL + '/login', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function logout(userData) {
			var defer = $q.defer();
			var data = {
				email: userData.email,
				userId: userData.userId
			}
			$http
				.post(USER_URL + '/logout', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function getProfile(userData) {
			var defer = $q.defer();
			var data = {
				userId: userData.userId
			}
			$http
				.get(USER_URL, data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}
		
		function addProfile(profileData) {
			var defer = $q.defer();
			var data = {
				name: profileData.name,
				unit: profileData.unit,
				value: profileData.value
			}
			$http
				.get(USER_URL + '/profile/add', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function editProfile(userId, profileId, profileData) {
			var defer = $q.defer();
			var data = {
				userId: userId,
				profileId: profileId,
				profileData: profileData
			}
			$http
				.post(USER_URL + '/profile/edit', data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function getUsers() {
			var defer = $q.defer();
			$http
				.get(USER_URL)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function getUser(userId) {
			var defer = $q.defer();
			var data = {
				userId: userId
			}
			$http
				.get(USER_URL, data)
				.then(function (data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function (err) {
					console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}
	}

})();