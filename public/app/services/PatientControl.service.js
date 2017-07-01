(function() {
	'use strict';

	angular
			.module('app')
			.factory('PatientControl', PatientControl);

	PatientControl.$inject = ['$q', '$firebaseArray', '$firebaseObject', 'Auth'];

	function PatientControl($q, $firebaseArray, $firebaseObject, Auth) {

		var patientControl = {
			add: add,
			getByUser: getByUser,
			getParents: getParents,
			approveParent: approveParent,
			declineParent: declineParent,
			declinePatient: declinePatient
		};
		return patientControl;

		function add(parent, user) {
			var defer = $q.defer();


			firebase.database().ref('/control/'+user.$id)
				.update({
					fullName: user.fullName
				})

			firebase.database().ref('/control/'+user.$id+'/list/'+parent.$id)
				.set({
					"uid":parent.$id,
					"email":parent.email,
					"type": parent.type,
					"fullName": parent.fullName,
					"username": parent.username,
					"isReq": 1
				})
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

		function getByUser(user) {
			var defer = $q.defer();
			var control = $firebaseArray(firebase.database().ref('/control'));
			control.$loaded()
				.then(function(userList) {
					var controlList = [];
					var users = _.forEach(userList, function(val) {
						val.list = _.map(val.list, function(val) {
							return val;
						})
						return val;
					});
					users = _.forEach(users, function(o){
						var a = _.filter(o.list, function(l) {
							return l.uid == user.$id
						})
						if(a.length > 0) {
							controlList.push({
								'uid': o.$id,
								'fullName': o.fullName,
								'isReq': a[0].isReq
							});
						}
					})
					defer.resolve(controlList);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function getParents(user) {
			var defer = $q.defer();

			var control = $firebaseArray(firebase.database().ref('/control/' + user.uid))
			control.$loaded()
				.then(function(parents) {
					var retval = [];
					var parentRet = _.filter(parents, {'$id': 'list'});
					_.forEach(parentRet, function(val) {
						val = _.map(val, function(val,key) {
							if(_.isObject(val)) {
								retval.push(val);
							}
							return val;
						})
						return val;
					});
					defer.resolve(retval);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})
			return defer.promise;
		}

		function approveParent(parent, user) {
			var defer = $q.defer();
			var control = firebase.database().ref('/control/' + user.uid + '/list/' + parent.uid);
			control.update({
				isReq: 0
			}).then(function(parent) {
				console.log(parent);
				defer.resolve(parent);
			}).catch(function(error) {
				console.log(error);
				defer.reject(error);
			})
			return defer.promise;
		}

		function declineParent(parent, user) {
			var defer = $q.defer();

			var control = firebase.database().ref('/control/' + user.uid + '/list/' + parent.uid);
			control.remove()
				.then(function(data) {
					defer.resolve(data);
				})
				.catch(function(error) {
					console.log(error);
					defer.reject(error);
				})

			return defer.promise;
		}

		function declinePatient(patient, user) {
			var defer = $q.defer();

			var control = firebase.database().ref('/control/' + patient.uid + '/list/' + user.uid);
			control.remove()
				.then(function(data) {
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
