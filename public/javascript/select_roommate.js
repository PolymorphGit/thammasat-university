angular.module('accountApp', [])
.controller('mainController', function ($scope, $http) {
	
	$scope.account = {
		name : "abc",
		identification_number__c : "1234"
	};
	
});