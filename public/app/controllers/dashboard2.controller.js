(function() {
	'use strict';

	angular
			.module('app')
			.controller('dashboardCtrl', dashboardCtrl);

	dashboardCtrl.$inject = ['$state', '$interval', 'Auth', 'Users', 'Data', '$firebaseArray', 'PatientControl'];

	function dashboardCtrl($state, $interval, Auth, Users, Data, $firebaseArray, PatientControl) {
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
		
		vm.profile = {
			toggle: function() {
				this._show = !this._show;
			},
			show: function() {
				this._show = true;
			},
			hide: function() {
				this._show = false;
			},
			_show: false,
		}


		
		vm.logout = logout;
		vm.datas = [];
		vm.dataAvg = {};
		vm.showParentsList = false;
		vm.showMyData = true;
		vm.notiUnread = false;
		vm.notifications = [];
		vm.chartConfig = {};
		vm.chartConfig2 = {};
		vm.chartConfig3 = {};
		vm.chartConfig4 = {};
		vm.readNoti = readNoti;
		vm.friends = [];
		vm.friendRequest = [];
		vm.selectData = selectData;
		vm.confirmFriendRequest = confirmFriendRequest;
		vm.deleteFriendRequest = deleteFriendRequest;
		vm.selectFriend = selectFriend;
		vm.selectedFriend = {};
		vm.selectFriendData = selectFriendData;
		vm.addFriend = addFriend;
		vm.closeAddFriend = closeAddFriend;
		vm.showAddFriend = false;
		vm.addNewFriend = addNewFriend;
		vm.addDevice = addDevice;
		vm.closeAddDevice = closeAddDevice;
		vm.showAddDevice = false;
		vm.addNewDevice = addNewDevice;
		vm.thirdPartyList = [{
			name: "fitbit"
		},{
			name: "wahoo",
		},{
			name: "skulpt aim"
		},{
			name: "mi band",
		},{
			name: "jawbone"
		}];



		function realHeartrate() {
			console.log('real');
			var value = getRandomInt(80,85);
			var timestamp = Date.now() / 1000;
			var timeAgo = moment.unix(_.toInteger(timestamp)).fromNow()
			var v = {
				chartType: "line",
				isDanger: false,
				isLive:true,
				name: "heart rate",
				timeAgo: timeAgo,
				timestamp: timestamp,
				unit:"bpm from wahoo",
				value:value
			}
			vm.friendData['heart rate'].push(v);
			
			console.log(vm.chartConfig3);
			vm.chartConfig3['heart rate'].series[0].data.shift();
			vm.chartConfig3['heart rate'].series[0].data.push(value);
		}
		

		function addNewDevice(device) {
			console.log(vm.datas);
			vm.datas['steps'] = []
			for(var i = 0; i < 20; i ++) {
				vm.datas['steps'].push({
					name: 'steps',
					unit: 'from fitbit',
					value: getRandomInt(2000,5000),
					timestamp: Date.now() / 1000,
					chartType: 'column',
				});
			};
			let vals = _.map(vm.datas['steps'], function(val) {
				return val.value;
			})
			var unit = vm.datas['steps'][0].unit || '';
			unit = unit.toUpperCase();
			vm.chartConfig['steps'] = {};
			vm.chartConfig['steps'] = {
				chart: {
					height: 200,
				},
				legend: {
					enabled: false,
				},
				xAxis: {
					visible: false,
				},
				yAxis: {
					visible: false,
				},
				title: {
					text: ''
				},
				series: [{
					name: 'Value',
					type: vm.datas['steps'][0].chartType || 'line',
					data: vals,
					showInLegend: false,
					color: '#2a65ff',
					borderRadius: 3,
					pointPadding: 0.1,
					groupPadding: 0,
					borderWidth: 0,
					tooltip: {
						headerFormat: '',
						pointFormat: '{series.name}: <b>{point.y}</b><br/>',
						valueSuffix: ` ${unit}`,
					},
				}]
			};
			vm.showAddDevice = false;
		}

		function addDevice() {
			vm.showAddDevice = true;
		}

		function closeAddDevice() {
			vm.showAddDevice = false;
		}

		function addFriend() {
			getAllUser();
			vm.showAddFriend = true;
			console.log(vm.showAddFriend);
		}

		function closeAddFriend() {
			vm.showAddFriend = false;
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
			vm.showAddFriend = false;
		}


		/* Authentication */
		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			if(vm.authData) {
				vm.user = Users.get(vm.authData);
				getNotification(vm.authData);
				vm.user.$loaded()
					.then(function(user) {
						vm.me = user;
					});
				getData();
				
				getFriends();
				getFriendsRequest();
				firebase.database().ref().child('health').child(authData.uid)
					.on('value', function(snapshot) {
						getNewData(snapshot);
					})
			}
		});

		function getNewData(snapshot) {
			var data = snapshot.val();
			data = _.orderBy(data, 'timestamp', 'asc');
			data = _.forEach(data, function(val) {		
				return val.timeAgo = moment.unix(_.toInteger(val.timestamp)).fromNow()
			})
			data = _.groupBy(data, 'name');
			var hasVal = {};
			_.forEach(data, (key) => {
				if (key[0].value) {
					hasVal[key[0].name] = key;
				}
			});
			var retval = _.merge(hasVal);
			_.forIn(retval, function(value, key) {
				retval[key] = _.takeRight(value, 20);
			});
			_.forIn(retval, function(data, key){
				var vals = _.map(data, function (val) {
					if(val.value == "Good") {
						return 1;
					} else if (val.value == "Bad") {
						return 0;
					} else if (val.value == null) {
						return 0;
					}
					return val.value;
				});
				var lastData = vm.datas[key][vm.datas[key].length-1].timestamp;
				var newData = retval[key][retval[key].length-1].timestamp;
				console.log(lastData);
				cosnole.log(newData);
				if (lastData != newData) {
					while(vm.chartConfig[key].series[0].data.length > 20) {
						vm.chartConfig[key].series[0].data.shift()
					}
					console.log(vm.chartConfig[key].series[0].data);
					vm.chartConfig[key].series[0].data.push(parseFloat(vals[vals.length-1]));
					// console.log(vm.datas);
					if(vm.chartConfig2.series) {
						while(vm.chartConfig2.series[0].data.length > 20) {
							vm.chartConfig2.series[0].data.shift()
						}
					}
					
					if(key == vm.selectedKey) {
						vm.chartConfig2.series[0].data.push(parseFloat(vals[vals.length-1]));
						vm.selectedData = retval[key];
					}
				}
				// var reglength = (retval.length < 20 ) ? retval.length : 20;
				// var regression = {
				// 	type: 'line',
				// 	name: 'Regression Line',
				// 	showInLegend: false,
				// 	color: '#FF2A2A',
				// 	data: [[0, 0], [regLength, 100]],
				// 	marker: {
				// 			enabled: false
				// 	},
				// 	states: {
				// 			hover: {
				// 					lineWidth: 0
				// 			}
				// 	},
				// 	enableMouseTracking: false
				// }
				vm.datas = retval;
			});
		}

		function getData() {
			Data.get(vm.authData)
				.then(function(data) {
					
					vm.datas = data;
					_.forEach(vm.datas, function(data, key){
						var vals = _.map(data, function (val) {
							if(val.value == "Good") {
								return 1;
							} else if (val.value == "Bad") {
								return 0;
							} else if (val.value == null) {
								return 0;
							}
							return parseFloat(val.value);
						});
						// console.log(vals);
						vm.dataAvg[key] = '';
						vm.dataAvg[key] = _.mean(vals);
						var unit = vm.datas[key][0].unit || '';
						unit = unit.toUpperCase();
						vm.chartConfig[key] = {};
						vm.chartConfig[key] = {
							chart: {
								height: 200,
							},
							legend: {
								enabled: false,
							},
							xAxis: {
								visible: false,
							},
							yAxis: {
								visible: false,
							},
							title: {
								text: ''
							},
							series: [{
								name: 'Value',
								type: vm.datas[key][0].chartType || 'line',
								data: vals,
								showInLegend: false,
								color: '#2a65ff',
								borderRadius: 3,
								pointPadding: 0.1,
								groupPadding: 0,
								borderWidth: 0,
								tooltip: {
									headerFormat: '',
									pointFormat: '{series.name}: <b>{point.y}</b><br/>',
									valueSuffix: ` ${unit}`,
								},
							}],
						}
					})
				});
		}

		vm.showParents = function() {
			PatientControl.getParents(vm.authData)
				.then(function(parents) {
					vm.parents = parents;
					vm.showParentsList = true;
					vm.showMyData = false;
				})
		}

		vm.approveParent = function(parent) {
			PatientControl.approveParent(parent, vm.authData)
				.then(function(parent) {
					console.log(parent);
					vm.showParents();
				})
		}

		vm.declineParent = function(parent) {
			PatientControl.declineParent(parent, vm.authData)
				.then(function(parent) {
					console.log(parent);
					vm.showParents();
				})
		}

		function logout() {
			Users.logout();
			$state.go('login');
		}

		function getNotification(authData) {
			firebase.database().ref().child('notification').child(authData.uid).child('notifications')
				.on('value', function(snapshot) {
					var noti = snapshot.val();
					console.log(noti);
					noti = _.map(noti, function(val, k) {
						val['key'] = k;
						return val;
					});
					
					var notiUnread = _.filter(noti, { isRead: false });
					if(notiUnread.length > 0) {
						vm.notiUnread = true;
					} else {
						vm.notiUnread = false;
					}
					vm.notifications = noti;
				})
		}

		function readNoti(notification) {
			firebase.database().ref().child('notification').child(vm.authData.uid).child('notifications').child(notification.key).child('isRead')
				.set(true);
		}

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

		function selectFriend(friend) {
			console.log(friend);
			vm.selectedFriend = friend;
			getFriendData(vm.selectedFriend);
			vm.page = 'friend dashboard';
		}

		function getFriendData(friend) {
			Data.get(friend)
				.then((data) => {
					vm.friendData = data;
					_.forEach(vm.friendData, function(data, key) {
						var vals = _.map(data, function (val) {
							if(val.value == "Good") {
								return 1;
							} else if (val.value == "Bad") {
								return 0;
							} else if (val.value == null) {
								return 0;
							}
							return parseFloat(val.value);
						});
						

						var unit = vm.friendData[key][0].unit || '';
						unit = unit.toUpperCase();
						vm.chartConfig3[key] = {};
						vm.chartConfig3[key] = {
							chart: {
								height: 200,
							},
							legend: {
								enabled: false,
							},
							xAxis: {
								visible: false,
							},
							yAxis: {
								visible: false,
							},
							title: {
								text: ''
							},
							series: [{
								name: 'Value',
								type:vm.friendData[key][0].chartType,
								data: vals,
								showInLegend: false,
								color: '#2a65ff',
								borderRadius: 3,
								pointPadding: 0.1,
								groupPadding: 0,
								borderWidth: 0,
								tooltip: {
									headerFormat: '',
									pointFormat: '{series.name}: <b>{point.y}</b><br/>',
									valueSuffix: ` ${unit}`,
								},
							}],
						}
					});

					firebase.database().ref(`/health/${friend.uid}`)
						.on('value', (snapshot) => {
							var data = snapshot.val();
							data = _.orderBy(data, 'timestamp', 'asc');
							data = _.forEach(data, function(val) {		
								return val.timeAgo = moment.unix(_.toInteger(val.timestamp)).fromNow()
							})
							data = _.groupBy(data, 'name');
							var hasVal = {};
							_.forEach(data, (key) => {
								if (key[0].value) {
									hasVal[key[0].name] = key;
								} 
							});
							var retval = hasVal
							_.forIn(retval, function(value, key) {
								retval[key] = _.takeRight(value, 20);
							});
							_.forIn(retval, function(data, key){
								var vals = _.map(data, function (val) {
									if(val.value == "Good") {
										return 1;
									} else if (val.value == "Bad") {
										return 0;
									} else if (val.value == null) {
										return 0;
									}
									return val.value;
								});
								var lastData = vm.friendData[key][vm.friendData[key].length-1].timestamp;
								var newData = retval[key][retval[key].length-1].timestamp;
								if (lastData != newData) {
									while(vm.chartConfig3[key].series[0].data.length > 20) {
										vm.chartConfig3[key].series[0].data.shift()
									}
									vm.chartConfig3[key].series[0].data.push(parseFloat(vals[vals.length-1]));
									while(vm.chartConfig4.series[0].data.length > 20) {
										vm.chartConfig4.series[0].data.shift()
									}
									if(key == vm.selectedFriendKey) {
										vm.chartConfig4.series[0].data.push(parseFloat(vals[vals.length-1]));
									}
								}

								vm.friendData = retval;
							})
						});
					});
		}


		function selectFriendData(key, data) {
			vm.selectedFriendData = data;
			vm.selectedFriendKey = key;
			var vals = _.map(vm.selectedFriendData, function (val) {
				if(val.value == "Good") {
					return 1;
				} else if (val.value == "Bad") {
					return 0;
				} else if (val.value == null) {
					return 0;
				}
				return parseFloat(val.value);
			});
			var unit = vm.selectedFriendData[0].unit || '';
			unit = unit.toUpperCase();
			vm.chartConfig4 = {};
			vm.chartConfig4 = {
				chart: {
					height: 200,
				},
				legend: {
					enabled: false,
				},
				xAxis: {
					visible: false,
				},
				yAxis: {
					// visible: false,
				},
				title: {
					text: ''
				},
				series: [{
					name: 'Value',
					type:vm.selectedFriendData[0].chartType,
					data: vals,
					showInLegend: false,
					color: '#2a65ff',
					borderRadius: 3,
					pointPadding: 0.1,
					groupPadding: 0,
					borderWidth: 0,
					tooltip: {
						headerFormat: '',
						pointFormat: '{series.name}: <b>{point.y}</b><br/>',
						valueSuffix: ` ${unit}`,
					},
				}],
			}
			vm.page = 'friend dashboard detail';
		}

		function selectData(key, data) {
			vm.selectedData = data;
			vm.selectedKey = key;
			var vals = _.map(vm.selectedData, function (val) {
				if(val.value == "Good") {
					return 1;
				} else if (val.value == "Bad") {
					return 0;
				} else if (val.value == null) {
					return 0;
				}
				return parseFloat(val.value);
			});
			var unit = vm.selectedData[0].unit || '';
			unit = unit.toUpperCase();
			vm.chartConfig2 = {};
			vm.chartConfig2 = {
				chart: {
					height: 200,
				},
				legend: {
					enabled: false,
				},
				xAxis: {
					visible: false,
				},
				yAxis: {
					// visible: false,
				},
				title: {
					text: ''
				},
				series: [{
					name: 'Value',
					type:vm.selectedData[0].chartType,
					data: vals,
					showInLegend: false,
					color: '#2a65ff',
					borderRadius: 3,
					pointPadding: 0.1,
					groupPadding: 0,
					borderWidth: 0,
					tooltip: {
						headerFormat: '',
						pointFormat: '{series.name}: <b>{point.y}</b><br/>',
						valueSuffix: ` ${unit}`,
					},
				}],
			}
			vm.page = 'dashboard detail';
		}

		// console.log(Date.now() / 1000);

		// function liveData() {
		// 	getMockData('heart rate', 70, 80, 170, true, 'bpm', 'line');
		// 	getMockData('body fat', 25, 25, 50, false, 'percent', 'line');
		// 	getMockData('ast', 30, 40, 40, false, 'mg/dl', 'line');
		// 	getMockData('alt', 30, 40, 40, false, 'mg/dl', 'line');
		// 	getMockData('ggt', 30, 40, 40, false, 'mg/dl', 'line');
			
		// }

		function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		function addNoti(uid, data) {
			var status = 'abnormal';
			if(data.name == 'ast' || data.name == 'alt' || data.name == 'ggt') {
				status = 'out of bounds';
			} else {
				status = 'abnormal';
			}
			firebase.database().ref(`/friends/${uid}/friends`)
				.on('value', function(snapshot) {
					var friends = snapshot.val();
					_.forEach(friends, function(friend) {
						firebase.database().ref(`/notification/${friend.uid}/notifications`)
							.push({
								data: {
									name: data.name,
									status: 'abnormal',
								},
								isRead: false,
								name: auth.user.profile.fname,
								timestamp: data.timestamp
							})
					})
				})
			firebase.database().ref(`/notification/${uid}/notifications`)
				.push({
					data: {
						name: data.name,
						status: 'abnormal',
					},
					isRead: false,
					name: auth.user.profile.fname,
					timestamp: data.timestamp
				})
		}

		// function addNoti(data, uid) {
		// 	var status = 'abnormal';
		// 	if(data.name == 'ast' || data.name == 'alt' || data.name == 'ggt') {
		// 		status = 'out of bounds';
		// 	} else {
		// 		status = 'abnormal';
		// 	}
		// 	firebase.database().ref(`/notification/${vm.authData.uid}/notifications`)
		// 		.push({
		// 			data: {
		// 				name: data.name,
		// 				status: 'abnormal',
		// 			},
		// 			isRead: false,
		// 			name: vm.me.profile.fname,
		// 			timestamp: data.timestamp
		// 		})
		// }

		// $interval(liveHeartrate, 3000);

		function liveHeartrate() {
			console.log('heart rate');
			getMockData('heart rate', 70, 80, 170, true, 'bpm', 'line', '4sJgDUlaOGPhAUN2tZZ4j8cuwN12')
		}
		// $inverval();

		function getMockData(name, min, max, danger, live, unit, chartType, userid) {
			var val = getRandomInt(min, max);
			var isDanger = false;
			if(val > danger) {
				isDanger = true;
			}
			var mockData = {
				name: name,
				isLive: live,
				unit: unit,
				timestamp: Date.now() / 1000,
				value: val,
				isDanger: isDanger,
				chartType: chartType
			}
			if(isDanger) {
				addNoti(mockData);
			}
			firebase.database().ref(`/health/${vm.authData.uid}`)
				.push(mockData);
		}


		function emptyData(name) {
			firebase.database().ref(`/health/${vm.authData.uid}`)
				.push({
					name: name,
				});
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
									console.log('add');
									firebase.database().ref(`/friends/${friend.uid}/friends`)
										.push(profile[0])
										.then((data) => {
											console.log(data);
										})
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

		function getAllUser() {
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
				// firebase.database().ref(`/friends`)
				// 	.on('value', (snapshot) => {
				// 		var friends = snapshot.val();
				// 		const retval = [];
				// 		_.forEach(users, (u, k) => {
				// 			var found = false;
				// 				var foundReq = false;
				// 			_.forEach(friends, (f,k) => {
				// 				_.forEach(f.friends, (ff,kk) => {
				// 					if(ff.uid != vm.authData.uid) {
				// 						console.log(ff.uid);
				// 						found = true;
				// 					}
				// 				});
				// 				_.forEach(f.friendsRequest, (ffrq,kkrq) => {
				// 					console.log(ffrq.uid);
				// 					// if(ff.uid == u.uid) {
				// 					// 	console.log(ff);
				// 					// 	foundReq = true;	
				// 					// }
				// 				});
							
				// 			})
				// 			if(!found) {
				// 					console.log(u);
				// 					retval.push(u);\
				// 				}
				// 		});
				// 		vm.allUsers = retval;
				// 	});
				
				
				
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
            
						// firebase.database().ref(`/friends/$`)
            
            vm.allUsers = retval;
          });
      });
		}

	}
})();
