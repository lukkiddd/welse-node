(function() {
	'use strict';

	angular
			.module('app')
			.factory('Users', Users);

	Users.$inject = ['$q', '$firebaseArray', '$firebaseObject', 'Auth'];

	function Users($q, $firebaseArray, $firebaseObject, Auth) {
		var usersRef = firebase.database().ref().child('users');

		var users = {
			signup: signup,
			login: login,
			logout: logout,
			get: get,
			add: add,
			update: add
		};
		return users;


		function signup(userData) {
			var defer = $q.defer();

			Auth.$createUserWithEmailAndPassword(userData.email, userData.password)
				.then(function(authData) {
					users.add(authData, userData)
						.then(function(data) {
							defer.resolve(data);
						}).catch(function(error) {
							defer.reject(error);
						})
				}, function(error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function login(userData) {
			var defer = $q.defer();

			Auth.$signInWithEmailAndPassword(userData.email,userData.password)
				.then(function(authData) {
					defer.resolve(authData)
				}, function(error) {
					defer.reject(error);
				})
			return defer.promise;
		}

		function logout() {
			Auth.$signOut();
		}


		function add(authData,userData) {
			var defer = $q.defer();

			if(!authData.uid) {
				defer.reject("ERROR UID");
				return defer.promise;
			}

			var user = usersRef.child(authData.uid);

			user.set({
				profile: {
					fname: userData.fname,
					lname: userData.lname,
          type: userData.type,
				}
			}).then(function(data) {
		      	defer.resolve(data);
		      }, function(error) {
		      	defer.reject(error);
		      });
     return defer.promise;
		}

		function get(authData) {
			var defer = $q.defer();

			if(!authData.uid) {
				defer.reject("ERROR UID");
				return defer.promise;
			}

			var ref = usersRef.child(authData.uid);
			var user = $firebaseObject(ref);

			return user;
		}



	}
})();
