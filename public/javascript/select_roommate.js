angular.module('select_roommateApp', [])
.controller('mainController', function ($scope, $http) {
	$scope.id = "";
	$scope.message = "";
	$scope.account = {};
	//$scope.roommate = [ {"identification_number__c": "123"},{"passport_number__c":"abc"}];
	$scope.roommate = [{"identification_number__c": null},{},{}];
	
	//Get a account Detail
	$scope.getData = function (accountId) {	
		$http.get('../userinfo/' + accountId)
		.success((data) => {
			console.log(data);
			//alert(data[0].secondary__c);
			if(!data[0].secondary__c)
			{
				//alert("Pass");
				$scope.account = data[0];
			}
			else
			{
				$scope.message = "This Student is Secondary.";
			}
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
				$scope.roommate.push({"identification_number__c": null });
			}
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.upsertRoommate = function (record) {
		$scope.message = "";
		if(record.sfid == null)
		{
			//alert("Create");
			$scope.createRoommate(record);
		}
		else
		{
			//alert("Update");
			$scope.updateRoomate(record);
		}
	}
	
	$scope.createRoommate = function (record) {
		var roommate = record.passport_number__c;
		$http.get('../createroommate', { headers: {'primary': $scope.id, 'co': roommate} })
		.success((data) => {
			//Add record to roommate
			//alert('data:' + data[0].id + ' (' + (data[0].id != null) +')');
			if(data[0].id != null)
			{
				var index = $scope.roommate.indexOf(record);
				delete $scope.roommate.splice(index, 1);
				$scope.roommate.push(data[0]);
			}
			else
			{
				//alert(JSON.stringify(data));
				$scope.message = JSON.stringify(data);
				//TODO: Remove data in input field
				record = {"identification_number__c": null };
			}
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
			$scope.roommate.push({"identification_number__c": null});
		}) 	
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
	
	$scope.updateRoomate = function (record) {
		var roommate = record.identification_number__c;
		if(roommate == null)
		{
			roommate = record.passport_number__c;
		}
		//alert(roommate);
		$http.get('../updateroommate/' + record.sfid, { headers: {'primary': $scope.id, 'co':roommate} })
		.success((data) => {
			//Change data in roommate
			if(data[0].id != null)
			{
				record =  data[0];
			}
			else if(data != "")
			{
				$scope.message = JSON.stringify(data);
				//TODO: Remove data in input field
				record = {"identification_number__c": null };
			}
		})
		.error((data) => {
			console.log('Error: ' + data);
		});
	}
});