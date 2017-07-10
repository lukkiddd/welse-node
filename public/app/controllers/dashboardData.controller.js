(function () {
	'use strict';

	angular
		.module('app')
		.controller('dashboardDataCtrl', dashboardDataCtrl);

		dashboardDataCtrl.$inject = ['$scope', '$stateParams', 'Auth', 'Data', '$firebaseObject'];

		function dashboardDataCtrl($scope, $stateParams, Auth, Data, $firebaseObject) {
			var vm = this;

			$scope.goal = {
				toggle: function () {
					this._show = !this._show;
				},
				show: function () {
					this._show = true;
				},
				close: function () {
					this._show = false;
				},
				add: function () {
					if($scope.uid && $scope.selectedData[0].name) {
						console.log(this.value);
						firebase
							.database()
							.ref('goal')
							.child($scope.uid)
							.child($scope.selectedData[0].name)
							.set({ value: parseInt(this.value) })
							.then(function () {
								$scope.goal.value = '';
								location.reload();
							})
							.catch(function (err) {
								console.log(err);
							});
					}
				},
				_show: false,
				value: ''
			}

			$scope.key = $stateParams.key;
			$scope.uid = $stateParams.uid;
			$scope.selectedData = [];
			getData();

			function getData() {
				Data
					.get($stateParams)
					.then(function (data) {
						$scope.selectedData = data[$scope.key]
						var ref = firebase
												.database()
												.ref('goal')
												.child($scope.uid)
												.child($scope.selectedData[0].name);
						var obj = $firebaseObject(ref);
						obj
							.$loaded()
							.then(function (data) {
								$scope.selectedDataGoal = data.value;
								drawChart($scope.selectedData, $scope.selectedDataGoal);
							})
					});
			}
			
			function drawChart(data, goal) {
				goal = parseInt(goal);
				console.log(goal);
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
				
				var unit = data[0].unit || '';

				unit = unit.toUpperCase();

				$scope.chartData = {};
				$scope.chartData = {
					chart: {
						height: 400,
					},
					legend: {
						enabled: false,
					},
					xAxis: {
						visible: false,
					},
					yAxis: {
						plotBands: [{
            from: 30,
            to: vals[0] * 2,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Normal',
                style: {
                    color: '#606060'
                }
							}
						}]
					},
					title: {
						text: ''
					},
					series: [{
						name: 'Goal',
						type: 'line',
						data: [ [0, goal] , [vals.length, goal] ],
						marker: {
								enabled: false
						},
						states: {
								hover: {
										lineWidth: 0
								}
						},
						enableMouseTracking: false
					}, {
						name: 'Value',
						type: data[0].chartType,
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
			}
		}

})();