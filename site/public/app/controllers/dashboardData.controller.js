(function () {
	'use strict';

	angular
		.module('app')
		.controller('dashboardDataCtrl', dashboardDataCtrl);

		dashboardDataCtrl.$inject = ['$scope', '$stateParams', '$interval', 'Health', 'Goal'];

		function dashboardDataCtrl($scope, $stateParams, $interval, Health, Goal) {
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
					let goalData ={
						name: $scope.key,
						value: $scope.goal._value
					}
					$scope.goal._loading = true;
					Goal
						.setGoal(goalData)
						.then(function (data) {
							$scope.goal._loading = false;
							$scope.goal.value = $scope.goal._value;
							$scope.goal.close();
							$scope.chartData.yAxis.plotLines[0].value = $scope.goal.value;
						})
						.catch(function (error) {
							$scope.goal._loading = false;
							$scope.goal.add();
						})
				},
				_loading: false,
				_show: false,
				value: '',
				_value: ''
			}

			$scope.key = $stateParams.key;
			$scope.selectedData = false;
			$scope.chartData = false;
			$interval(function () {
				getData();
			}, 3000);

			function getData() {
				Health
					.getHealth()
					.then(function (data) {
						$scope.selectedData = data[$scope.key];
						getGoal();
					})
					.catch(function () {
						if(!$scope.selectedData) {
							getData();
						}
					});
			}
			
			function getGoal() {
				Goal
					.getGoal()
					.then(function (data) {
						var key = $scope.key.toLowerCase();
						if(data[key]) {
							$scope.goal.value = data[key].value;
						}
						drawChart($scope.selectedData, $scope.goal.value);
					})
					.catch(function (err) {
						if(!$scope.chartData) {
							getGoal();
						}
					})
			}
			
			function drawChart(data, goalValue) {
				var goal = parseInt(goalValue) || data[0].max;
				var plotLinesText = (parseInt(goalValue)) ? 'Goal' : 'Danger'
				var unit = data[0].unit || '';
				var vals = _.map(data, function (val) {
					return val.value;
				});
				vals = vals.reverse();
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
						title: '',
					},
					yAxis: {
						title: '',
						plotLines: [{
								value: goal,
								color: '#FF2A2A',
								width: 2,
								label: {
										text: plotLinesText,
										style: {
												color: '#FF2A2A'
										}
								}
						}],
					},
					title: {
						text: ''
					},
					series: [{
						name: '',
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
							valuePrefix: `${data[0].name}: `,
							pointFormat: '<b>{point.y}</b><br/>',
							valueSuffix: ` ${unit}`,
						},
					}],
				}
			}
		}

})();