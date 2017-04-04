(function() {
	'use strict';

	angular
			.module('app')
			.factory('PatientControl', PatientControl);

	PatientControl.$inject = ['$q', '$cookies', '$http'];

	function PatientControl($q, $cookies, $http) {
		var BASE_URL = "http://192.168.137.1:9000/api/v1/parent/";
		var BASE_URL_PATIENT = "http://192.168.137.1:9000/api/v1/patient/";
		var patientControl = {
			add: add,
			getParents: getParents,
			getPatients: getPatients,
			approveParent: approveParent,
			declineParent: declineParent,
			declinePatient: declinePatient
		};
		return patientControl;

		function add(user) {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			var data = {
				token: token,
				user: user
			}

			$http.post(BASE_URL + 'request', data)
				.then(function(data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function getPatients() {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			$http.get(BASE_URL_PATIENT + 'all?token=' + token)
				.then(function(data) {
					console.log(data.data.data.Users);
					defer.resolve(data.data.data.Users);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}



		function getParents() {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			$http.get(BASE_URL + 'all?token=' + token)
				.then(function(data) {
					console.log("== GET PARENTS");
					console.log(data.data.data.Users);
					defer.resolve(data.data.data.Users);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function approveParent(user) {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			var data = {
				token: token,
				user: user
			}

			$http.post(BASE_URL + 'accept', data)
				.then(function(data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function declineParent(parent) {
			var defer = $q.defer();
			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			var data = {
				token: token,
				user: parent
			}

			$http.post(BASE_URL + 'decline', data)
				.then(function(data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function declinePatient(patient) {
			var defer = $q.defer();

			var token = $cookies.get('token');
			if(!token) {
				defer.reject("NO TOKEN");
				return defer.promise;
			}

			var data = {
				token: token,
				user: patient
			}
			console.log(data);
			$http.post(BASE_URL + 'decline', data)
				.then(function(data) {
					console.log(data);
					defer.resolve(data);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})

			return defer.promise;
		}

	}
})();
