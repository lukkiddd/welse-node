(function() {
	'use strict';

	angular
			.module('app')
			.controller('mainPageCtrl', mainPageCtrl);

	mainPageCtrl.$inject = ['$scope', '$state', 'Auth', 'Users'];

	function mainPageCtrl($scope, $state, Auth, Users) {
		var vm = this;

		vm.authData = {};
		$scope.logout = logout;
		$scope.readNoti = readNoti;

		/* Authentication */
		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			if(vm.authData) {
				vm.me = Users.get(vm.authData);
				if(!vm.me) {
					$state.go('login');
				}
				getNotification(vm.authData);
			}
		});
		
		function logout() {
			console.log('s');
			Users.logout();
			$state.go('login');
		}

		function getNotification(authData) {
			firebase.database().ref().child('notification').child(authData.uid).child('notifications')
				.on('value', function(snapshot) {
					var noti = snapshot.val();
					noti = _.map(noti, function(val, k) {
						val['key'] = k;
						return val;
					});
					
					var notiUnread = _.filter(noti, { isRead: false });
					$scope.notiUnread = (notiUnread.length > 0) ? true : false;
					$scope.notifications = noti;
				})
		}

		function readNoti(notification) {
			firebase.database().ref().child('notification').child(vm.authData.uid).child('notifications').child(notification.key).child('isRead')
				.set(true);
		}
	}
})();
