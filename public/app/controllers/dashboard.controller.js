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


	
		vm.datas = [];
		vm.dataAvg = {};
		vm.showParentsList = false;
		vm.showMyData = true;

		vm.chartConfig = {};

		vm.chartConfig3 = {};
		vm.chartConfig4 = {};

		vm.selectData = selectData;

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

		/* Authentication */
		Auth.$onAuthStateChanged(function(authData) {
			vm.authData = authData;
			vm.uid = authData.uid;
			if(vm.authData) {
				vm.user = Users.get(vm.authData);
				vm.user.$loaded()
					.then(function(user) {
						vm.me = user;
					});
				getData();
				
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
				var lastData = '';
				if(vm.datas[key]) {
					lastData = vm.datas[key][vm.datas[key].length-1].timestamp;
				}
				var newData = retval[key][retval[key].length-1].timestamp;

				if ( (lastData != newData) && vm.chartConfig[key]) {
					while(vm.chartConfig[key].series[0].data.length > 20) {
						vm.chartConfig[key].series[0].data.shift()
					}

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
								marker: {
									enabled: false
								},
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
			$state.go('dashboard.mydata');
		}



		/** PRIVATE !!!! */

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


		function liveHeartrate() {
			console.log('heart rate');
			getMockData('heart rate', 70, 80, 170, true, 'bpm', 'line', '4sJgDUlaOGPhAUN2tZZ4j8cuwN12')
		}

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

	}
})();
