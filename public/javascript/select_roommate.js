angular.module('select_roommateApp', [])
.controller('mainController', function ($scope, $http) {
	$scope.id = "";
	$scope.account = {};
	//$scope.roommate = [ {"identification_number__c": "123"},{"passport_number__c":"abc"}];
	$scope.roommate = [{},{},{}];
	
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
			//alert(data);
			$scope.roommate = data;
			for(var i = data.length ; i < 3 ; i++)
			{
				$scope.roommate.push({});
			}
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.createRoommate = function (record) {
		var roommate = record.identification_number__c;
		alert(roommate);
		$http.get('../createroommate', { headers: {'primary': $scope.id, 'co':roommate} })
		.success((data) => {
			//Add record to roommate
			$scope.roommate = data;
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.deleteRoommate = function (record) {
		$http.get('../deleteroommate/' + record.sfid)
		.success((data) => {
			//Remove record from roommate
			var index = $scope.roommate.indexOf(record);
			delete $scope.roommate.splice(index, 1);
			$scope.roommate.push({});
		}) 	
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.updateRoomate = function (record) {
		var roommate = record.identification_number__c;
		alert(roommate);
		$http.get('../updateroommate/' + record.sfid, { headers: {'primary': $scope.id, 'co':roommate} })
		.success((data) => {
			//Change data in roommate
			record =  data
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
});