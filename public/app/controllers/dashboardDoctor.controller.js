(function() {
	'use strict';

	angular
			.module('app')
			.controller('dashboardDoctorCtrl', dashboardDoctorCtrl);

	dashboardDoctorCtrl.$inject = ['$state', '$stateParams', '$interval', 'Data', 'Users', 'PatientControl'];

	function dashboardDoctorCtrl($state, $stateParams, $interval, Data, Users, PatientControl) {
		var vm = this;

		vm.exportPDF = exportPDF;
		vm.users = [];
		vm.datas = [];
		vm.chartConfig = {
		  options: {
		      chart: {
		          type: 'line',
		          animation: true,
		          zoomType: 'x'
		      },
		      tooltip: {
		          style: {
		              padding: 10,
		              fontWeight: 'bold'
		          },
		          valueSuffix: ''
		      },
		      title: '',
		      yAxis: {
		      	title: ''
		      },
		      xAxis: {
		      	title: '',
            type: 'datetime',
            categories: []
		      },
		      legend: {
            enabled: false
          },
		  },
		  plotOptions: {
          spline: {
              lineWidth: 4,
              states: {
                  hover: {
                      lineWidth: 5
                  }
              },
              marker: {
                  enabled: false
              },
          }
      },
		  series: [{
		      data: []
		  }],
		  loading: false,
		  useHighStocks: false,
		  size: {
		  	height: 200
		  }
		}

		isLogin();

		function isLogin() {
			Users.get()
				.then(function(user) {
					getControlList()
					vm.me = user;
				}).catch(function(error) {
					console.log(error);
				})
		}

		function getUsersAll(patients) {
			Users.getAll()
				.then(function(users) {
					_.forEach(users, function(user) {
						var found = 0;
						_.forEach(patients, function(patient) {
							if(user.id == patient.id) {
								found = 1;
							}
						});
						if(!found) {
							vm.users.push(user);
						}
					});
				})
		}

		function getControlList() {
			PatientControl.getPatients()
				.then(function(patients) {
					console.log(patients);
					vm.patients = patients;
					getUsersAll(vm.patients);
					if($stateParams.index) {
						viewUserData(vm.patients[$stateParams.index]);
					}
				})
		}

		vm.addPatientToList = function(user) {
			console.log(user);
			PatientControl.add(user)
				.then(function(data) {
					vm.showAddPatientModal = false;
					vm.patientControl = "";
					$state.reload();
				})
		}

		vm.userData = function(index, patient) {
			if(patient.status != 'pending')
				$state.go('dashboard-staff-user',{index: index})
		}

		vm.declinePatient = function(patient) {
			console.log(patient);
			PatientControl.declinePatient(patient)
				.then(function(patient) {
					console.log(patient);
					$state.reload();
				})
		}

		function viewUserData(patient) {
			if(patient.status != 'pending') {
				getData(patient);
			}
		}
		
		function getData(patient) {
			console.log(patient);
			Data.get(patient)
				.then(function(data) {
					var index = 0;
					vm.currentPatient = patient;
					vm.datas = data;
					vm.showPatientList = false;
					vm.showPatient = true;
				});
		}

		vm.setChart = function(value) {
			vm.dataChart = {};
			vm.dataChart = {name: value.topic};
			vm.chartConfig.series[0].data = [];
			_.forEach(_.takeRight(_.orderBy(value, 'datetime', 'asc'), 10),function(val) {
				vm.chartConfig.series[0].data.push([val.formNow,_.toNumber(val.body)]);
				vm.chartConfig.options.xAxis.categories.push(val.fromNow);
			});
		}

		function exportPDF(selector) {
			html2canvas(document.getElementById(selector), {
	        onrendered: function (canvas) {
	            var data = canvas.toDataURL();
	            var docDefinition = {
	                content: [{
	                    image: data,
	                    width: 500,
	                }]
	            };
	            pdfMake.createPdf(docDefinition).download("Report.pdf");
	        }
	    });
		}

 //  var mymap = L.map('mapid').setView([13.725377712079784, 100.49537658691406], 7);

 //  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2Fpb3NpcyIsImEiOiJjaXhkaXc3cXEwMGhvMnRyajk0Zmg5cWw3In0.Yna6IsKxB6-7T51-0HPT9Q', {
 //    maxZoom: 18,
 //    id: 'kaiosis.2h8f1o3l',
 //    accessToken: 'pk.eyJ1Ijoia2Fpb3NpcyIsImEiOiJjaXhkaXc3cXEwMGhvMnRyajk0Zmg5cWw3In0.Yna6IsKxB6-7T51-0HPT9Q'
 //  }).addTo(mymap);

	// var icon = L.divIcon({
	//   iconSize: [30, 30],
	//   iconAnchor: [15, 15],
	//   popupAnchor: [10, 0],
	//   shadowSize: [0, 0],
	//   className: 'animated-icon my-icon',
	//   html: ''
	// });

	// var ll = L.latLng(14.907630165799675, 102.0904541015625);
	// var l2 = L.latLng(14.107630165799675, 102.0904541015625);
	// var marker = L.marker(ll, {
	//   icon: icon,
	//   title: 'look at me!'
	// }).addTo(mymap)
	// var marker = L.marker(l2, {
	//   icon: icon
	// }).addTo(mymap)

	// doAnimations();
 //  setInterval(function(){
 //    doAnimations()
 //  }, 2500)
	  
	// function doAnimations(){
	//   var myIcons = document.querySelectorAll('.my-icon')
	//   _.forEach(myIcons, function(myIcon) {
 //  	myIcon.style.width = '10px'
 //    myIcon.style.height = '10px'
 //    myIcon.style.marginLeft = '-5px'
 //    myIcon.style.marginTop = '-5px'
 //   	setTimeout(function(){
 //      myIcon.style.opacity = '1'
 //    }, 500)

 //    setTimeout(function(){
 //      myIcon.style.width = '60px'
 //      myIcon.style.height = '60px'
 //      myIcon.style.marginLeft = '-30px'
 //      myIcon.style.marginTop = '-30px'
 //      myIcon.style.opacity = '0'
 //    }, 2000)
	//   })
	// }


	}
})();
