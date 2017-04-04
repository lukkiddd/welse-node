(function() {
	'use strict';

	angular
			.module('app')
			.factory('Users', Users);

	Users.$inject = ['$q', '$http', '$cookies'];

	function Users($q, $http, $cookies) {
		var BASE_URL = "http://192.168.137.1:9000/api/v1/user/";
		var users = {
			signup: signup,
			login: login,
			logout: logout,
			get: get,
			getAll: getAll,
			editProfile: editProfile
		};
		return users;


		function signup(userData) {
			var defer = $q.defer();
			if(userData) {
				if(!userData.email || !userData.password || !userData.confirmPassword) {
					defer.reject('invalid data');
					return defer.promise;
				} else if (userData.password != userData.confirmPassword) {
					defer.reject('invalid data');
					return defer.promise;
				}
			}
			var data = {
				email: userData.email,
				password: userData.password,
				name: userData.fullName || "ไม่ระบุ",
				type: userData.type
			}
			$http.post(BASE_URL + 'createuser', data)
				.then(function(data) {
					console.log("== REGISTER")
					console.log(data.data);
					login(userData);
					defer.resolve(data.data);
				}, function(error) {
					console.log(error);
					defer.reject(error);
				});
			return defer.promise;

		}

		function login(userData) {
			var defer = $q.defer();

			var data = {
				email: userData.email,
				password: userData.password,

			}
			$http.post(BASE_URL + 'signin', data)
				.then(function(data) {
					console.log("== SIGN IN");
					$cookies.put('token',data.data.data.token);
					console.log(data.data.data);
					get(data.data);
					defer.resolve(data.data);
				}).catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function logout(token) {
			var defer = $q.defer();
			var token = $cookies.get('token');
			console.log(token);
			var data = {
				token: token
			}
			$http.post(BASE_URL + 'signout', data)
				.then(function(data) {
					console.log("== SIGN OUT");
					console.log(data.data);
					$cookies.remove('token');
					defer.resolve(data.data);
				}).catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}


		function get(user) {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}
			if(!user) {
				var user = {id: 0};
			}
			console.log(user);
			$http.get(BASE_URL + 'profile?token='+token+'&id='+user.id)
				.then(function(data) {
					console.log("GET PROFILE");
					console.log(data);
					defer.resolve(data.data.data.user);
				}).catch(function(error) {
					console.log(error);
					defer.reject(error);
				})

			return defer.promise;
		}

		function getAll() {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}
			$http.get(BASE_URL + 'all?token=' + token)
				.then(function(data) {
					console.log("GET USERS ALL");
					defer.resolve(data.data.data.Users);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function editProfile(userData) {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			var data = {
				user: userData,
				token: token
			}
			$http.put(BASE_URL + 'profile', data)
				.then(function(data) {
					console.log(data.data);
					defer.resolve(data.data);
				}).catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}


	}
})();
