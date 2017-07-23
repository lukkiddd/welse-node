(function () {
	'use strict';

	angular
		.module('app')
		.service('Friend', FriendService);
	
	FriendService.$inject = ['$http', '$q', '$cookies'];

	function FriendService($http, $q, $cookies) {
		var BASE_URL = "https://welse-us.azurewebsites.net/api/db/friends";
		var friendService = {
			follow: follow,
			unfollow: unfollow,
			confirm: confirm,
			decline: decline
		}
		return friendService;

		function follow(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token').replace(/["]+/g,''),
				follow_id: follow_id
			}
			// console.log(data);
			$http
				.post(BASE_URL + '/follow', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error.data);
					defer.reject(error);
				});

			return defer.promise;
		}

		function unfollow(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token').replace(/["]+/g,''),
				follow_id: follow_id
			}

			$http
				.post(BASE_URL + '/unfollow', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error.data);
					defer.reject(error);
				});

			return defer.promise;
		}

		function confirm(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token').replace(/["]+/g,''),
				follow_id: follow_id
			}

			$http
				.post(BASE_URL + '/confirm', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error.data);
					defer.reject(error);
				});

			return defer.promise;
		}

		function decline(follow_id) {
			var defer = $q.defer();

			var data = {
				token: $cookies.get('token').replace(/["]+/g,''),
				follow_id: follow_id
			}
			// console.log(data);
			$http
				.post(BASE_URL + '/decline', data)
				.then(function (data) {
					// console.log(data.data);
					defer.resolve(data.data);
				})
				.catch(function (error) {
					// console.log(error.data);
					defer.reject(error);
				});

			return defer.promise;
		}

	}

})();