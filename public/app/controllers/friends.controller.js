(function () {
	'use strict';

	angular
		.module('app')
		.controller('friendsCtrl', friendsCtrl);

	friendsCtrl.$inject = ['Users', 'Auth'];

	function friendsCtrl(Users, Auth) {
		var vm = this;

		vm.friends = [];
		vm.friendRequest = [];

		vm.confirmFriendRequest = confirmFriendRequest;
		vm.deleteFriendRequest = deleteFriendRequest;
		vm.addNewFriend = addNewFriend;

		vm.friends_modal = {
			show: function () {
				this._show = true;
			},
			close: function () {
				this._show = false;
			},
			_show: false,
		}

		/* Authentication */
		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			getFriends();
			getFriendsRequest();
			getAllUsers();
		});

		function getFriends() {
			firebase.database().ref()
				.child('friends')
				.child(vm.authData.uid)
				.child('friends')
				.on('value', function(snapshot) {
					var friends = snapshot.val();
					friends = _.map(friends, function(val, k) {
						val['key'] = k;
						return val;
					})
					vm.friends = friends;
				})
		}

		function getFriendsRequest() {
			firebase.database().ref()
				.child('friends')
				.child(vm.authData.uid)
				.child('friendsRequest')
				.on('value', function(snapshot) {
					var friendsRequest = snapshot.val();
					friendsRequest = _.map(friendsRequest, function(val, k) {
						val['key'] = k;
						return val;
					})
					vm.friendsRequest = friendsRequest;
				})
		}

		function getAllUsers() {
			firebase.database().ref('/users')
				.on('value', (snapshot) => {
					var users = snapshot.val();
					users = _.map(users, (u, uid) => {
						u.uid = uid;
						return u
					})
					users = _.filter(users, (u) => {
						return u.uid != vm.authData.uid;
					});
					firebase.database().ref(`/friends/${vm.authData.uid}/friends`)
						.on('value', (s) => {
							let myFriends = s.val();
							const retval = [];
							_.forEach(users, (u) => {
								let found = false;
								_.forEach(myFriends, (f) => {
									if (u.uid == f.uid) {
										found = true;
									}
								});
								if(!found) {
									retval.push(u);
								}
							});
							
							vm.allUsers = retval;
						});
      });
		}

		function addNewFriend(friend) {
			delete friend.$$hashKey;
			firebase.database().ref(`/users/${vm.authData.uid}`)
      .on('value', (snapshot) => {
        let userProfile = snapshot.val();
        userProfile = _.map(userProfile, (val) => {
          return { profile: val, uid: vm.authData.uid };
        });
        firebase.database().ref(`/friends/${friend.uid}/friendsRequest`)
          .push(userProfile[0]);
      });
			vm.friends_modal.close();
		}

		function confirmFriendRequest(friend) {
			firebase.database().ref(`/friends/${vm.authData.uid}/friendsRequest/${friend.key}`)
				.remove()
				.then(() => {
					delete friend.key;
					delete friend.$$hashKey;
					firebase.database().ref(`/friends/${vm.authData.uid}/friends`)
						.push(friend)
						.then(() => {
							firebase.database().ref(`/users/${vm.authData.uid}`)
								.on('value', (snapshot) => {
									let profile = snapshot.val();
									profile = _.map(profile, (val, uid) => {
										return { profile: val, uid: vm.authData.uid }
									});
									firebase.database().ref(`/friends/${friend.uid}/friends`)
										.push(profile[0])
										.catch((error) => {
											console.log(error);
										});
								});
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((error) => {
					console.log(error);
				});
		};

		function deleteFriendRequest(friend) {
			firebase.database().ref(`/friends/${vm.authData.uid}/friendsRequest/${friend.key}`)
				.remove();
		};
		
	}
	
})();