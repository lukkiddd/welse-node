(function () {
	'use strict';

	angular
		.module('app')
		.service('Users', UserService);
	
	UserService.$inject = ['$http', '$q', '$cookieStore'];

	function UserService($http, $q, $cookieStore) {
		// var BASE_URL = "https://welse-app.azurewebsites.net/api/db/users";
		var BASE_URL = "http://localhost:3000/api/db/users";
		var userService = {
			register: register,
			login: login, //pass
			logout: logout, // pass
			getProfile: getProfile, //pass
			editProfile: editProfile,
			getUsers: getUsers, //pass
			getProfileUser: getProfileUser,
			isLogin: isLogin //pass
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
				.post(BASE_URL + '/register', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
					$cookieStore.put('token', data.data.token);
				})
				.catch(function (err) {
					// console.log(err);
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
				.post(BASE_URL + '/login', data)
				.then(function (data) {
					$cookieStore.put('token', data.data.token);
					defer.resolve(data.data);
				})
				.catch(function (err) {
					// console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function logout() {
			var defer = $q.defer();
			
			if($cookieStore.get('token').replace(/["]+/g,'')) {
				$cookieStore.remove('token');
				defer.resolve({message: 'success'});
			} else {
				defer.reject({message: 'error'});
			}

			return defer.promise;
		}

		function getProfile() {
			var defer = $q.defer();
			var cookie =  $cookieStore.get('token');
			if(cookie) {
				cookie = cookie.replace(/["]+/g,'')
			}
			var token = cookie
			if(!token) {
				defer.reject({ message: "Token not found!"});
			}

			$http
				.post(BASE_URL + '/profile', { token: token })
				.then(function (data) {
					defer.resolve(data.data);
				})
				.catch(function (err) {
					// console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function editProfile(userId, profile_key, profile_value) {
			var defer = $q.defer();
			var cookie =  $cookieStore.get('token');
			if(cookie) {
				cookie = cookie.replace(/["]+/g,'')
			}
			var data = {
				token: cookie,
				profile_key: profile_key,
				profile_value: profile_value
			}
			$http
				.post(BASE_URL + '/profile/edit', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (err) {
					// console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function getUsers() {
			var defer = $q.defer();
			var cookie =  $cookieStore.get('token');
			if(cookie) {
				cookie = cookie.replace(/["]+/g,'')
			}
			var token = cookie;

			if(!token) {
				defer.reject({ message: "Token not found!"});
			}

			$http
				.post(BASE_URL, { token: token })
				.then(function (data) {
					defer.resolve(data.data);
				})
				.catch(function (err) {
					// console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function getProfileUser(id) {
			var defer = $q.defer();
			var data = {
				_id: id
			}

			$http
				.post(BASE_URL + '/profile/user', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (err) {
					// console.log(err);
					defer.reject(err);
				});
			return defer.promise;
		}

		function isLogin() {
			var cookie =  $cookieStore.get('token');
			if(cookie) {
				cookie = cookie.replace(/["]+/g,'')
			}
			var token = cookie;
			if(token) {
				return true;
			} else {
				return false;
			}
		}
	}

})();