angular.module('select_roommateApp', [])
.controller('mainController', function ($scope, $http) {
	
	$scope.account = {};
	$scope.roommate = [];
	
	//Get a account Detail
	$scope.getData = function (accountId) {	
		$http.get('../userinfo/' + accountId)
		.success((data) => {
			console.log(data);
			$scope.account = data[0];
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	    
	};
	
	$scope.getRoommate = function (accountId) {
		$http.get('../getroommate/' + accountId)
		.success((data) => {
			console.log(data);
			$scope.roomate = data;
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.createRoommate = function (accountId, roommate) {
		$http.get('../createroommate', { headers: {'primary': accountId, 'co':roomate} })
		.success((data) => {
			//Add record to roommate
			$scope.roommate = data;
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.deleteRoommate = function (record) {
		$http.get('../deleteroommate/' + record.id)
		.success((data) => {
			//Remove record from roommate
			var index = $scope.roommate.indexOf(record);
			delete $scope.roommate.splice(index, 1);
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.deleteRoommate = function (record, accountId, roomate) {
		$http.get('../updateroommate/' + record.id, { headers: {'primary': accountId, 'co':roomate} })
		.success((data) => {
			//Change data in roommate
			record =  data
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
});